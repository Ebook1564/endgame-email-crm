import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  onSearch: (query: string) => void;
  onOpenExport: () => void;
  onOpenFilter: () => void;
  onOpenCompose: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onSearch,
  onOpenExport,
  onOpenFilter,
  onOpenCompose
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden tech-bg text-slate-100 font-sans z-0 relative">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenCompose={onOpenCompose}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative z-10 bg-black/10">
        <Topbar 
          onSearch={onSearch} 
          onOpenExport={onOpenExport}
          onOpenFilter={onOpenFilter}
        />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
      
    </div>
  );
};
