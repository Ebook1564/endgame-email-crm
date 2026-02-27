import React, { useState, useEffect } from 'react';
import { Deal, Task, Email, DealStage, TaskStatus } from '../types';
import { Briefcase, Calendar, CheckSquare, Plus, Clock, FileText } from './Icons';

interface CrmSidebarProps {
  email: Email | null;
  deals: Deal[];
  tasks: Task[];
  onUpdateDeal: (deal: Deal) => void;
  onUpdateTask: (task: Task) => void;
  onFetchUnanswered: () => void;
}

export const CrmSidebar: React.FC<CrmSidebarProps> = ({ email, deals, tasks, onUpdateDeal, onUpdateTask, onFetchUnanswered }) => {
  const [localNotes, setLocalNotes] = useState('');

  const linkedDeal = email?.dealId ? deals.find(d => d.id === email.dealId) : null;
  const linkedTasks = email ? tasks.filter(t => t.relatedEmailId === email.id || (linkedDeal && t.relatedDealId === linkedDeal.id)) : [];

  useEffect(() => {
    if (linkedDeal) setLocalNotes(linkedDeal.notes);
    else setLocalNotes('');
  }, [linkedDeal?.id]);

  const handleNotesBlur = () => {
    if (linkedDeal && localNotes !== linkedDeal.notes) {
      onUpdateDeal({ ...linkedDeal, notes: localNotes });
    }
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (linkedDeal) {
      onUpdateDeal({ ...linkedDeal, stage: e.target.value as DealStage });
    }
  };

  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    onUpdateTask({ ...task, status: newStatus });
  };

  if (!email) {
    return (
      <div className="w-80 glass border-l border-white/10 hidden xl:flex flex-col shrink-0 items-center justify-center text-slate-500 p-8 text-center bg-black/20">
        <Briefcase className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select an email to view CRM context</p>
        <button
          onClick={onFetchUnanswered}
          className="mt-4 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 px-4 py-2 bg-indigo-500/10 rounded-lg transition-colors border border-indigo-500/20"
        >
          Get Unanswered Emails
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getStageColor = (stage: DealStage) => {
    switch(stage) {
      case DealStage.LEAD: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case DealStage.NEGOTIATION: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case DealStage.CLOSED_WON: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case DealStage.CLOSED_LOST: return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-80 glass border-l border-white/10 hidden xl:flex flex-col shrink-0 overflow-y-auto bg-black/20 no-scrollbar">
      {/* Contact Profile Header */}
      <div className="p-6 border-b border-white/5 bg-white/5">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Contact Info</h2>
        <div className="flex items-center mb-5">
          <img src={email.sender.avatar} alt="" className="w-12 h-12 rounded-full mr-4 border border-slate-700 shadow-lg" />
          <div className="min-w-0">
            <h3 className="font-bold text-white truncate">{email.sender.name}</h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{email.sender.email}</p>
          </div>
        </div>
        <div className="flex items-center">
           <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
             email.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
             email.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
             'bg-slate-800/50 text-slate-300 border-slate-700'
           }`}>
             Sentiment: {email.sentiment}
           </span>
        </div>
      </div>

      {/* Linked Deal Section */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Deal</h2>
          {!linkedDeal && (
            <button className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 p-1.5 rounded-lg transition-colors" title="Create Deal">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {linkedDeal ? (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl shadow-inner p-5 backdrop-blur-sm">
            <h3 className="font-bold text-white mb-2 leading-tight">{linkedDeal.title}</h3>
            <p className="text-2xl font-bold text-emerald-400 mb-5">{formatCurrency(linkedDeal.value)}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Stage</label>
                <select 
                  className={`w-full text-sm rounded-lg border py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors appearance-none font-medium shadow-sm cursor-pointer ${getStageColor(linkedDeal.stage)}`}
                  value={linkedDeal.stage}
                  onChange={handleStageChange}
                >
                  {Object.values(DealStage).map(stage => (
                    <option key={stage} value={stage} className="bg-slate-900 text-slate-200">{stage}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center text-xs text-slate-400 bg-black/20 p-2.5 rounded-lg border border-white/5">
                <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                Close Date: <span className="font-bold text-slate-200 ml-auto">{new Date(linkedDeal.closeDate).toLocaleDateString()}</span>
              </div>
              
              <div className="pt-3 border-t border-white/5">
                <label className="flex items-center text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
                  <FileText className="w-3 h-3 mr-1.5" /> Notes
                </label>
                <textarea 
                  className="w-full text-sm text-slate-300 bg-black/30 border border-white/5 rounded-xl p-3 focus:bg-black/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all placeholder-slate-600"
                  rows={3}
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  placeholder="Add deal notes..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 text-center">
            <Briefcase className="w-8 h-8 mx-auto text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">No active deal linked.</p>
            <button className="mt-4 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 px-4 py-2 bg-indigo-500/10 rounded-lg transition-colors border border-indigo-500/20">
              Create Deal
            </button>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="p-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Related Tasks</h2>
          <button className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 p-1.5 rounded-lg transition-colors" title="Add Task">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {linkedTasks.length > 0 ? (
          <div className="space-y-3">
            {linkedTasks.map(task => (
              <div key={task.id} className={`flex items-start p-3.5 bg-slate-900/50 border rounded-xl shadow-sm transition-all ${
                task.status === TaskStatus.COMPLETED ? 'opacity-50 border-white/5 grayscale' : 
                task.status === TaskStatus.OVERDUE ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 hover:border-indigo-500/30'
              }`}>
                <button 
                  onClick={() => toggleTaskStatus(task)}
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors shadow-sm ${
                    task.status === TaskStatus.COMPLETED ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 hover:border-indigo-400 bg-black/40'
                  }`}
                >
                  {task.status === TaskStatus.COMPLETED && <CheckSquare className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate font-medium ${task.status === TaskStatus.COMPLETED ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <p className={`text-[11px] mt-1.5 flex items-center font-semibold uppercase tracking-wider ${
                    task.status === TaskStatus.OVERDUE ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic px-2">No tasks pending.</p>
        )}
      </div>
    </div>
  );
};
