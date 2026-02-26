import React, { useState } from 'react';
import { X, Minimize2, Maximize2, Send, Paperclip, Trash2 } from './Icons';

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeEmail: React.FC<ComposeEmailProps> = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    // Mock send functionality
    console.log("Sending email:", { to, subject, body });
    onClose();
    setTo('');
    setSubject('');
    setBody('');
  };

  const windowClasses = isExpanded 
    ? "fixed inset-4 md:inset-20 z-50 glass-strong rounded-2xl flex flex-col shadow-2xl transition-all duration-300 border border-white/20"
    : `fixed bottom-0 right-[10%] w-[500px] z-50 glass-strong rounded-t-2xl flex flex-col shadow-2xl transition-all duration-300 border border-white/20 border-b-0 ${isMinimized ? 'h-14' : 'h-[550px]'}`;

  return (
    <div className={windowClasses}>
      {/* Header */}
      <div 
        className="h-14 px-4 bg-white/5 border-b border-white/10 flex items-center justify-between cursor-pointer rounded-t-2xl hover:bg-white/10 transition-colors"
        onClick={() => !isExpanded && setIsMinimized(!isMinimized)}
      >
        <span className="text-sm font-bold text-slate-200 tracking-wide">
          {subject ? subject : 'New Message'}
        </span>
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (isMinimized) setIsMinimized(false);
            }} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Area */}
      {!isMinimized && (
        <div className="flex flex-col flex-1 overflow-hidden bg-black/40">
          <div className="px-4 border-b border-white/5 flex items-center">
            <span className="text-sm font-medium text-slate-400 w-12">To</span>
            <input 
              type="text" 
              className="flex-1 bg-transparent py-3 text-sm text-slate-200 focus:outline-none" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipient"
            />
          </div>
          <div className="px-4 border-b border-white/5 flex items-center">
            <span className="text-sm font-medium text-slate-400 w-12">Subject</span>
            <input 
              type="text" 
              className="flex-1 bg-transparent py-3 text-sm text-slate-200 font-bold focus:outline-none" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <textarea 
              className="w-full h-full bg-transparent resize-none focus:outline-none text-sm text-slate-300 placeholder-slate-600"
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
            <button 
              onClick={handleSend}
              className="flex items-center px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
