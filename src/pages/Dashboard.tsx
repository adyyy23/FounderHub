import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Zap, Users, Activity, Loader as Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { investorService, type Investor } from '@/services/investors';
import { activityService, type ActivityLog } from '@/services/activity';
import { goalService, type Goal } from '@/services/goals';
import { useAuth } from '@/contexts/AuthContext';

interface GrowthData {
  month: string;
  arr: number;
  target: number;
}

const mockGrowthData: GrowthData[] = [
  { month: 'Jan', arr: 800000, target: 1000000 },
  { month: 'Feb', arr: 1100000, target: 1500000 },
  { month: 'Mar', arr: 1600000, target: 2000000 },
  { month: 'Apr', arr: 2200000, target: 2800000 },
  { month: 'May', arr: 3200000, target: 3500000 },
  { month: 'Jun', arr: 4200000, target: 4500000 },
];

const formatCurrency = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
};

export default function Dashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState({
    totalCommitment: 0,
    investorCount: 0,
    goalCompletion: 0,
    activityCount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [investorData, activityData, goalData, investorStats] = await Promise.all([
        investorService.getAll(),
        activityService.getRecent(10),
        goalService.getAll(),
        investorService.getStats(),
      ]);

      const topInvestors = investorData
        .filter((inv) => inv.commitment && inv.commitment > 0)
        .sort((a, b) => (b.commitment || 0) - (a.commitment || 0))
        .slice(0, 3);

      setInvestors(topInvestors);
      setActivities(activityData);
      setGoals(goalData);
      setStats({
        totalCommitment: investorStats.totalCommitment,
        investorCount: investorStats.total,
        goalCompletion: goalData.length > 0
          ? Math.round(goalData.reduce((sum, g) => sum + g.completion, 0) / goalData.length)
          : 0,
        activityCount: activityData.length,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  const healthScore = Math.min(100, Math.round(70 + stats.goalCompletion * 0.3));
  const topGoal = goals.find((g) => g.status !== 'archived') || goals[0];

  return (
    <div className="p-8 min-h-screen">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Mission Control</h1>
            <span className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
              Live Telemetry
            </span>
          </div>
          <p className="text-[#6b7280] text-sm">
            Welcome back, {profile?.full_name || 'Founder'}. The operating status for FounderHub is currently{' '}
            <span className="text-orange-400 font-medium">Optimal</span>.
          </p>
        </div>
        <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1">
          <button className="bg-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-md">Variant A</button>
          <button className="text-[#6b7280] text-xs font-semibold px-4 py-1.5 rounded-md hover:text-white transition-colors">Variant B</button>
        </div>
      </div>

      {/* Health + Metrics Panel */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-[auto_1fr_1fr] gap-8 items-center">
          {/* Health Circle */}
          <div className="flex flex-col items-center justify-center w-40 h-40 relative">
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1e1e1e" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="#f97316" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50 * (healthScore / 100)} ${2 * Math.PI * 50}`}
              />
            </svg>
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold text-white">{healthScore}</div>
              <div className="text-[10px] text-[#6b7280] uppercase tracking-widest mt-0.5">STARTUP HEALTH</div>
            </div>
            <div className="absolute -bottom-1 flex items-center gap-1 text-green-400 text-xs font-medium">
              <TrendingUp size={11} />
              +4% this week
            </div>
          </div>

          {/* Left metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Total Commitment</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalCommitment)}</div>
              <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                <TrendingUp size={11} />
                <span>{stats.investorCount} investors</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Goal Progress</div>
              <div className="text-2xl font-bold text-white">{stats.goalCompletion}%</div>
              <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                <TrendingUp size={11} />
                <span>{goals.length} goals</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Active Investors</div>
              <div className="text-2xl font-bold text-white">{stats.investorCount}</div>
              <div className="flex items-center gap-1 text-blue-400 text-xs mt-1">
                <Users size={11} />
                <span>in pipeline</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-1">Recent Activity</div>
              <div className="text-2xl font-bold text-white">{stats.activityCount}</div>
              <div className="flex items-center gap-1 text-orange-400 text-xs mt-1">
                <Activity size={11} />
                <span>updates</span>
              </div>
            </div>
          </div>

          {/* Right placeholder for balance */}
          <div />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-[1fr_1fr_320px] gap-5 mb-6">
        {/* Strategic Advisor */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Strategic Advisor</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">Refining Growth Efficiency</h3>
          <p className="text-[#6b7280] text-sm leading-relaxed mb-4">
            {topGoal
              ? `Focus on "${topGoal.title}" - currently at ${topGoal.completion}% completion.`
              : 'Add your first goal to start tracking progress and receive AI-powered insights.'}
          </p>
          <Link
            to="/goals"
            className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {topGoal ? 'View All Goals' : 'Add Goal'}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Top Investor */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Top Investor</span>
            {investors[0] && (
              <span className="text-[10px] font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                {investors[0].stage}
              </span>
            )}
          </div>
          {investors[0] ? (
            <>
              <Link to={`/investors/${investors[0].id}`} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                {investors[0].avatar_url ? (
                  <img src={investors[0].avatar_url} alt={investors[0].name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{investors[0].name.charAt(0)}</span>
                  </div>
                )}
                <span className="text-white font-semibold">{investors[0].name}</span>
              </Link>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[10px] text-[#6b7280] mb-1">COMMITTED</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(investors[0].commitment || 0)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6b7280] mb-1">FIRM</div>
                  <div className="text-xl font-bold text-white truncate">{investors[0].firm || '-'}</div>
                </div>
              </div>
              {investors[0].notes?.[0] && (
                <p className="text-[#6b7280] text-xs italic">"{investors[0].notes[0].slice(0, 60)}..."</p>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#6b7280] text-sm mb-3">No investors in pipeline yet</p>
              <Link
                to="/investors"
                className="text-orange-400 text-xs font-medium hover:text-orange-300"
              >
                Add your first investor
              </Link>
            </div>
          )}
        </div>

        {/* Key Investors */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Key Investors</span>
            <Link to="/investors" className="text-orange-400 text-xs font-medium hover:text-orange-300 transition-colors">
              View All
            </Link>
          </div>
          {investors.length > 0 ? (
            <div className="space-y-3">
              {investors.map((inv) => (
                <Link key={inv.id} to={`/investors/${inv.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  {inv.avatar_url ? (
                    <img src={inv.avatar_url} alt={inv.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{inv.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{inv.name}</div>
                    <div className="text-xs text-[#6b7280]">{inv.firm}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{formatCurrency(inv.commitment || 0)}</div>
                    <div className="text-[10px] text-[#6b7280]">{inv.stage}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#6b7280] text-xs">Add investors to see them here</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Growth Timeline */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-base font-bold text-white">Growth Timeline</h3>
              <p className="text-[#6b7280] text-xs">Net ARR growth vs. board-level targets (USD)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6b7280]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                ARR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Target
              </span>
            </div>
          </div>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockGrowthData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => formatCurrency(v)}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: 12 }}
                  formatter={(value: number) => [formatCurrency(value)]}
                />
                <Area type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={1.5} fill="url(#targetGradient)" dot={false} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="arr" stroke="#f97316" strokeWidth={2} fill="url(#arrGradient)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mission Updates */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} className="text-orange-400" />
            <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Mission Updates</span>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 4).map((activity) => {
                const iconType = activity.action.includes('created') ? 'success' : activity.action.includes('stage') ? 'action' : 'info';
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div className={`w-7 h-7 rounded-lg ${iconType === 'success' ? 'bg-green-400/10' : iconType === 'action' ? 'bg-orange-400/10' : 'bg-blue-400/10'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Activity size={13} className={iconType === 'success' ? 'text-green-400' : iconType === 'action' ? 'text-orange-400' : 'text-blue-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">{activity.action}</span>
                        <span className="text-[10px] text-[#6b7280] ml-auto flex-shrink-0">
                          {formatTimeAgo(activity.created_at)}
                        </span>
                      </div>
                      {activity.details && 'title' in activity.details && typeof activity.details.title === 'string' && (
                        <p className="text-[11px] text-[#6b7280] leading-relaxed truncate">{activity.details.title as string}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-[#6b7280] text-xs">No recent activity</p>
            </div>
          )}
          <Link to="/roadmap" className="mt-4 text-xs text-[#6b7280] hover:text-white flex items-center gap-1.5 transition-colors">
            View full activity log
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Bottom Nav Icons */}
      <div className="mt-6 flex items-center gap-4">
        <Link to="/roadmap" className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl py-3 flex flex-col items-center gap-1 text-[#6b7280] hover:text-white transition-colors">
          <span className="text-xs font-medium">ROADMAP</span>
        </Link>
        <Link to="/metrics" className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-xl py-3 flex flex-col items-center gap-1 text-[#6b7280] hover:text-white transition-colors">
          <span className="text-xs font-medium">METRICS</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <a href="#" className="hover:text-[#6b7280] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#6b7280] transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-[#6b7280] transition-colors">Support</a>
      </footer>
    </div>
  );
}
