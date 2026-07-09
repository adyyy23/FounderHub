import {
  Clock, Mail, FileText, Video, ChevronRight, MoreVertical,
  TrendingUp, AlertCircle, CheckCircle, Zap, ExternalLink
} from 'lucide-react';

interface InvestorProfileProps {
  onBack: () => void;
}

const timeline = [
  {
    type: 'meeting',
    icon: Video,
    typeLabel: 'meeting',
    title: 'Technical Deep Dive & Architecture Review',
    date: 'Yesterday, 2:30 PM',
    body: 'Detailed discussion on our vector database implementation and scaling strategy. Partner expressed confidence in our moat against incumbents.',
    files: ['Technical_Architecture_V2.pdf', 'Scaling_Benchmarks.csv'],
  },
  {
    type: 'email',
    icon: Mail,
    typeLabel: 'email',
    title: 'Follow-up: Series A Terms Discussion',
    date: 'Oct 28, 9:15 AM',
    body: 'Received preliminary thoughts on valuation ranges and board seat requirements. Terms are competitive but require a counter-offer on option pool expansion.',
    files: [],
  },
  {
    type: 'document',
    icon: FileText,
    typeLabel: 'document',
    title: 'Data Room Access Granted',
    date: 'Oct 25, 4:45 PM',
    body: 'Full access provided to the financial projections and historical cohorts for Q3 analysis.',
    files: ['FounderHub_DataRoom_Log.log'],
  },
  {
    type: 'meeting',
    icon: Video,
    typeLabel: 'meeting',
    title: 'Initial Intro & Vision Pitch',
    date: 'Oct 12, 11:00 AM',
    body: "Initial chemistry meeting with Sarah Chen (GP). Focus was on the 'Why Now' of the platform and the founding team's pedigree.",
    files: [],
  },
];

const meetingHistory = [
  { date: 'Oct 12', type: 'Intro Call', outcome: 'Positive', outcomeColor: 'text-green-400' },
  { date: 'Oct 24', type: 'Product Demo', outcome: 'Qualified', outcomeColor: 'text-blue-400' },
  { date: 'Nov 03', type: 'Partner Meeting', outcome: 'Diligent', outcomeColor: 'text-orange-400' },
];

const playbook = [
  { label: 'Focus on AI Unit Economics', icon: TrendingUp },
  { label: 'Highlight Enterprise Pipeline', icon: Zap },
  { label: 'Address Sales Efficiency', icon: TrendingUp },
];

const typeColors: Record<string, string> = {
  meeting: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
  email: 'bg-orange-500/20 text-orange-400 border border-orange-500/20',
  document: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
};

const typeIconBg: Record<string, string> = {
  meeting: 'bg-blue-500',
  email: 'bg-orange-500',
  document: 'bg-purple-500',
};

export default function InvestorProfile({ onBack }: InvestorProfileProps) {
  return (
    <div className="p-6 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <button onClick={onBack} className="text-[#6b7280] hover:text-white transition-colors">Investors</button>
        <ChevronRight size={14} className="text-[#4b5563]" />
        <span className="text-white font-medium">Apex Ventures</span>
      </div>

      {/* Page Title + Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Command Dossier</h1>
        <div className="flex items-center gap-2">
          <button className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">
            Engagement Timeline
          </button>
          <button className="bg-[#161616] border border-[#1e1e1e] text-[#9ca3af] text-sm font-medium px-4 py-2 rounded-lg hover:text-white transition-colors">
            Intelligence Hub
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr_280px] gap-5">
        {/* Left: Investor Card */}
        <div>
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-[#2a2a2a] flex items-center justify-center mb-3 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Apex Ventures"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Apex Ventures</h2>
              <p className="text-[11px] text-[#6b7280] leading-relaxed">
                Early-stage focused fund specializing in AI infrastructure and B2B SaaS. Known for high-conviction checks and deep operational support.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">PORTFOLIO FIT</span>
                <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">High (94%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">TYPICAL CHECK</span>
                <span className="text-xs font-semibold text-white">$2M - $5M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">CURRENT STATUS</span>
                <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Interested</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                Contact
              </button>
              <button className="flex-1 bg-[#1e1e1e] hover:bg-[#252525] text-[#9ca3af] hover:text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                Updates
              </button>
            </div>
          </div>

          {/* Portfolio Companies */}
          <div className="mt-4 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-3">Portfolio Companies</div>
            <div className="flex flex-wrap gap-1.5">
              {['Linear', 'Vercel', 'Scale AI', 'Retool'].map((co) => (
                <span key={co} className="text-xs text-[#9ca3af] bg-[#1e1e1e] border border-[#2a2a2a] px-2 py-0.5 rounded-full">
                  {co}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Active Pipeline</h3>
            <button className="flex items-center gap-1.5 text-[#6b7280] hover:text-white text-xs transition-colors">
              <Clock size={12} />
              Schedule Follow-up
            </button>
          </div>

          <div className="relative space-y-4">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-10 bottom-10 w-px bg-[#1e1e1e]" />

            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full ${typeIconBg[item.type]} flex items-center justify-center flex-shrink-0 z-10`}>
                  <item.icon size={16} className="text-white" />
                </div>

                {/* Card */}
                <div className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{item.title}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                          {item.typeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#6b7280]">
                        <Clock size={10} />
                        {item.date}
                      </div>
                    </div>
                    <button className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <p className="text-[#9ca3af] text-xs leading-relaxed mb-3">{item.body}</p>
                  {item.files.length > 0 && (
                    <div className="space-y-1">
                      {item.files.map((file) => (
                        <div key={file} className="flex items-center gap-2 text-xs text-[#6b7280] bg-[#1a1a1a] rounded-lg px-3 py-1.5">
                          <FileText size={11} className="text-orange-400" />
                          {file}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full text-center text-sm text-[#6b7280] hover:text-white py-2 transition-colors">
            Show Full History
          </button>
        </div>

        {/* Right: Intelligence */}
        <div className="space-y-4">
          {/* Command Intelligence */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={12} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Command Intelligence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-3">Strategic Outlook</h3>
            <p className="text-[#9ca3af] text-xs leading-relaxed mb-3">
              Apex tends to push for aggressive expansion over profitability in Series A. They are currently skeptical of the sales cycle length mentioned in the latest deck.
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white">Strength: </span>
                  <span className="text-xs text-[#9ca3af]">Existing relationship with our CTO through Stanford network.</span>
                </div>
              </div>
              <div className="flex gap-2">
                <AlertCircle size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white">Urgency: </span>
                  <span className="text-xs text-[#9ca3af]">Next follow-up needed within 48 hours to maintain momentum.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Playbook */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1">Founder Playbook</h3>
            <p className="text-[10px] text-[#6b7280] mb-3">Targeted strategies for this specific investor</p>
            <div className="space-y-2">
              {playbook.map((item) => (
                <button key={item.label} className="w-full flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-2.5 rounded-lg transition-colors text-left">
                  <item.icon size={12} className="text-orange-400 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting History */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Meeting History</h3>
              <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View All</button>
            </div>
            <p className="text-[10px] text-[#6b7280] mb-3">Past 5 engagements with Apex</p>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-[#4b5563] mb-2 uppercase tracking-wider">
              <span>Date</span>
              <span>Type</span>
              <span>Outcome</span>
            </div>
            <div className="space-y-2">
              {meetingHistory.map((m, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-xs text-[#9ca3af] font-medium">{m.date}</span>
                  <span className="text-xs text-[#6b7280]">{m.type}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-semibold ${m.outcomeColor}`}>{m.outcome}</span>
                    <ExternalLink size={10} className="text-[#4b5563]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Graph */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Network Graph</h3>
              <span className="text-[10px] font-medium text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">2 Shared Connections</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40" className="w-7 h-7 rounded-full border-2 border-[#141414] object-cover" alt="" />
                <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40" className="w-7 h-7 rounded-full border-2 border-[#141414] object-cover" alt="" />
              </div>
              <span className="text-[10px] text-[#4b5563] bg-[#1e1e1e] rounded-full px-2 py-0.5">+14</span>
            </div>
            <p className="text-[10px] text-[#6b7280] leading-relaxed">
              You and Sarah both worked at{' '}
              <span className="text-white font-medium">Stripe</span>{' '}
              in 2018. She frequently co-invests with{' '}
              <span className="text-white font-medium">Sequoia</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>© 2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>
    </div>
  );
}
