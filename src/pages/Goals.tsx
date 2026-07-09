import { Zap, BarChart2, Calendar, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

type Tab = 'all' | 'product' | 'growth' | 'ops';

const goals = [
  {
    category: 'PRODUCT',
    categoryColor: 'text-blue-400',
    dotColor: 'bg-blue-400',
    title: 'Achieve Series A Product-Market Fit Benchmarks',
    completion: 68,
    confidence: 'HIGH',
    owner: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=40',
    keyResults: [
      { label: 'Improve Day 30 Retention to 45%', current: 38, target: 45, unit: '%' },
      { label: 'Reduce Core Task Latency by 50%', current: 30, target: 50, unit: '%' },
      { label: 'Launch 3 Mission-Critical AI Modules', current: 2, target: 3, unit: '' },
    ],
    tab: 'product',
  },
  {
    category: 'GROWTH',
    categoryColor: 'text-orange-400',
    dotColor: 'bg-orange-400',
    title: 'Scale Revenue to $2M ARR with Sustainable CAC',
    completion: 42,
    confidence: 'HIGH',
    owner: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40',
    keyResults: [
      { label: 'Close 12 New Enterprise Contracts', current: 5, target: 12, unit: '' },
      { label: 'Maintain Blended CAC below $1,200', current: 1450, target: 1200, unit: '$', inverse: true },
      { label: 'Expand to EMEA Market (Initial Presence)', current: 1, target: 1, unit: 'Market' },
    ],
    tab: 'growth',
  },
  {
    category: 'OPERATIONS',
    categoryColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    title: 'Build a World-Class Distributed Engineering Org',
    completion: 85,
    confidence: 'HIGH',
    owner: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=40',
    keyResults: [
      { label: 'Hire 8 Senior Platform Engineers', current: 7, target: 8, unit: '' },
      { label: 'Implement 24/7 On-Call Rotation Hubs', current: 100, target: 100, unit: '%' },
      { label: 'Achieve 99.99% Infrastructure Uptime', current: 99.95, target: 99.99, unit: '%' },
    ],
    tab: 'ops',
  },
];

const milestones = [
  { date: 'OCT 12', label: 'V2.0-Core-Beta-Launch', done: true },
  { date: 'OCT 28', label: 'Investor Update: Q3 Metrics', done: false },
  { date: 'NOV 15', label: 'Hiring Sprint: Eng Lead', done: false },
  { date: 'DEC 05', label: 'Annual Strategy Offsite', done: false },
];

function GoalCard({ goal }: { goal: typeof goals[0] }) {
  const fillPct = Math.min(100, (goal.completion / 100) * 100);

  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${goal.categoryColor} uppercase tracking-widest`}>{goal.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={goal.owner} alt="owner" className="w-7 h-7 rounded-full object-cover border border-[#2a2a2a]" />
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{goal.completion}%</div>
            <div className="text-[9px] text-[#6b7280] uppercase">CONFIDENCE: {goal.confidence}</div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-4 leading-snug">{goal.title}</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-[#6b7280] mb-1.5">
          <span>Overall Completion</span>
          <span className="text-white font-semibold">{goal.completion}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <div className="border-t border-[#1e1e1e] pt-3">
        <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Key Results</div>
        <div className="space-y-2">
          {goal.keyResults.map((kr, i) => {
            const rawPct = kr.inverse
              ? kr.current > kr.target ? 0 : ((kr.target - kr.current) / kr.target) * 100
              : (kr.current / kr.target) * 100;
            const pct = Math.min(100, rawPct);
            const displayCurrent = kr.unit === '%' ? `${kr.current}%` : kr.unit === '$' ? `${kr.current}$` : `${kr.current}`;
            const displayTarget = kr.unit === '%' ? `${kr.target}%` : kr.unit === '$' ? `${kr.target}$` : `${kr.target}${kr.unit ? ' / ' + kr.unit : ''}`;
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-1">
                  <span>{kr.label}</span>
                  <span className="text-[#6b7280] flex-shrink-0 ml-4">{displayCurrent} / {displayTarget}</span>
                </div>
                <div className="w-full h-0.5 bg-[#2a2a2a] rounded-full">
                  <div
                    className={`h-full rounded-full ${pct >= 100 ? 'bg-green-500' : pct >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1e1e1e]">
        <button className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-white transition-colors">
          <MoreHorizontal size={13} />
          More Details
        </button>
        <button className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors">
          <Zap size={11} />
          AI Forecast
        </button>
      </div>
    </div>
  );
}

export default function Goals() {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filtered = activeTab === 'all' ? goals : goals.filter((g) => g.tab === activeTab);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Strategic Objectives</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-1">Mission Roadmap</h1>
          <p className="text-[#6b7280] text-sm max-w-md">
            Connect your highest-level vision to daily execution. These goals define our trajectory towards the next milestone.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <BarChart2 size={14} />
            Quarterly Report
          </button>
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            New Objective
          </button>
        </div>
      </div>

      {/* System Velocity Banner */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">
                Quarterly Focus: Q4 2024
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">System Velocity: 72%</h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed max-w-lg">
              You are currently ahead of schedule for Product milestones but trailing on Growth targets. Focus on the European expansion to re-align velocity.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Zap size={13} />
                Run AI Strategy Analysis
              </button>
              <button className="bg-[#1e1e1e] hover:bg-[#252525] text-[#9ca3af] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Update Q4 Targets
              </button>
            </div>
          </div>
          {/* Progress Circle */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#1e1e1e" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="48"
                fill="none" stroke="#f97316" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 48 * 0.72} ${2 * Math.PI * 48}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">72%</span>
              <span className="text-[9px] text-[#6b7280] uppercase tracking-wider">Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-[1fr_300px] gap-6">
        {/* Left: Goals list */}
        <div>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 mb-4">
            {(['all', 'product', 'growth', 'ops'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-orange-500'
                    : 'text-[#6b7280] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-[#4b5563]">
              <Calendar size={11} className="inline mr-1" />
              Last updated 4 hours ago by Sarah
            </span>
          </div>

          {filtered.map((goal, i) => (
            <GoalCard key={i} goal={goal} />
          ))}

          {/* End state */}
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-sm font-medium text-[#6b7280] mb-1">You've reached the end of critical objectives</p>
            <p className="text-xs text-[#4b5563] mb-4">Archive completed goals to keep your roadmap clean.</p>
            <button className="text-sm text-[#9ca3af] hover:text-white border border-[#2a2a2a] hover:border-[#3a3a3a] px-4 py-2 rounded-lg transition-colors">
              View Goal Archive
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Alignment Map */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Alignment Map</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <div className="text-[9px] text-orange-400 uppercase mb-1">The Mission</div>
                <div className="text-sm font-semibold text-white">Become the infrastructure of AI-first companies.</div>
              </div>
              <div className="ml-4 space-y-2">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5">
                  <div className="text-[9px] text-[#6b7280] uppercase mb-0.5">Strategic Goal</div>
                  <div className="text-xs font-medium text-white">Scale Series A ARR</div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5">
                  <div className="text-[9px] text-[#6b7280] uppercase mb-0.5">Strategic Goal</div>
                  <div className="text-xs font-medium text-white">Engineering Excellence</div>
                </div>
              </div>
            </div>
            <button className="mt-3 flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors">
              View Full Graph
              <ArrowUpRight size={11} />
            </button>
          </div>

          {/* Critical Milestones */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={12} className="text-[#6b7280]" />
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Critical Milestones</span>
            </div>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${m.done ? 'bg-green-500' : 'border-2 border-[#2a2a2a]'}`}>
                    {m.done && <span className="text-white text-[9px] font-bold">✓</span>}
                  </div>
                  <div>
                    <div className="text-[10px] text-[#6b7280] mb-0.5">{m.date}</div>
                    <div className="text-xs font-medium text-white">{m.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategist */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={12} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">AI Strategist</span>
            </div>
            <p className="text-xs text-[#9ca3af] leading-relaxed mb-3">
              "Growth objectives are 12% behind baseline. I recommend shifting 15% of engineering capacity from Platform stability to User Onboarding automation."
            </p>
            <button className="w-full bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
              Apply Strategy Shift
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>© 2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>
    </div>
  );
}
