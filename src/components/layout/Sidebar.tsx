import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Target, ChartBar as BarChart2, Lightbulb, Map, Users as Users2, TrendingUp, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

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

interface SidebarProps {
  startupHealth?: number;
  runwayMonths?: number;
}

export default function Sidebar({ startupHealth = 86, runwayMonths = 14 }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  const healthColor = startupHealth >= 80 ? 'text-green-400' : startupHealth >= 60 ? 'text-orange-400' : 'text-red-400';
  const healthLabel = startupHealth >= 80 ? 'Excellent' : startupHealth >= 60 ? 'Good' : 'Needs Attention';

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[210px] bg-[#111111] border-r border-[#1e1e1e] flex flex-col z-20">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2.5 px-5 h-[60px] border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset active:scale-[0.98]"
      >
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">F</span>
        </div>
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-semibold text-[#6b7280] tracking-widest uppercase">Runway</span>
          <span className="text-[10px] font-semibold text-[#9ca3af]">{runwayMonths} MONTHS</span>
        </div>
        <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mb-2.5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            style={{ width: `${Math.min(100, (runwayMonths / 18) * 100)}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className={healthColor} />
          <span className="text-xs font-semibold text-white">Health {startupHealth}</span>
          <span className={cn('ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full', healthColor, 'bg-current/10')}>
            {healthLabel}
          </span>
        </div>
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
