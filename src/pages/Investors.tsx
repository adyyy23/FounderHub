import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, LayoutGrid, List, Filter, Plus, Loader as Loader2, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import { investorService, type Investor, type InvestorStage } from '@/services/investors';
import { useToast } from '@/hooks/use-toast';

const stageOrder: InvestorStage[] = ['SOURCED', 'CONTACTED', 'INTERESTED', 'NEGOTIATING'];

const sentimentColors: Record<string, string> = {
  Bullish: 'text-green-400 bg-green-400/10',
  Hot: 'text-orange-400 bg-orange-400/10',
  Neutral: 'text-yellow-400 bg-yellow-400/10',
  Cold: 'text-blue-400 bg-blue-400/10',
};

const allStages: InvestorStage[] = ['SOURCED', 'CONTACTED', 'INTERESTED', 'NEGOTIATING', 'SIGNED', 'PASSED'];
const allSentiments = ['Bullish', 'Hot', 'Neutral', 'Cold'];

function formatAmount(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
}

export default function Investors() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [stats, setStats] = useState({
    total: 0,
    totalCommitment: 0,
    byStage: {} as Record<InvestorStage, number>,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [stageFilter, setStageFilter] = useState<InvestorStage | 'all'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [checkSizeFilter, setCheckSizeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'commitment' | 'name'>('recent');
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [investorData, statsData] = await Promise.all([
        investorService.getAll(),
        investorService.getStats(),
      ]);
      setInvestors(investorData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load investors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await investorService.delete(id);
      toast({ title: 'Investor removed' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to remove investor', variant: 'destructive' });
    }
  };

  const handleEdit = (investor: Investor) => {
    setEditingInvestor(investor);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (data: Partial<Investor>) => {
    if (!editingInvestor) return;
    try {
      await investorService.update(editingInvestor.id, data as any);
      toast({ title: 'Investor updated' });
      setShowEditForm(false);
      setEditingInvestor(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update investor', variant: 'destructive' });
    }
  };

  const filteredInvestors = useMemo(() => {
    let result = [...investors];
    if (stageFilter !== 'all') result = result.filter((i) => i.stage === stageFilter);
    if (sentimentFilter !== 'all') result = result.filter((i) => i.sentiment === sentimentFilter);
    if (checkSizeFilter !== 'all') {
      const ranges: Record<string, [number, number]> = {
        small: [0, 100000],
        medium: [100000, 500000],
        large: [500000, 5000000],
        xlarge: [5000000, Infinity],
      };
      const [min, max] = ranges[checkSizeFilter] || [0, Infinity];
      result = result.filter((i) => (i.commitment || 0) >= min && (i.commitment || 0) <= max);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.firm?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'commitment') result.sort((a, b) => (b.commitment || 0) - (a.commitment || 0));
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [investors, stageFilter, sentimentFilter, checkSizeFilter, searchQuery, sortBy]);

  const getInvestorsByStage = (stage: InvestorStage) => filteredInvestors.filter((inv) => inv.stage === stage);
  const getTotalByStage = (stage: InvestorStage) => getInvestorsByStage(stage).reduce((sum, inv) => sum + (inv.commitment || 0), 0);

  const activeFilters = (stageFilter !== 'all' ? 1 : 0) + (sentimentFilter !== 'all' ? 1 : 0) + (checkSizeFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setStageFilter('all');
    setSentimentFilter('all');
    setCheckSizeFilter('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400">{stats.total > 0 ? 'Active' : 'Empty'}</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Total Pool</div>
          <div className="text-2xl font-bold text-white">{formatAmount(stats.totalCommitment)}</div>
        </div>
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400">+5.4%</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Weighted Forecast</div>
          <div className="text-2xl font-bold text-white">{formatAmount(stats.totalCommitment * 0.43)}</div>
        </div>
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400">+0.8</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Active Velocity</div>
          <div className="text-2xl font-bold text-white">{stats.total > 0 ? (stats.total / 4).toFixed(1) : '0'} / wk</div>
        </div>
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400 bg-[#1e1e1e] px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Closing Probability</div>
          <div className="text-2xl font-bold text-white">{stats.total > 0 ? '68%' : 'N/A'}</div>
        </div>
      </div>

      {/* Pipeline Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Investor Pipeline</h1>
          <p className="text-[#6b7280] text-sm">Strategic management of Seed Round fundraising.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1 gap-1">
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${view === 'board' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
            >
              <LayoutGrid size={13} />
              Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${view === 'table' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
            >
              <List size={13} />
              Table
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 bg-[#161616] border ${activeFilters > 0 ? 'border-orange-500/50 text-orange-400' : 'border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af]'} text-xs font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer`}
          >
            <Filter size={13} />
            Filter
            {activeFilters > 0 && (
              <span className="bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
          <Link
            to="/investors/new"
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            <Plus size={13} />
            Add Investor
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white">Filters & Search</span>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-white transition-colors">
                <X size={11} />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, firm, location..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Stage</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as InvestorStage | 'all')}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Stages</option>
                {allStages.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Sentiment</label>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Sentiments</option>
                {allSentiments.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Check Size</label>
              <select
                value={checkSizeFilter}
                onChange={(e) => setCheckSizeFilter(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Sizes</option>
                <option value="small">Under $100k</option>
                <option value="medium">$100k - $500k</option>
                <option value="large">$500k - $5M</option>
                <option value="xlarge">$5M+</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#1e1e1e]">
            <span className="text-[10px] font-medium text-[#6b7280] uppercase tracking-wider">Sort by:</span>
            {(['recent', 'commitment', 'name'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${sortBy === s ? 'bg-orange-500 text-white' : 'text-[#6b7280] hover:text-white'}`}
              >
                {s === 'recent' ? 'Most Recent' : s === 'commitment' ? 'Commitment' : 'Name'}
              </button>
            ))}
            <span className="ml-auto text-xs text-[#6b7280]">{filteredInvestors.length} of {investors.length} investors</span>
          </div>
        </div>
      )}

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-4 gap-4">
          {stageOrder.map((stage) => {
            const stageInvestors = getInvestorsByStage(stage);
            const stageTotal = getTotalByStage(stage);
            return (
              <div key={stage}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">{stage}</span>
                  <span className="text-[10px] font-bold text-white bg-[#1e1e1e] rounded-full w-5 h-5 flex items-center justify-center">
                    {stageInvestors.length}
                  </span>
                  <span className="text-[10px] text-[#4b5563] ml-auto">{formatAmount(stageTotal)}</span>
                </div>
                <div className="space-y-3">
                  {stageInvestors.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => navigate(`/investors/${inv.id}`)}
                      className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl overflow-hidden cursor-pointer transition-all group"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          {inv.avatar_url ? (
                            <img src={inv.avatar_url} alt={inv.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#1e1e1e]" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border-2 border-[#2a2a2a] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{inv.name.charAt(0)}</span>
                            </div>
                          )}
                          <span className={`text-[10px] font-semibold ${sentimentColors[inv.sentiment] || 'text-gray-400 bg-gray-400/10'} px-2 py-0.5 rounded-full`}>
                            {inv.sentiment}
                          </span>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{inv.name}</div>
                          <div className="text-[11px] text-[#6b7280]">{inv.firm}</div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-[10px] text-[#6b7280] mb-0.5">COMMITMENT</div>
                            <div className="text-base font-bold text-white">{formatAmount(inv.commitment)}</div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(inv); }}
                              className="text-[#4b5563] hover:text-white p-1"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }}
                              className="text-[#4b5563] hover:text-red-400 p-1"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    to={`/investors/new?stage=${stage}`}
                    className="block w-full bg-[#0f0f0f] border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] rounded-2xl p-4 text-center text-[#4b5563] hover:text-[#6b7280] text-xs transition-colors"
                  >
                    <Plus size={13} className="inline mr-1" />
                    Add investor
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Name</th>
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Firm</th>
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Stage</th>
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Sentiment</th>
                <th className="text-right text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Commitment</th>
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Location</th>
                <th className="text-right text-[10px] font-bold text-[#6b7280] uppercase py-3 px-4 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestors.length > 0 ? (
                filteredInvestors.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => navigate(`/investors/${inv.id}`)}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {inv.avatar_url ? (
                          <img src={inv.avatar_url} alt={inv.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                            <span className="text-white font-bold text-xs">{inv.name.charAt(0)}</span>
                          </div>
                        )}
                        <span className="font-medium text-white">{inv.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#9ca3af]">{inv.firm || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">{inv.stage}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold ${sentimentColors[inv.sentiment] || 'text-gray-400 bg-gray-400/10'} px-2 py-0.5 rounded-full`}>{inv.sentiment || '-'}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">{formatAmount(inv.commitment || 0)}</td>
                    <td className="py-3 px-4 text-[#9ca3af]">{inv.location || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(inv); }} className="text-[#4b5563] hover:text-white p-1">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }} className="text-[#4b5563] hover:text-red-400 p-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6b7280] text-sm">
                    No investors match your filters. <button onClick={clearFilters} className="text-orange-400 hover:text-orange-300">Clear filters</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditForm && editingInvestor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowEditForm(false)}>
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Edit Investor</h2>
              <button onClick={() => setShowEditForm(false)} className="text-[#6b7280] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <InvestorEditForm investor={editingInvestor} onSubmit={handleEditSubmit} />
          </div>
        </div>
      )}

      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <span className="cursor-not-allowed opacity-60">Privacy Policy</span>
        <span className="cursor-not-allowed opacity-60">Terms of Service</span>
        <span className="cursor-not-allowed opacity-60">Support</span>
      </footer>
    </div>
  );
}

function InvestorEditForm({ investor, onSubmit }: { investor: Investor; onSubmit: (data: Partial<Investor>) => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: investor.name,
    firm: investor.firm || '',
    email: investor.email || '',
    stage: investor.stage,
    sentiment: investor.sentiment || '',
    commitment: investor.commitment || 0,
    location: investor.location || '',
    notes: investor.notes || '',
    linkedin_url: investor.linkedin_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Name *</label>
        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Firm</label>
          <input value={formData.firm} onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Email</label>
          <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Stage</label>
          <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value as InvestorStage })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
            {allStages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Sentiment</label>
          <select value={formData.sentiment} onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
            <option value="">None</option>
            {allSentiments.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Commitment ($)</label>
          <input type="number" value={formData.commitment} onChange={(e) => setFormData({ ...formData, commitment: parseInt(e.target.value) || 0 })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Location</label>
          <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">LinkedIn URL</label>
        <input value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
      </div>
      <div>
        <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Notes</label>
        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Changes
        </button>
      </div>
    </form>
  );
}
