import React from 'react';
import { Deal, Task, Email, Activity, DealStage, TaskStatus } from '../types';
import { Activity as ActivityIcon, Mail, Briefcase, CheckSquare, Zap, Clock, TrendingUp } from './Icons';

interface OverviewProps {
  deals: Deal[];
  emails: Email[];
  tasks: Task[];
  activities: Activity[];
}

export const OverviewDashboard: React.FC<OverviewProps> = ({ deals, emails, tasks, activities }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const totalValue = deals.reduce((acc, curr) => acc + curr.value, 0);
  const wonValue = deals.filter(d => d.stage === DealStage.CLOSED_WON).reduce((acc, curr) => acc + curr.value, 0);
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const unreadEmails = emails.filter(e => !e.isRead).length;

  const getRelativeTime = (dateString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000); // mins
    if (diff < 60) return `${diff}m ago`;
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />;
      case 'deal': return <Briefcase className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />;
      default: return <Zap className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]" />;
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 relative z-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center tracking-tight glow-text">
              <Zap className="w-8 h-8 mr-3 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              Command Center
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Your real-time operations overview.</p>
          </div>
          <div className="flex items-center space-x-3 bg-indigo-500/10 border border-indigo-500/30 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-md">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
             <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live Sync Active</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all group border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl group-hover:scale-110 transition-transform shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
                <Mail className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unread</span>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">{unreadEmails}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-400" /> +3 this hour</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all group border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                <Briefcase className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline</span>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">{formatCurrency(totalValue)}</h3>
            <div className="w-full bg-black/40 rounded-full h-2 mt-4 overflow-hidden border border-white/5">
               <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] relative" style={{width: `${(wonValue/totalValue)*100}%`}}>
                 <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
               </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all group border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl group-hover:scale-110 transition-transform shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]">
                <CheckSquare className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tasks</span>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">{pendingTasks}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2"><span className="text-red-400">2 Overdue</span></p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all group flex flex-col justify-center items-center text-center border border-white/5">
             <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 mb-3 shadow-[0_0_25px_rgba(139,92,246,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 blur-md opacity-50 rounded-full"></div>
                <div className="relative w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-2xl font-black text-white">
                  68<span className="text-sm text-indigo-300">%</span>
                </div>
             </div>
             <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Win Rate</p>
          </div>
        </div>

        {/* Main Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Deals (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center glow-text">
              <TrendingUp className="w-5 h-5 mr-3 text-indigo-400" />
              Active Opportunities
            </h2>
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-black/40 border-b border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <div className="col-span-5">Deal Name</div>
                 <div className="col-span-3">Stage</div>
                 <div className="col-span-4 text-right">Value</div>
              </div>
              <div className="divide-y divide-white/5 bg-black/20">
                 {deals.slice(0, 5).map(deal => (
                   <div key={deal.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="col-span-5 flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{deal.title}</span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center mt-1.5 uppercase tracking-wider">
                          <Clock className="w-3 h-3 mr-1 text-indigo-500" /> Close: {new Date(deal.closeDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="col-span-3">
                         <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 bg-black/40 text-slate-300 shadow-inner">
                           {deal.stage}
                         </span>
                      </div>
                      <div className="col-span-4 text-right font-black text-emerald-400 text-lg drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">
                         {formatCurrency(deal.value)}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Activity Feed (Right Col) */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center glow-text">
                <ActivityIcon className="w-5 h-5 mr-3 text-indigo-400" />
                Live Feed
              </h2>
            </div>
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative bg-black/20">
               {/* Glowing Vertical Line */}
               <div className="absolute top-10 bottom-10 left-[42px] w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500/50 to-transparent shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
               
               <div className="space-y-7 relative">
                 {activities.map((act, i) => (
                   <div key={act.id} className="flex relative group">
                      <div className="flex-shrink-0 mr-5 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-indigo-400 transition-all group-hover:scale-110">
                           {act.user ? <img src={act.user.avatar} className="w-full h-full object-cover" alt="" /> : getActivityIcon(act.type)}
                        </div>
                        {i === 0 && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-slate-900 animate-ping"></div>}
                        {i === 0 && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(99,102,241,1)]"></div>}
                      </div>
                      <div className="pt-1">
                         <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors leading-snug">
                           {act.description}
                         </p>
                         <div className="flex items-center mt-2 space-x-2">
                           {getActivityIcon(act.type)}
                           <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{getRelativeTime(act.timestamp)}</span>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
               
               <button className="w-full mt-8 py-3 bg-black/40 border border-white/10 rounded-xl text-xs font-bold text-indigo-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors hover:border-indigo-500/50">
                 View All Activity
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
