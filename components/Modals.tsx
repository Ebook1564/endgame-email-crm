import React, { useState } from 'react';
import { X, Download, Filter, Save, ListFilter, Calendar, Tag, Plus, GripVertical, Trash2 } from './Icons';
import { FilterState, DealStage } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('CSV');
  const [includeFilters, setIncludeFilters] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Download className="w-5 h-5 mr-3 text-indigo-400" />
            Export Data
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Format</label>
            <div className="grid grid-cols-2 gap-3">
              {['CSV', 'XLSX (Excel)', 'PDF', 'JSON'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all shadow-sm ${
                    format === f 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'bg-black/20 border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-white/5">
             <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={includeFilters}
                onChange={(e) => setIncludeFilters(e.target.checked)}
                className="w-5 h-5 text-indigo-500 border-white/20 rounded bg-black/40 focus:ring-indigo-500/50 focus:ring-offset-slate-900"
              />
              <span className="ml-3 text-sm text-slate-200 font-medium group-hover:text-white transition-colors">Apply current filters to export</span>
            </label>
            <p className="mt-2 text-xs text-slate-500 ml-8">Only exports the items currently visible in your list.</p>
          </div>
        </div>

        <div className="px-6 py-5 bg-black/40 border-t border-white/10 flex justify-end space-x-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600/80 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download {format}
          </button>
        </div>
      </div>
    </div>
  );
};

interface FilterModalProps extends ModalProps {
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, currentFilters, onApply }) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('advanced');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center space-x-5">
            <h2 className="text-xl font-bold text-white flex items-center">
              <ListFilter className="w-6 h-6 mr-3 text-indigo-400" />
              Advanced Filters
            </h2>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button 
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'basic' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic
              </button>
              <button 
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'advanced' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('advanced')}
              >
                Builder
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 bg-black/20 no-scrollbar">
          {activeTab === 'basic' ? (
             <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deal Stage</label>
                  <select 
                    className="w-full text-sm rounded-xl border-white/10 border p-3 bg-black/40 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500/50"
                    value={filters.stage}
                    onChange={(e) => setFilters({...filters, stage: e.target.value as DealStage | 'All'})}
                  >
                    <option value="All">Any Stage</option>
                    {Object.values(DealStage).map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date Range</label>
                  <select 
                    className="w-full text-sm rounded-xl border-white/10 border p-3 bg-black/40 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500/50"
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
                  >
                    <option value="All">All Time</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sentiment</label>
                  <select 
                    className="w-full text-sm rounded-xl border-white/10 border p-3 bg-black/40 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500/50"
                    value={filters.sentiment}
                    onChange={(e) => setFilters({...filters, sentiment: e.target.value as any})}
                  >
                    <option value="All">Any Sentiment</option>
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Has Attachments</label>
                   <div className="flex items-center space-x-5 bg-black/40 p-3 rounded-xl border border-white/10">
                     {['All', true, false].map((val) => (
                       <label key={String(val)} className="flex items-center cursor-pointer group">
                         <input 
                            type="radio" 
                            name="attachment"
                            className="text-indigo-500 bg-black/40 border-white/20 focus:ring-indigo-500/50 focus:ring-offset-slate-900 w-4 h-4"
                            checked={filters.hasAttachment === val}
                            onChange={() => setFilters({...filters, hasAttachment: val as any})}
                          />
                         <span className="ml-2 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                           {val === 'All' ? 'Any' : val ? 'Yes' : 'No'}
                         </span>
                       </label>
                     ))}
                   </div>
                </div>
             </div>
          ) : (
             // Mockup of Advanced Builder UI
             <div className="space-y-6">
               <div className="flex items-center justify-between mb-2">
                 <p className="text-sm text-slate-400">Create complex logic with AND / OR conditions.</p>
                 <button className="text-indigo-400 text-sm font-bold uppercase tracking-wider hover:text-indigo-300 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">Load Preset</button>
               </div>
               
               {/* Builder Rows Mock */}
               <div className="bg-black/30 border border-white/10 rounded-2xl shadow-inner p-2">
                 {/* Row 1 */}
                 <div className="flex items-center gap-3 p-3 border-b border-white/5 group bg-white/5 rounded-t-xl mb-1">
                    <GripVertical className="w-5 h-5 text-slate-600 cursor-grab hover:text-slate-400" />
                    <select className="text-sm border-white/10 rounded-lg bg-black/40 text-white p-2.5 focus:outline-none"><option>Deal Stage</option></select>
                    <select className="text-sm border-white/10 rounded-lg bg-black/40 text-white p-2.5 focus:outline-none"><option>is exactly</option></select>
                    <select className="text-sm border-white/10 rounded-lg bg-black/60 text-white p-2.5 flex-1 focus:outline-none"><option>Negotiation</option></select>
                    <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                 </div>
                 {/* Logical Operator */}
                 <div className="px-10 py-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                   <span className="bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">AND</span>
                 </div>
                 {/* Row 2 */}
                 <div className="flex items-center gap-3 p-3 border-b border-white/5 group bg-white/5 mb-1">
                    <GripVertical className="w-5 h-5 text-slate-600 cursor-grab hover:text-slate-400" />
                    <select className="text-sm border-white/10 rounded-lg bg-black/40 text-white p-2.5 focus:outline-none"><option>Email Sentiment</option></select>
                    <select className="text-sm border-white/10 rounded-lg bg-black/40 text-white p-2.5 focus:outline-none"><option>is</option></select>
                    <select className="text-sm border-white/10 rounded-lg bg-black/60 text-white p-2.5 flex-1 focus:outline-none"><option>Positive</option></select>
                    <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                 </div>
                 {/* Logical Operator */}
                 <div className="px-10 py-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center">
                   <span className="bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">OR</span>
                 </div>
                 {/* Row 3 */}
                 <div className="flex items-center gap-3 p-3 group bg-white/5 rounded-b-xl">
                    <GripVertical className="w-5 h-5 text-slate-600 cursor-grab hover:text-slate-400" />
                    <select className="text-sm border-white/10 rounded-lg bg-black/40 text-white p-2.5 focus:outline-none"><option>Labels</option></select>
                    <select className="text-sm border-white/10 rounded-lg bg-black/40 text-white p-2.5 focus:outline-none"><option>contains</option></select>
                    <input type="text" className="text-sm border-white/10 rounded-lg bg-black/60 text-white p-2.5 flex-1 focus:outline-none" value="Contract" readOnly />
                    <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                 </div>
               </div>
               
               <button className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-sm font-bold text-white rounded-xl transition-colors border border-white/10">
                 <Plus className="w-4 h-4 mr-2 text-indigo-400" /> Add Rule
               </button>

               <div className="mt-8 p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-start shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
                  <Filter className="w-6 h-6 text-indigo-400 mr-4 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-200">Preview Results</h4>
                    <p className="text-xs text-indigo-300/70 mt-1.5">This complex query will yield approximately <strong className="text-white bg-indigo-500/30 px-1.5 py-0.5 rounded mx-0.5">12</strong> results out of your total inbox.</p>
                  </div>
               </div>
             </div>
          )}
        </div>

        <div className="px-6 py-5 bg-black/40 border-t border-white/10 flex justify-between items-center shrink-0">
          <button className="flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save as Preset
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleApply} className="px-6 py-2.5 bg-indigo-600/80 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/50">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
