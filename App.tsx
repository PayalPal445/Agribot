import React, { useState, useEffect, useRef } from 'react';
import { AppState, Message, Sender, MessageType, Consultation, AgriFeature, ViewMode } from './types';
import { generateResponse, getMarketData, generateSpeech } from './services/geminiService';
import { AGRI_FEATURES } from './services/features';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import ToolsGrid from './components/ToolsGrid';
import ExpertConnect from './components/ExpertConnect';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BotMascot from './components/BotMascot';
import { Globe, Wifi, WifiOff, Bell, Menu, Loader2, Volume2, VolumeX, X, Upload, Settings, Sun, Moon, CloudSun, Sunset } from 'lucide-react';

// Helper to decode raw PCM audio data from Gemini TTS
const decodePCMData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const initialAppState: AppState = {
  isLoggedIn: false,
  hasSelectedLanguage: false,
  language: 'en',
  user: null,
  customLogo: localStorage.getItem('agribot_custom_logo') || null,
  currentView: 'dashboard'
};

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'es', name: 'Español' }
];


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Time of Day State
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  // Mascot State
  const [mascotState, setMascotState] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');

  // Expert Connect State
  const [showExpertConnect, setShowExpertConnect] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<Consultation[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Startup Animation & Time Check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500); 

    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 20) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000 * 15); // Check every 15 mins

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  // Network Status Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Update Mascot State based on App Activity
  useEffect(() => {
    if (isProcessing) {
      setMascotState('thinking');
    } else if (currentlyPlayingId) {
      setMascotState('speaking');
    } else {
      setMascotState('idle');
    }
  }, [isProcessing, currentlyPlayingId]);
  
  // Effect to add initial welcome message after language selection
  useEffect(() => {
    if (appState.hasSelectedLanguage && messages.length === 0 && appState.user) {
        let greeting = `Hello ${appState.user.name}! Welcome to your Maker Dashboard. Select a tool to get started.`;
        switch (appState.language) {
            case 'hi': greeting = `नमस्ते ${appState.user.name}! एग्रीबॉट डैशबोर्ड में आपका स्वागत है। शुरू करने के लिए कोई उपकरण चुनें।`; break;
            case 'mr': greeting = `नमस्कार ${appState.user.name}! ॲग्रीबॉट डॅशबोर्डवर आपले स्वागत आहे.`; break;
            case 'ta': greeting = `வணக்கம் ${appState.user.name}! அக்ரிபாட் டாஷ்போர்டுக்கு வருக.`; break;
            case 'te': greeting = `నమస్కారం ${appState.user.name}! అగ్రిబాట్ డాష్‌బోర్డ్‌కు స్వాగతం.`; break;
            case 'gu': greeting = `નમસ્તે ${appState.user.name}! એગ્રીબોટ ડેશબોર્ડ પર આપનું સ્વાગત છે.`; break;
            case 'es': greeting = `¡Hola ${appState.user.name}! Bienvenido al panel de AgriBot.`; break;
        }

        const initMsg: Message = {
            id: 'init-1',
            sender: Sender.Bot,
            text: greeting,
            type: MessageType.Text,
            timestamp: Date.now()
        };
        addMessage(initMsg);
    }
  }, [appState.hasSelectedLanguage, appState.language, appState.user]);


  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (appState.currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, appState.currentView, isProcessing]);

  // Remove notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    
    setAppState(prev => ({
      ...prev,
      isLoggedIn: true,
      user: { name, location }
    }));
  };
  
  const handleLogout = () => {
    setAppState(initialAppState);
    setMessages([]);
    setConsultationHistory([]);
    setShowExpertConnect(false);
    // Add any other state resets here if needed
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAppState(prev => ({ ...prev, customLogo: result }));
        localStorage.setItem('agribot_custom_logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetLogo = () => {
    setAppState(prev => ({ ...prev, customLogo: null }));
    localStorage.removeItem('agribot_custom_logo');
  };

  // --- AUDIO / TTS LOGIC ---
  
  // Unlocks browser audio on first user interaction
  const ensureAudioContext = async () => {
    if (!audioContextRef.current) {
      try {
        // Gemini TTS model outputs at 24000Hz
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      } catch (e) {
        console.error("AudioContext not supported", e);
        return;
      }
    }
    // Resume context if it's suspended (happens on first load)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    // Also "warm up" the speech synthesis API
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
       window.speechSynthesis.cancel();
    }
  };
  
  const getLanguageCodeForWebSpeech = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'gu': return 'gu-IN';
      case 'es': return 'es-ES';
      default: return 'en-US';
    }
  };

  const playAudioData = async (base64String: string) => {
    if (!audioContextRef.current) {
      console.error("AudioContext not initialized.");
      setCurrentlyPlayingId(null);
      return;
    }
  
    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
  
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
  
      // Use custom PCM decoder instead of browser's standard decodeAudioData
      const audioBuffer = await decodePCMData(
        bytes,
        audioContextRef.current,
        24000, // Gemini TTS sample rate
        1,     // Mono channel
      );
  
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setCurrentlyPlayingId(null);
      };
  
      source.start(0);
    } catch (e) {
      console.error("Error playing audio data", e);
      setCurrentlyPlayingId(null);
    }
  };

  const speakTextOffline = (text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = getLanguageCodeForWebSpeech(lang);
    utterance.lang = langCode;

    if (availableVoices.length > 0) {
      let voice = availableVoices.find(v => v.lang === langCode && v.name.includes('Google'));
      if (!voice) voice = availableVoices.find(v => v.lang === langCode);
      if (!voice) voice = availableVoices.find(v => v.lang.startsWith(lang));
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => setCurrentlyPlayingId('offline-tts');
    utterance.onend = () => setCurrentlyPlayingId(null);
    utterance.onerror = () => setCurrentlyPlayingId(null);
    
    window.speechSynthesis.speak(utterance);
    setCurrentlyPlayingId('offline-tts');
  };

  const handleSpeakMessage = async (message: Message) => {
    if (currentlyPlayingId === message.id) {
       if (audioContextRef.current) await audioContextRef.current.suspend();
       window.speechSynthesis.cancel();
       setCurrentlyPlayingId(null);
       return;
    }

    setCurrentlyPlayingId(message.id);

    if (message.audioData) {
      await playAudioData(message.audioData);
      return;
    }

    if (isOnline) {
      try {
        const audioBase64 = await generateSpeech(message.text);
        if (audioBase64) {
          setMessages(prev => prev.map(m => 
            m.id === message.id ? { ...m, audioData: audioBase64 } : m
          ));
          await playAudioData(audioBase64);
          return;
        }
      } catch (e) {
        console.warn("Cloud TTS failed, falling back to local.");
      }
    }

    speakTextOffline(message.text, appState.language);
  };

  // --- APP FLOW ---

  const handleLanguageSelect = (lang: string) => {
    setAppState(prev => ({
      ...prev,
      language: lang,
      hasSelectedLanguage: true
    }));
  };

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSendMessage = async (text: string, image?: string, audioBlob?: Blob) => {
    if (!text && !image && !audioBlob) return;
    
    // Ensure AudioContext is active on user interaction
    await ensureAudioContext();

    if (appState.currentView !== 'chat') {
       setAppState(prev => ({ ...prev, currentView: 'chat' }));
    }

    const userMsgId = Date.now().toString();
    
    let displayAudioText = '🎤 Audio Message';
    if (appState.language === 'hi') displayAudioText = '🎤 ध्वनि संदेश';
    else if (appState.language === 'mr') displayAudioText = '🎤 व्हॉइस मेसेज';
    else if (appState.language === 'gu') displayAudioText = '🎤 વોઇસ મેસેજ';

    addMessage({
      id: userMsgId,
      sender: Sender.User,
      text: audioBlob ? displayAudioText : text,
      type: MessageType.Text,
      image: image,
      timestamp: Date.now()
    });

    setIsProcessing(true);
    setShowTools(false); 

    try {
      let audioBase64: string | undefined;
      if (audioBlob) {
        audioBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
             const base64 = (reader.result as string).split(',')[1];
             resolve(base64);
          };
          reader.readAsDataURL(audioBlob);
        });
      }

      const imageBase64 = image ? image.split(',')[1] : undefined;

      const response = await generateResponse(
        text, 
        imageBase64, 
        audioBase64, 
        appState.language, 
        messages
      );

      const botText = response.text || "Error";
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: botText,
        type: response.type || MessageType.Text,
        chartData: response.chartData,
        sources: response.sources,
        timestamp: Date.now()
      };

      addMessage(botMsg);
      
      if (!isMuted && botText) {
        handleSpeakMessage(botMsg);
      }

    } catch (error) {
      console.error(error);
      addMessage({
        id: Date.now().toString(),
        sender: Sender.Bot,
        text: "Sorry, I encountered an error. Please try again.",
        type: MessageType.Error,
        timestamp: Date.now()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeatureSelect = async (feature: AgriFeature) => {
    setAppState(prev => ({ ...prev, currentView: 'chat' }));

    if (feature.id === 'expert_connect') {
       setShowExpertConnect(true);
       return;
    }

    if (feature.id === 'market_price') {
       const userMsgId = Date.now().toString();
       const location = appState.user?.location || "my area";
       addMessage({
         id: userMsgId,
         sender: Sender.User,
         text: `Check market prices in ${location}`,
         type: MessageType.Text,
         timestamp: Date.now()
       });
       
       setIsProcessing(true);
       setShowTools(false);
       
       const marketData = await getMarketData('common crops', location);
       const botMsg: Message = {
         id: (Date.now() + 1).toString(),
         sender: Sender.Bot,
         text: marketData.text || "Here are the market trends.",
         type: marketData.data.length > 0 ? MessageType.Chart : MessageType.Text,
         chartData: marketData.data,
         sources: marketData.sources,
         timestamp: Date.now()
       };

       addMessage(botMsg);
       
       if (!isMuted && marketData.text) {
         handleSpeakMessage(botMsg);
       }
       
       setIsProcessing(false);
       return;
    }

    const finalPrompt = feature.requiresCamera 
        ? `${feature.prompt} (I will upload an image soon)` 
        : feature.prompt;
    
    handleSendMessage(finalPrompt);
  };

  const handleConsultationRequest = (consultation: Consultation) => {
     setConsultationHistory(prev => [...prev, consultation]);
     setTimeout(() => {
        setConsultationHistory(prev => 
          prev.map(c => c.id === consultation.id ? { ...c, status: 'Accepted' } : c)
        );
        setNotification(`${consultation.specialistName} has accepted your request!`);
     }, 4000);
  };

  const LogoImage = ({ className }: { className: string }) => {
    const [imgError, setImgError] = useState(false);
    const primarySrc = appState.customLogo || "./logo.png";
    const fallbackSrc = "https://ui-avatars.com/api/?name=Agri+Bot&background=166534&color=fff&rounded=true&bold=true";
    return (
      <img 
        src={imgError ? fallbackSrc : primarySrc} 
        alt="AgriBot Logo" 
        onError={() => setImgError(true)}
        className={`object-contain ${className}`} 
      />
    );
  };

  // Helper for background tint based on time
  const getTimeStyles = () => {
    switch(timeOfDay) {
      case 'morning': return 'from-yellow-100/30 to-green-100/30';
      case 'afternoon': return 'from-blue-100/30 to-green-100/30';
      case 'evening': return 'from-orange-100/30 to-indigo-100/30';
      case 'night': return 'from-slate-900/40 to-indigo-900/40';
    }
  };

  const SettingsModal = () => {
    if (!showSettingsModal) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl m-4 relative">
          <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"><X size={20} /></button>
          <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2"><Settings className="text-green-600" /> Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">App Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden border border-stone-200">
                  <LogoImage className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-2">
                   <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><Upload size={14} /> Upload New</button>
                   {appState.customLogo && <button onClick={resetLogo} className="text-xs text-red-500 hover:text-red-700 underline text-left px-1">Reset Default</button>}
                   <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-stone-700 mb-2">Network Status</label>
               <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${isOnline ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                  {isOnline ? 'Online Mode' : 'Offline Mode'}
               </div>
            </div>
             <button onClick={() => setShowSettingsModal(false)} className="w-full bg-stone-100 text-stone-700 font-medium py-2 rounded-xl hover:bg-stone-200">Close</button>
          </div>
        </div>
      </div>
    );
  };

  const OfflineBanner = () => (
    !isOnline ? (
      <div className="bg-amber-100 text-amber-800 text-xs text-center py-1 font-medium flex items-center justify-center gap-2 border-b border-amber-200 sticky top-0 z-50">
        <WifiOff size={14} /> Offline Mode (Using Local Data)
      </div>
    ) : null
  );

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-stone-50 flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl">
             <LogoImage className="w-24 h-24 sm:w-32 sm:h-32" />
          </div>
        </div>
        <h1 className="mt-8 text-2xl font-bold text-green-900 tracking-wider animate-pulse">AGRIBOT</h1>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!appState.isLoggedIn) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('./agribot-cover.jpg')`, backgroundColor: '#166534' }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        <button onClick={() => setShowSettingsModal(true)} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full z-20"><Settings size={20} /></button>
        <SettingsModal />
        <div className="relative z-10 w-full max-w-md">
            <div className="mb-4"><OfflineBanner /></div>
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-green-100">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-3 rounded-2xl mb-4 shadow-md border border-stone-100"><LogoImage className="w-20 h-20" /></div>
                <h1 className="text-3xl font-bold text-green-900">AgriBot</h1>
                <p className="text-stone-600 text-center mt-2 font-medium">Smart AI Farming Dashboard</p>
                <p className="text-xs text-stone-500 text-center mt-3 leading-relaxed">
                  AgriBot Dashboard features 20+ specialized tools including Disease Detection, 
                  Crop Calendar, Mandi Prices, Expert Connect, and Yield Prediction.
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                  <input name="name" required type="text" className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Ram Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                  <input name="location" required type="text" className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Punjab" />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg mt-4">Login to Dashboard</button>
              </form>
            </div>
        </div>
      </div>
    );
  }

  // LANGUAGE SELECTION
  if (!appState.hasSelectedLanguage) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
         {/* Background */}
         <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('./agribot-cover.jpg')`, backgroundColor: '#166534' }}>
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
        </div>

         <button onClick={() => setShowSettingsModal(true)} className="absolute top-4 right-4 p-2 bg-stone-100/80 rounded-full z-20"><Settings size={20} /></button>
         <SettingsModal />
         <div className="relative z-10 w-full max-w-lg mb-4"><OfflineBanner /></div>
         <div className="relative z-10 mb-8 flex flex-col items-center">
            <div className="bg-white p-3 rounded-2xl shadow-lg border border-stone-100 mb-4"><LogoImage className="w-24 h-24" /></div>
            <h1 className="text-3xl font-bold text-green-900">AgriBot</h1>
         </div>
        <div className="relative z-10 bg-white/95 backdrop-blur p-8 rounded-2xl shadow-xl w-full max-w-lg text-center border border-stone-100">
          <Globe className="w-10 h-10 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Select Language</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)} className="p-4 border-2 border-stone-100 hover:border-green-500 hover:bg-green-50 rounded-xl font-semibold text-stone-700 uppercase transition-all">
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP LAYOUT (DASHBOARD OR CHAT)
  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      
      {/* GLOBAL BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
         {/* Base Image */}
         <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000" style={{ backgroundImage: `url('./agribot-cover.jpg')`, backgroundColor: '#f5f5f4' }}></div>
         
         {/* Glassmorphism Overlay (Ensure Readability) */}
         <div className="absolute inset-0 bg-white/85 backdrop-blur-[4px]"></div>
         
         {/* Time of Day Gradient Tint */}
         <div className={`absolute inset-0 bg-gradient-to-br ${getTimeStyles()} opacity-60 mix-blend-overlay pointer-events-none`}></div>
      </div>

      <SettingsModal />
      
      {/* Content Wrapper */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          currentView={appState.currentView}
          onChangeView={(view) => {
            setAppState(prev => ({...prev, currentView: view}));
            setIsSidebarOpen(false);
          }}
          onLogout={handleLogout}
          logoSrc={appState.customLogo}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <OfflineBanner />

          {/* Header */}
          <header className="bg-white/70 backdrop-blur-md border-b border-stone-200/50 px-4 py-3 flex items-center justify-between shadow-sm shrink-0 z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg">
                <Menu size={24} />
              </button>
              <h1 className="font-bold text-lg text-stone-800 hidden sm:block">
                {appState.currentView === 'dashboard' ? 'Maker Dashboard' : 'AgriChat AI'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time of Day Indicator */}
              <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100/50 px-2 py-1 rounded-full border border-stone-200/50">
                 {timeOfDay === 'morning' && <Sun size={14} className="text-amber-500" />}
                 {timeOfDay === 'afternoon' && <CloudSun size={14} className="text-blue-500" />}
                 {timeOfDay === 'evening' && <Sunset size={14} className="text-orange-500" />}
                 {timeOfDay === 'night' && <Moon size={14} className="text-indigo-500" />}
                 <span className="capitalize">{timeOfDay}</span>
              </div>

              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isOnline ? 'bg-green-100/80 text-green-700' : 'bg-amber-100/80 text-amber-700'}`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <button 
                onClick={() => {
                    setIsMuted(!isMuted);
                    if (!isMuted && ('speechSynthesis' in window)) window.speechSynthesis.cancel();
                    if (!isMuted && audioContextRef.current) audioContextRef.current.suspend();
                }}
                className={`p-2 rounded-full transition-colors ${isMuted ? 'text-stone-400 bg-stone-100/80' : 'text-green-600 bg-green-50/80'}`}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </header>

          {/* Notifications */}
          {notification && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-4 py-2 rounded-full shadow-lg z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <Bell size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {appState.currentView === 'dashboard' && (
            <div className="flex-1 overflow-y-auto">
              <Dashboard 
                onFeatureSelect={handleFeatureSelect} 
                userName={appState.user?.name}
              />
            </div>
          )}

          {/* VIEW: CHAT */}
          {appState.currentView === 'chat' && (
            <>
              <main className="flex-1 overflow-y-auto relative flex flex-col">
                {/* Bot Mascot Section */}
                <div className="shrink-0 pt-6 pb-2 z-10 flex flex-col items-center justify-center pointer-events-none">
                  <BotMascot state={mascotState} />
                  {mascotState === 'thinking' && <p className="text-xs text-stone-500 font-mono mt-2 animate-pulse font-bold bg-white/50 px-2 rounded">ANALYZING DATA...</p>}
                  {mascotState === 'speaking' && <p className="text-xs text-green-600 font-mono mt-2 animate-pulse font-bold bg-white/50 px-2 rounded">SPEAKING...</p>}
                  {mascotState === 'listening' && <p className="text-xs text-red-500 font-mono mt-2 font-bold bg-white/50 px-2 rounded">LISTENING...</p>}
                </div>

                {/* Messages Area */}
                <div className="flex-1 px-4 sm:px-6 pb-4 space-y-2 z-10">
                  {messages.length === 0 && (
                    <div className="text-center text-stone-500 mt-10 text-sm bg-white/40 p-4 rounded-xl backdrop-blur-sm max-w-xs mx-auto">
                        Start asking questions about crops, weather, or markets.
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <ChatMessage 
                      key={msg.id} 
                      message={msg} 
                      onPlayAudio={!isMuted ? handleSpeakMessage : undefined} 
                      isPlayingAudio={currentlyPlayingId === msg.id || (currentlyPlayingId === 'offline-tts' && index === messages.length - 1)}
                      botAvatar={appState.customLogo || "./logo.png"}
                      isNew={index === messages.length - 1}
                    />
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start mb-6">
                      <div className="glass-panel p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-stone-500 text-sm shadow-sm animate-pulse">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </main>

              {/* In-Chat Tools */}
              <div className={`transition-all duration-300 z-20 relative ${showTools ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 pb-2 bg-gradient-to-t from-stone-50/50 to-transparent">
                  <ToolsGrid onSelectTool={(tool) => {
                      const feature = AGRI_FEATURES.find(f => f.title === tool.name);
                      if(feature) handleFeatureSelect(feature);
                      else handleSendMessage(tool.promptPrefix);
                  }} language={appState.language} />
                </div>
              </div>

              {!showTools && !isProcessing && (
                <div className="flex justify-center -mb-3 z-30 relative">
                  <button onClick={() => setShowTools(true)} className="text-xs bg-white/80 backdrop-blur text-stone-600 px-4 py-1 rounded-t-xl shadow-sm border border-stone-200 hover:bg-white">Show Tools</button>
                </div>
              )}

              <InputArea 
                onSendMessage={handleSendMessage} 
                isProcessing={isProcessing} 
                language={appState.language}
              />
            </>
          )}

          {/* VIEW: SETTINGS/PROFILE */}
          {(appState.currentView === 'settings' || appState.currentView === 'profile') && (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                <div className="bg-white/60 p-8 rounded-3xl backdrop-blur-sm text-center">
                  <Settings size={48} className="mb-4 opacity-50 mx-auto" />
                  <p>Section under construction</p>
                  <button onClick={() => setAppState(prev => ({...prev, currentView: 'dashboard'}))} className="mt-4 text-green-600 underline">Back to Dashboard</button>
                </div>
            </div>
          )}

          <ExpertConnect 
            isOpen={showExpertConnect} 
            onClose={() => setShowExpertConnect(false)}
            language={appState.language}
            onConsultationRequest={handleConsultationRequest}
            history={consultationHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
