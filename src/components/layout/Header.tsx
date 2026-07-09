import { Search, Plus, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-[210px] right-0 h-[60px] bg-[#0d0d0d] border-b border-[#1e1e1e] flex items-center px-6 gap-4 z-10">
      {/* Search */}
      <div className="flex-1 max-w-[400px]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input
            type="text"
            placeholder="Search company, investor, metric..."
            className="w-full bg-[#161616] border border-[#1e1e1e] rounded-lg pl-9 pr-4 py-2 text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:border-[#2a2a2a] focus:text-white transition-colors"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg px-4 py-2 text-sm text-white font-medium transition-colors">
          <Plus size={14} />
          Quick Action
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center bg-[#161616] border border-[#1e1e1e] rounded-lg text-[#9ca3af] hover:text-white transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </button>
        <div className="relative">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#2a2a2a]">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#0d0d0d] rounded-full" />
        </div>
      </div>
    </header>
  );
}
