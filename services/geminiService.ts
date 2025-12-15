import { GoogleGenAI, Modality } from "@google/genai";
import { Message, Sender, MessageType, ChartDataPoint } from '../types';
import { OFFLINE_DATABASE, getFallbackText } from './offlineData';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';
const TTS_MODEL_NAME = 'gemini-2.5-flash-preview-tts';

// Helper to check connection
const isOnline = () => navigator.onLine;

// Offline Search Function
const searchOfflineDB = (prompt: string, language: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Find matching entry
  const entry = OFFLINE_DATABASE.find(item => 
    item.keywords.some(k => lowerPrompt.includes(k))
  );

  if (entry) {
    // Return localized response or fallback to english
    return (entry.response as any)[language] || entry.response.en;
  }

  return getFallbackText(language);
};

export const generateResponse = async (
  prompt: string,
  imagePart?: string,
  audioPart?: string,
  language: string = 'en',
  history: Message[] = []
): Promise<Partial<Message>> => {
  
  // --- OFFLINE MODE HANDLING ---
  if (!isOnline()) {
    console.log("App is Offline. Using local database.");
    
    // Handle Voice/Image limitations in offline mode
    if (audioPart) {
       return {
        sender: Sender.Bot,
        text: language === 'hi' 
          ? "वॉयस प्रोसेसिंग के लिए इंटरनेट की आवश्यकता है। कृपया अपना प्रश्न टाइप करें।" 
          : "Voice processing requires an active internet connection. Please type your query in Offline Mode.",
        type: MessageType.Text,
        timestamp: Date.now()
      };
    }

    if (imagePart) {
      return {
        sender: Sender.Bot,
        text: language === 'hi'
          ? "छवि विश्लेषण के लिए इंटरनेट की आवश्यकता है। कृपया समस्या का वर्णन करें।"
          : "Image analysis requires an active internet connection. Please describe the issue in text.",
        type: MessageType.Text,
        timestamp: Date.now()
      };
    }

    // Search Local DB
    const offlineResponse = searchOfflineDB(prompt, language);
    
    return {
      sender: Sender.Bot,
      text: offlineResponse,
      type: MessageType.Text,
      timestamp: Date.now(),
      // No sources in offline mode
    };
  }

  // --- ONLINE MODE (Existing Logic) ---
  try {
    const systemInstruction = `You are AgriBot, a helpful, friendly, and expert agricultural assistant. 
    Your goal is to help farmers with crop management, disease identification, weather insights, government schemes, and market prices.
    
    Current User Language Preference: ${language}.
    ALWAYS reply in the language: ${language}.
    
    If the user asks about market prices or weather trends and you can provide data, try to format a small JSON snippet at the end of your response for visualization, but primarily provide a helpful text summary.
    
    If the user sends an image of a plant, diagnose the disease or identify the crop and provide treatment or care recommendations.
    
    Keep responses concise, practical, and easy to understand for a farmer. Avoid overly technical jargon unless necessary.
    `;

    // Construct parts
    const parts: any[] = [];
    
    if (audioPart) {
      parts.push({
        inlineData: {
          mimeType: 'audio/wav', // Assuming WAV from recorder
          data: audioPart
        }
      });
    }

    if (imagePart) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imagePart
        }
      });
    }

    parts.push({ text: prompt });

    // Detect if we need search grounding (for market prices, schemes, news)
    const needsSearch = /market|price|scheme|news|government|weather|today|current/i.test(prompt);
    
    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (needsSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { role: 'user', parts },
      config: config
    });

    const text = response.text || "I couldn't generate a response. Please try again.";
    
    // Extract sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title || 'Source' }));

    return {
      sender: Sender.Bot,
      text: text,
      type: MessageType.Text,
      timestamp: Date.now(),
      sources: sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // If API fails, try offline fallback as a safety net
    if (!navigator.onLine) {
        return {
          sender: Sender.Bot,
          text: searchOfflineDB(prompt, language),
          type: MessageType.Text,
          timestamp: Date.now()
        };
    }

    return {
      sender: Sender.Bot,
      text: "Sorry, I'm having trouble connecting to the farm server right now. Please check your connection or try again later.",
      type: MessageType.Error,
      timestamp: Date.now()
    };
  }
};

// specialized function to get structured data for charts
export const getMarketData = async (crop: string, location: string): Promise<{ text: string, data: ChartDataPoint[], sources?: { uri: string; title: string }[] }> => {
  // Offline fallback for tools
  if (!isOnline()) {
     return {
       text: "You are currently offline. Showing historical average data from local database. Please connect to internet for live prices.",
       data: [
         { name: 'Week 1', value: 2100 },
         { name: 'Week 2', value: 2150 },
         { name: 'Week 3', value: 2120 },
         { name: 'Week 4', value: 2200 },
         { name: 'Week 5', value: 2180 },
       ]
     };
  }

  try {
    const prompt = `Get the current approximate market prices for ${crop} in or near ${location} for the last 5 time periods (days/weeks/months). 
    Return a valid JSON object (NO markdown formatting) with a 'summary' text field explaining the trend, and a 'data' array with 'name' (date/period) and 'value' (price) fields.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // responseMimeType: "application/json", // NOT ALLOWED with googleSearch
        tools: [{ googleSearch: {} }],
        // responseSchema: ... // NOT ALLOWED with googleSearch
      }
    });

    let jsonStr = response.text || "";
    
    // Clean up markdown if present
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    if (!jsonStr) throw new Error("No data returned");
    
    let parsed;
    try {
        parsed = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return { text: response.text || "Here is the information.", data: [] };
    }

    // Extract sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title || 'Source' }));

    return {
        text: parsed.summary,
        data: parsed.data,
        sources: sources
    };

  } catch (error) {
    console.error("Market Data Error:", error);
    return { text: "Could not fetch market data visualization.", data: [] };
  }
};

// Generate Speech from Text
export const generateSpeech = async (text: string): Promise<string | null> => {
  if (!isOnline()) return null; // No TTS offline

  try {
    // Strip markdown characters for better speech (e.g., *bold*, # header)
    const cleanText = text.replace(/[*#`_]/g, '');

    const response = await ai.models.generateContent({
      model: TTS_MODEL_NAME,
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO], // Must be an array with a single `Modality.AUDIO` element.
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is usually a good neutral voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};