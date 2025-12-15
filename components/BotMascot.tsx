import React from 'react';

interface BotMascotProps {
  state: 'idle' | 'thinking' | 'speaking' | 'listening';
}

const BotMascot: React.FC<BotMascotProps> = ({ state }) => {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto animate-float transition-all duration-500">
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${state === 'thinking' ? 'bg-amber-400/30' : state === 'speaking' ? 'bg-green-500/30' : state === 'listening' ? 'bg-red-500/30' : 'bg-blue-400/20'}`}></div>

      {/* Robot Head */}
      <div className="relative w-full h-full bg-gradient-to-b from-white to-stone-100 rounded-[2rem] border-2 border-white shadow-xl flex flex-col items-center justify-center overflow-hidden">
        
        {/* Antenna */}
        <div className="absolute -top-3 w-1 h-4 bg-stone-300"></div>
        <div className={`absolute -top-5 w-3 h-3 rounded-full shadow-md transition-colors duration-300 ${state === 'listening' ? 'bg-red-500 animate-pulse' : state === 'thinking' ? 'bg-amber-400 animate-bounce' : 'bg-green-500'}`}></div>

        {/* Face Screen */}
        <div className="w-[80%] h-[60%] bg-stone-900 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner border border-stone-800">
          
          {/* Eyes Container */}
          <div className="flex gap-4 sm:gap-6 items-center z-10">
             {/* Left Eye */}
             <div className={`bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-300 animate-blink
                ${state === 'thinking' ? 'w-3 h-3 rounded-full animate-spin' : 
                  state === 'listening' ? 'w-6 h-6 rounded-full scale-110' : 
                  state === 'speaking' ? 'w-6 h-3 rounded-t-full' : 'w-5 h-5 sm:w-6 sm:h-6 rounded-full'
                }`}></div>
             
             {/* Right Eye */}
             <div className={`bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-300 animate-blink
                ${state === 'thinking' ? 'w-3 h-3 rounded-full animate-spin' : 
                  state === 'listening' ? 'w-6 h-6 rounded-full scale-110' : 
                  state === 'speaking' ? 'w-6 h-3 rounded-t-full' : 'w-5 h-5 sm:w-6 sm:h-6 rounded-full'
                }`}></div>
          </div>

          {/* Mouth (optional based on state) */}
          {state === 'speaking' && (
             <div className="absolute bottom-3 w-8 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
          )}

          {/* Screen Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-full w-full animate-[scanline_3s_linear_infinite] opacity-30 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default BotMascot;