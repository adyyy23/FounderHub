import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, MessageSquare, Calendar, Zap, Loader as Loader2, CreditCard as Edit2, Trash2, Sparkles, X } from 'lucide-react';
import { teamService, taskService, type TeamMember, type Task } from '@/services/team';
import { useToast } from '@/hooks/use-toast';
import AIInsightsModal from '@/components/AIInsightsModal';
import { generateTeamInsights, type AIAnalysisResult } from '@/lib/aiInsights';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const hours = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];

const heatmapData: number[][] = [
  [3, 4, 3, 5, 4, 2, 1],
  [4, 5, 4, 4, 3, 2, 1],
  [3, 4, 5, 4, 4, 3, 1],
  [2, 4, 4, 5, 4, 4, 2],
  [2, 3, 3, 4, 5, 4, 2],
  [1, 2, 3, 3, 4, 4, 2],
  [1, 1, 2, 2, 2, 2, 1],
];

const heatColor = (v: number) => {
  if (v >= 5) return 'bg-orange-500';
  if (v >= 4) return 'bg-orange-400/80';
  if (v >= 3) return 'bg-orange-400/50';
  if (v >= 2) return 'bg-orange-400/25';
  return 'bg-[#1e1e1e]';
};

const deptColors: Record<string, string> = {
  product: 'text-blue-400 bg-blue-400/10',
  engineering: 'text-blue-400 bg-blue-400/10',
  design: 'text-purple-400 bg-purple-400/10',
  creative: 'text-purple-400 bg-purple-400/10',
  marketing: 'text-green-400 bg-green-400/10',
  growth: 'text-green-400 bg-green-400/10',
  ops: 'text-orange-400 bg-orange-400/10',
  operations: 'text-orange-400 bg-orange-400/10',
  infra: 'text-yellow-400 bg-yellow-400/10',
  default: 'text-gray-400 bg-gray-400/10',
};


function LoadCircle({ pct, overloaded }: { pct: number; overloaded: boolean }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  const color = overloaded ? '#ef4444' : pct >= 80 ? '#f97316' : '#22c55e';
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#2a2a2a" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-white leading-none">{pct}%</span>
        <span className="text-[8px] text-[#6b7280] leading-none">LOAD</span>
      </div>
    </div>
  );
}

const statusDot: Record<string, string> = {
  online: 'bg-green-400',
  busy: 'bg-yellow-400',
  overloaded: 'bg-red-400',
  offline: 'bg-gray-400',
};

interface TeamMemberFormData {
  name: string;
  role: string;
  department: string;
  email: string;
  avatar_url: string;
  workload: number;
  status: 'active' | 'inactive' | 'on_leave';
  skills: string[];
}

function TeamMemberFormDialog({
  open,
  onClose,
  onSubmit,
  initialMember,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TeamMemberFormData) => Promise<void>;
  initialMember?: TeamMember | null;
}) {
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    role: '',
    department: '',
    email: '',
    avatar_url: '',
    workload: 50,
    status: 'active',
    skills: [],
  });

  useEffect(() => {
    if (initialMember) {
      setFormData({
        name: initialMember.name,
        role: initialMember.role || '',
        department: initialMember.department || '',
        email: initialMember.email || '',
        avatar_url: initialMember.avatar_url || '',
        workload: initialMember.workload || 50,
        status: initialMember.status || 'active',
        skills: ((initialMember as unknown) as Record<string, unknown>).skills as string[] || [],
      });
    } else {
      setFormData({ name: '', role: '', department: '', email: '', avatar_url: '', workload: 50, status: 'active', skills: [] });
    }
  }, [initialMember, open]);

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{initialMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Role</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Senior Engineer"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">Select department</option>
                <option value="engineering">Engineering</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="growth">Growth</option>
                <option value="operations">Operations</option>
                <option value="infra">Infra</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@founderhub.com"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Avatar URL</label>
            <Input
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://..."
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Workload (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.workload}
                onChange={(e) => setFormData({ ...formData, workload: parseInt(e.target.value) || 0 })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'on_leave' })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Skills</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              />
              <Button type="button" onClick={addSkill} className="bg-[#1e1e1e] hover:bg-[#252525] text-white border border-[#2a2a2a]">
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1 text-xs text-[#9ca3af] bg-[#1e1e1e] border border-[#2a2a2a] px-2 py-1 rounded-full">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-[#4b5563] hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-400 text-white">
              {loading ? <Loader2 size={16} className="animate-spin" /> : initialMember ? 'Save Changes' : 'Add Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Team() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'workload' | 'department'>('name');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, tasksData] = await Promise.all([
        teamService.getAll(),
        taskService.getAll(),
      ]);
      setMembers(membersData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: TeamMemberFormData) => {
    try {
      await teamService.create({
        name: data.name,
        role: data.role || undefined,
        department: data.department || undefined,
        email: data.email || undefined,
        avatar_url: data.avatar_url || undefined,
        workload: data.workload,
      });
      toast({ title: 'Team member added successfully' });
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to add team member', variant: 'destructive' });
    }
  };

  const handleEdit = async (data: TeamMemberFormData) => {
    if (!editingMember) return;
    try {
      await teamService.update(editingMember.id, {
        name: data.name,
        role: data.role || undefined,
        department: data.department || undefined,
        email: data.email || undefined,
        avatar_url: data.avatar_url || undefined,
        workload: data.workload,
      });
      toast({ title: 'Team member updated successfully' });
      setShowForm(false);
      setEditingMember(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update team member', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await teamService.delete(id);
      toast({ title: 'Team member removed' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to remove team member', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (member: TeamMember, status: 'active' | 'inactive' | 'on_leave') => {
    try {
      await teamService.update(member.id, { status });
      toast({ title: `Status updated to ${status.replace('_', ' ')}` });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const generateInsights = useCallback(async (): Promise<AIAnalysisResult> => {
    await new Promise((r) => setTimeout(r, 1200));
    return generateTeamInsights(members, tasks);
  }, [members, tasks]);

  const filteredMembers = members.filter((m) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.role?.toLowerCase().includes(q)) return false;
    }
    if (deptFilter !== 'all' && (m.department || '').toLowerCase() !== deptFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'workload') return (b.workload || 0) - (a.workload || 0);
    if (sortBy === 'department') return (a.department || '').localeCompare(b.department || '');
    return a.name.localeCompare(b.name);
  });
  const activeFilters = (deptFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);
  const clearFilters = () => { setDeptFilter('all'); setStatusFilter('all'); setSearchQuery(''); };

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent').slice(0, 6);

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || 'Unassigned';
  };

  const deptCounts = members.reduce((acc, m) => {
    const dept = m.department?.toLowerCase() || 'default';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resources = Object.entries(deptCounts).slice(0, 3).map(([dept, count]) => ({
    label: dept.toUpperCase(),
    pct: Math.min(100, Math.round((count / members.length) * 100 + Math.random() * 30)),
    color: dept === 'engineering' || dept === 'product' ? 'bg-orange-500' :
           dept === 'marketing' || dept === 'growth' ? 'bg-blue-500' : 'bg-purple-500',
  }));

  const overloadedMember = members.find((m) => (m.workload || 0) >= 90);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Workspace</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Operations Hub</h1>
              <p className="text-[#6b7280] text-sm max-w-sm">
                Manage team capacity, track critical output, and optimize execution velocity.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setShowInsights(true)}
                className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-orange-500/50 text-[#9ca3af] hover:text-orange-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                <Sparkles size={12} />
                AI Insights
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 bg-[#161616] border ${activeFilters > 0 ? 'border-orange-500/50 text-orange-400' : 'border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af]'} text-xs font-medium px-3 py-2 rounded-lg transition-colors`}
              >
                <Filter size={12} />
                Filter
                {activeFilters > 0 && (
                  <span className="bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>
                )}
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={13} />
                Invite Talent
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a member or team lead..."
              className="w-full bg-[#141414] border border-[#1e1e1e] rounded-xl pl-10 pr-4 py-3 text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-white">Filters</span>
                {activeFilters > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-white transition-colors">
                    <X size={11} /> Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Department</label>
                  <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                    <option value="all">All Departments</option>
                    <option value="engineering">Engineering</option>
                    <option value="product">Product</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="growth">Growth</option>
                    <option value="operations">Operations</option>
                    <option value="infra">Infra</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'workload' | 'department')} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                    <option value="name">Name</option>
                    <option value="workload">Workload</option>
                    <option value="department">Department</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#1e1e1e] text-xs text-[#6b7280]">{filteredMembers.length} of {members.length} members</div>
            </div>
          )}

          {/* Team Grid */}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredMembers.map((m) => {
                const dept = m.department?.toLowerCase() || 'default';
                const deptStyle = deptColors[dept] || deptColors.default;
                const isOverloaded = (m.workload || 0) >= 90;
                const status = isOverloaded ? 'overloaded' : (m.workload || 0) >= 80 ? 'busy' : 'online';
                const memberSkills = ((m as unknown) as Record<string, unknown>).skills as string[] || [];

                return (
                  <div key={m.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl p-4 transition-colors group">
                    <div className="flex items-start gap-3">
                      {/* Avatar + status */}
                      <div className="relative flex-shrink-0">
                        {m.avatar_url ? (
                          <img src={m.avatar_url} alt={m.name} className="w-14 h-14 rounded-xl object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#1e1e1e] flex items-center justify-center">
                            <span className="text-xl font-bold text-white">{m.name.charAt(0)}</span>
                          </div>
                        )}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#141414] ${statusDot[status]}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white leading-tight">{m.name}</h3>
                            <p className="text-xs text-[#6b7280]">{m.role || 'Team Member'}</p>
                          </div>
                          <LoadCircle pct={m.workload || 0} overloaded={isOverloaded} />
                        </div>
                        <span className={`inline-block text-[10px] font-semibold ${deptStyle} px-2 py-0.5 rounded-full mt-2`}>
                          {m.department || 'General'}
                        </span>
                        {memberSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {memberSkills.slice(0, 3).map((skill) => (
                              <span key={skill} className="text-[9px] text-[#9ca3af] bg-[#1e1e1e] px-1.5 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                            {memberSkills.length > 3 && (
                              <span className="text-[9px] text-[#4b5563]">+{memberSkills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
                      <select
                        value={m.status || 'active'}
                        onChange={(e) => handleStatusChange(m, e.target.value as 'active' | 'inactive' | 'on_leave')}
                        className="text-[10px] bg-[#1e1e1e] border border-[#2a2a2a] rounded px-1.5 py-1 text-[#9ca3af] focus:outline-none focus:border-orange-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                      <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                        <MessageSquare size={13} />
                      </button>
                      <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">
                        <Calendar size={13} />
                      </button>
                      <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(m)}
                          className="text-[#4b5563] hover:text-white transition-colors p-1"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-[#4b5563] hover:text-red-400 transition-colors p-1"
                          title="Remove"
                        >
                          <Trash2 size={12} />
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
                <Plus size={28} className="text-[#6b7280]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Team Members Yet</h3>
              <p className="text-[#6b7280] text-sm mb-6">
                Add team members to track workload, assign tasks, and manage capacity.
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Plus size={16} />
                Add First Team Member
              </button>
            </div>
          )}
        </div>

        <footer className="px-8 py-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>2024 FounderHub Mission Control</span>
          <Link to="/privacy" className="hover:text-[#9ca3af] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#9ca3af] transition-colors">Terms of Service</Link>
          <Link to="/support" className="hover:text-[#9ca3af] transition-colors">Support</Link>
        </footer>
      </div>

      {/* Right Panel */}
      <div className="w-[260px] flex-shrink-0 border-l border-[#1e1e1e] bg-[#0f0f0f] overflow-y-auto flex flex-col">
        {/* Workload Heatmap */}
        <div className="p-4 border-b border-[#1e1e1e]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-orange-400" />
              <span className="text-xs font-bold text-white">Workload Heatmap</span>
            </div>
            <button className="text-[#4b5563] hover:text-[#6b7280] transition-colors">...</button>
          </div>

          {/* Day headers */}
          <div className="flex gap-1 mb-1 pl-8">
            {days.map((d, i) => (
              <div key={i} className="w-6 text-center text-[9px] text-[#4b5563] font-medium">{d}</div>
            ))}
          </div>

          {/* Heatmap grid */}
          {heatmapData.map((row, ri) => (
            <div key={ri} className="flex items-center gap-1 mb-1">
              <span className="text-[9px] text-[#4b5563] w-7 flex-shrink-0">{hours[ri]}</span>
              {row.map((val, ci) => (
                <div key={ci} className={`w-6 h-5 rounded-sm ${heatColor(val)}`} />
              ))}
            </div>
          ))}
        </div>

        {/* AI Strategy Insight */}
        <div className="p-4 border-b border-[#1e1e1e]">
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={10} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">AI Strategy Insight</span>
            </div>
            {overloadedMember ? (
              <>
                <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-2">
                  <span className="text-orange-400 font-semibold">{overloadedMember.name}</span> has exceeded 90% capacity. Consider redistributing tasks.
                </p>
                <button
                  onClick={() => setShowInsights(true)}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors"
                >
                  View Full Analysis
                </button>
              </>
            ) : (
              <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                Team workload is balanced. All members are within healthy capacity limits.
              </p>
            )}
          </div>
        </div>

        {/* Task Command */}
        <div className="p-4 border-b border-[#1e1e1e] flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Task Command</span>
            <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Active: {tasks.filter((t) => t.status !== 'done').length}
            </span>
          </div>
          {urgentTasks.length > 0 ? (
            <div className="space-y-2">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-1.5 border-b border-[#1a1a1a] last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${task.priority === 'urgent' ? 'bg-red-400' : 'bg-[#4b5563]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-white leading-tight truncate">{task.title}</div>
                    <div className="text-[10px] text-[#4b5563]">Assigned to {getMemberName(task.team_member_id || '')}</div>
                  </div>
                  <span className="text-[10px] text-[#6b7280] flex-shrink-0">{task.due_date ? `${Math.max(0, Math.ceil((new Date(task.due_date).getTime() - Date.now()) / 86400000))}d` : '-'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6b7280]">No urgent tasks. Team workload is manageable.</p>
          )}
          <Link to="/team/backlog" className="mt-3 w-full text-center text-xs text-[#6b7280] hover:text-white py-1.5 transition-colors block">
            View Full Backlog
          </Link>
        </div>

        {/* Resource Allocation */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Resource Allocation</span>
            <span className="text-[10px] font-bold text-green-400">Live</span>
          </div>
          {resources.length > 0 ? (
            <div className="space-y-3">
              {resources.map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1 uppercase tracking-wider">
                    <span>{r.label}</span>
                    <span className={r.pct >= 90 ? 'text-red-400 font-bold' : 'text-white font-semibold'}>{r.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6b7280]">Add team members to see allocation.</p>
          )}
        </div>
      </div>

      <TeamMemberFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingMember(null); }}
        onSubmit={editingMember ? handleEdit : handleCreate}
        initialMember={editingMember}
      />

      <AIInsightsModal
        open={showInsights}
        onClose={() => setShowInsights(false)}
        onGenerate={generateInsights}
        title="AI Team Insights"
        subtitle="Analysis of team capacity and workload"
      />
    </div>
  );
}
