import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useEffect, useState } from 'react';
import { LayoutDashboard, MessageSquare, Users, Target, ChartBar as BarChart2, Lightbulb, Map, Users as Users2, TrendingUp, Settings, LogOut, Loader as Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { investorService } from '@/services/investors';
import { goalService } from '@/services/goals';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'advisor', label: 'AI Advisor', icon: MessageSquare, path: '/advisor' },
  { id: 'investors', label: 'Investors', icon: Users, path: '/investors' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
  { id: 'metrics', label: 'Metrics', icon: BarChart2, path: '/metrics' },
  { id: 'ideas', label: 'Ideas', icon: Lightbulb, path: '/ideas' },
  { id: 'roadmap', label: 'Roadmap', icon: Map, path: '/roadmap' },
  { id: 'team', label: 'Team', icon: Users2, path: '/team' },
];

const MONTHLY_BURN = 128000;

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [runwayMonths, setRunwayMonths] = useState<number | null>(null);
  const [startupHealth, setStartupHealth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const [investorStats, goals] = await Promise.all([
        investorService.getStats(),
        goalService.getAll(),
      ]);

      const runway = investorStats.totalCommitment > 0
        ? investorStats.totalCommitment / MONTHLY_BURN
        : 0;
      setRunwayMonths(Math.round(runway * 10) / 10);

      const activeGoals = goals.filter((g) => g.status === 'active');
      const avgCompletion = activeGoals.length > 0
        ? Math.round(activeGoals.reduce((sum, g) => sum + g.completion, 0) / activeGoals.length)
        : 0;

      let health = 50;
      health += Math.min(30, avgCompletion * 0.3);
      health += Math.min(20, investorStats.total * 2);
      health = Math.min(100, Math.round(health));
      setStartupHealth(health);
    } catch {
      setRunwayMonths(0);
      setStartupHealth(50);
    } finally {
      setLoading(false);
    }
  };

  const health = startupHealth ?? 86;
  const runway = runwayMonths ?? 14;
  const healthColor = health >= 80 ? 'text-green-400' : health >= 60 ? 'text-orange-400' : 'text-red-400';
  const healthLabel = health >= 80 ? 'Excellent' : health >= 60 ? 'Good' : 'Needs Attention';

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[210px] bg-[#111111] border-r border-[#1e1e1e] flex flex-col z-20">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2.5 px-5 h-[60px] border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset active:scale-[0.98]"
      >
        <Logo size={32} showText={false} />
        <span className="text-white font-semibold text-[15px] tracking-tight">FounderHub</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={id}
              to={path}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]',
                isActive
                  ? 'bg-[#1e1e1e] text-white'
                  : 'text-[#6b7280] hover:text-white hover:bg-[#161616]'
              )}
            >
              <Icon size={16} className={cn('transition-colors', isActive ? 'text-orange-400' : 'group-hover:text-orange-400')} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Runway Widget */}
      <div className="mx-3 mb-3 p-3 bg-[#161616] rounded-xl border border-[#1e1e1e]">
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 size={14} className="text-[#6b7280] animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-semibold text-[#6b7280] tracking-widest uppercase">Runway</span>
              <span className="text-[10px] font-semibold text-[#9ca3af]">{runway > 0 ? `${runway} MONTHS` : 'N/A'}</span>
            </div>
            <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mb-2.5">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                style={{ width: `${Math.min(100, (runway / 18) * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className={healthColor} />
              <span className="text-xs font-semibold text-white">Health {health}</span>
              <span className={cn('ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full', healthColor, 'bg-current/10')}>
                {healthLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-3 pb-3 space-y-1">
        <Link
          to="/settings"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]',
            location.pathname === '/settings'
              ? 'bg-[#1e1e1e] text-white'
              : 'text-[#6b7280] hover:text-white hover:bg-[#161616]'
          )}
        >
          <Settings size={16} />
          <span className="font-medium">Settings</span>
        </Link>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#6b7280] hover:text-red-400 hover:bg-[#161616] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]"
        >
          <LogOut size={16} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
