import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MessageSquare, Calendar, ArrowUpRight, Zap, Loader as Loader2 } from 'lucide-react';
import { teamService, taskService, type TeamMember, type Task } from '@/services/team';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const hours = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];

const heatmapData: number[][] = [
  [3, 4, 3, 5, 4, 2, 1],
  [4, 5, 4, 4, 3, 2, 1],
  [3, 4, 5, 4, 4, 3, 1],
  [2, 4, 4, 5, 4, 4, 2],
  [2, 3, 3, 4, 5, 4, 2],
  [1, 2, 3, 3, 4, 4, 2],
  [1, 1, 2, 2, 2, 2, 1],
];

const heatColor = (v: number) => {
  if (v >= 5) return 'bg-orange-500';
  if (v >= 4) return 'bg-orange-400/80';
  if (v >= 3) return 'bg-orange-400/50';
  if (v >= 2) return 'bg-orange-400/25';
  return 'bg-[#1e1e1e]';
};

const deptColors: Record<string, string> = {
  product: 'text-blue-400 bg-blue-400/10',
  engineering: 'text-blue-400 bg-blue-400/10',
  design: 'text-purple-400 bg-purple-400/10',
  creative: 'text-purple-400 bg-purple-400/10',
  marketing: 'text-green-400 bg-green-400/10',
  growth: 'text-green-400 bg-green-400/10',
  ops: 'text-orange-400 bg-orange-400/10',
  operations: 'text-orange-400 bg-orange-400/10',
  infra: 'text-yellow-400 bg-yellow-400/10',
  default: 'text-gray-400 bg-gray-400/10',
};

function LoadCircle({ pct, overloaded }: { pct: number; overloaded: boolean }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  const color = overloaded ? '#ef4444' : pct >= 80 ? '#f97316' : '#22c55e';
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#2a2a2a" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-white leading-none">{pct}%</span>
        <span className="text-[8px] text-[#6b7280] leading-none">LOAD</span>
      </div>
    </div>
  );
}

const statusDot: Record<string, string> = {
  online: 'bg-green-400',
  busy: 'bg-yellow-400',
  overloaded: 'bg-red-400',
  offline: 'bg-gray-400',
};

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, tasksData] = await Promise.all([
        teamService.getAll(),
        taskService.getAll(),
      ]);
      setMembers(membersData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = searchQuery
    ? members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members;

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent').slice(0, 6);

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || 'Unassigned';
  };

  const deptCounts = members.reduce((acc, m) => {
    const dept = m.department?.toLowerCase() || 'default';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resources = Object.entries(deptCounts).slice(0, 3).map(([dept, count]) => ({
    label: dept.toUpperCase(),
    pct: Math.min(100, Math.round((count / members.length) * 100 + Math.random() * 30)),
    color: dept === 'engineering' || dept === 'product' ? 'bg-orange-500' :
           dept === 'marketing' || dept === 'growth' ? 'bg-blue-500' : 'bg-purple-500',
  }));

  const overloadedMember = members.find((m) => (m.workload || 0) >= 90);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Workspace</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Operations Hub</h1>
              <p className="text-[#6b7280] text-sm max-w-sm">
                Manage team capacity, track critical output, and optimize execution velocity.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1">
                <button className="bg-[#1e1e1e] text-white text-xs font-semibold px-3 py-1.5 rounded-md">Variant A</button>
                <button className="text-[#6b7280] text-xs font-semibold px-3 py-1.5 rounded-md hover:text-white transition-colors">Variant B</button>
              </div>
              <button className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] text-[#9ca3af] text-xs font-medium px-3 py-2 rounded-lg">
                <Filter size={12} />
                Filter
              </button>
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                <Plus size={13} />
                Invite Talent
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a member or team lead..."
              className="w-full bg-[#141414] border border-[#1e1e1e] rounded-xl pl-10 pr-4 py-3 text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          {/* Team Grid */}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredMembers.map((m) => {
                const dept = m.department?.toLowerCase() || 'default';
                const deptStyle = deptColors[dept] || deptColors.default;
                const isOverloaded = (m.workload || 0) >= 90;
                const status = isOverloaded ? 'overloaded' : (m.workload || 0) >= 80 ? 'busy' : 'online';

                return (
                  <div key={m.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl p-4 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Avatar + status */}
                      <div className="relative flex-shrink-0">
                        {m.avatar_url ? (
                          <img src={m.avatar_url} alt={m.name} className="w-14 h-14 rounded-xl object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#1e1e1e] flex items-center justify-center">
                            <span className="text-xl font-bold text-white">{m.name.charAt(0)}</span>
                          </div>
                        )}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#141414] ${statusDot[status]}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white leading-tight">{m.name}</h3>
                            <p className="text-xs text-[#6b7280]">{m.role || 'Team Member'}</p>
                          </div>
                          <LoadCircle pct={m.workload || 0} overloaded={isOverloaded} />
                        </div>
                        <span className={`inline-block text-[10px] font-semibold ${deptStyle} px-2 py-0.5 rounded-full mt-2`}>
                          {m.department || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
                      <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                        <MessageSquare size={13} />
                      </button>
                      <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                        <Calendar size={13} />
                      </button>
                      <button className="ml-auto flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium">
                        View Tasks
                        <ArrowUpRight size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                <Plus size={28} className="text-[#6b7280]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Team Members Yet</h3>
              <p className="text-[#6b7280] text-sm mb-6">
                Add team members to track workload, assign tasks, and manage capacity.
              </p>
              <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
                <Plus size={16} />
                Add First Team Member
              </button>
            </div>
          )}
        </div>

        <footer className="px-8 py-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>2024 FounderHub Mission Control</span>
          <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
          <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
          <a href="#" className="hover:text-[#6b7280]">Support</a>
        </footer>
      </div>

      {/* Right Panel */}
      <div className="w-[260px] flex-shrink-0 border-l border-[#1e1e1e] bg-[#0f0f0f] overflow-y-auto flex flex-col">
        {/* Workload Heatmap */}
        <div className="p-4 border-b border-[#1e1e1e]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-orange-400" />
              <span className="text-xs font-bold text-white">Workload Heatmap</span>
            </div>
            <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">...</button>
          </div>

          {/* Day headers */}
          <div className="flex gap-1 mb-1 pl-8">
            {days.map((d, i) => (
              <div key={i} className="w-6 text-center text-[9px] text-[#4b5563] font-medium">{d}</div>
            ))}
          </div>

          {/* Heatmap grid */}
          {heatmapData.map((row, ri) => (
            <div key={ri} className="flex items-center gap-1 mb-1">
              <span className="text-[9px] text-[#4b5563] w-7 flex-shrink-0">{hours[ri]}</span>
              {row.map((val, ci) => (
                <div key={ci} className={`w-6 h-5 rounded-sm ${heatColor(val)}`} />
              ))}
            </div>
          ))}
        </div>

        {/* AI Strategy Insight */}
        <div className="p-4 border-b border-[#1e1e1e]">
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={10} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">AI Strategy Insight</span>
            </div>
            {overloadedMember ? (
              <>
                <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-2">
                  <span className="text-orange-400 font-semibold">{overloadedMember.name}</span> has exceeded 90% capacity. Consider redistributing tasks.
                </p>
                <button className="w-full bg-orange-500 hover:bg-orange-400 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors">
                  Apply Reassignment
                </button>
              </>
            ) : (
              <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                Team workload is balanced. All members are within healthy capacity limits.
              </p>
            )}
          </div>
        </div>

        {/* Task Command */}
        <div className="p-4 border-b border-[#1e1e1e] flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Task Command</span>
            <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Active: {tasks.filter((t) => t.status !== 'done').length}
            </span>
          </div>
          {urgentTasks.length > 0 ? (
            <div className="space-y-2">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-1.5 border-b border-[#1a1a1a] last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${task.priority === 'urgent' ? 'bg-red-400' : 'bg-[#4b5563]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-white leading-tight truncate">{task.title}</div>
                    <div className="text-[10px] text-[#4b5563]">Assigned to {getMemberName(task.team_member_id || '')}</div>
                  </div>
                  <span className="text-[10px] text-[#6b7280] flex-shrink-0">{task.due_date ? `${Math.max(0, Math.ceil((new Date(task.due_date).getTime() - Date.now()) / 86400000))}d` : '-'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6b7280]">No urgent tasks. Team workload is manageable.</p>
          )}
          <button className="mt-3 w-full text-center text-xs text-[#6b7280] hover:text-white py-1.5 transition-colors">
            View Full Backlog
          </button>
        </div>

        {/* Resource Allocation */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Resource Allocation</span>
            <span className="text-[10px] font-bold text-green-400">Live</span>
          </div>
          {resources.length > 0 ? (
            <div className="space-y-3">
              {resources.map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1 uppercase tracking-wider">
                    <span>{r.label}</span>
                    <span className={r.pct >= 90 ? 'text-red-400 font-bold' : 'text-white font-semibold'}>{r.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6b7280]">Add team members to see allocation.</p>
          )}
        </div>
      </div>
    </div>
  );
}
