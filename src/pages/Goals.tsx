import { useState, useEffect, useCallback } from 'react';
import { Zap, ChartBar as BarChart2, Calendar, ArrowUpRight, Plus, Loader as Loader2, CreditCard as Edit2, Trash2, Check, Target, Sparkles, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { goalService, type Goal, type KeyResult, type GoalCategory } from '@/services/goals';
import { useToast } from '@/hooks/use-toast';
import AIInsightsModal from '@/components/AIInsightsModal';
import { generateGoalInsights, type AIAnalysisResult } from '@/lib/aiInsights';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Tab = 'all' | 'product' | 'growth' | 'ops';

const categoryColors: Record<string, { text: string; bg: string; dot: string }> = {
  product: { text: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-400' },
  growth: { text: 'text-orange-400', bg: 'bg-orange-400/10', dot: 'bg-orange-400' },
  operations: { text: 'text-purple-400', bg: 'bg-purple-400/10', dot: 'bg-purple-400' },
  default: { text: 'text-gray-400', bg: 'bg-gray-400/10', dot: 'bg-gray-400' },
};

interface KeyResultDisplay {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  inverse?: boolean;
}

function GoalCard({ goal, onEdit, onDelete, onComplete, onArchive }: { goal: Goal; onEdit: (goal: Goal) => void; onDelete: (id: string) => void; onComplete: (id: string) => void; onArchive: (id: string) => void }) {
  const fillPct = Math.min(100, goal.completion);
  const category = goal.category?.toLowerCase() || 'default';
  const colors = categoryColors[category] || categoryColors.default;

  const keyResults: KeyResultDisplay[] = goal.key_results?.map((kr: KeyResult) => ({
    id: kr.id,
    label: kr.label,
    current: kr.current,
    target: kr.target,
    unit: kr.unit || '',
    inverse: kr.label.toLowerCase().includes('reduc') || kr.label.toLowerCase().includes('lower'),
  })) || [];

  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${colors.text} uppercase tracking-widest`}>
            {goal.category || 'GOAL'}
          </span>
          {goal.status === 'completed' && (
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">COMPLETED</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{goal.completion}%</div>
            <div className="text-[9px] text-[#6b7280] uppercase">
              {goal.due_date ? `Due: ${new Date(goal.due_date).toLocaleDateString()}` : 'No deadline'}
            </div>
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

      {keyResults.length > 0 && (
        <div className="border-t border-[#1e1e1e] pt-3">
          <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Key Results</div>
          <div className="space-y-2">
            {keyResults.map((kr) => {
              const rawPct = kr.inverse
                ? kr.current > kr.target ? 0 : ((kr.target - kr.current) / kr.target) * 100
                : (kr.current / kr.target) * 100;
              const pct = Math.min(100, rawPct);
              const displayCurrent = kr.unit === '%' ? `${kr.current}%` : `${kr.current}`;
              const displayTarget = kr.unit === '%' ? `${kr.target}%` : `${kr.target}`;

              return (
                <div key={kr.id}>
                  <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-1">
                    <span>{kr.label}</span>
                    <span className="text-[#6b7280] flex-shrink-0 ml-4">
                      {displayCurrent} / {displayTarget}
                    </span>
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
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-white transition-colors"
          >
            <Edit2 size={13} />
            Edit
          </button>
          {goal.status !== 'completed' && (
            <button
              onClick={() => onComplete(goal.id)}
              className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-green-400 transition-colors"
            >
              <Check size={13} />
              Complete
            </button>
          )}
          <button
            onClick={() => onArchive(goal.id)}
            className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-orange-400 transition-colors"
          >
            <Archive size={13} />
            Archive
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface GoalFormData {
  title: string;
  category: GoalCategory;
  description: string;
  completion: number;
  due_date: string;
  confidence: string;
}

function GoalFormDialog({
  open,
  onClose,
  onSubmit,
  initialGoal,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => Promise<void>;
  initialGoal?: Goal | null;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    category: 'product',
    description: '',
    completion: 0,
    due_date: '',
    confidence: 'HIGH',
  });

  useEffect(() => {
    if (initialGoal) {
      setFormData({
        title: initialGoal.title,
        category: initialGoal.category,
        description: initialGoal.description || '',
        completion: initialGoal.completion,
        due_date: initialGoal.due_date || '',
        confidence: initialGoal.confidence || 'HIGH',
      });
    } else {
      setFormData({ title: '', category: 'product', description: '', completion: 0, due_date: '', confidence: 'HIGH' });
    }
  }, [initialGoal, open]);

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
          <DialogTitle className="text-white">{initialGoal ? 'Edit Goal' : 'New Objective'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Reach $150K MRR"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="product">Product</option>
                <option value="growth">Growth</option>
                <option value="ops">Operations</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Confidence</label>
              <select
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Completion (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.completion}
                onChange={(e) => setFormData({ ...formData, completion: parseInt(e.target.value) || 0 })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Due Date</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this objective..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#3a3a3a]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-400 text-white">
              {loading ? <Loader2 size={16} className="animate-spin" /> : initialGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Goals() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: GoalFormData) => {
    try {
      await goalService.create({
        title: data.title,
        category: data.category,
        description: data.description || undefined,
        completion: data.completion,
        confidence: data.confidence,
        due_date: data.due_date || undefined,
      });
      toast({ title: 'Goal created successfully' });
      setShowForm(false);
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to create goal', variant: 'destructive' });
    }
  };

  const handleEdit = async (data: GoalFormData) => {
    if (!editingGoal) return;
    try {
      await goalService.update(editingGoal.id, {
        title: data.title,
        category: data.category,
        description: data.description || undefined,
        completion: data.completion,
        confidence: data.confidence,
        due_date: data.due_date || undefined,
      });
      toast({ title: 'Goal updated successfully' });
      setShowForm(false);
      setEditingGoal(null);
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update goal', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await goalService.delete(id);
      toast({ title: 'Goal deleted' });
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete goal', variant: 'destructive' });
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await goalService.archive(id);
      toast({ title: 'Goal archived' });
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to archive goal', variant: 'destructive' });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await goalService.complete(id);
      toast({ title: 'Goal marked as complete!' });
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to complete goal', variant: 'destructive' });
    }
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const generateInsights = useCallback(async (): Promise<AIAnalysisResult> => {
    await new Promise((r) => setTimeout(r, 1200));
    const category = activeTab === 'all' ? undefined : activeTab === 'ops' ? 'operations' : activeTab;
    return generateGoalInsights(goals, category);
  }, [goals, activeTab]);

  const tabToCategory: Record<Tab, string | null> = {
    all: null,
    product: 'product',
    growth: 'growth',
    ops: 'operations',
  };

  const filtered = activeTab === 'all'
    ? goals.filter((g) => g.status !== 'archived')
    : goals.filter((g) => g.category?.toLowerCase() === tabToCategory[activeTab] && g.status !== 'archived');

  const avgCompletion = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.completion, 0) / goals.length)
    : 0;

  const milestones = goals
    .filter((g) => g.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 4)
    .map((g) => ({
      date: new Date(g.due_date!).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase(),
      label: g.title.slice(0, 25) + (g.title.length > 25 ? '...' : ''),
      done: g.completion >= 100,
    }));

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
          <button
            onClick={() => setShowInsights(true)}
            className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-orange-500/50 text-[#9ca3af] hover:text-orange-400 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <BarChart2 size={14} />
            Quarterly Report
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={14} />
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
            <h2 className="text-3xl font-bold text-white mb-2">System Velocity: {avgCompletion}%</h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed max-w-lg">
              {goals.length === 0
                ? 'Add your first goal to start tracking progress towards your strategic objectives.'
                : `You have ${goals.filter(g => g.status !== 'archived').length} active objectives. Keep pushing towards your targets.`}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setShowInsights(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Sparkles size={13} />
                Run AI Strategy Analysis
              </button>
              <button
                onClick={openCreate}
                className="bg-[#1e1e1e] hover:bg-[#252525] text-[#9ca3af] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
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
                strokeDasharray={`${2 * Math.PI * 48 * (avgCompletion / 100)} ${2 * Math.PI * 48}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{avgCompletion}%</span>
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
              {goals.length} total objectives
            </span>
          </div>

          {filtered.length > 0 ? (
            filtered.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={openEdit} onDelete={handleDelete} onComplete={handleComplete} onArchive={handleArchive} />
            ))
          ) : (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                <Target size={28} className="text-[#6b7280]" />
              </div>
              <p className="text-sm font-medium text-[#6b7280] mb-1">No objectives found</p>
              <p className="text-xs text-[#4b5563] mb-4">
                {activeTab === 'all'
                  ? 'Add your first objective to start tracking progress.'
                  : `No ${activeTab} objectives yet.`}
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300"
              >
                <Plus size={14} />
                Add Objective
              </button>
            </div>
          )}
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
                <div className="text-sm font-semibold text-white">Build the future of founder tools.</div>
              </div>
              <div className="ml-4 space-y-2">
                {goals.slice(0, 2).map((g) => (
                  <div key={g.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5">
                    <div className="text-[9px] text-[#6b7280] uppercase mb-0.5">{g.category || 'Goal'}</div>
                    <div className="text-xs font-medium text-white truncate">{g.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/goals/archive" className="mt-3 flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors">
              View Full Graph
              <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Critical Milestones */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={12} className="text-[#6b7280]" />
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Critical Milestones</span>
            </div>
            {milestones.length > 0 ? (
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${m.done ? 'bg-green-500' : 'border-2 border-[#2a2a2a]'}`}>
                      {m.done && <Check size={10} className="text-white" />}
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6b7280] mb-0.5">{m.date}</div>
                      <div className="text-xs font-medium text-white">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6b7280]">No upcoming milestones. Add target dates to your goals.</p>
            )}
          </div>

          {/* AI Strategist */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={12} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">AI Strategist</span>
            </div>
            <p className="text-xs text-[#9ca3af] leading-relaxed mb-3">
              {goals.length === 0
                ? "Add goals to receive AI-powered strategic recommendations tailored to your objectives."
                : `You're making progress on ${goals.length} objectives. Focus on completing key results to maintain momentum.`}
            </p>
            <button
              onClick={() => setShowInsights(true)}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
            >
              Get AI Insights
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>

      <GoalFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingGoal(null); }}
        onSubmit={editingGoal ? handleEdit : handleCreate}
        initialGoal={editingGoal}
      />

      <AIInsightsModal
        open={showInsights}
        onClose={() => setShowInsights(false)}
        onGenerate={generateInsights}
        title="AI Strategy Analysis"
        subtitle={activeTab === 'all' ? 'Analyzing all strategic objectives' : `Analyzing ${activeTab} objectives`}
      />
    </div>
  );
}
