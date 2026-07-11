import { useState, useEffect, useCallback } from 'react';
import { List, LayoutGrid, Grid3x3 as Grid3X3, Plus, Zap, ArrowUpRight, Loader as Loader2, CreditCard as Edit2, Trash2, Sparkles } from 'lucide-react';
import { ideaService, type Idea, type IdeaCategory, type IdeaStatus } from '@/services/ideas';
import { useToast } from '@/hooks/use-toast';
import AIInsightsModal from '@/components/AIInsightsModal';
import { generateIdeaInsights, type AIAnalysisResult } from '@/lib/aiInsights';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type View = 'editorial' | 'board' | 'matrix';

const categoryColors: Record<string, string> = {
  product: 'text-blue-400 bg-blue-400/10',
  growth: 'text-green-400 bg-green-400/10',
  operations: 'text-purple-400 bg-purple-400/10',
  default: 'text-gray-400 bg-gray-400/10',
};

const statusColors: Record<string, string> = {
  backlog: 'bg-gray-400',
  scoping: 'bg-yellow-400',
  validation: 'bg-orange-400',
  ready: 'bg-blue-400',
  in_progress: 'bg-green-400',
  completed: 'bg-emerald-400',
  archived: 'bg-red-400',
};

const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  scoping: 'Scoping',
  validation: 'Validation',
  ready: 'Ready',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

function ConfidenceBar({ value, max = 10, color = 'bg-blue-500' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

interface IdeaFormData {
  title: string;
  description: string;
  category: IdeaCategory;
  impact: number;
  confidence: number;
  effort: number;
  status: IdeaStatus;
}

function IdeaFormDialog({
  open,
  onClose,
  onSubmit,
  initialIdea,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IdeaFormData) => Promise<void>;
  initialIdea?: Idea | null;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    category: 'Product',
    impact: 5,
    confidence: 5,
    effort: 5,
    status: 'backlog',
  });

  useEffect(() => {
    if (initialIdea) {
      setFormData({
        title: initialIdea.title,
        description: initialIdea.description || '',
        category: initialIdea.category,
        impact: initialIdea.impact || 5,
        confidence: initialIdea.confidence || 5,
        effort: initialIdea.effort || 5,
        status: initialIdea.status,
      });
    } else {
      setFormData({ title: '', description: '', category: 'Product', impact: 5, confidence: 5, effort: 5, status: 'backlog' });
    }
  }, [initialIdea, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{initialIdea ? 'Edit Concept' : 'Capture New Idea'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Viral Loop Experiment"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the idea, hypothesis, and expected outcome..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#3a3a3a]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as IdeaCategory })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Product">Product</option>
                <option value="Growth">Growth</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as IdeaStatus })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="backlog">Backlog</option>
                <option value="scoping">Scoping</option>
                <option value="validation">Validation</option>
                <option value="ready">Ready</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Impact (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) || 5 })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Confidence (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) || 5 })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Effort (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.effort}
                onChange={(e) => setFormData({ ...formData, effort: parseInt(e.target.value) || 5 })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-400 text-white">
              {loading ? <Loader2 size={16} className="animate-spin" /> : initialIdea ? 'Save Changes' : 'Capture Idea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function IdeaVault() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<View>('editorial');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const data = await ideaService.getAll();
      const sorted = data.sort((a, b) => (b.impact || 0) - (a.impact || 0));
      setIdeas(sorted);
    } catch (err) {
      console.error('Failed to load ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: IdeaFormData) => {
    try {
      await ideaService.create({
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        impact: data.impact,
        confidence: data.confidence,
        effort: data.effort,
        status: data.status,
      });
      toast({ title: 'Idea captured successfully' });
      setShowForm(false);
      loadIdeas();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to capture idea', variant: 'destructive' });
    }
  };

  const handleEdit = async (data: IdeaFormData) => {
    if (!editingIdea) return;
    try {
      await ideaService.update(editingIdea.id, {
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        impact: data.impact,
        confidence: data.confidence,
        effort: data.effort,
        status: data.status,
      });
      toast({ title: 'Idea updated successfully' });
      setShowForm(false);
      setEditingIdea(null);
      loadIdeas();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update idea', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ideaService.delete(id);
      toast({ title: 'Idea deleted' });
      loadIdeas();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete idea', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (idea: Idea, newStatus: IdeaStatus) => {
    try {
      await ideaService.update(idea.id, { status: newStatus });
      toast({ title: `Status updated to ${statusLabels[newStatus]}` });
      loadIdeas();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const openEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingIdea(null);
    setShowForm(true);
  };

  const generateInsights = useCallback(async (): Promise<AIAnalysisResult> => {
    await new Promise((r) => setTimeout(r, 1200));
    return generateIdeaInsights(ideas);
  }, [ideas]);

  const topIdea = ideas.find((i) => i.impact && i.impact >= 8 && i.effort && i.effort <= 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Idea Vault</h1>
          <p className="text-[#6b7280] text-sm">Prioritize your next growth engine with data-driven precision.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInsights(true)}
            className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-orange-500/50 text-[#9ca3af] hover:text-orange-400 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Sparkles size={14} />
            AI Insights
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={14} />
            New Concept
          </button>
        </div>
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
            <span className="text-white font-semibold">{ideas.length}</span> Active Ideas
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            Sorted by
            <span className="text-orange-400 font-semibold">High Impact</span>
            <ArrowUpRight size={11} className="text-orange-400" />
          </span>
        </div>
      </div>

      {/* Priority Insight Banner */}
      {topIdea && (
        <div className="bg-gradient-to-r from-[#1a1008] via-[#1e1208] to-[#141414] border border-orange-900/30 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={22} className="text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Priority Insight Available</h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed">
                Based on your current priorities, AI suggests focusing on{' '}
                <span className="text-orange-400 font-semibold">"{topIdea.title}"</span>
                {' '}for maximum impact with manageable effort.
              </p>
            </div>
            <button
              onClick={() => setShowInsights(true)}
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Run Strategic Prioritization
            </button>
          </div>
        </div>
      )}

      {/* Ideas Grid */}
      {ideas.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {ideas.map((idea) => {
            const category = idea.category?.toLowerCase() || 'default';
            const categoryStyle = categoryColors[category] || categoryColors.default;
            const status = idea.status?.toLowerCase().replace(' ', '_') || 'backlog';
            const statusColor = statusColors[status] || statusColors.backlog;

            return (
              <div
                key={idea.id}
                className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl p-4 transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold ${categoryStyle} px-2 py-0.5 rounded-full`}>
                      {idea.category || 'General'}
                    </span>
                    <span className="text-[10px] font-medium text-[#6b7280] bg-[#1e1e1e] px-2 py-0.5 rounded-full">
                      Impact: {idea.impact || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(idea)}
                      className="text-[#4b5563] hover:text-white transition-colors p-1"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="text-[#4b5563] hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-tight">{idea.title}</h3>
                <p className="text-[#6b7280] text-xs leading-relaxed mb-4 line-clamp-2">{idea.description}</p>

                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1 uppercase tracking-wider">
                      <span>CONFIDENCE</span>
                      <span>{idea.confidence || 0}/10</span>
                    </div>
                    <ConfidenceBar value={idea.confidence || 0} color="bg-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1 uppercase tracking-wider">
                      <span>EFFORT</span>
                      <span>{idea.effort || 0}/10</span>
                    </div>
                    <ConfidenceBar value={idea.effort || 0} color="bg-orange-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={idea.status}
                    onChange={(e) => handleStatusChange(idea, e.target.value as IdeaStatus)}
                    className="bg-transparent text-[10px] text-[#6b7280] focus:outline-none cursor-pointer hover:text-white transition-colors"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="scoping">Scoping</option>
                    <option value="validation">Validation</option>
                    <option value="ready">Ready</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                    <span className="text-[10px] text-[#6b7280]">{statusLabels[idea.status] || idea.status}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Capture New Idea */}
          <div
            onClick={openCreate}
            className="bg-[#0f0f0f] border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1e1e1e] group-hover:bg-[#252525] flex items-center justify-center mb-3 transition-colors">
              <Plus size={18} className="text-[#6b7280] group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm font-medium text-[#6b7280] group-hover:text-white transition-colors">Capture New Idea</span>
          </div>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
            <Zap size={28} className="text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Your Idea Vault is Empty</h3>
          <p className="text-[#6b7280] text-sm mb-6 max-w-md mx-auto">
            Start capturing product ideas, growth experiments, and operational improvements. Score them by impact and effort to prioritize effectively.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Capture Your First Idea
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>

      <IdeaFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingIdea(null); }}
        onSubmit={editingIdea ? handleEdit : handleCreate}
        initialIdea={editingIdea}
      />

      <AIInsightsModal
        open={showInsights}
        onClose={() => setShowInsights(false)}
        onGenerate={generateInsights}
        title="AI Idea Insights"
        subtitle="Strategic analysis of your idea portfolio"
      />
    </div>
  );
}
