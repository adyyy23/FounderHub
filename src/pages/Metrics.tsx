import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line
} from 'recharts';
import { Download, Database, RefreshCw, Loader as Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { investorService } from '@/services/investors';
import { goalService } from '@/services/goals';
import { ideaService } from '@/services/ideas';
import { roadmapService } from '@/services/roadmap';
import { teamService } from '@/services/team';
import { useToast } from '@/hooks/use-toast';

type Period = '3M' | '6M' | '1Y';

const sparkData = (seed: number) =>
  Array.from({ length: 7 }, (_, i) => ({ v: Math.sin(i * 0.8 + seed) * 2 + seed * 0.5 + 3 }));

const cohorts = [
  { label: 'Jan 2024', users: 450, retention: [100, 88, 78, 72, 68, 65, 62] },
  { label: 'Feb 2024', users: 520, retention: [100, 82, 75, 70, 66, 62, null] },
  { label: 'Mar 2024', users: 610, retention: [100, 85, 80, 78, 74, null, null] },
  { label: 'Apr 2024', users: 580, retention: [100, 84, 79, 75, null, null, null] },
  { label: 'May 2024', users: 720, retention: [100, 90, 85, null, null, null, null] },
];

function retentionColor(val: number | null): string {
  if (val === null) return 'bg-transparent text-transparent';
  if (val === 100) return 'bg-orange-500 text-white';
  if (val >= 80) return 'bg-orange-500/80 text-white';
  if (val >= 70) return 'bg-orange-500/60 text-white';
  if (val >= 60) return 'bg-orange-500/40 text-white';
  return 'bg-orange-500/20 text-[#9ca3af]';
}

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
};

function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Metrics() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<Period>('6M');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [kpis, setKpis] = useState<{
    totalCommitment: number;
    investorCount: number;
    goalCompletion: number;
    goalCount: number;
    ideaCount: number;
    roadmapCount: number;
    teamCount: number;
    activeGoals: number;
    completedGoals: number;
    avgConfidence: number;
  }>({
    totalCommitment: 0, investorCount: 0, goalCompletion: 0, goalCount: 0,
    ideaCount: 0, roadmapCount: 0, teamCount: 0, activeGoals: 0, completedGoals: 0, avgConfidence: 0,
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const [investorStats, goals, ideas, roadmap, members] = await Promise.all([
        investorService.getStats(),
        goalService.getAll(),
        ideaService.getAll(),
        roadmapService.getAll(),
        teamService.getAll(),
      ]);

      const activeGoals = goals.filter((g) => g.status === 'active');
      const completedGoals = goals.filter((g) => g.status === 'completed');
      const avgCompletion = activeGoals.length > 0
        ? Math.round(activeGoals.reduce((sum, g) => sum + g.completion, 0) / activeGoals.length)
        : 0;
      const confidences = goals.filter((g) => g.confidence);
      const avgConfidence = confidences.length > 0
        ? Math.round((confidences.filter((g) => g.confidence === 'HIGH').length * 100 + confidences.filter((g) => g.confidence === 'MEDIUM').length * 60 + confidences.filter((g) => g.confidence === 'LOW').length * 30) / confidences.length)
        : 0;

      setKpis({
        totalCommitment: investorStats.totalCommitment,
        investorCount: investorStats.total,
        goalCompletion: avgCompletion,
        goalCount: goals.length,
        ideaCount: ideas.length,
        roadmapCount: roadmap.length,
        teamCount: members.length,
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        avgConfidence,
      });
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const [investors, goals, ideas, roadmap, members] = await Promise.all([
        investorService.getAll(),
        goalService.getAll(),
        ideaService.getAll(),
        roadmapService.getAll(),
        teamService.getAll(),
      ]);

      const timestamp = new Date().toISOString().split('T')[0];

      downloadCSV(`founderhub-metrics-${timestamp}.csv`,
        ['Metric', 'Value'],
        [
          ['Total Commitment', formatCurrency(kpis.totalCommitment)],
          ['Active Investors', kpis.investorCount],
          ['Goal Progress (%)', kpis.goalCompletion],
          ['Total Goals', kpis.goalCount],
          ['Active Goals', kpis.activeGoals],
          ['Completed Goals', kpis.completedGoals],
          ['Avg Confidence (%)', kpis.avgConfidence],
          ['Total Ideas', kpis.ideaCount],
          ['Roadmap Items', kpis.roadmapCount],
          ['Team Members', kpis.teamCount],
        ]
      );

      downloadCSV(`founderhub-investors-${timestamp}.csv`,
        ['Name', 'Firm', 'Stage', 'Sentiment', 'Commitment', 'Location', 'Email'],
        investors.map((inv) => [inv.name, inv.firm || '', inv.stage, inv.sentiment || '', inv.commitment || 0, inv.location || '', inv.email || ''])
      );

      downloadCSV(`founderhub-goals-${timestamp}.csv`,
        ['Title', 'Category', 'Status', 'Completion (%)', 'Confidence', 'Due Date'],
        goals.map((g) => [g.title, g.category || '', g.status, g.completion, g.confidence || '', g.due_date || ''])
      );

      downloadCSV(`founderhub-ideas-${timestamp}.csv`,
        ['Title', 'Category', 'Status', 'Impact', 'Confidence', 'Effort'],
        ideas.map((i) => [i.title, i.category || '', i.status, i.impact || 0, i.confidence || 0, i.effort || 0])
      );

      downloadCSV(`founderhub-roadmap-${timestamp}.csv`,
        ['Title', 'Status', 'Priority', 'Progress (%)', 'Start Date', 'End Date', 'Assignee'],
        roadmap.map((r) => [r.title, r.status, r.priority, r.progress, r.start_date || '', r.end_date || '', r.assignee || ''])
      );

      downloadCSV(`founderhub-team-${timestamp}.csv`,
        ['Name', 'Role', 'Department', 'Workload (%)', 'Status', 'Email'],
        members.map((m) => [m.name, m.role || '', m.department || '', m.workload || 0, m.status || 'active', m.email || ''])
      );

      toast({ title: 'CSV export downloaded', description: '6 CSV files exported successfully' });
    } catch (err) {
      console.error('Export failed:', err);
      toast({ title: 'Export failed', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const revenueData = {
    '3M': [
      { month: 'May', arr: Math.max(kpis.totalCommitment * 0.3, 80000), burn: 120000 },
      { month: 'Jun', arr: Math.max(kpis.totalCommitment * 0.35, 100000), burn: 125000 },
      { month: 'Jul', arr: Math.max(kpis.totalCommitment * 0.4, 120000), burn: 128000 },
    ],
    '6M': [
      { month: 'Feb', arr: Math.max(kpis.totalCommitment * 0.2, 60000), burn: 110000 },
      { month: 'Mar', arr: Math.max(kpis.totalCommitment * 0.25, 70000), burn: 112000 },
      { month: 'Apr', arr: Math.max(kpis.totalCommitment * 0.28, 75000), burn: 115000 },
      { month: 'May', arr: Math.max(kpis.totalCommitment * 0.3, 80000), burn: 120000 },
      { month: 'Jun', arr: Math.max(kpis.totalCommitment * 0.35, 100000), burn: 125000 },
      { month: 'Jul', arr: Math.max(kpis.totalCommitment * 0.4, 120000), burn: 128000 },
    ],
    '1Y': [
      { month: 'Jan', arr: Math.max(kpis.totalCommitment * 0.1, 30000), burn: 95000 },
      { month: 'Feb', arr: Math.max(kpis.totalCommitment * 0.2, 60000), burn: 110000 },
      { month: 'Mar', arr: Math.max(kpis.totalCommitment * 0.25, 70000), burn: 112000 },
      { month: 'Apr', arr: Math.max(kpis.totalCommitment * 0.28, 75000), burn: 115000 },
      { month: 'May', arr: Math.max(kpis.totalCommitment * 0.3, 80000), burn: 120000 },
      { month: 'Jun', arr: Math.max(kpis.totalCommitment * 0.35, 100000), burn: 125000 },
      { month: 'Jul', arr: Math.max(kpis.totalCommitment * 0.4, 120000), burn: 128000 },
    ],
  };

  const kpiCards = [
    { label: 'Total Commitment', value: formatCurrency(kpis.totalCommitment), change: kpis.investorCount > 0 ? `${kpis.investorCount} investors` : 'No investors', positive: true, spark: sparkData(1) },
    { label: 'Active Investors', value: kpis.investorCount.toString(), change: kpis.investorCount > 0 ? 'Active' : 'Empty', positive: true, spark: sparkData(2) },
    { label: 'Goal Progress', value: `${kpis.goalCompletion}%`, change: `${kpis.activeGoals} active`, positive: true, spark: sparkData(0.5) },
    { label: 'Total Goals', value: kpis.goalCount.toString(), change: `${kpis.completedGoals} completed`, positive: true, spark: sparkData(3) },
    { label: 'RUNWAY', value: kpis.totalCommitment > 0 ? `${(kpis.totalCommitment / 128000).toFixed(1)}m` : 'N/A', change: kpis.totalCommitment > 0 ? 'Calculated' : 'No data', positive: true, spark: sparkData(2) },
    { label: 'IDEAS', value: kpis.ideaCount.toString(), change: kpis.ideaCount > 0 ? 'Captured' : 'Empty', positive: true, spark: sparkData(3.5) },
    { label: 'ROADMAP', value: kpis.roadmapCount.toString(), change: `${kpis.roadmapCount} items`, positive: true, spark: sparkData(1.5) },
    { label: 'TEAM SIZE', value: kpis.teamCount.toString(), change: kpis.teamCount > 0 ? 'Members' : 'No team', positive: true, spark: sparkData(2.5) },
  ];

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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white leading-none">Telemetry<br />Console</h1>
            <span className="self-start mt-1 flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
              Real-Time
            </span>
          </div>
          <p className="text-[#6b7280] text-sm mt-2">
            Deep-dive startup health metrics, revenue velocity, and long-term cohort retention.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <button onClick={loadMetrics} className="flex items-center gap-2 text-xs text-[#6b7280] bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-2 bg-[#141414] border border-[#1e1e1e] hover:border-orange-500/50 text-orange-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Revenue Console + Efficiency Scorecard */}
      <div className="grid grid-cols-[1fr_280px] gap-5 mb-6">
        {/* Revenue Console */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Console</h3>
              <p className="text-xs text-[#6b7280]">Annual Recurring Revenue vs. Monthly Gross Burn</p>
            </div>
            <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
              {(['3M', '6M', '1Y'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${period === p ? 'bg-[#2a2a2a] text-white' : 'text-[#6b7280] hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData[period]} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="arrFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCurrency} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v)]}
                />
                <Area type="monotone" dataKey="arr" stroke="#f97316" strokeWidth={2} fill="url(#arrFill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Scorecard */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-1">Efficiency Scorecard</h3>
          <p className="text-xs text-[#6b7280] mb-5">Growth vs. Sustainability markers</p>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280] uppercase tracking-wider font-medium">Goal Confidence</span>
                <span className="text-white font-bold text-lg">{kpis.avgConfidence}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${kpis.avgConfidence}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280] uppercase tracking-wider font-medium">Goal Completion</span>
                <span className="text-white font-bold text-lg">{kpis.goalCompletion}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${kpis.goalCompletion}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280] uppercase tracking-wider font-medium">Runway</span>
                <span className="text-white font-bold text-lg">
                  {kpis.totalCommitment > 0 ? `${(kpis.totalCommitment / 128000).toFixed(1)}m` : 'N/A'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (kpis.totalCommitment / 128000 / 18) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Metrics */}
      <h2 className="text-2xl font-bold text-white mb-4">Key Metrics</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">{kpi.label}</span>
              <span className={`text-[10px] font-semibold ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-3">{kpi.value}</div>
            <div className="h-10 -mx-4 -mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.spark} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Line type="monotone" dataKey="v" stroke="#f97316" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Cohort Analysis */}
      <h2 className="text-2xl font-bold text-white mb-4">Cohort Analysis</h2>
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Cohort Explorer</h3>
            <p className="text-xs text-[#6b7280]">User retention analysis by acquisition month</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-2 pr-4 tracking-wider">COHORT</th>
                <th className="text-left text-[10px] font-bold text-[#6b7280] uppercase py-2 pr-4 tracking-wider">USERS</th>
                {['MONTH 0', 'MONTH 1', 'MONTH 2', 'MONTH 3', 'MONTH 4', 'MONTH 5', 'MONTH 6'].map((m) => (
                  <th key={m} className="text-center text-[10px] font-bold text-[#6b7280] uppercase py-2 px-1 tracking-wider">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.label} className="border-b border-[#1a1a1a]">
                  <td className="py-2 pr-4 font-semibold text-white whitespace-nowrap">{cohort.label}</td>
                  <td className="py-2 pr-4 text-[#6b7280]">{cohort.users}</td>
                  {cohort.retention.map((val, i) => (
                    <td key={i} className="py-2 px-1">
                      <div className={`rounded-lg px-2 py-1.5 text-center font-semibold text-[11px] ${retentionColor(val)}`}>
                        {val !== null ? `${val}%` : '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Stack CTA */}
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-[#1e1e1e] rounded-xl flex items-center justify-center flex-shrink-0">
          <Database size={18} className="text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white mb-0.5">Scale your data stack</h3>
          <p className="text-xs text-[#6b7280]">Connect Snowflake, BigQuery, or Redshift for enterprise-grade telemetry.</p>
        </div>
        <Link to="/settings" className="flex-shrink-0 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
          Connect Data Source
        </Link>
      </div>

      <footer className="pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <Link to="/privacy" className="hover:text-[#9ca3af] transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-[#9ca3af] transition-colors">Terms of Service</Link>
        <Link to="/support" className="hover:text-[#9ca3af] transition-colors">Support</Link>
      </footer>
    </div>
  );
}
