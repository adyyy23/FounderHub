import { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, Filter, Calendar, Loader as Loader2 } from 'lucide-react';
import { roadmapService, type RoadmapItem } from '@/services/roadmap';

type RoadmapView = 'gantt' | 'milestone';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const COL_W = 180;
const TODAY_COL = 1.5;

const priorityColors: Record<string, string> = {
  high: 'text-orange-400 bg-orange-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-green-400 bg-green-400/10',
};

const statusColors: Record<string, { bg: string; border: string }> = {
  'not-started': { bg: '#1a1a1a', border: 'border-gray-800/50' },
  'in-progress': { bg: '#1a241a', border: 'border-green-800/40' },
  'completed': { bg: '#0f1f0f', border: 'border-green-900/50' },
  'on-hold': { bg: '#1f1a0f', border: 'border-yellow-800/40' },
};

export default function Roadmap() {
  const [view, setView] = useState<RoadmapView>('gantt');
  const [backlogOpen, setBacklogOpen] = useState(true);
  const [cycleOpen, setCycleOpen] = useState(true);
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await roadmapService.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load roadmap items:', err);
    } finally {
      setLoading(false);
    }
  };

  const backlogItems = items.filter((i) => i.status === 'backlog' || !i.start_date);
  const activeItems = items.filter((i) => i.status === 'in_progress' && i.start_date);

  const ganttItems = activeItems.slice(0, 5).map((item, idx) => {
    const startDate = item.start_date ? new Date(item.start_date) : new Date();
    const endDate = item.end_date ? new Date(item.end_date) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startCol = startMonth;
    const spanCols = Math.max(1, endMonth - startMonth + 1);

    const statuses = statusColors[item.status?.replace('_', '-') || 'backlog'] || statusColors['backlog'];

    return {
      id: item.id,
      title: item.title,
      subtitle: item.description?.slice(0, 30) + (item.description && item.description.length > 30 ? '...' : ''),
      tag: item.progress >= 100 ? 'Done' : `${item.progress}%`,
      tagColor: item.progress >= 100
        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      assigneeId: item.assignee,
      startCol,
      spanCols,
      color: statuses.bg,
      border: statuses.border,
      row: idx % 2,
    };
  });

  const unassignedCount = backlogItems.length + items.filter((i) => !i.assignee).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[230px] flex-shrink-0 border-r border-[#1e1e1e] flex flex-col bg-[#0f0f0f] overflow-y-auto">
        {/* Hangar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Planning Hangar</span>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
            {unassignedCount} Unassigned
          </span>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[#1e1e1e]">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <span className="text-orange-400 text-[9px] font-bold">!</span>
              </div>
              <span className="text-xs font-semibold text-[#9ca3af]">Backlog ({backlogItems.length})</span>
            </div>
            <ChevronDown size={12} className={`text-[#4b5563] transition-transform ${backlogOpen ? '' : '-rotate-90'}`} />
          </button>

          {backlogOpen && (
            <div className="px-3 pb-3 space-y-2">
              {backlogItems.slice(0, 4).map((item) => {
                const priority = (item.priority || 'medium').toLowerCase();
                const priorityStyle = priorityColors[priority] || priorityColors.medium;

                return (
                  <div key={item.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg p-2.5 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-semibold ${priorityStyle} px-1.5 py-0.5 rounded`}>{priority}</span>
                      <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="text-xs font-medium text-white mb-1">{item.title}</div>
                    <div className="text-[10px] text-[#4b5563] uppercase">{item.status?.replace('_', ' ') || 'backlog'}</div>
                  </div>
                );
              })}
              {backlogItems.length === 0 && (
                <p className="text-xs text-[#6b7280] py-2">No backlog items</p>
              )}
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
              <span className="text-orange-400 text-xs">!</span>
              <span className="text-xs font-semibold text-[#9ca3af]">Active ({activeItems.length})</span>
            </div>
            <ChevronDown size={12} className={`text-[#4b5563] transition-transform ${cycleOpen ? '' : '-rotate-90'}`} />
          </button>

          {cycleOpen && (
            <div className="px-3 pb-3 space-y-2">
              {/* Progress card */}
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-400">Current Sprint</span>
                  <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1.5">
                  <span>Progress</span>
                  <span>{activeItems.length > 0 ? Math.round(activeItems.reduce((s, i) => s + i.progress, 0) / activeItems.length) : 0}% Avg</span>
                </div>
                <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${activeItems.length > 0 ? Math.round(activeItems.reduce((s, i) => s + i.progress, 0) / activeItems.length) : 0}%` }}
                  />
                </div>
              </div>

              {activeItems.slice(0, 2).map((item) => {
                const priority = (item.priority || 'medium').toLowerCase();
                const priorityStyle = priorityColors[priority] || priorityColors.medium;

                return (
                  <div key={item.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg p-2.5 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-semibold ${priorityStyle} px-1.5 py-0.5 rounded`}>{priority}</span>
                      <span className="text-[10px] text-orange-400">{item.progress}%</span>
                    </div>
                    <div className="text-xs font-medium text-white mb-1">{item.title}</div>
                    <div className="text-[10px] text-[#4b5563] uppercase">in progress</div>
                  </div>
                );
              })}
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
              {items.length} total initiatives
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Mission Manifest 2024</h1>
          <p className="text-[#6b7280] text-sm mb-4 max-w-xl">
            Visualizing the path from product velocity to strategic dominance.
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
          </div>

          {/* Gantt rows */}
          {ganttItems.length > 0 ? (
            <div className="relative p-6" style={{ minWidth: `${COL_W * 6}px` }}>
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
                {ganttItems.filter((item) => item.row === 0).map((item) => (
                  <div
                    key={item.id}
                    className={`absolute top-2 border ${item.border} rounded-xl p-3 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
                    style={{
                      left: `${item.startCol * COL_W}px`,
                      width: `${item.spanCols * COL_W - 8}px`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.title}</div>
                        {item.subtitle && <div className="text-[11px] text-[#6b7280] truncate">{item.subtitle}</div>}
                      </div>
                      <span className={`text-[10px] font-semibold ${item.tagColor} px-2 py-0.5 rounded-full ml-2 flex-shrink-0`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 1 items */}
              <div className="relative h-28">
                {ganttItems.filter((item) => item.row === 1).map((item) => (
                  <div
                    key={item.id}
                    className={`absolute top-2 border ${item.border} rounded-xl p-3 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
                    style={{
                      left: `${item.startCol * COL_W}px`,
                      width: `${item.spanCols * COL_W - 8}px`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.title}</div>
                        {item.subtitle && <div className="text-[11px] text-[#6b7280] truncate">{item.subtitle}</div>}
                      </div>
                      <span className={`text-[10px] font-semibold ${item.tagColor} px-2 py-0.5 rounded-full ml-2 flex-shrink-0`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                  <Calendar size={28} className="text-[#6b7280]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Roadmap Items Yet</h3>
                <p className="text-[#6b7280] text-sm mb-4">Add initiatives to visualize your strategic timeline.</p>
                <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  <Plus size={14} />
                  Add First Initiative
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-8 py-3 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>2024 FounderHub Mission Control</span>
          <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
          <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
          <a href="#" className="hover:text-[#6b7280]">Support</a>
        </footer>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 hover:bg-orange-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 transition-colors z-50">
        <span className="text-lg font-bold">+</span>
      </button>
    </div>
  );
}
