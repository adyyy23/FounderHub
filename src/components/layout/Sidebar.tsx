import { LayoutDashboard, MessageSquare, Users, Target, BarChart2, Lightbulb, Map, Users2, TrendingUp, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

type Page = 'dashboard' | 'advisor' | 'investors' | 'investor-profile' | 'goals' | 'metrics' | 'ideas' | 'roadmap' | 'team';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'advisor' as Page, label: 'AI Advisor', icon: MessageSquare },
  { id: 'investors' as Page, label: 'Investors', icon: Users },
  { id: 'goals' as Page, label: 'Goals', icon: Target },
  { id: 'metrics' as Page, label: 'Metrics', icon: BarChart2 },
  { id: 'ideas' as Page, label: 'Ideas', icon: Lightbulb },
  { id: 'roadmap' as Page, label: 'Roadmap', icon: Map },
  { id: 'team' as Page, label: 'Team', icon: Users2 },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[210px] bg-[#111111] border-r border-[#1e1e1e] flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-[#1e1e1e]">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="text-white font-semibold text-[15px] tracking-tight">FounderHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id || (activePage === 'investor-profile' && id === 'investors');
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-[#1e1e1e] text-white'
                  : 'text-[#6b7280] hover:text-[#9ca3af] hover:bg-[#161616]'
              )}
            >
              <Icon size={16} className={isActive ? 'text-orange-400' : ''} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Runway Widget */}
      <div className="mx-3 mb-3 p-3 bg-[#161616] rounded-xl border border-[#1e1e1e]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-semibold text-[#6b7280] tracking-widest uppercase">Runway</span>
          <span className="text-[10px] font-semibold text-[#9ca3af]">14 MONTHS</span>
        </div>
        <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mb-2.5">
          <div className="h-full w-[70%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-green-400" />
          <span className="text-xs font-semibold text-white">Health 86</span>
          <span className="ml-auto text-[10px] font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Excellent</span>
        </div>
      </div>

      {/* Collapse button */}
      <button className="flex items-center gap-2 px-5 py-3 text-[#6b7280] hover:text-[#9ca3af] text-xs border-t border-[#1e1e1e] transition-colors">
        <ChevronLeft size={14} />
      </button>
    </aside>
  );
}
