import React from 'react';
import { Deal, DealStage } from '../types';
import { Briefcase, MoreHorizontal, Calendar, Plus } from './Icons';

interface DealsDashboardProps {
  deals: Deal[];
}

export const DealsDashboard: React.FC<DealsDashboardProps> = ({ deals }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const stages = [
    { id: DealStage.LEAD, title: 'Leads', color: 'bg-blue-400', shadow: 'shadow-[0_0_15px_rgba(96,165,250,0.5)]', border: 'border-blue-500/20' },
    { id: DealStage.NEGOTIATION, title: 'Negotiation', color: 'bg-amber-400', shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]', border: 'border-amber-500/20' },
    { id: DealStage.CLOSED_WON, title: 'Closed Won', color: 'bg-emerald-400', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]', border: 'border-emerald-500/30' },
    { id: DealStage.CLOSED_LOST, title: 'Closed Lost', color: 'bg-red-400', shadow: 'shadow-[0_0_15px_rgba(248,113,113,0.5)]', border: 'border-red-500/20' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10">
      <div className="px-8 py-6 border-b border-white/5 glass flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Briefcase className="w-6 h-6 mr-3 text-indigo-400" />
            Deal Pipeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage active deals and track revenue across stages.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-indigo-600/80 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/50">
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-8 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const totalValue = stageDeals.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div key={stage.id} className={`flex flex-col w-80 rounded-3xl glass-strong border ${stage.border} shrink-0 max-h-full overflow-hidden`}>
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${stage.color} mr-3 ${stage.shadow}`} />
                    <h3 className="font-bold text-white tracking-wide">{stage.title}</h3>
                    <span className="ml-3 bg-white/10 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-white/5">
                      {stageDeals.length}
                    </span>
                  </div>
                  <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                
                <div className="px-5 py-3 bg-black/40 border-b border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total: <span className="text-slate-200">{formatCurrency(totalValue)}</span></p>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">
                  {stageDeals.map(deal => (
                    <div key={deal.id} className="bg-slate-900/60 p-5 rounded-2xl shadow-lg border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-slate-200 leading-tight group-hover:text-indigo-300 transition-colors">{deal.title}</h4>
                      </div>
                      <p className="text-xl font-bold text-emerald-400 mb-4">{formatCurrency(deal.value)}</p>
                      
                      {deal.notes && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 bg-black/30 p-2.5 rounded-lg border border-white/5 italic">
                          "{deal.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                          {new Date(deal.closeDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <img src={`https://picsum.photos/100/100?random=${deal.id}`} alt="Owner" className="w-7 h-7 rounded-full border border-slate-700 shadow-sm" title="Owner" />
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="h-28 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 text-sm font-medium">
                      Drop deals here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
