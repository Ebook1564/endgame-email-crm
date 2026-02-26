import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { EmailList } from './components/EmailList';
import { EmailDetail } from './components/EmailDetail';
import { CrmSidebar } from './components/CrmSidebar';
import { AnalyticsDashboard } from './components/Analytics';
import { DealsDashboard } from './components/DealsDashboard';
import { TasksDashboard } from './components/TasksDashboard';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ExportModal, FilterModal } from './components/Modals';
import { ComposeEmail } from './components/ComposeEmail';
import { initialEmails, initialDeals, initialTasks, initialActivities } from './mockData';
import { Email, Deal, Task, Activity, FilterState, SortState, EmailStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(initialEmails[0].id);
  
  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search & Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    stage: 'All',
    dateRange: 'All',
    hasAttachment: 'All',
    sentiment: 'All'
  });

  const [sortState, setSortState] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  // Handlers for CRM updates
  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleSort = (field: keyof Email | 'dealValue') => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Filter and Sort Logic
  const filteredAndSortedEmails = useMemo(() => {
    let result = emails;

    // Base Status Filter (from sidebar)
    if (Object.values(EmailStatus).includes(activeTab as EmailStatus)) {
      result = result.filter(e => e.status === activeTab);
    }

    // Advanced Filters
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => 
        e.subject.toLowerCase().includes(q) || 
        e.sender.name.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q)
      );
    }
    
    if (filters.hasAttachment !== 'All') {
      result = result.filter(e => e.hasAttachment === filters.hasAttachment);
    }

    if (filters.sentiment !== 'All') {
      result = result.filter(e => e.sentiment === filters.sentiment);
    }

    if (filters.stage !== 'All') {
      result = result.filter(e => {
        const linkedDeal = deals.find(d => d.id === e.dealId);
        return linkedDeal && linkedDeal.stage === filters.stage;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = a[sortState.field as keyof Email];
      let valB: any = b[sortState.field as keyof Email];

      // Custom sorts
      if (sortState.field === 'sender') {
        valA = a.sender.name;
        valB = b.sender.name;
      } else if (sortState.field === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [emails, activeTab, filters, sortState, deals]);

  const selectedEmail = useMemo(() => {
    return emails.find(e => e.id === selectedEmailId) || null;
  }, [selectedEmailId, emails]);

  // Main Content Renderer based on active tab
  const renderContent = () => {
    if (activeTab === 'dashboard') return <OverviewDashboard deals={deals} emails={emails} tasks={tasks} activities={activities} />;
    if (activeTab === 'analytics') return <AnalyticsDashboard />;
    if (activeTab === 'deals') return <DealsDashboard deals={deals} />;
    if (activeTab === 'tasks') return <TasksDashboard tasks={tasks} onUpdateTask={handleUpdateTask} />;

    // Default: Email Inbox/Sent/Draft View
    return (
      <div className="flex flex-1 h-full overflow-hidden">
        <EmailList 
          emails={filteredAndSortedEmails} 
          deals={deals}
          selectedEmailId={selectedEmailId}
          onSelectEmail={setSelectedEmailId}
          sortState={sortState}
          onSort={handleSort}
        />
        <EmailDetail email={selectedEmail} />
        <CrmSidebar 
          email={selectedEmail} 
          deals={deals} 
          tasks={tasks}
          onUpdateDeal={handleUpdateDeal}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    );
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        onSearch={(q) => setFilters(prev => ({...prev, search: q}))}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenCompose={() => setIsComposeOpen(true)}
      >
        {renderContent()}
      </Layout>

      <ComposeEmail isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
      
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentFilters={filters}
        onApply={(f) => setFilters({...filters, ...f, search: filters.search})} // keep search distinct from modal
      />
    </>
  );
}
