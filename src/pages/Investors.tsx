import { TrendingUp, LayoutGrid, List, Filter, Plus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

type InvestorProfilePage = () => void;

interface InvestorsProps {
  onOpenProfile: InvestorProfilePage;
}

const stats = [
  { label: 'Total Pool', value: '$9.8M', change: '+12%', positive: true },
  { label: 'Weighted Forecast', value: '$4.2M', change: '+5.4%', positive: true },
  { label: 'Active Velocity', value: '2.4 / wk', change: '+0.8', positive: true },
  { label: 'Closing Probability', value: '68%', change: 'Stable', stable: true },
];

const miniChartData = [
  [{ v: 2 }, { v: 3 }, { v: 2.5 }, { v: 4 }, { v: 3.5 }, { v: 5 }, { v: 6 }],
  [{ v: 5 }, { v: 4 }, { v: 4.5 }, { v: 3 }, { v: 3.5 }, { v: 4 }, { v: 3 }],
  [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 2.5 }, { v: 4 }, { v: 5 }, { v: 6 }],
  [{ v: 4 }, { v: 3 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }],
];

const columns = [
  {
    title: 'SOURCED',
    count: 12,
    total: '$4.2M',
    investors: [
      {
        name: 'Elena Rodriguez',
        firm: 'Horizon Capital',
        sentiment: 'Bullish',
        sentimentColor: 'text-green-400 bg-green-400/10',
        commitment: '$1.2M',
        lastActive: '1 day ago',
        img: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=80',
        chartIdx: 0,
      },
    ],
  },
  {
    title: 'CONTACTED',
    count: 8,
    total: '$2.8M',
    investors: [
      {
        name: 'David Wu',
        firm: 'Protocol Labs',
        sentiment: 'Cold',
        sentimentColor: 'text-blue-400 bg-blue-400/10',
        commitment: '$750k',
        lastActive: '14 days ago',
        img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80',
        chartIdx: 1,
      },
    ],
  },
  {
    title: 'INTERESTED',
    count: 5,
    total: '$1.5M',
    investors: [
      {
        name: 'Marcus Thorne',
        firm: 'Blackstone Seed',
        sentiment: 'Neutral',
        sentimentColor: 'text-yellow-400 bg-yellow-400/10',
        commitment: '$250k',
        lastActive: '5 days ago',
        img: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80',
        chartIdx: 2,
      },
    ],
  },
  {
    title: 'NEGOTIATING',
    count: 3,
    total: '$800k',
    investors: [
      {
        name: 'Sarah Chen',
        firm: 'Nexus Ventures',
        sentiment: 'Hot',
        sentimentColor: 'text-orange-400 bg-orange-400/10',
        commitment: '$500k',
        lastActive: '2 days ago',
        img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
        chartIdx: 3,
      },
    ],
  },
];

export default function Investors({ onOpenProfile }: InvestorsProps) {
  return (
    <div className="p-8 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <TrendingUp size={18} className="text-orange-400" />
              {stat.stable ? (
                <span className="text-[10px] font-medium text-[#6b7280] bg-[#1e1e1e] px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              ) : (
                <span className={`text-[10px] font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#6b7280] mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Investor Pipeline</h1>
          <p className="text-[#6b7280] text-sm">Strategic management of Seed Round fundraising.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1 gap-1">
            <button className="flex items-center gap-1.5 bg-[#1e1e1e] text-white text-xs font-medium px-3 py-1.5 rounded-md">
              <LayoutGrid size={13} />
              Board
            </button>
            <button className="flex items-center gap-1.5 text-[#6b7280] text-xs font-medium px-3 py-1.5 rounded-md hover:text-white transition-colors">
              <List size={13} />
              Table
            </button>
          </div>
          <button className="flex items-center gap-1.5 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] text-xs font-medium px-3 py-2 rounded-lg transition-colors">
            <Filter size={13} />
            Filter
          </button>
          <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus size={13} />
            Add Investor
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.title}>
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">{col.title}</span>
              <span className="text-[10px] font-bold text-white bg-[#1e1e1e] rounded-full w-5 h-5 flex items-center justify-center">
                {col.count}
              </span>
              <span className="text-[10px] text-[#4b5563] ml-auto">{col.total}</span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {col.investors.map((inv) => (
                <div
                  key={inv.name}
                  onClick={onOpenProfile}
                  className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 group"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <img
                        src={inv.img}
                        alt={inv.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#1e1e1e]"
                      />
                      <span className={`text-[10px] font-semibold ${inv.sentimentColor} px-2 py-0.5 rounded-full`}>
                        {inv.sentiment}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{inv.name}</div>
                      <div className="text-[11px] text-[#6b7280]">{inv.firm}</div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-[#6b7280] mb-0.5">COMMITMENT</div>
                        <div className="text-base font-bold text-white">{inv.commitment}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-green-400 font-medium">ACTIVE</div>
                        <div className="text-[10px] text-[#6b7280]">{inv.lastActive}</div>
                      </div>
                    </div>
                  </div>
                  {/* Mini sparkline */}
                  <div className="h-16 px-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={miniChartData[inv.chartIdx]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`sparkGrad-${inv.chartIdx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#f97316"
                          strokeWidth={1.5}
                          fill={`url(#sparkGrad-${inv.chartIdx})`}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}

              {/* Add card */}
              <button className="w-full bg-[#0f0f0f] border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] rounded-2xl p-4 flex items-center justify-center gap-2 text-[#4b5563] hover:text-[#6b7280] text-xs transition-colors">
                <Plus size={13} />
                Add investor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>© 2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>
    </div>
  );
}
