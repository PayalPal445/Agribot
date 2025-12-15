import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, MessageType } from '../types';
import { User, Volume2, Loader2, ExternalLink, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChatMessageProps {
  message: Message;
  onPlayAudio?: (message: Message) => void;
  isPlayingAudio?: boolean;
  botAvatar?: string;
  isNew?: boolean; // Prop to trigger animation
}

const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 15); // Speed of typing

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <div className="whitespace-pre-wrap leading-relaxed">{displayedText}</div>;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPlayAudio, isPlayingAudio, botAvatar, isNew }) => {
  const isBot = message.sender === Sender.Bot;
  const [imgError, setImgError] = useState(false);
  const [typingComplete, setTypingComplete] = useState(!isNew); // If not new, show immediately

  const fallbackAvatar = "https://ui-avatars.com/api/?name=Agri+Bot&background=166534&color=fff&rounded=true&bold=true";
  const avatarSrc = isBot ? (imgError ? fallbackAvatar : (botAvatar || "./logo.png")) : "";

  // Play sound on mount if it's a new message
  useEffect(() => {
    if (isNew) {
      // Simple 'pop' sound
      const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"); // Placeholder/Silent
      // In a real app, use a real short beep base64. 
    }
  }, [isNew]);

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-6 group`}>
      <div className={`flex max-w-[90%] sm:max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
        
        {/* Avatar */}
        {isBot && (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden bg-white/50 border border-white/60 shadow-lg backdrop-blur-sm">
             <img 
               src={avatarSrc} 
               alt="Bot" 
               onError={() => setImgError(true)}
               className="w-full h-full object-contain p-1" 
             />
          </div>
        )}

        {/* Bubble */}
        <div className={`
          relative p-4 rounded-2xl shadow-sm border backdrop-blur-md transition-all duration-300
          ${isBot 
            ? 'glass-panel rounded-bl-none text-stone-800 border-white/60 hover:shadow-md' 
            : 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-br-none border-green-500 shadow-green-200 shadow-lg'
          }
        `}>
          
          {/* Futuristic corner accent */}
          <div className={`absolute top-0 w-3 h-3 border-t border-l ${isBot ? 'left-0 border-stone-400 rounded-tl-lg' : 'right-0 border-green-300 rounded-tr-lg'} opacity-50`}></div>

          {/* Image Attachment */}
          {message.image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-white/50 shadow-sm">
              <img src={message.image} alt="Uploaded" className="max-w-full h-auto max-h-64 object-cover" />
            </div>
          )}

          {/* Text Content */}
          <div className="text-sm sm:text-base pr-6 font-medium">
             {isBot && isNew ? (
               <TypewriterText text={message.text} onComplete={() => setTypingComplete(true)} />
             ) : (
               <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
             )}
          </div>

          {/* Audio Replay Button (Only for Bot) */}
          {isBot && onPlayAudio && (
            <button 
              onClick={() => onPlayAudio(message)}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 
                ${isPlayingAudio 
                  ? 'text-green-600 bg-green-100 shadow-[0_0_10px_rgba(74,222,128,0.6)]' 
                  : 'text-stone-400 hover:text-green-600 hover:bg-stone-50'}`}
              title="Read Aloud"
            >
              {isPlayingAudio ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
            </button>
          )}

          {/* Chart Content */}
          {message.type === MessageType.Chart && message.chartData && (
            <div className="mt-4 w-full h-56 bg-white/60 rounded-xl p-2 border border-stone-100 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={message.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-2 mt-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Market Trends Live</p>
              </div>
            </div>
          )}
          
           {/* Sources/Grounding */}
           {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-stone-200/50">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <ExternalLink size={10} /> Verified Sources
              </p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full border border-green-200 transition-colors"
                  >
                    {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <span className={`text-[10px] absolute bottom-1 right-3 opacity-60 font-medium ${isBot ? 'text-stone-500' : 'text-green-100'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;