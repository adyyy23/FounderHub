import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit2, Trash2, Zap, Loader as Loader2, Sparkles, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';
import { ideaService, type Idea } from '@/services/ideas';
import { useToast } from '@/hooks/use-toast';
import AIInsightsModal from '@/components/AIInsightsModal';
import { generateIdeaInsights, type AIAnalysisResult } from '@/lib/aiInsights';
import { useCallback } from 'react';

const statusColors: Record<string, string> = {
  backlog: 'bg-gray-400',
  scoping: 'bg-yellow-400',
  validation: 'bg-orange-400',
  ready: 'bg-blue-400',
  in_progress: 'bg-green-400',
  completed: 'bg-emerald-400',
};

const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  scoping: 'Scoping',
  validation: 'Validation',
  ready: 'Ready',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function IdeaSpec() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [, setShowEdit] = useState(false);

  useEffect(() => {
    if (id) loadIdea(id);
  }, [id]);

  const loadIdea = async (ideaId: string) => {
    try {
      const data = await ideaService.getAll();
      const found = data.find((i) => i.id === ideaId);
      if (found) setIdea(found);
    } catch (err) {
      console.error('Failed to load idea:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!idea) return;
    try {
      await ideaService.delete(idea.id);
      toast({ title: 'Idea deleted' });
      navigate('/ideas');
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete idea', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!idea) return;
    try {
      await ideaService.update(idea.id, { status: newStatus as Idea['status'] });
      toast({ title: `Status updated to ${statusLabels[newStatus] || newStatus}` });
      loadIdea(idea.id);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const generateInsights = useCallback(async (): Promise<AIAnalysisResult> => {
    await new Promise((r) => setTimeout(r, 1200));
    return generateIdeaInsights(idea ? [idea] : []);
  }, [idea]);

  const priorityScore = idea ? Math.round(((idea.impact || 0) * (idea.confidence || 0)) / (idea.effort || 1) * 10) : 0;
  const riskLevel = idea ? (idea.confidence || 0) < 4 ? 'High' : (idea.confidence || 0) < 7 ? 'Medium' : 'Low' : 'N/A';
  const riskColor = riskLevel === 'High' ? 'text-red-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-[#4b5563] mb-4" />
        <p className="text-white text-lg font-medium mb-2">Idea not found</p>
        <Link to="/ideas" className="text-orange-400 hover:text-orange-300 text-sm">Back to Ideas</Link>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen max-w-4xl mx-auto">
      <Link to="/ideas" className="flex items-center gap-2 text-[#6b7280] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Ideas
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
              {idea.category}
            </span>
            <span className={`w-2 h-2 rounded-full ${statusColors[idea.status] || statusColors.backlog}`} />
            <span className="text-[10px] text-[#6b7280]">{statusLabels[idea.status] || idea.status}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{idea.title}</h1>
          <p className="text-[#6b7280] text-sm">{idea.description || 'No description provided.'}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setShowInsights(true)}
            className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-orange-500/50 text-[#9ca3af] hover:text-orange-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Sparkles size={12} /> AI Insights
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Edit2 size={12} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-red-500/50 text-[#9ca3af] hover:text-red-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>

      {/* AI Priority Score */}
      <div className="bg-gradient-to-r from-[#1a1008] via-[#1e1208] to-[#141414] border border-orange-900/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-orange-400" />
          <h2 className="text-lg font-bold text-white">AI Priority Assessment</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-[#6b7280] uppercase tracking-widest mb-1">Priority Score</div>
            <div className="text-3xl font-bold text-orange-400">{priorityScore}</div>
            <div className="text-[10px] text-[#6b7280] mt-1">out of 100</div>
          </div>
          <div>
            <div className="text-[10px] text-[#6b7280] uppercase tracking-widest mb-1">Risk Level</div>
            <div className={`text-2xl font-bold ${riskColor}`}>{riskLevel}</div>
            <div className="text-[10px] text-[#6b7280] mt-1">based on confidence</div>
          </div>
          <div>
            <div className="text-[10px] text-[#6b7280] uppercase tracking-widest mb-1">Impact / Effort</div>
            <div className="text-2xl font-bold text-white">{idea.impact || 0} / {idea.effort || 0}</div>
            <div className="text-[10px] text-[#6b7280] mt-1">ratio: {((idea.impact || 0) / (idea.effort || 1)).toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#6b7280] uppercase tracking-widest mb-1">Recommendation</div>
            <div className="text-sm font-bold text-white">
              {priorityScore >= 60 ? 'Execute Now' : priorityScore >= 30 ? 'Scope Further' : 'Hold'}
            </div>
            <div className="text-[10px] text-[#6b7280] mt-1">
              {priorityScore >= 60 ? 'High value, low effort' : priorityScore >= 30 ? 'Needs validation' : 'Low priority'}
            </div>
          </div>
        </div>
      </div>

      {/* Specification Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Scoring Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280] uppercase tracking-wider">Impact</span>
                <span className="text-white font-bold">{idea.impact || 0}/10</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(idea.impact || 0) * 10}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280] uppercase tracking-wider">Confidence</span>
                <span className="text-white font-bold">{idea.confidence || 0}/10</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(idea.confidence || 0) * 10}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280] uppercase tracking-wider">Effort</span>
                <span className="text-white font-bold">{idea.effort || 0}/10</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(idea.effort || 0) * 10}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Status Management</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Current Status</label>
              <select
                value={idea.status}
                onChange={(e) => handleStatusChange(e.target.value)}
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
            <div className="pt-3 border-t border-[#1e1e1e]">
              <div className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-2">Created</div>
              <div className="text-xs text-white">{new Date(idea.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-orange-400" />
          <h3 className="text-sm font-bold text-white">AI Strategic Recommendations</h3>
        </div>
        <div className="space-y-3">
          {priorityScore >= 60 && (
            <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-xl p-3">
              <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Execute Immediately</div>
                <div className="text-xs text-[#9ca3af]">This idea has a high priority score of {priorityScore}. Move it to "Ready" status and schedule execution this sprint for maximum impact.</div>
              </div>
            </div>
          )}
          {riskLevel === 'High' && (
            <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Validate Before Committing</div>
                <div className="text-xs text-[#9ca3af]">Confidence is low ({idea.confidence}/10). Run a 1-week validation sprint with customer interviews to increase confidence before allocating resources.</div>
              </div>
            </div>
          )}
          {(idea.effort || 0) >= 7 && (idea.impact || 0) >= 7 && (
            <div className="flex items-start gap-3 bg-orange-500/5 border border-orange-500/20 rounded-xl p-3">
              <Zap size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Break Into Smaller Experiments</div>
                <div className="text-xs text-[#9ca3af]">This is a high-effort, high-impact idea. Break it into 3-4 smaller experiments to validate assumptions before committing full resources.</div>
              </div>
            </div>
          )}
          {priorityScore < 30 && (
            <div className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Low Priority — Hold for Now</div>
                <div className="text-xs text-[#9ca3af]">This idea has a low priority score. Keep it in the backlog and revisit when resources allow or when impact/confidence scores improve.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AIInsightsModal
        open={showInsights}
        onClose={() => setShowInsights(false)}
        onGenerate={generateInsights}
        title="AI Idea Analysis"
        subtitle={`Strategic analysis of "${idea.title}"`}
      />
    </div>
  );
}
