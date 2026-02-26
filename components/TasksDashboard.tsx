import React from 'react';
import { Task, TaskStatus } from '../types';
import { CheckSquare, Clock, AlertCircle, Circle, CheckCircle2, ListTodo, Plus } from './Icons';

interface TasksDashboardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export const TasksDashboard: React.FC<TasksDashboardProps> = ({ tasks, onUpdateTask }) => {
  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    onUpdateTask({ ...task, status: newStatus });
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const overdueTasks = sortedTasks.filter(t => t.status === TaskStatus.OVERDUE || (t.status === TaskStatus.PENDING && new Date(t.dueDate) < new Date()));
  const pendingTasks = sortedTasks.filter(t => t.status === TaskStatus.PENDING && new Date(t.dueDate) >= new Date());
  const completedTasks = sortedTasks.filter(t => t.status === TaskStatus.COMPLETED);

  const renderTaskRow = (task: Task) => (
    <div key={task.id} className={`flex items-center justify-between p-5 bg-slate-900/40 border border-white/10 rounded-2xl shadow-lg mb-4 transition-all hover:border-indigo-500/50 backdrop-blur-md ${task.status === TaskStatus.COMPLETED ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex items-center flex-1">
        <button 
          onClick={() => toggleTaskStatus(task)}
          className={`shrink-0 flex items-center justify-center transition-all mr-5 ${
            task.status === TaskStatus.COMPLETED ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-indigo-400 hover:scale-110'
          }`}
        >
          {task.status === TaskStatus.COMPLETED ? <CheckCircle2 className="w-7 h-7 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> : <Circle className="w-7 h-7" />}
        </button>
        <div>
          <h4 className={`text-base font-bold ${task.status === TaskStatus.COMPLETED ? 'text-slate-500 line-through' : 'text-white'}`}>
            {task.title}
          </h4>
          <div className="flex items-center mt-2 space-x-3">
             <span className={`flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
               task.status === TaskStatus.OVERDUE || new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED 
               ? 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.2)]' 
               : 'text-slate-400 bg-black/20 border-white/5'
             }`}>
               {task.status === TaskStatus.OVERDUE || new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED ? (
                 <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
               ) : (
                 <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
               )}
               {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
             </span>
             {task.relatedDealId && (
               <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">Linked to Deal</span>
             )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <img src={`https://picsum.photos/100/100?random=${task.assigneeId}`} alt="Assignee" className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-lg" title="Assigned to you" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10">
      <div className="px-8 py-6 border-b border-white/5 glass flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <ListTodo className="w-6 h-6 mr-3 text-indigo-400" />
            Task Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Keep track of your to-dos, follow-ups, and deal activities.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-indigo-600/80 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/50">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10 pb-12">
          
          {overdueTasks.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                Action Required ({overdueTasks.length})
              </h3>
              <div className="space-y-4">
                {overdueTasks.map(renderTaskRow)}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
              Pending ({pendingTasks.length})
            </h3>
            <div className="space-y-4">
              {pendingTasks.length > 0 ? pendingTasks.map(renderTaskRow) : (
                <div className="p-10 text-center text-slate-500 glass-strong rounded-3xl border border-dashed border-white/10">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-30 text-emerald-400" />
                  <p className="text-base font-medium">You're all caught up!</p>
                </div>
              )}
            </div>
          </section>

          {completedTasks.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-slate-600 mr-2"></span>
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-4">
                {completedTasks.map(renderTaskRow)}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};
