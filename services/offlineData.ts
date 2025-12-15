export interface OfflineEntry {
  keywords: string[];
  response: {
    en: string;
    hi: string;
    mr: string;
    ta: string;
    te: string;
    gu: string;
    es: string;
  };
}

export const OFFLINE_DATABASE: OfflineEntry[] = [
  {
    keywords: ['wheat', 'gehu', 'gahu', 'ghau'],
    response: {
      en: "Wheat Farming (Offline Mode): \n• Sowing Time: Nov-Dec \n• Temperature: 10-25°C \n• Irrigation: 4-6 times depending on soil. \n• Common Diseases: Rust, Loose Smut. \n• Tip: Use Zinc Sulphate for better yield.",
      hi: "गेहूँ की खेती (ऑफलाइन मोड): \n• बुवाई का समय: नवंबर-दिसंबर \n• तापमान: 10-25°C \n• सिंचाई: 4-6 बार। \n• सामान्य रोग: रतुआ (Rust)। \n• सुझाव: बेहतर पैदावार के लिए जिंक सल्फेट का प्रयोग करें।",
      mr: "गहू लागवड (ऑफलाइन मोड): \n• पेरणीची वेळ: नोव्हेंबर-डिसेंबर \n• तापमान: 10-25°C \n• पाणी: 4-6 वेळा. \n• सामान्य रोग: तांबेरा. \n• टीप: चांगल्या उत्पादनासाठी झिंक सल्फेट वापरा.",
      ta: "கோதுமை விவசாயம் (ஆஃப்லைன் பயன்முறை): \n• விதைக்கும் நேரம்: நவம்பர்-டிசம்பர் \n• வெப்பநிலை: 10-25°C \n• நீர்ப்பாசனம்: 4-6 முறை. \n• உதவிக்குறிப்பு: சிறந்த விளைச்சலுக்கு ஜிங்க் சல்பேட்டைப் பயன்படுத்தவும்.",
      te: "గోధుమ సాగు (ఆఫ్‌లైన్ మోడ్): \n• విత్తే సమయం: నవంబర్-డిసెంబర్ \n• నీటిపారుదల: 4-6 సార్లు. \n• చిట్కా: మెరుగైన దిగుబడి కోసం జింక్ సల్ఫేట్ ఉపయోగించండి.",
      gu: "ઘઉંની ખેતી (ઓફલાઇન મોડ): \n• વાવણીનો સમય: નવેમ્બર-ડિસેમ્બર \n• તાપમાન: 10-25°C \n• પિયત: 4-6 વખત. \n• સામાન્ય રોગો: રસ્ટ. \n• ટીપ: વધુ ઉપજ માટે ઝીંક સલ્ફેટનો ઉપયોગ કરો.",
      es: "Cultivo de trigo (Modo sin conexión): \n• Siembra: Nov-Dic \n• Riego: 4-6 veces. \n• Consejo: Use sulfato de zinc para obtener un mejor rendimiento."
    }
  },
  {
    keywords: ['rice', 'paddy', 'chawal', 'dhan', 'tandul', 'chokha'],
    response: {
      en: "Rice/Paddy (Offline Mode): \n• Sowing: June-July (Kharif) \n• Water: Needs standing water. \n• Pests: Stem Borer, Leaf Folder. \n• Fertilizer: Urea, DAP, Potash in split doses.",
      hi: "धान की खेती (ऑफलाइन मोड): \n• बुवाई: जून-जुलाई (खरीफ) \n• पानी: खड़े पानी की आवश्यकता होती है। \n• कीट: तना छेदक, पत्ता लपेटक। \n• खाद: यूरिया, डीएपी का प्रयोग करें।",
      mr: "भात शेती (ऑफलाइन मोड): \n• पेरणी: जून-जुलाई \n• पाणी: साचलेले पाणी आवश्यक आहे. \n• कीड: खोडकिडा. \n• खत: युरिया, डीएपी वापरा.",
      ta: "நெல் விவசாயம் (ஆஃப்லைன் பயன்முறை): \n• விதைப்பு: ஜூன்-ஜூலை \n• பூச்சிகள்: தண்டு துளைப்பான். \n• உரம்: யூரியா மற்றும் டி.ஏ.பி பயன்படுத்தவும்.",
      te: "వరి సాగు (ఆఫ్‌లైన్ మోడ్): \n• విత్తడం: జూన్-జులై \n• చీడలు: కాండం తొలుచు పురుగు. \n• ఎరువులు: యూరియా, డిఎపి ఉపయోగించండి.",
      gu: "ડાંગરની ખેતી (ઓફલાઇન મોડ): \n• વાવણી: જૂન-જુલાઈ (ખરીફ) \n• પાણી: સ્થિર પાણીની જરૂર છે. \n• જીવાતો: સ્ટેમ બોરર. \n• ખાતર: યુરિયા, ડીએપી, પોટાશનો ઉપયોગ કરો.",
      es: "Cultivo de arroz (Modo sin conexión): \n• Siembra: Junio-Julio \n• Agua: Necesita agua estancada. \n• Plagas: Barrenador del tallo."
    }
  },
  {
    keywords: ['market', 'price', 'bhav', 'mand', 'rate', 'kimat'],
    response: {
      en: "Offline Market Insight: \nSince I cannot access live servers, here are historical averages for this season: \n• Wheat: ₹2100-2400/quintal \n• Rice: ₹2200-2800/quintal \n• Cotton: ₹6000-7500/quintal \n(Please connect to internet for live daily rates).",
      hi: "ऑफलाइन बाजार भाव: \nलाइव सर्वर उपलब्ध नहीं है, यहाँ इस मौसम के औसत भाव हैं: \n• गेहूँ: ₹2100-2400/क्विंटल \n• धान: ₹2200-2800/क्विंटल \n• कपास: ₹6000-7500/क्विंटल \n(ताज़ा भाव के लिए इंटरनेट से कनेक्ट करें)।",
      mr: "ऑफलाइन बाजार भाव: \n• गहू: ₹2100-2400/क्विंटल \n• तांदूळ: ₹2200-2800/क्विंटल \n• कापूस: ₹6000-7500/क्विंटल \n(ताज्या भावासाठी इंटरनेटशी कनेक्ट करा).",
      ta: "சந்தை விலை (ஆஃப்லைன்): \n• கோதுமை: ₹2100-2400 \n• அரிசி: ₹2200-2800 \n• பருத்தி: ₹6000-7500 \n(நேரடி விலைகளுக்கு இணையத்துடன் இணைக்கவும்).",
      te: "మార్కెట్ ధరలు (ఆఫ్‌లైన్): \n• గోధుమ: ₹2100-2400 \n• వరి: ₹2200-2800 \n• పత్తి: ₹6000-7500",
      gu: "બજાર ભાવ (ઓફલાઇન): \n• ઘઉં: ₹2100-2400/ક્વિન્ટલ \n• ચોખા: ₹2200-2800/ક્વિન્ટલ \n• કપાસ: ₹6000-7500/ક્વિન્ટલ \n(જીવંત દરો માટે ઇન્ટરનેટ સાથે કનેક્ટ કરો).",
      es: "Precios de mercado (Sin conexión): \n• Trigo: ₹2100-2400 \n• Arroz: ₹2200-2800 \n(Conéctese a internet para precios en vivo)."
    }
  },
  {
    keywords: ['scheme', 'yojana', 'subsid', 'pm kisan'],
    response: {
      en: "Government Schemes (Offline Cache): \n1. PM-KISAN: ₹6000/year income support. \n2. PM Fasal Bima Yojana: Crop insurance against failure. \n3. KCC (Kisan Credit Card): Low interest loans. \nContact your local Krishi Vigyan Kendra for forms.",
      hi: "सरकारी योजनाएं (ऑफलाइन): \n1. पीएम-किसान: ₹6000/वर्ष। \n2. फसल बीमा योजना: फसल के नुकसान का बीमा। \n3. केसीसी (KCC): कम ब्याज पर ऋण। \nअधिक जानकारी के लिए कृषि विज्ञान केंद्र से संपर्क करें।",
      mr: "सरकारी योजना (ऑफलाइन): \n1. पीएम-किसान: ₹6000/वर्ष. \n2. पीक विमा योजना. \n3. किसान क्रेडिट कार्ड (KCC). \nस्थानिक कृषी केंद्राशी संपर्क साधा.",
      ta: "அரசு திட்டங்கள் (ஆஃப்லைன்): \n1. பிஎம்-கிசான்: ₹6000/ஆண்டு. \n2. பயிர் காப்பீட்டுத் திட்டம். \n3. கிசான் கிரெடிட் கார்டு.",
      te: "ప్రభుత్వ పథకాలు (ఆఫ్‌లైన్): \n1. పిఎం-కిసాన్: ₹6000/సంవత్సరం. \n2. పంట బీమా పథకం. \n3. కిసాన్ క్రెడిట్ కార్డ్.",
      gu: "સરકારી યોજનાઓ (ઓફલાઇન): \n1. પીએમ-કિસાન: ₹6000/વર્ષ. \n2. પાક વીમા યોજના. \n3. કિસાન ક્રેડિટ કાર્ડ (KCC).",
      es: "Esquemas gubernamentales (Sin conexión): \n1. PM-KISAN: Soporte de ingresos. \n2. Seguro de cultivos. \n3. Tarjeta de crédito Kisan."
    }
  },
  {
    keywords: ['contact', 'help', 'number', 'call', 'support'],
    response: {
      en: "Offline Emergency Contacts: \n• Kisan Call Center: 1800-180-1551 \n• Soil Testing Lab: Check local KVK \n• Agri Dept Helpline: 1551",
      hi: "संपर्क नंबर (ऑफलाइन): \n• किसान कॉल सेंटर: 1800-180-1551 \n• कृषि विभाग हेल्पलाइन: 1551",
      mr: "संपर्क क्रमांक (ऑफलाइन): \n• किसान कॉल सेंटर: 1800-180-1551 \n• कृषी विभाग: 1551",
      ta: "தொடர்பு எண்கள்: \n• கிசான் கால் சென்டர்: 1800-180-1551",
      te: "సంప్రదింపు నంబర్లు: \n• కిసాన్ కాల్ సెంటర్: 1800-180-1551",
      gu: "સંપર્ક નંબરો: \n• કિસાન કોલ સેન્ટર: 1800-180-1551",
      es: "Contactos de emergencia: \n• Centro de llamadas Kisan: 1800-180-1551"
    }
  },
  {
    keywords: ['weather', 'mausam', 'barish', 'rain', 'havaman'],
    response: {
      en: "Weather (Offline Mode): \nI cannot fetch the live forecast without internet. \nGeneral advice: If the sky is cloudy, delay spraying pesticides. Ensure proper drainage in fields during monsoon months.",
      hi: "मौसम (ऑफलाइन मोड): \nइंटरनेट के बिना मैं लाइव पूर्वानुमान नहीं बता सकता। \nसामान्य सलाह: यदि बादल छाए हों, तो कीटनाशक का छिड़काव न करें।",
      mr: "हवामान (ऑफलाइन मोड): \nइंटरनेटशिवाय मी थेट अंदाज सांगू शकत नाही. \nसल्ला: ढगाळ वातावरण असल्यास फवारणी टाळा.",
      ta: "வானிலை (ஆஃப்லைன்): \nஇணையம் இல்லாமல் நேரடி முன்னறிவிப்பை என்னால் பெற முடியாது.",
      te: "వాతావరణం (ఆఫ్‌లైన్): \nఇంటర్నెట్ లేకుండా నేను ప్రత్యక్ష సూచనను పొందలేను.",
      gu: "હવામાન (ઓફલાઇન): \nઇન્ટરનેટ વિના હું જીવંત આગાહી મેળવી શકતો નથી. \nસામાન્ય સલાહ: જો વાદળછાયું હોય, તો જંતુનાશક દવાનો છંટકાવ મુલતવી રાખો.",
      es: "Clima (Sin conexión): \nNo puedo obtener el pronóstico en vivo sin internet."
    }
  },
   {
    keywords: ['calendar', 'month', 'task'],
    response: {
      en: "Crop Calendar (Offline):\n• June-July: Sowing for Kharif (Rice, Cotton).\n• Oct-Nov: Harvesting Kharif, Sowing Rabi (Wheat, Mustard).\n• Jan-Feb: Irrigation and weeding for Rabi.\n• March-April: Harvesting Rabi crops.",
      hi: "फसल कैलेंडर (ऑफलाइन):\n• जून-जुलाई: खरीफ बुवाई (धान, कपास)।\n• अक्टूबर-नवंबर: खरीफ कटाई, रबी बुवाई (गेहूँ)।\n• जनवरी-फरवरी: रबी फसलों की सिंचाई।",
      mr: "पीक दिनदर्शिका (ऑफलाइन):\n• जून-जुलै: खरीप पेरणी.\n• ऑक्टोबर-नोव्हेंबर: रबी पेरणी.\n• जानेवारी-फेब्रुवारी: पाणी आणि निंदणी.",
      ta: "பயிர் காலண்டர் (ஆஃப்லைன்):\n• ஜூன்-ஜூலை: காரீஃப் விதைப்பு.\n• ஜனவரி-பிப்ரவரி: ரபிக்கு நீர்ப்பாசனம்.",
      te: "పంట క్యాలెండర్ (ఆఫ్‌లైన్):\n• జూన్-జులై: ఖరీఫ్ విత్తనాలు.\n• జనవరి-ఫిబ్రవరి: రబీకి నీటిపారుదల.",
      gu: "પાક કેલેન્ડર (ઓફલાઇન):\n• જૂન-જુલાઈ: ખરીફ વાવણી.\n• ઓક્ટોબર-નવેમ્બર: રવિ વાવણી.\n• જાન્યુઆરી-ફેબ્રુઆરી: પિયત.",
      es: "Calendario de cultivos (Sin conexión):\n• Junio-Julio: Siembra.\n• Ene-Feb: Riego."
    }
  }
];

export const getFallbackText = (lang: string) => {
  switch(lang) {
    case 'hi': return "मैं अभी ऑफलाइन मोड में हूं। मेरे पास सीमित जानकारी उपलब्ध है। कृपया अपनी फसल, बीमारी या योजना के बारे में पूछें।";
    case 'mr': return "मी सध्या ऑफलाइन मोडमध्ये आहे. माझ्याकडे मर्यादित माहिती उपलब्ध आहे. कृपया पीक, रोग किंवा योजनेबद्दल विचारा.";
    case 'ta': return "நான் இப்போது ஆஃப்லைனில் இருக்கிறேன். என்னிடம் குறைந்த அளவு தகவல்களே உள்ளன.";
    case 'te': return "నేను ఇప్పుడు ఆఫ్‌లైన్ మోడ్‌లో ఉన్నాను. నా దగ్గర పరిమిత సమాచారం అందుబాటులో ఉంది.";
    case 'gu': return "હું હાલમાં ઑફલાઇન મોડમાં છું. મારી પાસે મર્યાદિત માહિતી ઉપલબ્ધ છે.";
    case 'es': return "Estoy en modo sin conexión. Tengo información limitada disponible.";
    default: return "I am currently in Offline Mode using local database. I can answer basic questions about crops, contacts, and schemes. Please connect to internet for advanced features.";
  }
};