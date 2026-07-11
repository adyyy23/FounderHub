import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Mail, FileText, Video, ChevronRight, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Zap, ExternalLink, Loader as Loader2, ArrowLeft, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { investorService, type Investor, type InvestorStage } from '@/services/investors';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TimelineItem {
  id: string;
  type: 'meeting' | 'email' | 'document' | 'note';
  title: string;
  date: string;
  body: string;
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

const allStages: InvestorStage[] = ['SOURCED', 'CONTACTED', 'INTERESTED', 'NEGOTIATING', 'SIGNED', 'PASSED'];

function formatAmount(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
}

export default function InvestorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'intelligence'>('timeline');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showStageDialog, setShowStageDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [newStage, setNewStage] = useState<InvestorStage>('SOURCED');
  const [editForm, setEditForm] = useState<Partial<Investor>>({});

  useEffect(() => {
    if (id) loadInvestor(id);
  }, [id]);

  const loadInvestor = async (investorId: string) => {
    try {
      setLoading(true);
      const data = await investorService.getById(investorId);
      if (!data) {
        setError('Investor not found');
      } else {
        setInvestor(data);
        setEditForm(data);
        setNewStage(data.stage);
      }
    } catch (err) {
      console.error('Failed to load investor:', err);
      setError('Failed to load investor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!investor || !noteText.trim()) return;
    try {
      const existingNotes = investor.notes || '';
      const updatedNotes = existingNotes
        ? `${existingNotes}\n\n--- ${new Date().toLocaleDateString()} ---\n${noteText}`
        : `--- ${new Date().toLocaleDateString()} ---\n${noteText}`;
      await investorService.update(investor.id, { notes: updatedNotes });
      toast({ title: 'Note added successfully' });
      setNoteText('');
      setShowNoteDialog(false);
      loadInvestor(investor.id);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to add note', variant: 'destructive' });
    }
  };

  const handleMoveStage = async () => {
    if (!investor) return;
    try {
      await investorService.moveToStage(investor.id, newStage);
      toast({ title: `Moved to ${stageSentiment[newStage].label}` });
      setShowStageDialog(false);
      loadInvestor(investor.id);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to move stage', variant: 'destructive' });
    }
  };

  const handleEdit = async () => {
    if (!investor) return;
    try {
      await investorService.update(investor.id, editForm as any);
      toast({ title: 'Investor updated successfully' });
      setShowEditDialog(false);
      loadInvestor(investor.id);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update investor', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!investor) return;
    try {
      await investorService.delete(investor.id);
      toast({ title: 'Investor removed' });
      navigate('/investors');
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to remove investor', variant: 'destructive' });
    }
  };

  const handleContact = async () => {
    if (!investor?.email) {
      toast({ title: 'No email on file', description: 'Add an email in Edit Profile', variant: 'destructive' });
      return;
    }
    const subject = encodeURIComponent('FounderHub Update');
    const body = encodeURIComponent('Hi ' + investor.name + ',\n\nI wanted to share a quick update on our progress...\n');
    window.location.href = `mailto:${investor.email}?subject=${subject}&body=${body}`;
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
        <Link to="/investors" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">Back to Investors</Link>
      </div>
    );
  }

  const stageInfo = stageSentiment[investor.stage] || stageSentiment.SOURCED;
  const timeline: TimelineItem[] = investor.notes
    ? [{ id: '1', type: 'note', title: 'Note', date: investor.last_contact_date || 'Recent', body: investor.notes }]
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
        <button onClick={() => navigate('/investors')} className="text-[#6b7280] hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
          <ArrowLeft size={14} /> Investors
        </button>
        <ChevronRight size={14} className="text-[#4b5563]" />
        <span className="text-white font-medium">{investor.name}</span>
      </div>

      {/* Page Title + Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Command Dossier</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'timeline' ? 'bg-orange-500 text-white' : 'bg-[#161616] border border-[#1e1e1e] text-[#9ca3af] hover:text-white'}`}
          >
            Engagement Timeline
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'intelligence' ? 'bg-orange-500 text-white' : 'bg-[#161616] border border-[#1e1e1e] text-[#9ca3af] hover:text-white'}`}
          >
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
                <img src={investor.avatar_url} alt={investor.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2a2a] mb-3" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#1e1e1e] border-2 border-[#2a2a2a] flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-white">{investor.name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{investor.name}</h2>
              <p className="text-sm text-[#6b7280] mb-2">{investor.firm}</p>
              {investor.bio && <p className="text-[11px] text-[#6b7280] leading-relaxed">{investor.bio}</p>}
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">COMMITMENT</span>
                <span className="text-xs font-bold text-white">{formatAmount(investor.commitment || 0)}</span>
              </div>
              {investor.typical_check_min && investor.typical_check_max && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">TYPICAL CHECK</span>
                  <span className="text-xs font-semibold text-white">{formatAmount(investor.typical_check_min)} - {formatAmount(investor.typical_check_max)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">CURRENT STATUS</span>
                <span className={`text-xs font-semibold ${stageInfo.color} px-2 py-0.5 rounded-full`}>{stageInfo.label}</span>
              </div>
              {investor.sentiment && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">SENTIMENT</span>
                  <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">{investor.sentiment}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={handleContact} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                Contact
              </button>
              <button onClick={() => { setEditForm(investor); setShowEditDialog(true); }} className="flex-1 bg-[#1e1e1e] hover:bg-[#252525] text-[#9ca3af] hover:text-white text-xs font-semibold py-2 rounded-lg transition-colors">
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
                  <span key={idx} className="text-xs text-[#9ca3af] bg-[#1e1e1e] border border-[#2a2a2a] px-2 py-0.5 rounded-full">{area}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Timeline / Intelligence */}
        <div>
          {activeTab === 'timeline' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Active Pipeline</h3>
                <button
                  onClick={() => setShowNoteDialog(true)}
                  className="flex items-center gap-1.5 text-[#6b7280] hover:text-white text-xs transition-colors"
                >
                  <Clock size={12} /> Schedule Follow-up
                </button>
              </div>

              {timeline.length > 0 ? (
                <div className="relative space-y-4">
                  <div className="absolute left-[19px] top-10 bottom-10 w-px bg-[#1e1e1e]" />
                  {timeline.map((item, idx) => {
                    const IconComponent = typeIcons[item.type];
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full ${typeIconBg[item.type]} flex items-center justify-center flex-shrink-0 z-10`}>
                          <IconComponent size={16} className="text-white" />
                        </div>
                        <div className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-white">{item.title}</span>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>{item.type}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-[#6b7280]">
                                <Clock size={10} /> {item.date}
                              </div>
                            </div>
                          </div>
                          <p className="text-[#9ca3af] text-xs leading-relaxed whitespace-pre-wrap">{item.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-8 text-center">
                  <FileText size={32} className="text-[#4b5563] mx-auto mb-3" />
                  <p className="text-[#6b7280] text-sm">No engagement history yet</p>
                  <button onClick={() => setShowNoteDialog(true)} className="mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                    Add first interaction
                  </button>
                </div>
              )}

              {investor.linkedin_url && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-bold text-white mb-3">Quick Links</h4>
                  <a href={investor.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-orange-400 transition-colors">
                    <ExternalLink size={12} /> LinkedIn Profile
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
                <h3 className="text-base font-bold text-white mb-3">Investor Intelligence</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-[#1e1e1e]">
                    <span className="text-xs text-[#6b7280]">Stage</span>
                    <span className={`text-xs font-semibold ${stageInfo.color} px-2 py-0.5 rounded-full`}>{stageInfo.label}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#1e1e1e]">
                    <span className="text-xs text-[#6b7280]">Commitment</span>
                    <span className="text-sm font-bold text-white">{formatAmount(investor.commitment || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#1e1e1e]">
                    <span className="text-xs text-[#6b7280]">Location</span>
                    <span className="text-xs text-white">{investor.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#1e1e1e]">
                    <span className="text-xs text-[#6b7280]">Email</span>
                    <span className="text-xs text-white">{investor.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-[#6b7280]">Last Contact</span>
                    <span className="text-xs text-white">{investor.last_contact_date ? new Date(investor.last_contact_date).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              {investor.location ? ` Based in ${investor.location}.` : ''}
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
                <div key={item.label} className="w-full flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] text-xs font-medium px-3 py-2.5 rounded-lg text-left">
                  <item.icon size={12} className="text-orange-400 flex-shrink-0" />
                  {item.label}
                </div>
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
                <Edit2 size={12} className="mr-1.5" /> Edit Profile
              </Link>
              <button
                onClick={() => { setNewStage(investor.stage); setShowStageDialog(true); }}
                className="w-full flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium py-2.5 rounded-lg transition-colors"
              >
                Move Stage
              </button>
              <button
                onClick={() => setShowNoteDialog(true)}
                className="w-full flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium py-2.5 rounded-lg transition-colors"
              >
                Add Note
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium py-2.5 rounded-lg transition-colors"
              >
                <Trash2 size={12} className="mr-1.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add Note / Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note about this investor interaction..."
              rows={5}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowNoteDialog(false)} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">Cancel</Button>
              <Button onClick={handleAddNote} className="bg-orange-500 hover:bg-orange-400 text-white" disabled={!noteText.trim()}>Save Note</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage Dialog */}
      <Dialog open={showStageDialog} onOpenChange={setShowStageDialog}>
        <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Move Pipeline Stage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value as InvestorStage)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              {allStages.map((s) => <option key={s} value={s}>{stageSentiment[s].label}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowStageDialog(false)} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">Cancel</Button>
              <Button onClick={handleMoveStage} className="bg-orange-500 hover:bg-orange-400 text-white">Move Stage</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Investor</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Name</label>
              <Input value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Firm</label>
                <Input value={editForm.firm || ''} onChange={(e) => setEditForm({ ...editForm, firm: e.target.value })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Email</label>
                <Input value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Stage</label>
                <select value={editForm.stage || 'SOURCED'} onChange={(e) => setEditForm({ ...editForm, stage: e.target.value as InvestorStage })}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                  {allStages.map((s) => <option key={s} value={s}>{stageSentiment[s].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Sentiment</label>
                <Input value={editForm.sentiment || ''} onChange={(e) => setEditForm({ ...editForm, sentiment: e.target.value })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Commitment ($)</label>
                <Input type="number" value={editForm.commitment || 0} onChange={(e) => setEditForm({ ...editForm, commitment: parseInt(e.target.value) || 0 })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Location</label>
                <Input value={editForm.location || ''} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Notes</label>
              <textarea value={editForm.notes || ''} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={3}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setShowEditDialog(false)} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">Cancel</Button>
              <Button onClick={handleEdit} className="bg-orange-500 hover:bg-orange-400 text-white">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="mt-8 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <Link to="/privacy" className="hover:text-[#9ca3af] transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-[#9ca3af] transition-colors">Terms of Service</Link>
        <Link to="/support" className="hover:text-[#9ca3af] transition-colors">Support</Link>
      </footer>
    </div>
  );
}
