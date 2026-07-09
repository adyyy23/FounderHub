import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Mail, FileText, Video, ChevronRight, MoveVertical as MoreVertical, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Zap, ExternalLink, Loader as Loader2, ArrowLeft } from 'lucide-react';
import { investorService, type Investor } from '@/services/investors';

interface TimelineItem {
  type: 'meeting' | 'email' | 'document' | 'note';
  title: string;
  date: string;
  body: string;
  files?: string[];
}

const typeColors: Record<string, string> = {
  meeting: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
  email: 'bg-orange-500/20 text-orange-400 border border-orange-500/20',
  document: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
  note: 'bg-green-500/20 text-green-400 border border-green-500/20',
};

const typeIconBg: Record<string, string> = {
  meeting: 'bg-blue-500',
  email: 'bg-orange-500',
  document: 'bg-purple-500',
  note: 'bg-green-500',
};

const typeIcons = {
  meeting: Video,
  email: Mail,
  document: FileText,
  note: FileText,
};

const stageSentiment: Record<string, { label: string; color: string }> = {
  SOURCED: { label: 'Sourced', color: 'text-yellow-400 bg-yellow-400/10' },
  CONTACTED: { label: 'Contacted', color: 'text-blue-400 bg-blue-400/10' },
  INTERESTED: { label: 'Interested', color: 'text-green-400 bg-green-400/10' },
  NEGOTIATING: { label: 'Negotiating', color: 'text-orange-400 bg-orange-400/10' },
  SIGNED: { label: 'Signed', color: 'text-green-400 bg-green-400/10' },
  PASSED: { label: 'Passed', color: 'text-red-400 bg-red-400/10' },
};

export default function InvestorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadInvestor(id);
    }
  }, [id]);

  const loadInvestor = async (investorId: string) => {
    try {
      setLoading(true);
      const data = await investorService.getById(investorId);
      if (!data) {
        setError('Investor not found');
      } else {
        setInvestor(data);
      }
    } catch (err) {
      console.error('Failed to load investor:', err);
      setError('Failed to load investor profile');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-[#4b5563] mb-4" />
        <p className="text-white text-lg font-medium mb-2">{error || 'Investor not found'}</p>
        <Link to="/investors" className="text-orange-400 hover:text-orange-300 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded">
          Back to Investors
        </Link>
      </div>
    );
  }

  const stageInfo = stageSentiment[investor.stage] || stageSentiment.SOURCED;
  const timeline: TimelineItem[] = investor.notes
    ? [{ type: 'note', title: 'Note', date: investor.last_contact_date || 'Recent', body: investor.notes, files: [] }]
    : [];

  const playbook = [
    { label: 'Focus on AI Unit Economics', icon: TrendingUp },
    { label: 'Highlight Enterprise Pipeline', icon: Zap },
    { label: 'Address Sales Efficiency', icon: TrendingUp },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <button onClick={() => navigate('/investors')} className="text-[#6b7280] hover:text-white transition-colors flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded">
          <ArrowLeft size={14} />
          Investors
        </button>
        <ChevronRight size={14} className="text-[#4b5563]" />
        <span className="text-white font-medium">{investor.name}</span>
      </div>

      {/* Page Title + Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Command Dossier</h1>
        <div className="flex items-center gap-2">
          <button className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-400 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]">
            Engagement Timeline
          </button>
          <button className="bg-[#161616] border border-[#1e1e1e] text-[#9ca3af] text-sm font-medium px-4 py-2 rounded-lg hover:text-white hover:border-[#2a2a2a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
            Intelligence Hub
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr_280px] gap-5">
        {/* Left: Investor Card */}
        <div>
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
            <div className="flex flex-col items-center text-center mb-5">
              {investor.avatar_url ? (
                <img
                  src={investor.avatar_url}
                  alt={investor.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2a2a] mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#1e1e1e] border-2 border-[#2a2a2a] flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-white">{investor.name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{investor.name}</h2>
              <p className="text-sm text-[#6b7280] mb-2">{investor.firm}</p>
              {investor.bio && (
                <p className="text-[11px] text-[#6b7280] leading-relaxed">
                  {investor.bio}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">COMMITMENT</span>
                <span className="text-xs font-bold text-white">{formatAmount(investor.commitment || 0)}</span>
              </div>
              {investor.typical_check_min && investor.typical_check_max && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">TYPICAL CHECK</span>
                  <span className="text-xs font-semibold text-white">
                    {formatAmount(investor.typical_check_min)} - {formatAmount(investor.typical_check_max)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">CURRENT STATUS</span>
                <span className={`text-xs font-semibold ${stageInfo.color} px-2 py-0.5 rounded-full`}>
                  {stageInfo.label}
                </span>
              </div>
              {investor.sentiment && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">SENTIMENT</span>
                  <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                    {investor.sentiment}
                  </span>
                </div>
              )}
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

          {/* Tags */}
          {investor.focus_areas && investor.focus_areas.length > 0 && (
            <div className="mt-4 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
              <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-3">Focus Areas</div>
              <div className="flex flex-wrap gap-1.5">
                {investor.focus_areas.map((area, idx) => (
                  <span key={idx} className="text-xs text-[#9ca3af] bg-[#1e1e1e] border border-[#2a2a2a] px-2 py-0.5 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
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

          {timeline.length > 0 ? (
            <div className="relative space-y-4">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-10 bottom-10 w-px bg-[#1e1e1e]" />

              {timeline.map((item, idx) => {
                const IconComponent = typeIcons[item.type];
                return (
                  <div key={idx} className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full ${typeIconBg[item.type]} flex items-center justify-center flex-shrink-0 z-10`}>
                      <IconComponent size={16} className="text-white" />
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">{item.title}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                              {item.type}
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
                      <p className="text-[#9ca3af] text-xs leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-8 text-center">
              <FileText size={32} className="text-[#4b5563] mx-auto mb-3" />
              <p className="text-[#6b7280] text-sm">No engagement history yet</p>
              <button className="mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                Add first interaction
              </button>
            </div>
          )}

          {investor.linkedin_url ? (
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-bold text-white mb-3">Quick Links</h4>
              {investor.linkedin_url && (
                <a
                  href={investor.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-orange-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  LinkedIn Profile
                </a>
              )}
            </div>
          ) : null}
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
              {investor.name} is currently at the {stageInfo.label} stage. {investor.sentiment ? `Sentiment appears ${investor.sentiment.toLowerCase()}.` : ''}
              {investor.location ? `Based in ${investor.location}.` : ''}
            </p>
            <div className="space-y-2">
              {investor.commitment && investor.commitment > 0 && (
                <div className="flex gap-2">
                  <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-white">Commitment: </span>
                    <span className="text-xs text-[#9ca3af]">{formatAmount(investor.commitment)} pledged</span>
                  </div>
                </div>
              )}
              {investor.last_contact_date && (
                <div className="flex gap-2">
                  <AlertCircle size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-white">Last Contact: </span>
                    <span className="text-xs text-[#9ca3af]">{new Date(investor.last_contact_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Founder Playbook */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1">Founder Playbook</h3>
            <p className="text-[10px] text-[#6b7280] mb-3">Targeted strategies for this investor</p>
            <div className="space-y-2">
              {playbook.map((item) => (
                <button key={item.label} className="w-full flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-2.5 rounded-lg transition-colors text-left">
                  <item.icon size={12} className="text-orange-400 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to={`/investors/${investor.id}/edit`}
                className="w-full flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium py-2.5 rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
              <button className="w-full flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium py-2.5 rounded-lg transition-colors">
                Add Note
              </button>
              <button className="w-full flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium py-2.5 rounded-lg transition-colors">
                Move Stage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>
    </div>
  );
}
