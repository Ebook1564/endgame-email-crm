import React from 'react';
import { 
  Inbox, Send, File, Trash2, PieChart, CheckSquare, Briefcase, LayoutDashboard, ChevronLeft, ChevronRight, Activity, PenSquare, MessageSquareWarning
} from './Icons';
import { EmailStatus } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onOpenCompose: () => void;
  inboxCount: number;
  unansweredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, onOpenCompose, inboxCount, unansweredCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { divider: true, id: 'd0' },
    { id: EmailStatus.INBOX, label: 'Inbox', icon: Inbox, count: inboxCount },
    { id: EmailStatus.UNANSWERED, label: 'Unanswered', icon: MessageSquareWarning, count: unansweredCount }, // New item for unanswered emails
    { id: EmailStatus.SENT, label: 'Sent', icon: Send },
    { id: EmailStatus.DRAFT, label: 'Drafts', icon: File },
    { id: EmailStatus.TRASH, label: 'Trash', icon: Trash2 },
    { divider: true, id: 'd1' },
    { id: 'deals', label: 'Pipeline', icon: Briefcase },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <aside className={`relative flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out border-r border-white/10 glass-strong z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && <span className="ml-3 text-xl font-black text-white tracking-tight truncate whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">MailDash</span>}
      </div>

      <div className="p-4 shrink-0">
        <button 
          onClick={onOpenCompose}
          className={`flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] ${isCollapsed ? 'p-3' : 'py-3 px-4'}`}
          title="Compose Email"
        >
          <PenSquare className="w-5 h-5" />
          {!isCollapsed && <span className="ml-2 tracking-wide">Compose</span>}
        </button>
      </div>

      <div className="px-3 pb-4 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            if (item.divider) {
              return <div key={item.id} className="h-px bg-white/5 my-4 mx-2" />;
            }
            const Icon = item.icon as React.ElementType;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></div>}
                
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-300'}`} />
                
                {!isCollapsed && (
                  <span className="flex-1 text-left ml-3 text-sm font-semibold whitespace-nowrap tracking-wide">{item.label}</span>
                )}
                
                {!isCollapsed && item.count && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-white/10 text-slate-300'
                  }`}>
                    {item.count}
                  </span>
                )}
                
                {isCollapsed && item.count && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-black/20">
        <div className="flex items-center overflow-hidden">
          <img 
            src="https://picsum.photos/100/100?random=1" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)] shrink-0"
          />
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-bold text-white truncate">Alex Mercer</p>
              <p className="text-xs text-indigo-300 truncate font-medium">alex@maildash.io</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-20 bg-slate-900 border border-white/10 rounded-full p-1.5 text-slate-400 hover:text-white hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

    </aside>
  );
};
