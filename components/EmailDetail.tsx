import React, { useState, useEffect } from 'react';
import { Email, EmailStatus } from '../types';
import { MoreVertical, Mail, Trash2, Tag, Paperclip, Send, FileText, Download, LinkIcon, MessageSquareWarning } from './Icons';

interface EmailDetailProps {
  email: Email | null;
  onUpdateEmail: (updatedEmail: Email) => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onUpdateEmail }) => {
  const [localResponse, setLocalResponse] = useState('');
  const [localNotes, setLocalNotes] = useState('');

  useEffect(() => {
    if (email) {
      setLocalResponse(email.response || '');
      setLocalNotes(email.notes || '');
    }
  }, [email]);

  const handleResponseBlur = () => {
    if (email && localResponse !== (email.response || '')) {
      onUpdateEmail({ ...email, response: localResponse });
    }
  };

  const handleNotesBlur = () => {
    if (email && localNotes !== (email.notes || '')) {
      onUpdateEmail({ ...email, notes: localNotes });
    }
  };

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

  const senderAvatar = typeof email.sender === 'string' ? `https://ui-avatars.com/api/?name=${encodeURIComponent(email.sender)}&background=random&color=fff` : email.sender.avatar;
  const senderName = typeof email.sender === 'string' ? email.sender : email.sender.name;
  const senderEmail = typeof email.sender === 'string' ? email.sender : email.sender.email;

  const recipientAvatar = typeof email.recipient === 'string' ? `https://ui-avatars.com/api/?name=${encodeURIComponent(email.recipient)}&background=random&color=fff` : email.recipient.avatar;
  const recipientName = typeof email.recipient === 'string' ? email.recipient : email.recipient.name;

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
          {email.status === EmailStatus.UNANSWERED && (
             <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-300">
               <MessageSquareWarning className="w-3 h-3 mr-1.5 opacity-70" />
               Unanswered
             </span>
          )}
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
          <h1 className="text-2xl font-bold text-white mb-4 leading-tight">{email.subject}</h1>
          
          {email.threadLink && (
            <div className="mb-6 text-sm text-slate-400 flex items-center">
              <LinkIcon className="w-4 h-4 mr-2" />
              <a href={email.threadLink} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 truncate">
                View Thread in Gmail
              </a>
            </div>
          )}

          {/* Sender Info */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center">
              <img src={senderAvatar} alt={senderName} className="w-12 h-12 rounded-full mr-4 border border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
              <div>
                <div className="flex items-baseline">
                  <h3 className="text-base font-bold text-slate-200 mr-2">{senderName}</h3>
                  <span className="text-sm text-slate-500">&lt;{senderEmail}&gt;</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">to {recipientName}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-500 whitespace-nowrap bg-black/30 px-3 py-1 rounded-lg">
              {formattedDate}
            </div>
          </div>

          {/* Last Reply Snippet */}
          {email.lastReply && (
            <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm italic relative">
              <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2">Last Interaction Snippet:</p>
              <p>{email.lastReply}</p>
              <MessageSquareWarning className="absolute right-4 top-4 w-6 h-6 text-red-500/30" />
            </div>
          )}

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

      {/* Reply Box and Notes/Response (Sticky at bottom) */}
      <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto flex flex-col space-y-4">
          {/* Notes */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl shadow-inner focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all overflow-hidden">
            <textarea 
              className="w-full p-4 bg-transparent resize-none focus:outline-none text-sm min-h-[80px] text-slate-200 placeholder-slate-500"
              placeholder="Add internal notes..."
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              onBlur={handleNotesBlur}
            />
          </div>

          {/* Response Draft */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl shadow-inner focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all overflow-hidden">
            <textarea 
              className="w-full p-4 bg-transparent resize-none focus:outline-none text-sm min-h-[100px] text-slate-200 placeholder-slate-500"
              placeholder="Draft your response here..."
              value={localResponse}
              onChange={(e) => setLocalResponse(e.target.value)}
              onBlur={handleResponseBlur}
            />
            <div className="bg-black/30 px-3 py-2 border-t border-white/5 flex items-center justify-between">
              <div className="flex space-x-2">
                 <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
                 <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
              </div>
              <button className="flex items-center px-5 py-2 bg-indigo-600/80 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                <Send className="w-4 h-4 mr-2" />
                Send Response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
