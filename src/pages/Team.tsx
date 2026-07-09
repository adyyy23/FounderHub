import { Search, Filter, Plus, MessageSquare, Calendar, ArrowUpRight, Zap } from 'lucide-react';

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

const tasks = [
  { title: 'Fix Q3 Runway Calculation Bug', assignee: 'Elena Rossi', time: '2h left', urgent: true },
  { title: 'Finalize Series A Pitch Deck', assignee: 'Marcus Thorne', time: '5h left', urgent: true },
  { title: 'Optimize Landing Page LCP', assignee: 'David Kim', time: '1d left', urgent: false },
  { title: 'Draft Investor Update Email', assignee: 'Sarah Chen', time: '3h left', urgent: false },
  { title: 'Automate CI/CD Pipeline', assignee: 'Jordan Smith', time: '2d left', urgent: false },
  { title: 'Renew AWS Reserved Instances', assignee: 'Aisha Vance', time: '45m left', urgent: true },
];

const resources = [
  { label: 'ENGINEERING', pct: 78, color: 'bg-orange-500' },
  { label: 'MARKETING', pct: 34, color: 'bg-blue-500' },
  { label: 'DESIGN', pct: 92, color: 'bg-red-500' },
];

const members = [
  {
    name: 'Elena Rossi',
    role: 'Principal Engineer',
    dept: 'Product',
    deptColor: 'text-blue-400 bg-blue-400/10',
    load: 82,
    status: 'online',
    img: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Marcus Thorne',
    role: 'Head of Design',
    dept: 'Creative',
    deptColor: 'text-purple-400 bg-purple-400/10',
    load: 94,
    status: 'overloaded',
    img: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Sarah Chen',
    role: 'Growth Lead',
    dept: 'Marketing',
    deptColor: 'text-green-400 bg-green-400/10',
    load: 45,
    status: 'online',
    img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'David Kim',
    role: 'Backend Architect',
    dept: 'Product',
    deptColor: 'text-blue-400 bg-blue-400/10',
    load: 68,
    status: 'busy',
    img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Jordan Smith',
    role: 'DevOps Specialist',
    dept: 'Infra',
    deptColor: 'text-yellow-400 bg-yellow-400/10',
    load: 88,
    status: 'online',
    img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Aisha Vance',
    role: 'Customer Success',
    dept: 'Ops',
    deptColor: 'text-orange-400 bg-orange-400/10',
    load: 32,
    status: 'online',
    img: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
];

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
};

export default function Team() {
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
                Manage team capacity,<br />track critical output, and<br />optimize execution velocity.
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
              placeholder="Find a member or team lead..."
              className="w-full bg-[#141414] border border-[#1e1e1e] rounded-xl pl-10 pr-4 py-3 text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 gap-4">
            {members.map((m) => (
              <div key={m.name} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl p-4 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Avatar + status */}
                  <div className="relative flex-shrink-0">
                    <img src={m.img} alt={m.name} className="w-14 h-14 rounded-xl object-cover" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#141414] ${statusDot[m.status]}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">{m.name}</h3>
                        <p className="text-xs text-[#6b7280]">{m.role}</p>
                      </div>
                      <LoadCircle pct={m.load} overloaded={m.status === 'overloaded'} />
                    </div>
                    <span className={`inline-block text-[10px] font-semibold ${m.deptColor} px-2 py-0.5 rounded-full mt-2`}>
                      {m.dept}
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
            ))}
          </div>
        </div>

        <footer className="px-8 py-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>© 2024 FounderHub Mission Control</span>
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
            <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">···</button>
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
            <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-2">
              <span className="text-orange-400 font-semibold">Marcus Thorne</span> has exceeded 90% capacity for 3 consecutive days. Suggest moving "Design System Audit" to{' '}
              <span className="text-orange-400 font-semibold">Sarah Chen</span>.
            </p>
            <button className="w-full bg-orange-500 hover:bg-orange-400 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors">
              Apply Reassignment
            </button>
          </div>
        </div>

        {/* Task Command */}
        <div className="p-4 border-b border-[#1e1e1e] flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Task Command</span>
            <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Active: 42</span>
          </div>
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-[#1a1a1a] last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${task.urgent ? 'bg-red-400' : 'bg-[#4b5563]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-white leading-tight truncate">{task.title}</div>
                  <div className="text-[10px] text-[#4b5563]">Assigned to {task.assignee}</div>
                </div>
                <span className="text-[10px] text-[#6b7280] flex-shrink-0">{task.time}</span>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
}
