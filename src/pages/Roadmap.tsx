import { Search, ChevronDown, Plus, Filter, Calendar } from 'lucide-react';
import { useState } from 'react';

type RoadmapView = 'gantt' | 'milestone';

const backlogItems = [
  { title: 'Investor Data Room v2', priority: 'High', priorityColor: 'text-orange-400 bg-orange-400/10', effort: 'MEDIUM EFFORT' },
  { title: 'Self-Serve Onboarding', priority: 'Medium', priorityColor: 'text-yellow-400 bg-yellow-400/10', effort: 'HIGH EFFORT' },
  { title: 'Global Search Analytics', priority: 'Low', priorityColor: 'text-green-400 bg-green-400/10', effort: 'SMALL EFFORT' },
  { title: 'Mobile App Wireframes', priority: 'High', priorityColor: 'text-orange-400 bg-orange-400/10', effort: 'LARGE EFFORT' },
];

const sprintItems = [
  { title: 'Refactor Auth Hooks', priority: 'High', priorityColor: 'text-orange-400 bg-orange-400/10', effort: 'SMALL EFFORT' },
  { title: 'Fix CSS Grid Overflow', priority: 'Medium', priorityColor: 'text-yellow-400 bg-yellow-400/10', effort: 'SMALL EFFORT' },
];

const ganttItems = [
  {
    title: 'Multi-Currency Support',
    subtitle: 'Expand to EMEA market founders',
    tag: '+15% ARR',
    tagColor: 'bg-green-500/20 text-green-400 border border-green-500/30',
    assignee: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=32',
    assigneeName: 'SARAH',
    startCol: 0, // Jan
    spanCols: 2.5,
    color: '#1a2a1a',
    border: 'border-green-900/50',
    row: 0,
  },
  {
    title: 'Investor CRM Pro',
    subtitle: 'Streamline Series A pipeline',
    tag: '',
    tagColor: '',
    assignee: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32',
    assigneeName: 'ELENA',
    startCol: 2.5,
    spanCols: 2,
    color: '#1a1a2a',
    border: 'border-blue-900/50',
    row: 0,
  },
  {
    title: 'AI Insight Engine',
    subtitle: 'Reduce strategic planning time',
    tag: '4.8 CSAT',
    tagColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    assignee: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=32',
    assigneeName: 'MARCUS',
    startCol: 1,
    spanCols: 3,
    color: '#1a241a',
    border: 'border-green-800/40',
    row: 1,
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr'];
const COL_W = 180; // px per month
const TODAY_COL = 2.2; // approximately Feb-ish into Mar

export default function Roadmap() {
  const [view, setView] = useState<RoadmapView>('gantt');
  const [backlogOpen, setBacklogOpen] = useState(true);
  const [cycleOpen, setCycleOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[230px] flex-shrink-0 border-r border-[#1e1e1e] flex flex-col bg-[#0f0f0f] overflow-y-auto">
        {/* Hangar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Planning Hangar</span>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
            12 Unassigned
          </span>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[#1e1e1e]">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              placeholder="Search backlog..."
              className="w-full bg-[#141414] border border-[#1e1e1e] rounded-lg pl-7 pr-3 py-1.5 text-xs text-[#9ca3af] placeholder-[#4b5563] focus:outline-none"
            />
          </div>
        </div>

        {/* Ideation Backlog */}
        <div className="border-b border-[#1e1e1e]">
          <button
            onClick={() => setBacklogOpen(!backlogOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#141414] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500/20 rounded flex items-center justify-center">
                <span className="text-orange-400 text-[9px] font-bold">⚡</span>
              </div>
              <span className="text-xs font-semibold text-[#9ca3af]">Ideation Backlog</span>
            </div>
            <ChevronDown size={12} className={`text-[#4b5563] transition-transform ${backlogOpen ? '' : '-rotate-90'}`} />
          </button>

          {backlogOpen && (
            <div className="px-3 pb-3 space-y-2">
              {backlogItems.map((item, i) => (
                <div key={i} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg p-2.5 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-semibold ${item.priorityColor} px-1.5 py-0.5 rounded`}>{item.priority}</span>
                    <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                      <Plus size={11} />
                    </button>
                  </div>
                  <div className="text-xs font-medium text-white mb-1">{item.title}</div>
                  <div className="text-[10px] text-[#4b5563] uppercase">{item.effort}</div>
                </div>
              ))}
              <button className="flex items-center gap-1.5 text-xs text-[#4b5563] hover:text-[#6b7280] pl-1 transition-colors">
                <Plus size={11} />
                Add Item
              </button>
            </div>
          )}
        </div>

        {/* Current Cycle */}
        <div>
          <button
            onClick={() => setCycleOpen(!cycleOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#141414] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-xs">⚡</span>
              <span className="text-xs font-semibold text-[#9ca3af]">Current Cycle</span>
            </div>
            <ChevronDown size={12} className={`text-[#4b5563] transition-transform ${cycleOpen ? '' : '-rotate-90'}`} />
          </button>

          {cycleOpen && (
            <div className="px-3 pb-3 space-y-2">
              {/* Sprint card */}
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-400">Sprint 42: "Velocity"</span>
                  <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1.5">
                  <span>Capacity</span>
                  <span>78% Used</span>
                </div>
                <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
                  <div className="h-full w-[78%] bg-orange-500 rounded-full" />
                </div>
              </div>

              {sprintItems.map((item, i) => (
                <div key={i} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg p-2.5 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-semibold ${item.priorityColor} px-1.5 py-0.5 rounded`}>{item.priority}</span>
                    <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                      <Plus size={11} />
                    </button>
                  </div>
                  <div className="text-xs font-medium text-white mb-1">{item.title}</div>
                  <div className="text-[10px] text-[#4b5563] uppercase">{item.effort}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Gantt Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="px-8 pt-6 pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-full">
              Strategic Timeline
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#4b5563]">
              <Calendar size={11} />
              Updated 2 hours ago
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Mission Manifest 2024</h1>
          <p className="text-[#6b7280] text-sm mb-4 max-w-xl">
            Visualizing the path from product velocity to strategic dominance. Focusing on EMEA expansion and AI-driven telemetry.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1 gap-1">
              <button
                onClick={() => setView('gantt')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${view === 'gantt' ? 'bg-orange-500 text-white' : 'text-[#6b7280] hover:text-white'}`}
              >
                Gantt View
              </button>
              <button
                onClick={() => setView('milestone')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${view === 'milestone' ? 'bg-orange-500 text-white' : 'text-[#6b7280] hover:text-white'}`}
              >
                Milestone View
              </button>
            </div>
            <button className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Filter size={12} />
              Filter
            </button>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              <Plus size={13} />
              New Initiative
            </button>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-auto">
          {/* Quarter headers */}
          <div className="flex border-b border-[#1e1e1e] sticky top-0 bg-[#0d0d0d] z-10">
            <div
              className="flex-shrink-0 bg-orange-500/10 border-r border-orange-500/20 px-6 py-2 text-xs font-bold text-orange-400 uppercase tracking-widest"
              style={{ width: `${COL_W * 4}px` }}
            >
              Q1 - FOUNDATION
            </div>
            <div className="px-6 py-2 text-xs font-bold text-[#6b7280] uppercase tracking-widest">
              Q2
            </div>
          </div>

          {/* Month headers */}
          <div className="flex border-b border-[#1e1e1e] sticky top-[33px] bg-[#0d0d0d] z-10">
            {months.map((m) => (
              <div
                key={m}
                className="flex-shrink-0 px-4 py-2 text-xs text-[#6b7280] font-medium border-r border-[#1e1e1e]"
                style={{ width: `${COL_W}px` }}
              >
                {m}
              </div>
            ))}
            <div className="px-4 py-2 text-xs text-[#6b7280] font-medium" style={{ width: `${COL_W}px` }}>
              May
            </div>
          </div>

          {/* Gantt rows */}
          <div className="relative p-6" style={{ minWidth: `${COL_W * 5}px` }}>
            {/* TODAY line */}
            <div
              className="absolute top-0 bottom-0 border-l-2 border-orange-500 z-20 pointer-events-none"
              style={{ left: `${TODAY_COL * COL_W + 24}px` }}
            >
              <div className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 mt-2 absolute whitespace-nowrap">
                TODAY
              </div>
            </div>

            {/* Grid lines */}
            {months.map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r border-[#1a1a1a]"
                style={{ left: `${(i + 1) * COL_W + 24}px` }}
              />
            ))}

            {/* Row 0 items */}
            <div className="relative h-28 mb-4">
              {ganttItems.filter(item => item.row === 0).map((item, i) => (
                <div
                  key={i}
                  className={`absolute top-2 bg-[${item.color}] border ${item.border} rounded-xl p-3 overflow-hidden`}
                  style={{
                    left: `${item.startCol * COL_W}px`,
                    width: `${item.spanCols * COL_W - 8}px`,
                    backgroundColor: item.color,
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-[#6b7280] truncate">{item.subtitle}</div>
                    </div>
                    {item.tag && (
                      <span className={`text-[10px] font-semibold ${item.tagColor} px-2 py-0.5 rounded-full ml-2 flex-shrink-0`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <img src={item.assignee} alt={item.assigneeName} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] text-[#6b7280] font-medium">{item.assigneeName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 1 items */}
            <div className="relative h-28">
              {ganttItems.filter(item => item.row === 1).map((item, i) => (
                <div
                  key={i}
                  className={`absolute top-2 border ${item.border} rounded-xl p-3 overflow-hidden`}
                  style={{
                    left: `${item.startCol * COL_W}px`,
                    width: `${item.spanCols * COL_W - 8}px`,
                    backgroundColor: item.color,
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-[#6b7280] truncate">{item.subtitle}</div>
                    </div>
                    {item.tag && (
                      <span className={`text-[10px] font-semibold ${item.tagColor} px-2 py-0.5 rounded-full ml-2 flex-shrink-0`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <img src={item.assignee} alt={item.assigneeName} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] text-[#6b7280] font-medium">{item.assigneeName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-3 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>© 2024 FounderHub Mission Control</span>
          <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
          <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
          <a href="#" className="hover:text-[#6b7280]">Support</a>
        </footer>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 hover:bg-orange-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 transition-colors z-50">
        <span className="text-lg font-bold">···</span>
      </button>
    </div>
  );
}
