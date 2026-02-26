import React from 'react';
import { Email } from '../types';
import { MoreVertical, Mail, Trash2, Tag, Paperclip, Send, FileText, Download } from './Icons';

interface EmailDetailProps {
  email: Email | null;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center glass text-slate-500">
        <Mail className="w-16 h-16 mb-4 opacity-20" />
        <p>Select an item to read</p>
      </div>
    );
  }

  const date = new Date(email.date);
  const formattedDate = date.toLocaleDateString([], { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/40 backdrop-blur-md overflow-hidden relative">
      {/* Header Actions */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-black/20">
        <div className="flex items-center space-x-2">
          {email.labels.map(label => (
            <span key={label} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
              <Tag className="w-3 h-3 mr-1.5 opacity-70" />
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Content Wrapper */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8 leading-tight">{email.subject}</h1>
          
          {/* Sender Info */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center">
              <img src={email.sender.avatar} alt={email.sender.name} className="w-12 h-12 rounded-full mr-4 border border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
              <div>
                <div className="flex items-baseline">
                  <h3 className="text-base font-bold text-slate-200 mr-2">{email.sender.name}</h3>
                  <span className="text-sm text-slate-500">&lt;{email.sender.email}&gt;</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">to {email.recipient.name}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-500 whitespace-nowrap bg-black/30 px-3 py-1 rounded-lg">
              {formattedDate}
            </div>
          </div>

          {/* Body */}
          <div 
            className="prose prose-invert max-w-none text-slate-300 text-[15px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />

          {/* Attachments (Mock) */}
          {email.hasAttachment && (
            <div className="mt-10 pt-6 border-t border-white/5">
              <p className="text-sm font-semibold text-slate-400 mb-4 flex items-center uppercase tracking-wider">
                <Paperclip className="w-4 h-4 mr-2" />
                1 Attachment
              </p>
              <div className="flex items-center p-3 border border-white/10 rounded-xl bg-white/5 w-72 hover:bg-white/10 cursor-pointer transition-all group shadow-sm">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-4 text-red-400 border border-red-500/30 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">Contract_v2.pdf</p>
                  <p className="text-xs text-slate-500 mt-0.5">1.2 MB</p>
                </div>
                <Download className="w-4 h-4 text-slate-500 ml-2 group-hover:text-indigo-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Box (Sticky at bottom) */}
      <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto flex items-start space-x-4">
          <img src={email.recipient.avatar} alt="Me" className="w-10 h-10 rounded-full shrink-0 border border-slate-700" />
          <div className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl shadow-inner focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all overflow-hidden">
            <textarea 
              className="w-full p-4 bg-transparent resize-none focus:outline-none text-sm min-h-[100px] text-slate-200 placeholder-slate-500"
              placeholder={`Reply to ${email.sender.name}...`}
            />
            <div className="bg-black/30 px-3 py-2 border-t border-white/5 flex items-center justify-between">
              <div className="flex space-x-2">
                 <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
                 <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
              </div>
              <button className="flex items-center px-5 py-2 bg-indigo-600/80 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
