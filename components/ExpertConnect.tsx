import React, { useState } from 'react';
import { Specialist, Consultation } from '../types';
import { getExpertsByLanguage } from '../services/expertData';
import { Phone, MessageCircle, Calendar, X, CheckCircle, Clock, History, UserPlus } from 'lucide-react';

interface ExpertConnectProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  onConsultationRequest: (consultation: Consultation) => void;
  history: Consultation[];
}

const ExpertConnect: React.FC<ExpertConnectProps> = ({ isOpen, onClose, language, onConsultationRequest, history }) => {
  const [view, setView] = useState<'list' | 'form' | 'success' | 'history'>('list');
  const [selectedExpert, setSelectedExpert] = useState<Specialist | null>(null);
  const [requestType, setRequestType] = useState<'Chat' | 'Call' | 'Callback'>('Chat');
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const experts = getExpertsByLanguage(language);

  if (!isOpen) return null;

  const handleConnect = (expert: Specialist, type: 'Chat' | 'Call' | 'Callback') => {
    setSelectedExpert(expert);
    setRequestType(type);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        specialistId: selectedExpert.id,
        specialistName: selectedExpert.name,
        type: requestType,
        status: 'Pending',
        problem: problem,
        timestamp: Date.now()
      };
      
      onConsultationRequest(newConsultation);
      setIsSubmitting(false);
      setView('success');
      setProblem('');
    }, 1500);
  };

  const getText = (key: string) => {
    // Simple localization for the UI
    const dict: any = {
      title: { en: 'Specialist Connect', hi: 'विशेषज्ञ से जुड़ें', mr: 'तज्ञांशी संपर्क साधा' },
      subtitle: { en: 'Get advice from certified agri-experts', hi: 'प्रमाणित कृषि विशेषज्ञों से सलाह लें', mr: 'प्रमाणित कृषी तज्ञांचा सल्ला घ्या' },
      history: { en: 'History', hi: 'इतिहास', mr: 'इतिहास' },
      exp: { en: 'Exp', hi: 'अनुभव', mr: 'अनुभव' },
      describe: { en: 'Describe your problem...', hi: 'अपनी समस्या का वर्णन करें...', mr: 'तुमच्या समस्येचे वर्णन करा...' },
      submit: { en: 'Send Request', hi: 'अनुरोध भेजें', mr: 'विनंती पाठवा' },
      success: { en: 'Request Sent!', hi: 'अनुरोध भेजा गया!', mr: 'विनंती पाठवली!' },
      successSub: { en: 'The expert will connect with you shortly.', hi: 'विशेषज्ञ जल्द ही आपसे संपर्क करेंगे।', mr: 'तज्ञ लवकरच तुमच्याशी संपर्क साधतील.' }
    };
    return dict[key]?.[language === 'hi' || language === 'mr' ? language : 'en'] || dict[key]?.en;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-50 w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserPlus size={20} /> {getText('title')}
            </h2>
            <p className="text-xs text-green-100">{getText('subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-green-600 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-stone-200 shrink-0">
          <button 
            onClick={() => setView('list')} 
            className={`flex-1 py-3 text-sm font-medium ${view === 'list' || view === 'form' ? 'text-green-700 border-b-2 border-green-700' : 'text-stone-500'}`}
          >
            Experts
          </button>
          <button 
            onClick={() => setView('history')} 
            className={`flex-1 py-3 text-sm font-medium ${view === 'history' ? 'text-green-700 border-b-2 border-green-700' : 'text-stone-500'}`}
          >
            {getText('history')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-stone-50">
          
          {/* VIEW: EXPERT LIST */}
          {view === 'list' && (
            <div className="space-y-3">
              {experts.map(expert => (
                <div key={expert.id} className="bg-white p-3 rounded-xl shadow-sm border border-stone-100 flex gap-3">
                  <img src={expert.image} alt={expert.name} className="w-14 h-14 rounded-full object-cover border border-stone-200" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-stone-800">{expert.name}</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{expert.field}</span>
                      </div>
                      {expert.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online"></span>}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{getText('exp')}: {expert.experience}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => handleConnect(expert, 'Call')}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Phone size={14} /> Call
                      </button>
                      <button 
                         onClick={() => handleConnect(expert, 'Chat')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <MessageCircle size={14} /> Chat
                      </button>
                      <button 
                         onClick={() => handleConnect(expert, 'Callback')}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg"
                        title="Schedule Callback"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: FORM */}
          {view === 'form' && selectedExpert && (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded-xl border border-stone-200">
                <img src={selectedExpert.image} alt={selectedExpert.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-bold text-stone-800">{selectedExpert.name}</h3>
                  <p className="text-xs text-stone-500 capitalize">{requestType} Request</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <label className="text-sm font-medium text-stone-700 mb-2">{getText('describe')}</label>
                <textarea 
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none flex-1 mb-4"
                  placeholder={getText('describe')}
                />
                
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setView('list')}
                    className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <span className="animate-spin">⌛</span> : getText('submit')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: SUCCESS */}
          {view === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{getText('success')}</h3>
              <p className="text-stone-500 mb-6">{getText('successSub')}</p>
              <button 
                onClick={() => setView('list')}
                className="bg-stone-800 text-white px-6 py-2 rounded-xl text-sm"
              >
                Done
              </button>
            </div>
          )}

          {/* VIEW: HISTORY */}
          {view === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                 <div className="text-center text-stone-400 mt-10">
                   <History size={32} className="mx-auto mb-2 opacity-50" />
                   <p className="text-sm">No past consultations.</p>
                 </div>
              ) : (
                history.slice().reverse().map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-sm text-stone-800">{item.specialistName}</h4>
                       <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                         {item.status}
                       </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 mb-2 italic">"{item.problem}"</p>
                    <div className="flex justify-between items-center text-[10px] text-stone-400">
                      <span className="flex items-center gap-1"><Clock size={10} /> {new Date(item.timestamp).toLocaleDateString()}</span>
                      <span className="uppercase font-medium">{item.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExpertConnect;