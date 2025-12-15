import React from 'react';
import { Home, MessageSquare, Settings, User, LogOut, X } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onLogout: () => void;
  logoSrc: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onChangeView, onLogout, logoSrc }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'chat', label: 'AgriChat', icon: <MessageSquare size={20} /> },
    { id: 'profile', label: 'My Farm Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none lg:border-r border-stone-200 flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg overflow-hidden bg-green-50 border border-green-100 p-1">
                 <img 
                    src={logoSrc || "https://ui-avatars.com/api/?name=Agri+Bot&background=166534&color=fff"} 
                    alt="Logo" 
                    className="w-full h-full object-contain" 
                 />
             </div>
             <span className="font-bold text-xl text-green-900">AgriBot</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-stone-400 hover:text-stone-600">
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id as ViewMode);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                currentView === item.id 
                  ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                  : 'text-stone-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
          <p className="text-xs text-stone-400 text-center mt-4">v1.2.0 • Online Mode</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;