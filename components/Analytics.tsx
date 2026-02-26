import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell, 
  Legend
} from 'recharts';
import { TrendingUp, Users, Mail, Clock } from './Icons';

// Mock data for charts
const volumeData = [
  { name: 'Mon', in: 45, out: 24 },
  { name: 'Tue', in: 52, out: 30 },
  { name: 'Wed', in: 38, out: 45 },
  { name: 'Thu', in: 65, out: 50 },
  { name: 'Fri', in: 48, out: 35 },
  { name: 'Sat', in: 12, out: 5 },
  { name: 'Sun', in: 8, out: 2 },
];

const funnelData = [
  { name: 'Leads', value: 400, color: '#60a5fa' },
  { name: 'Qualified', value: 300, color: '#818cf8' },
  { name: 'Negotiation', value: 150, color: '#a78bfa' },
  { name: 'Closed Won', value: 80, color: '#34d399' },
];

const SLAData = [
  { name: '< 1h', value: 45 },
  { name: '1-4h', value: 30 },
  { name: '4-24h', value: 15 },
  { name: '> 24h', value: 10 },
];

const dealValueData = [
  { name: 'Leads', value: 125000, fill: '#60a5fa' },
  { name: 'Negotiation', value: 85000, fill: '#fbbf24' },
  { name: 'Closed Won', value: 245000, fill: '#34d399' },
  { name: 'Closed Lost', value: 45000, fill: '#f87171' },
];

const taskStatusData = [
  { name: 'Completed', value: 142, color: '#34d399' },
  { name: 'Pending', value: 45, color: '#fbbf24' },
  { name: 'Overdue', value: 12, color: '#f87171' },
];

const COLORS_SLA = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

export const AnalyticsDashboard: React.FC = () => {
  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <div className="h-full w-full overflow-y-auto p-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Overview</h1>
            <p className="text-slate-400 mt-2">Deep dive into communication metrics and team performance.</p>
          </div>
          <div className="flex space-x-2">
             <select className="bg-black/30 border border-white/10 rounded-xl text-sm font-semibold px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
               <option>This Quarter</option>
             </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Emails', value: '1,248', trend: '+12%', up: true, icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/20' },
            { label: 'Avg Response Time', value: '2.4h', trend: '-15%', up: true, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
            { label: 'Active Deals', value: '34', trend: '+4', up: true, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
            { label: 'Win Rate', value: '28.5%', trend: '-2.1%', up: false, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/20' },
          ].map((kpi, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <span className={`text-sm font-bold flex items-center ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.trend} {kpi.up ? '↗' : '↘'}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">{kpi.value}</p>
                <p className="text-sm font-medium text-slate-400 mt-1">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Area Chart & SLA Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 shrink-0">Email Volume (In vs Out)</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="in" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" name="Inbound" />
                  <Area type="monotone" dataKey="out" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" name="Outbound" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLA Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col">
             <h3 className="text-lg font-bold text-white mb-6 shrink-0">Response Time SLA</h3>
             <div className="flex-1 min-h-[250px] flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <RePieChart>
                   <Pie
                     data={SLAData}
                     cx="50%"
                     cy="50%"
                     innerRadius={70}
                     outerRadius={90}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {SLAData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS_SLA[index % COLORS_SLA.length]} />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                     itemStyle={{ color: '#f8fafc' }}
                   />
                 </RePieChart>
               </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">
                {SLAData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center text-sm font-bold text-slate-300">
                    <div className="w-3 h-3 rounded-full mr-2 shadow-md" style={{ backgroundColor: COLORS_SLA[idx] }}></div>
                    {entry.name} <span className="text-slate-500 ml-1.5 text-xs">({entry.value}%)</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Row 2: Pipeline Value & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deal Value Bar Chart */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 shrink-0">Pipeline Expected Value</h3>
            <div className="flex-1 min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dealValueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} dy={10} />
                   <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                   <RechartsTooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                      cursor={{fill: '#1e293b', opacity: 0.4}} 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                   <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {dealValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Task Status Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col">
             <h3 className="text-lg font-bold text-white mb-6 shrink-0">Task Completion</h3>
             <div className="flex-1 min-h-[250px] flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <RePieChart>
                   <Pie
                     data={taskStatusData}
                     cx="50%"
                     cy="50%"
                     innerRadius={0}
                     outerRadius={90}
                     dataKey="value"
                     stroke="#0f172a"
                     strokeWidth={3}
                   >
                     {taskStatusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                     itemStyle={{ color: '#f8fafc' }}
                   />
                 </RePieChart>
               </ResponsiveContainer>
             </div>
             <div className="flex flex-col space-y-3 mt-4 shrink-0 bg-black/20 p-4 rounded-xl">
                {taskStatusData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center font-bold text-slate-300">
                      <div className="w-3 h-3 rounded-full mr-3 shadow-md" style={{ backgroundColor: entry.color }}></div>
                      {entry.name}
                    </div>
                    <span className="font-bold text-white text-base">{entry.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Row 3: Deal Funnel */}
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-lg font-bold text-white mb-8 shrink-0">Conversion Funnel</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 600 }} />
                 <RechartsTooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                    itemStyle={{ color: '#f8fafc' }}
                 />
                 <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={36}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};
