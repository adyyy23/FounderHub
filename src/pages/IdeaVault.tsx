import { List, LayoutGrid, Grid3X3, Plus, MoreHorizontal, Zap, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

type View = 'editorial' | 'board' | 'matrix';

const ideas = [
  {
    category: 'Product',
    categoryColor: 'text-blue-400 bg-blue-400/10',
    impact: 9,
    title: 'Self-Serve Enterprise SSO',
    desc: 'Automate SAML/OIDC configuration for enterprise customers to reduce onboarding friction.',
    confidence: 7,
    effort: 6,
    status: 'scoping',
    statusColor: 'bg-green-400',
  },
  {
    category: 'Growth',
    categoryColor: 'text-green-400 bg-green-400/10',
    impact: 8,
    title: 'Referral Loop V2',
    desc: 'Incentivize power users with credits for every successful seat expansion they initiate.',
    confidence: 5,
    effort: 3,
    status: 'validation',
    statusColor: 'bg-orange-400',
  },
  {
    category: 'Product',
    categoryColor: 'text-blue-400 bg-blue-400/10',
    impact: 6,
    title: 'AI-Generated Release Notes',
    desc: 'Summarize GitHub PRs automatically into founder-ready changelogs for the community.',
    confidence: 9,
    effort: 2,
    status: 'backlog',
    statusColor: 'bg-gray-400',
  },
  {
    category: 'Operations',
    categoryColor: 'text-yellow-400 bg-yellow-400/10',
    impact: 7,
    title: 'Investor Auto-Update Bot',
    desc: 'Bi-weekly automated summaries of KPIs sent to the cap table to maintain momentum.',
    confidence: 8,
    effort: 4,
    status: 'ready',
    statusColor: 'bg-blue-400',
  },
  {
    category: 'Growth',
    categoryColor: 'text-green-400 bg-green-400/10',
    impact: 10,
    title: 'Viral Waitlist Gamification',
    desc: 'Moving users up the list based on social shares and attribution tracking.',
    confidence: 4,
    effort: 5,
    status: 'backlog',
    statusColor: 'bg-gray-400',
  },
];

function ConfidenceBar({ value, max = 10, color = 'bg-blue-500' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

export default function IdeaVault() {
  const [activeView, setActiveView] = useState<View>('editorial');

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Idea Vault</h1>
          <p className="text-[#6b7280] text-sm">Prioritize your next growth engine with data-driven precision.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={14} />
          New Concept
        </button>
      </div>

      {/* View Tabs + Meta */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center bg-[#141414] border border-[#1e1e1e] rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveView('editorial')}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${activeView === 'editorial' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
          >
            <List size={13} />
            Editorial Feed
          </button>
          <button
            onClick={() => setActiveView('board')}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${activeView === 'board' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
          >
            <LayoutGrid size={13} />
            Board View
          </button>
          <button
            onClick={() => setActiveView('matrix')}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${activeView === 'matrix' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
          >
            <Grid3X3 size={13} />
            Priority Matrix
          </button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[#6b7280]">
            <span className="text-white font-semibold">5</span> Active Ideas
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            Sorted by
            <span className="text-orange-400 font-semibold">High Impact</span>
            <ArrowUpRight size={11} className="text-orange-400" />
          </span>
        </div>
      </div>

      {/* Priority Insight Banner */}
      <div className="bg-gradient-to-r from-[#1a1008] via-[#1e1208] to-[#141414] border border-orange-900/30 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={22} className="text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Priority Insight Available</h3>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Based on your current{' '}
              <span className="text-orange-400 font-semibold">14-month runway</span>
              {' '}and slowing ARR growth, AI suggests focusing on{' '}
              <span className="text-orange-400 font-semibold">"Referral Loop V2"</span>
              {' '}for immediate low-effort impact.
            </p>
          </div>
          <button className="flex-shrink-0 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            Run Strategic Prioritization
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-3 gap-4">
        {ideas.map((idea, idx) => (
          <div
            key={idx}
            className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl p-4 transition-all duration-150 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold ${idea.categoryColor} px-2 py-0.5 rounded-full`}>
                  {idea.category}
                </span>
                <span className="text-[10px] font-medium text-[#6b7280] bg-[#1e1e1e] px-2 py-0.5 rounded-full">
                  Impact: {idea.impact}
                </span>
              </div>
              <button className="text-[#4b5563] hover:text-[#9ca3af] transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={14} />
              </button>
            </div>

            <h3 className="text-base font-bold text-white mb-2 leading-tight">{idea.title}</h3>
            <p className="text-[#6b7280] text-xs leading-relaxed mb-4">{idea.desc}</p>

            <div className="space-y-2 mb-4">
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1 uppercase tracking-wider">
                  <span>CONFIDENCE</span>
                  <span>{idea.confidence}/10</span>
                </div>
                <ConfidenceBar value={idea.confidence} color="bg-blue-500" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1 uppercase tracking-wider">
                  <span>EFFORT</span>
                  <span>{idea.effort}/10</span>
                </div>
                <ConfidenceBar value={idea.effort} color="bg-orange-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${idea.statusColor}`} />
                <span className="text-[10px] text-[#6b7280]">{idea.status}</span>
              </div>
              <button className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors">
                View Specs
                <ArrowUpRight size={11} />
              </button>
            </div>
          </div>
        ))}

        {/* Capture New Idea */}
        <div className="bg-[#0f0f0f] border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#1e1e1e] group-hover:bg-[#252525] flex items-center justify-center mb-3 transition-colors">
            <Plus size={18} className="text-[#6b7280] group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm font-medium text-[#6b7280] group-hover:text-white transition-colors">Capture New Idea</span>
        </div>
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
