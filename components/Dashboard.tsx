import React from 'react';
import { AGRI_FEATURES } from '../services/features';
import { AgriFeature } from '../types';
import { ArrowRight } from 'lucide-react';

interface DashboardProps {
  onFeatureSelect: (feature: AgriFeature) => void;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onFeatureSelect, userName }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full">
      
      {/* Welcome Section */}
      <div className="mb-8 p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">
          Welcome back, <span className="text-green-700">{userName || 'Farmer'}</span>
        </h1>
        <p className="text-stone-600 mt-1 font-medium">Access all your smart farming tools in one place.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {AGRI_FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onFeatureSelect(feature)}
            className="flex flex-col items-start text-left bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-lg hover:bg-white hover:border-green-300 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Hover decorative circle */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full -mr-10 -mt-10 z-0 transition-transform duration-500 group-hover:scale-150 group-hover:bg-green-100/50"></div>
            
            <div className="relative z-10 mb-3 p-2.5 bg-stone-50 rounded-xl group-hover:bg-green-50 transition-colors shadow-sm">
              {feature.icon}
            </div>
            
            <h3 className="relative z-10 font-bold text-stone-800 text-sm sm:text-base leading-tight mb-1 group-hover:text-green-800 transition-colors">
              {feature.title}
            </h3>
            
            <p className="relative z-10 text-xs text-stone-500 line-clamp-2 mb-3 h-8 group-hover:text-stone-600">
              {feature.description}
            </p>
            
            <div className="relative z-10 mt-auto flex items-center text-xs font-semibold text-green-600 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Open Tool <ArrowRight size={12} className="ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;