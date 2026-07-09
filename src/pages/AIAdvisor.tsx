import { TrendingUp, TrendingDown, Shield, Mail, Map, Target, Lightbulb, Plus, Zap, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const advisorMessages: Array<{
  id: number;
  title: string;
  subtitle: string;
  body: string[];
  actions: Array<{ label: string; icon: typeof Mail; to: string }>;
}> = [
  {
    id: 1,
    title: 'Advisor Insight',
    subtitle: 'COMMAND CHAT • ACTIVE NOW',
    body: [
      "Based on Sequoia's recent sentiment (7.8/10) and your current 14-month runway, delaying the Head of Growth hire by 2 months would extend your runway to 16.5 months. This aligns better with your 'Series A Milestone' goal of reaching $150K MRR with high capital efficiency.",
      "However, Sequoia specifically highlighted 'User Acquisition Velocity' as a key risk. Delaying this hire might slow your ARR trajectory. I recommend a contract-to-hire model for the next 90 days to maintain momentum without the full burn commitment.",
    ],
    actions: [
      { label: 'Draft Email to Sequoia', icon: Mail, to: '/investors' },
      { label: 'Add Milestone to Roadmap', icon: Map, to: '/roadmap' },
      { label: "Create 'Growth Hire' Goal", icon: Target, to: '/goals' },
    ],
  },
  {
    id: 2,
    title: 'Advisor Insight',
    subtitle: 'COMMAND CHAT • ACTIVE NOW',
    body: [
      "I've also detected a potential synergy in your 'Idea Vault'. There's a 'Viral Loop Experiment' that could be executed by your existing team to bridge the gap until the hire is finalized.",
    ],
    actions: [
      { label: 'View Idea Vault', icon: Lightbulb, to: '/ideas' },
    ],
  },
];

const vitals = [
  {
    label: 'CURRENT ARR',
    value: '$1.2M',
    change: '+12%',
    positive: true,
    icon: TrendingUp,
  },
  {
    label: 'MONTHLY BURN',
    value: '$85K',
    change: '-2%',
    positive: false,
    icon: TrendingDown,
  },
  {
    label: 'RUNWAY',
    value: '14 mo',
    change: 'Stable',
    stable: true,
    icon: Shield,
  },
];

const suggestions = [
  'Run runway simulation for Q4 hiring plan',
  'Analyze investor sentiment from last 5 meetings',
  'Audit roadmap against Series A goals',
];

export default function AIAdvisor() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left Panel - Vitals */}
      <div className="w-[220px] flex-shrink-0 border-r border-[#1e1e1e] p-4 overflow-y-auto">
        <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-3">Vitals Snapshot</h3>

        <div className="space-y-3 mb-6">
          {vitals.map((vital) => (
            <div key={vital.label} className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider">{vital.label}</span>
                {vital.stable ? (
                  <span className="text-[10px] text-[#6b7280]">{vital.change}</span>
                ) : (
                  <span className={`text-[10px] font-medium ${vital.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {vital.change}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <vital.icon size={14} className="text-orange-400" />
                <span className="text-xl font-bold text-white">{vital.value}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-3">Round Progress</h3>
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400">Series A Fundraising</span>
            <span className="text-lg font-bold text-white">65%</span>
          </div>
          <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mb-2">
            <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
          </div>
          <p className="text-[10px] text-[#6b7280]">Next Milestone: Term Sheet Review</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Query bar */}
        <div className="border-b border-[#1e1e1e] px-6 py-3">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-[#9ca3af] text-sm">
            Review our current burn rate and tell me if we should delay the hire of the Head of Growth given the recent Sequoia feedback.
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {advisorMessages.map((msg) => (
            <div key={msg.id} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{msg.title}</div>
                  <div className="text-[10px] text-[#4b5563] font-medium">{msg.subtitle}</div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {msg.body.map((paragraph, i) => (
                  <p key={i} className="text-[#d1d5db] text-sm leading-relaxed">{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {msg.actions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <action.icon size={12} />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion chips */}
        <div className="px-6 py-2 flex gap-2 overflow-x-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInputValue(s)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs px-3 py-1.5 rounded-full transition-colors"
            >
              <Zap size={10} className="text-orange-400" />
              {s}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="px-6 py-3 border-t border-[#1e1e1e]">
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl flex items-center gap-3 px-4 py-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the Advisor anything about your strategy, team, or runway..."
              className="flex-1 bg-transparent text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:text-white"
            />
            <button className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
              <Plus size={16} />
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
              Run Insight
              <Send size={11} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] text-[#4b5563]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              REAL-TIME TELEMETRY SYNC
            </span>
            <span className="text-[#2a2a2a]">•</span>
            <span className="flex items-center gap-1.5 text-[10px] text-[#4b5563]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              ANALYZING CRM & METRICS
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>© 2024 FounderHub Mission Control</span>
          <span className="cursor-not-allowed opacity-60">Privacy Policy</span>
          <span className="cursor-not-allowed opacity-60">Terms of Service</span>
          <span className="cursor-not-allowed opacity-60">Support</span>
        </footer>
      </div>
    </div>
  );
}
