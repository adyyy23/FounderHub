import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, RotateCcw, Trash2, Loader as Loader2, Target } from 'lucide-react';
import { goalService, type Goal } from '@/services/goals';
import { useToast } from '@/hooks/use-toast';

const categoryColors: Record<string, { text: string; bg: string }> = {
  product: { text: 'text-blue-400', bg: 'bg-blue-400/10' },
  growth: { text: 'text-orange-400', bg: 'bg-orange-400/10' },
  operations: { text: 'text-purple-400', bg: 'bg-purple-400/10' },
  default: { text: 'text-gray-400', bg: 'bg-gray-400/10' },
};

export default function GoalArchive() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'completion' | 'title'>('recent');

  useEffect(() => { loadGoals(); }, []);

  const loadGoals = async () => {
    try {
      const data = await goalService.getArchived();
      setGoals(data);
    } catch (err) {
      console.error('Failed to load archived goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await goalService.restore(id);
      toast({ title: 'Goal restored to active' });
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to restore goal', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await goalService.delete(id);
      toast({ title: 'Goal permanently deleted' });
      loadGoals();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete goal', variant: 'destructive' });
    }
  };

  const filteredGoals = useMemo(() => {
    let result = goals.filter((g) => {
      if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (categoryFilter !== 'all' && (g.category || '').toLowerCase() !== categoryFilter) return false;
      return true;
    });
    if (sortBy === 'completion') result.sort((a, b) => b.completion - a.completion);
    else if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [goals, searchQuery, categoryFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <Link to="/goals" className="flex items-center gap-2 text-[#6b7280] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Goals
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Goal Archive</h1>
          <p className="text-[#6b7280] text-sm">Restored or permanently delete archived objectives.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archived goals..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
              <option value="all">All Categories</option>
              <option value="product">Product</option>
              <option value="growth">Growth</option>
              <option value="ops">Operations</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'completion' | 'title')} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
              <option value="recent">Most Recent</option>
              <option value="completion">Completion %</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1e1e1e] text-xs text-[#6b7280]">
          {filteredGoals.length} of {goals.length} archived goals
        </div>
      </div>

      {/* Archived Goals */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-3">
          {filteredGoals.map((goal) => {
            const category = (goal.category || '').toLowerCase();
            const colors = categoryColors[category] || categoryColors.default;
            return (
              <div key={goal.id} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold ${colors.text} ${colors.bg} px-2 py-0.5 rounded uppercase tracking-widest`}>
                        {goal.category || 'GOAL'}
                      </span>
                      <span className="text-[10px] font-bold text-[#6b7280] bg-[#1e1e1e] px-2 py-0.5 rounded-full">ARCHIVED</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{goal.title}</h3>
                    {goal.description && <p className="text-xs text-[#6b7280] mb-2">{goal.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                      <span>Completion: {goal.completion}%</span>
                      {goal.due_date && <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>}
                      <span>Confidence: {goal.confidence || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleRestore(goal.id)}
                      className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <RotateCcw size={12} />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
            <Target size={28} className="text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Archived Goals</h3>
          <p className="text-[#6b7280] text-sm">Archived goals will appear here. Archive goals from the main Goals page to declutter your active list.</p>
        </div>
      )}
    </div>
  );
}
