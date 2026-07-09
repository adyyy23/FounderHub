import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, LayoutGrid, List, Filter, Plus, Loader as Loader2 } from 'lucide-react';
import { investorService, type Investor, type InvestorStage } from '@/services/investors';

const stageOrder: InvestorStage[] = ['SOURCED', 'CONTACTED', 'INTERESTED', 'NEGOTIATING'];

const sentimentColors: Record<string, string> = {
  'Bullish': 'text-green-400 bg-green-400/10',
  'Hot': 'text-orange-400 bg-orange-400/10',
  'Neutral': 'text-yellow-400 bg-yellow-400/10',
  'Cold': 'text-blue-400 bg-blue-400/10',
};

export default function Investors() {
  const navigate = useNavigate();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [stats, setStats] = useState({
    total: 0,
    totalCommitment: 0,
    byStage: {} as Record<InvestorStage, number>,
  });

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

  const getInvestorsByStage = (stage: InvestorStage) => {
    return investors.filter((inv) => inv.stage === stage);
  };

  const getTotalByStage = (stage: InvestorStage) => {
    const stageInvestors = getInvestorsByStage(stage);
    return stageInvestors.reduce((sum, inv) => sum + (inv.commitment || 0), 0);
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

  return (
    <div className="p-8 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div key="total" className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400">+12%</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Total Pool</div>
          <div className="text-2xl font-bold text-white">{formatAmount(stats.totalCommitment)}</div>
        </div>
        <div key="forecast" className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400">+5.4%</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Weighted Forecast</div>
          <div className="text-2xl font-bold text-white">{formatAmount(stats.totalCommitment * 0.43)}</div>
        </div>
        <div key="velocity" className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-green-400">+0.8</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Active Velocity</div>
          <div className="text-2xl font-bold text-white">2.4 / wk</div>
        </div>
        <div key="probability" className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={18} className="text-orange-400" />
            <span className="text-[10px] font-medium text-[#6b7280] bg-[#1e1e1e] px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <div className="text-[11px] text-[#6b7280] mb-1">Closing Probability</div>
          <div className="text-2xl font-bold text-white">68%</div>
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
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${view === 'board' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
            >
              <LayoutGrid size={13} />
              Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${view === 'table' ? 'bg-[#1e1e1e] text-white' : 'text-[#6b7280] hover:text-white'}`}
            >
              <List size={13} />
              Table
            </button>
          </div>
          <button className="flex items-center gap-1.5 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] text-xs font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
            <Filter size={13} />
            Filter
          </button>
          <Link
            to="/investors/new"
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]"
          >
            <Plus size={13} />
            Add Investor
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {stageOrder.map((stage) => {
          const stageInvestors = getInvestorsByStage(stage);
          const stageTotal = getTotalByStage(stage);

          return (
            <div key={stage}>
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">{stage}</span>
                <span className="text-[10px] font-bold text-white bg-[#1e1e1e] rounded-full w-5 h-5 flex items-center justify-center">
                  {stageInvestors.length}
                </span>
                <span className="text-[10px] text-[#4b5563] ml-auto">{formatAmount(stageTotal)}</span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {stageInvestors.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => navigate(`/investors/${inv.id}`)}
                    className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]"
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/investors/${inv.id}`)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        {inv.avatar_url ? (
                          <img
                            src={inv.avatar_url}
                            alt={inv.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#1e1e1e]"
                          />
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
                        <div className="text-right">
                          <div className="text-[10px] text-green-400 font-medium">ACTIVE</div>
                          <div className="text-[10px] text-[#6b7280]">{inv.last_contact_date ? 'Recently' : 'New'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add card */}
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

      {/* Footer */}
      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280]">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280]">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280]">Support</a>
      </footer>
    </div>
  );
}
