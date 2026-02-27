import React from 'react';
import { Email, Deal, SortState, EmailStatus } from '../types';
import { Paperclip, Star, ArrowUpRight, ArrowDownRight, ChevronDown, Inbox, Briefcase, MessageSquareWarning } from './Icons';

interface EmailListProps {
  emails: Email[];
  deals?: Deal[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  sortState: SortState;
  onSort: (field: keyof Email | 'dealValue') => void;
}

export const EmailList: React.FC<EmailListProps> = ({ 
  emails,
  deals = [],
  selectedEmailId, 
  onSelectEmail,
  sortState,
  onSort
}) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const renderSortIcon = (field: string) => {
    if (sortState.field !== field) return <ChevronDown className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortState.direction === 'asc' 
      ? <ArrowUpRight className="w-3 h-3 ml-1 text-indigo-400" />
      : <ArrowDownRight className="w-3 h-3 ml-1 text-indigo-400" />;
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full glass border-r border-white/10 w-full lg:w-[450px] xl:w-[500px] shrink-0">
      {/* List Header with Sorting */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/20 text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
        <button className="flex items-center group hover:text-white transition-colors" onClick={() => onSort('sender')}>
          Sender {renderSortIcon('sender')}
        </button>
        <button className="flex items-center group hover:text-white transition-colors" onClick={() => onSort('date')}>
          Date {renderSortIcon('date')}
        </button>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <Inbox className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">No emails found matching your criteria.</p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = email.id === selectedEmailId;
            const linkedDeal = email.dealId ? deals.find(d => d.id === email.dealId) : null;

            const senderName = typeof email.sender === 'string' ? email.sender : email.sender.name;
            const senderAvatar = typeof email.sender === 'string' ? `https://ui-avatars.com/api/?name=${encodeURIComponent(email.sender)}&background=random&color=fff` : email.sender.avatar;

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className={`group flex flex-col p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                  isSelected ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500 pl-3 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' : 'border-l-4 border-l-transparent bg-transparent'
                } ${!email.isRead ? 'bg-white/5' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <div className="relative shrink-0">
                      <img src={senderAvatar} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
                      {!email.isRead && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                      )}
                    </div>
                    <span className={`text-sm truncate ${!email.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                      {senderName}
                    </span>
                  </div>
                  <span className={`text-xs shrink-0 ml-2 ${!email.isRead ? 'font-bold text-indigo-400' : 'text-slate-500'}`}>
                    {getRelativeTime(email.date)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <h4 className={`text-sm truncate pr-2 ${!email.isRead ? 'font-bold text-white' : 'font-medium text-slate-400'}`}>
                    {email.subject}
                  </h4>
                  {email.hasAttachment && <Paperclip className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                </div>

                <p className="text-xs text-slate-500 truncate mt-1">
                  {email.snippet}
                </p>

                {/* Tags / Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {linkedDeal && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {formatCurrency(linkedDeal.value)}
                    </span>
                  )}
                  {email.labels.map(label => (
                    <span key={label} className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10">
                      {label}
                    </span>
                  ))}
                  {email.status === EmailStatus.UNANSWERED && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-300 shadow-sm">
                      <MessageSquareWarning className="w-3 h-3 mr-1" />
                      Unanswered
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
