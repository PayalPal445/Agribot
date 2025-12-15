import React from 'react';
import { Sprout, CloudSun, Tractor, Bug, BookOpen, LineChart, Droplets, Calendar, Wallet, TrendingUp, PhoneCall, ShieldCheck } from 'lucide-react';
import { AgriTool } from '../types';

interface ToolsGridProps {
  onSelectTool: (tool: AgriTool) => void;
  language: string;
}

const TOOLS: AgriTool[] = [
  { 
    id: 'identify', 
    name: 'Disease ID', 
    icon: <Bug className="w-6 h-6 text-red-500" />, 
    promptPrefix: 'I have uploaded a photo of my crop. Please identify any disease, pest, or deficiency and recommend a solution.',
    requiresCamera: true
  },
  { 
    id: 'market', 
    name: 'Market Price', 
    icon: <LineChart className="w-6 h-6 text-green-600" />, 
    promptPrefix: 'What are the current market prices for common crops in my area?' 
  },
  { 
    id: 'weather', 
    name: 'Weather', 
    icon: <CloudSun className="w-6 h-6 text-blue-500" />, 
    promptPrefix: 'What is the weather forecast for farming in my region for the next 7 days?' 
  },
  { 
    id: 'calendar', 
    name: 'Crop Planner', 
    icon: <Calendar className="w-6 h-6 text-orange-500" />, 
    promptPrefix: 'Create a smart crop calendar for this month. What tasks should I focus on?' 
  },
  { 
    id: 'schemes', 
    name: 'Gov Schemes', 
    icon: <BookOpen className="w-6 h-6 text-purple-500" />, 
    promptPrefix: 'Match me with the latest government agricultural schemes and subsidies.' 
  },
  { 
    id: 'expenses', 
    name: 'Expense Track', 
    icon: <Wallet className="w-6 h-6 text-emerald-700" />, 
    promptPrefix: 'Help me track and optimize my farm expenses and suggest cost-cutting measures.' 
  },
  { 
    id: 'yield', 
    name: 'Yield Predict', 
    icon: <TrendingUp className="w-6 h-6 text-indigo-500" />, 
    promptPrefix: 'Based on current conditions, help me predict my crop yield and potential profit.' 
  },
  { 
    id: 'soil', 
    name: 'Soil & Fert', 
    icon: <Sprout className="w-6 h-6 text-amber-700" />, 
    promptPrefix: 'Analyze my soil needs and recommend the right fertilizers and pesticides.' 
  },
  { 
    id: 'water', 
    name: 'Water Mgmt', 
    icon: <Droplets className="w-6 h-6 text-cyan-500" />, 
    promptPrefix: 'Suggest efficient irrigation techniques and water management strategies for my farm.' 
  },
  { 
    id: 'fuel', 
    name: 'Machinery', 
    icon: <Tractor className="w-6 h-6 text-slate-600" />, 
    promptPrefix: 'Give me tips on fuel efficiency for farm machinery and maintenance advice.' 
  },
  { 
    id: 'expert', 
    name: 'Expert Help', 
    icon: <PhoneCall className="w-6 h-6 text-rose-500" />, 
    promptPrefix: 'I need emergency expert advice. Connect me with agriculture specialists or helplines.' 
  },
  { 
    id: 'safety', 
    name: 'Crop Safety', 
    icon: <ShieldCheck className="w-6 h-6 text-teal-600" />, 
    promptPrefix: 'How can I protect my crops from animals, theft, and extreme weather?' 
  }
];

const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool, language }) => {
  const getHeader = () => {
    switch(language) {
      case 'hi': return 'किसान उपकरण';
      case 'mr': return 'शेतकरी साधने';
      case 'ta': return 'விவசாய கருவிகள்';
      case 'te': return 'రైతు పరికరాలు';
      case 'gu': return 'ખેડૂત સાધનો';
      case 'es': return 'Herramientas';
      default: return 'Smart Farming Tools';
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-xl border border-stone-200">
      <h3 className="text-sm font-semibold text-stone-500 mb-3 uppercase tracking-wider">
        {getHeader()}
      </h3>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="flex flex-col items-center justify-start p-2 rounded-lg hover:bg-green-50 transition-colors duration-200 group text-center h-24 sm:h-auto"
          >
            <div className="mb-2 p-2 bg-stone-50 rounded-full group-hover:bg-white group-hover:shadow-md transition-all">
              {tool.icon}
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-stone-700 leading-tight line-clamp-2">
              {tool.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolsGrid;