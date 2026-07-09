import { TrendingUp, TrendingDown, ArrowRight, Zap, Users, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const growthData = [
  { month: 'Jan', arr: 800000, target: 1000000 },
  { month: 'Feb', arr: 1100000, target: 1500000 },
  { month: 'Mar', arr: 1600000, target: 2000000 },
  { month: 'Apr', arr: 2200000, target: 2800000 },
  { month: 'May', arr: 3200000, target: 3500000 },
  { month: 'Jun', arr: 4200000, target: 4500000 },
];

const missionUpdates = [
  {
    icon: DollarSign,
    title: 'Seed Round Progress',
    time: '2h ago',
    desc: 'Committed capital reached $3.2M (80% of $4M target). Benchmark confirmed lead status.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Activity,
    title: 'Q3 Strategy Aligned',
    time: '5h ago',
    desc: 'Product roadmap updated with AI feature set. Focus on enterprise-tier onboarding.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Users,
    title: 'New Core Hire',
    time: 'Yesterday',
    desc: 'Signed Elena Vance as VP of Operations. Onboarding begins next Monday.',
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
  },
  {
    icon: TrendingDown,
    title: 'Burn Rate Optimized',
    time: '2d ago',
    desc: 'Cloud infrastructure costs reduced by 14% following server migration.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
];

const investors = [
  {
    name: 'Naval Ravikant',
    firm: 'AngelList',
    amount: '$500k',
    img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Sarah Tavel',
    firm: 'Benchmark',
    amount: '$1.2M',
    img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Elad Gil',
    firm: 'Solo GP',
    amount: '$250k',
    img: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
];

const formatCurrency = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
};

export default function Dashboard() {
  return (
    <div className="p-8 min-h-screen">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Mission Control</h1>
            <span className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
              Live Telemetry
            </span>
          </div>
          <p className="text-[#6b7280] text-sm">
            The operating status for FounderHub is currently{' '}
            <span className="text-orange-400 font-medium">Optimal</span>.
          </p>
        </div>
        <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1">
          <button className="bg-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-md">Variant A</button>
          <button className="text-[#6b7280] text-xs font-semibold px-4 py-1.5 rounded-md hover:text-white transition-colors">Variant B</button>
        </div>
      </div>

      {/* Health + Metrics Panel */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-[auto_1fr_1fr] gap-8 items-center">
          {/* Health Circle */}
          <div className="flex flex-col items-center justify-center w-40 h-40 relative">
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1e1e1e" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="#f97316" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50 * 0.86} ${2 * Math.PI * 50}`}
              />
            </svg>
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold text-white">86</div>
              <div className="text-[10px] text-[#6b7280] uppercase tracking-widest mt-0.5">STARTUP HEALTH</div>
            </div>
            <div className="absolute -bottom-1 flex items-center gap-1 text-green-400 text-xs font-medium">
              <TrendingUp size={11} />
              +4% this week
            </div>
          </div>

          {/* Left metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Current ARR</div>
              <div className="text-2xl font-bold text-white">$4.2M</div>
              <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                <TrendingUp size={11} />
                <span>+12.5%</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Runway</div>
              <div className="text-2xl font-bold text-white">14.2m</div>
              <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
                <TrendingDown size={11} />
                <span>-0.5m</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Net Burn</div>
              <div className="text-2xl font-bold text-white">$125k</div>
              <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
                <TrendingDown size={11} />
                <span>-2.1%</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Opportunities</div>
              <div className="text-2xl font-bold text-white">28</div>
              <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                <TrendingUp size={11} />
                <span>+6</span>
              </div>
            </div>
          </div>

          {/* Right placeholder for balance */}
          <div />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-[1fr_1fr_320px] gap-5 mb-6">
        {/* Strategic Advisor */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Strategic Advisor</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">Refining Growth Efficiency</h3>
          <p className="text-[#6b7280] text-sm leading-relaxed mb-4">
            Your LTV/CAC ratio has improved to 4.2x. AI suggests doubling spend on LinkedIn direct outreach based on recent 22% conversion spikes.
          </p>
          <button className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Run Insight Analysis
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Series A Pipeline */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Series A Pipeline</span>
            <span className="text-[10px] font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Interested</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="text-white font-semibold">Benchmark Capital</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-[10px] text-[#6b7280] mb-1">TARGET</div>
              <div className="text-xl font-bold text-white">$2.5M</div>
            </div>
            <div>
              <div className="text-[10px] text-[#6b7280] mb-1">CONFIDENCE</div>
              <div className="text-xl font-bold text-white">82%</div>
            </div>
          </div>
          <p className="text-[#6b7280] text-xs italic">
            "Following up after Product Hunt success. Ready for a deep dive."
          </p>
        </div>

        {/* Key Investors */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Key Investors</span>
            <button className="text-orange-400 text-xs font-medium hover:text-orange-300 transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {investors.map((inv) => (
              <div key={inv.name} className="flex items-center gap-3">
                <img src={inv.img} alt={inv.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{inv.name}</div>
                  <div className="text-xs text-[#6b7280]">{inv.firm}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{inv.amount}</div>
                  <button className="text-[10px] text-[#6b7280] border border-[#2a2a2a] rounded px-2 py-0.5 hover:border-[#3a3a3a] hover:text-white transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Growth Timeline */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-base font-bold text-white">Growth Timeline</h3>
              <p className="text-[#6b7280] text-xs">Net ARR growth vs. board-level targets (USD)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6b7280]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                ARR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Target
              </span>
            </div>
          </div>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => formatCurrency(v)}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: 12 }}
                  formatter={(value: number) => [formatCurrency(value)]}
                />
                <Area type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={1.5} fill="url(#targetGradient)" dot={false} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="arr" stroke="#f97316" strokeWidth={2} fill="url(#arrGradient)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mission Updates */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Mission Updates</span>
          </div>
          <div className="space-y-4">
            {missionUpdates.map((update, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-7 h-7 rounded-lg ${update.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <update.icon size={13} className={update.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">{update.title}</span>
                    <span className="text-[10px] text-[#6b7280] ml-auto flex-shrink-0">{update.time}</span>
                  </div>
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">{update.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs text-[#6b7280] hover:text-white flex items-center gap-1.5 transition-colors">
            View full activity log
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Bottom Nav Icons */}
      <div className="mt-6 flex items-center gap-4">
        <button className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl py-3 flex flex-col items-center gap-1 text-[#6b7280] hover:text-white transition-colors">
          <span className="text-xs font-medium">ROADMAP</span>
        </button>
        <button className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl py-3 flex flex-col items-center gap-1 text-[#6b7280] hover:text-white transition-colors">
          <span className="text-xs font-medium">METRICS</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>© 2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280] transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280] transition-colors">Support</a>
      </footer>
    </div>
  );
}
