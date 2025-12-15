import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Loader2, StopCircle, Radio } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string, image?: string, audioBlob?: Blob) => void;
  isProcessing: boolean;
  language: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isProcessing, language }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onSendMessage('Voice Message', selectedImage || undefined, audioBlob);
        stream.getTracks().forEach(track => track.stop());
        setRecordingDuration(0);
        setSelectedImage(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSend = () => {
    if (!text.trim() && !selectedImage) return;
    onSendMessage(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlaceholder = () => {
    switch(language) {
      case 'hi': return 'एग्रीबॉट से पूछें...';
      case 'mr': return 'ॲग्रीबॉटला विचारा...';
      case 'gu': return 'એગ્રીબોટને પૂછો...';
      default: return 'Type your question...';
    }
  };

  return (
    <div className="p-4 z-20 sticky bottom-0">
      <div className="glass-panel rounded-2xl p-2 sm:p-3 shadow-2xl border border-white/50 relative overflow-hidden">
        
        {/* Glowing Background Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 opacity-50"></div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-stone-50/80 rounded-xl w-fit animate-in slide-in-from-bottom-2 border border-stone-200">
            <img src={selectedImage} alt="Selected" className="h-12 w-12 object-cover rounded-lg" />
            <span className="text-xs text-stone-500 font-medium px-2">Image attached</span>
            <button 
              onClick={() => setSelectedImage(null)}
              className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Recording UI */}
        {isRecording ? (
          <div className="flex items-center justify-between bg-red-50/90 backdrop-blur p-3 rounded-xl border border-red-200 animate-pulse">
            <div className="flex items-center gap-3 text-red-600 font-bold">
               <div className="relative">
                 <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                 <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75"></div>
               </div>
               <span className="font-mono">{formatTime(recordingDuration)}</span>
               <span className="text-sm font-medium">Listening...</span>
            </div>
            
            {/* Audio Waveform Viz (Simulated) */}
            <div className="flex gap-1 h-4 items-center px-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-red-400 rounded-full animate-[bounce_1s_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>

            <button 
              onClick={stopRecording}
              className="p-2 bg-white text-red-600 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <StopCircle size={24} />
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            
            {/* Attachment Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-stone-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all flex-shrink-0"
            >
              <ImageIcon size={24} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Text Input */}
            <div className="relative flex-grow">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={getPlaceholder()}
                className="w-full bg-stone-50/50 border-none rounded-xl pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none max-h-32 min-h-[48px] placeholder-stone-400 text-stone-800 font-medium"
                rows={1}
              />
            </div>

            {/* Action Button (Send or Mic) */}
            {text.trim() || selectedImage ? (
              <button
                onClick={handleSend}
                disabled={isProcessing}
                className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all flex-shrink-0 group"
              >
                <Mic size={24} className="group-hover:animate-pulse" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputArea;