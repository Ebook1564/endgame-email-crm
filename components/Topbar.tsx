import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download, Filter } from './Icons';

interface TopbarProps {
  onSearch: (query: string) => void;
  onOpenExport: () => void;
  onOpenFilter: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onSearch, onOpenExport, onOpenFilter }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10 relative bg-black/20">
      <div className="flex-1 max-w-2xl flex items-center">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-12 py-2.5 bg-black/40 border border-white/10 rounded-xl leading-5 text-slate-200 placeholder-slate-500 font-medium focus:outline-none focus:bg-black/60 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 sm:text-sm transition-all shadow-inner"
            placeholder="Search emails, deals, or contacts..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
             <button 
                onClick={onOpenFilter}
                className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-white/10 rounded-lg transition-colors"
                title="Advanced Search Options"
             >
                <SlidersHorizontal className="h-4 w-4" />
             </button>
          </div>
        </div>
      </div>

      <div className="ml-6 flex items-center space-x-4">
        <button 
          onClick={onOpenFilter}
          className="flex items-center px-4 py-2 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all shadow-sm backdrop-blur-md hover:border-white/20"
        >
          <Filter className="w-4 h-4 mr-2 text-indigo-400" />
          Filter
        </button>
        <button 
          onClick={onOpenExport}
          className="flex items-center px-4 py-2 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all shadow-sm backdrop-blur-md hover:border-white/20"
        >
          <Download className="w-4 h-4 mr-2 text-indigo-400" />
          Export
        </button>
      </div>
    </header>
  );
};
