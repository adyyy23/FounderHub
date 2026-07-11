import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Plus, Calendar, Loader as Loader2, CreditCard as Edit2, Trash2, Check, Sparkles, Filter, X } from 'lucide-react';
import { roadmapService, type RoadmapItem, type RoadmapStatus, type RoadmapPriority } from '@/services/roadmap';
import { useToast } from '@/hooks/use-toast';
import AIInsightsModal from '@/components/AIInsightsModal';
import { generateRoadmapInsights, type AIAnalysisResult } from '@/lib/aiInsights';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type RoadmapView = 'gantt' | 'milestone';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const COL_W = 180;
const TODAY_COL = 1.5;

const priorityColors: Record<string, string> = {
  high: 'text-orange-400 bg-orange-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-green-400 bg-green-400/10',
  critical: 'text-red-400 bg-red-400/10',
};

const statusColors: Record<string, { bg: string; border: string }> = {
  'not-started': { bg: '#1a1a1a', border: 'border-gray-800/50' },
  'in-progress': { bg: '#1a241a', border: 'border-green-800/40' },
  'completed': { bg: '#0f1f0f', border: 'border-green-900/50' },
  'on-hold': { bg: '#1f1a0f', border: 'border-yellow-800/40' },
};

const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

interface RoadmapFormData {
  title: string;
  description: string;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  start_date: string;
  end_date: string;
  progress: number;
  assignee: string;
}

function RoadmapFormDialog({
  open,
  onClose,
  onSubmit,
  initialItem,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoadmapFormData) => Promise<void>;
  initialItem?: RoadmapItem | null;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RoadmapFormData>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    start_date: '',
    end_date: '',
    progress: 0,
    assignee: '',
  });

  useEffect(() => {
    if (initialItem) {
      setFormData({
        title: initialItem.title,
        description: initialItem.description || '',
        status: initialItem.status,
        priority: initialItem.priority,
        start_date: initialItem.start_date || '',
        end_date: initialItem.end_date || '',
        progress: initialItem.progress,
        assignee: initialItem.assignee || '',
      });
    } else {
      setFormData({ title: '', description: '', status: 'backlog', priority: 'medium', start_date: '', end_date: '', progress: 0, assignee: '' });
    }
  }, [initialItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{initialItem ? 'Edit Initiative' : 'New Initiative'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Multi-Currency SSO"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this initiative..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#3a3a3a]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoadmapStatus })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="backlog">Backlog</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as RoadmapPriority })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">End Date</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Progress (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Assignee</label>
              <Input
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="John Doe"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-400 text-white">
              {loading ? <Loader2 size={16} className="animate-spin" /> : initialItem ? 'Save Changes' : 'Create Initiative'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Roadmap() {
  const { toast } = useToast();
  const [view, setView] = useState<RoadmapView>('gantt');
  const [backlogOpen, setBacklogOpen] = useState(true);
  const [cycleOpen, setCycleOpen] = useState(true);
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RoadmapStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<RoadmapPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await roadmapService.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load roadmap items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: RoadmapFormData) => {
    try {
      await roadmapService.create({
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
        progress: data.progress,
        assignee: data.assignee || undefined,
      });
      toast({ title: 'Initiative created successfully' });
      setShowForm(false);
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to create initiative', variant: 'destructive' });
    }
  };

  const handleEdit = async (data: RoadmapFormData) => {
    if (!editingItem) return;
    try {
      await roadmapService.update(editingItem.id, {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
        progress: data.progress,
        assignee: data.assignee || undefined,
      });
      toast({ title: 'Initiative updated successfully' });
      setShowForm(false);
      setEditingItem(null);
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update initiative', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await roadmapService.delete(id);
      toast({ title: 'Initiative deleted' });
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete initiative', variant: 'destructive' });
    }
  };

  const handleComplete = async (item: RoadmapItem) => {
    try {
      await roadmapService.update(item.id, { status: 'completed', progress: 100 });
      toast({ title: 'Initiative marked complete!' });
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to complete initiative', variant: 'destructive' });
    }
  };

  const handleProgressUpdate = async (item: RoadmapItem, progress: number) => {
    try {
      await roadmapService.update(item.id, { progress });
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update progress', variant: 'destructive' });
    }
  };

  const openEdit = (item: RoadmapItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const generateInsights = useCallback(async (): Promise<AIAnalysisResult> => {
    await new Promise((r) => setTimeout(r, 1200));
    return generateRoadmapInsights(items);
  }, [items]);

  const filteredItems = items.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned' && i.assignee) return false;
      if (assigneeFilter !== 'unassigned' && i.assignee !== assigneeFilter) return false;
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      const itemDate = i.end_date ? new Date(i.end_date) : i.start_date ? new Date(i.start_date) : null;
      if (!itemDate && dateFilter !== 'none') return false;
      if (dateFilter === 'overdue' && (!itemDate || itemDate >= now || i.status === 'completed')) return false;
      if (dateFilter === 'thisMonth' && (!itemDate || itemDate.getMonth() !== now.getMonth())) return false;
      if (dateFilter === 'nextMonth' && (!itemDate || itemDate.getMonth() !== (now.getMonth() + 1) % 12)) return false;
      if (dateFilter === 'none' && itemDate) return false;
    }
    if (searchQuery && !i.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (priorityFilter !== 'all' ? 1 : 0) + (assigneeFilter !== 'all' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);
  const clearFilters = () => { setStatusFilter('all'); setPriorityFilter('all'); setAssigneeFilter('all'); setDateFilter('all'); setSearchQuery(''); };
  const uniqueAssignees = [...new Set(items.map((i) => i.assignee).filter(Boolean))] as string[];

  const backlogItems = filteredItems.filter((i) => i.status === 'backlog' || !i.start_date);
  const activeItems = filteredItems.filter((i) => i.status === 'in_progress' && i.start_date);

  const ganttItems = activeItems.slice(0, 5).map((item, idx) => {
    const startDate = item.start_date ? new Date(item.start_date) : new Date();
    const endDate = item.end_date ? new Date(item.end_date) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startCol = startMonth;
    const spanCols = Math.max(1, endMonth - startMonth + 1);

    const statuses = statusColors[item.status?.replace('_', '-') || 'backlog'] || statusColors['backlog'];

    return {
      id: item.id,
      title: item.title,
      subtitle: item.description?.slice(0, 30) + (item.description && item.description.length > 30 ? '...' : ''),
      tag: item.progress >= 100 ? 'Done' : `${item.progress}%`,
      tagColor: item.progress >= 100
        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      assigneeId: item.assignee,
      startCol,
      spanCols,
      color: statuses.bg,
      border: statuses.border,
      row: idx % 2,
      itemId: item.id,
    };
  });

  const unassignedCount = items.filter((i) => !i.assignee).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[230px] flex-shrink-0 border-r border-[#1e1e1e] flex flex-col bg-[#0f0f0f] overflow-y-auto">
        {/* Hangar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Planning Hangar</span>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
            {unassignedCount} Unassigned
          </span>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[#1e1e1e]">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search backlog..."
              className="w-full bg-[#141414] border border-[#1e1e1e] rounded-lg pl-7 pr-3 py-1.5 text-xs text-[#9ca3af] placeholder-[#4b5563] focus:outline-none"
            />
          </div>
        </div>

        {/* Ideation Backlog */}
        <div className="border-b border-[#1e1e1e]">
          <button
            onClick={() => setBacklogOpen(!backlogOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#141414] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500/20 rounded flex items-center justify-center">
                <span className="text-orange-400 text-[9px] font-bold">!</span>
              </div>
              <span className="text-xs font-semibold text-[#9ca3af]">Backlog ({backlogItems.length})</span>
            </div>
            <ChevronDown size={12} className={`text-[#4b5563] transition-transform ${backlogOpen ? '' : '-rotate-90'}`} />
          </button>

          {backlogOpen && (
            <div className="px-3 pb-3 space-y-2">
              {backlogItems.slice(0, 4).map((item) => {
                const priority = (item.priority || 'medium').toLowerCase();
                const priorityStyle = priorityColors[priority] || priorityColors.medium;

                return (
                  <div key={item.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg p-2.5 cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-semibold ${priorityStyle} px-1.5 py-0.5 rounded`}>{priority}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="text-[#4b5563] hover:text-white transition-colors">
                          <Edit2 size={10} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-[#4b5563] hover:text-red-400 transition-colors">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-white mb-1">{item.title}</div>
                    <div className="text-[10px] text-[#4b5563] uppercase">{statusLabels[item.status] || item.status}</div>
                  </div>
                );
              })}
              {backlogItems.length === 0 && (
                <p className="text-xs text-[#6b7280] py-2">No backlog items</p>
              )}
              <button
                onClick={openCreate}
                className="flex items-center gap-1.5 text-xs text-[#4b5563] hover:text-[#6b7280] pl-1 transition-colors"
              >
                <Plus size={11} />
                Add Item
              </button>
            </div>
          )}
        </div>

        {/* Current Cycle */}
        <div>
          <button
            onClick={() => setCycleOpen(!cycleOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#141414] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-xs">!</span>
              <span className="text-xs font-semibold text-[#9ca3af]">Active ({activeItems.length})</span>
            </div>
            <ChevronDown size={12} className={`text-[#4b5563] transition-transform ${cycleOpen ? '' : '-rotate-90'}`} />
          </button>

          {cycleOpen && (
            <div className="px-3 pb-3 space-y-2">
              {/* Progress card */}
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-400">Current Sprint</span>
                  <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-1.5">
                  <span>Progress</span>
                  <span>{activeItems.length > 0 ? Math.round(activeItems.reduce((s, i) => s + i.progress, 0) / activeItems.length) : 0}% Avg</span>
                </div>
                <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${activeItems.length > 0 ? Math.round(activeItems.reduce((s, i) => s + i.progress, 0) / activeItems.length) : 0}%` }}
                  />
                </div>
              </div>

              {activeItems.slice(0, 2).map((item) => {
                const priority = (item.priority || 'medium').toLowerCase();
                const priorityStyle = priorityColors[priority] || priorityColors.medium;

                return (
                  <div key={item.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-lg p-2.5 cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-semibold ${priorityStyle} px-1.5 py-0.5 rounded`}>{priority}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="text-[#4b5563] hover:text-white transition-colors">
                          <Edit2 size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-white mb-1">{item.title}</div>
                    <div className="text-[10px] text-[#4b5563] uppercase">in progress</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Gantt Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="px-8 pt-6 pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-full">
              Strategic Timeline
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#4b5563]">
              <Calendar size={11} />
              {items.length} total initiatives
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Mission Manifest 2024</h1>
          <p className="text-[#6b7280] text-sm mb-4 max-w-xl">
            Visualizing the path from product velocity to strategic dominance.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#161616] border border-[#1e1e1e] rounded-lg p-1 gap-1">
              <button
                onClick={() => setView('gantt')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${view === 'gantt' ? 'bg-orange-500 text-white' : 'text-[#6b7280] hover:text-white'}`}
              >
                Gantt View
              </button>
              <button
                onClick={() => setView('milestone')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${view === 'milestone' ? 'bg-orange-500 text-white' : 'text-[#6b7280] hover:text-white'}`}
              >
                Milestone View
              </button>
            </div>
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
              onClick={() => setShowInsights(true)}
              className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-orange-500/50 text-[#9ca3af] hover:text-orange-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Sparkles size={12} />
              AI Insights
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={13} />
              New Initiative
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 mx-8 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white">Filters</span>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-white transition-colors">
                  <X size={11} /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as RoadmapStatus | 'all')} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                  <option value="all">All Statuses</option>
                  <option value="backlog">Backlog</option>
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Priority</label>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as RoadmapPriority | 'all')} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Assignee</label>
                <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                  <option value="all">All Assignees</option>
                  <option value="unassigned">Unassigned</option>
                  {uniqueAssignees.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Date</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                  <option value="all">All Dates</option>
                  <option value="overdue">Overdue</option>
                  <option value="thisMonth">This Month</option>
                  <option value="nextMonth">Next Month</option>
                  <option value="none">No Date</option>
                </select>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#1e1e1e] text-xs text-[#6b7280]">{filteredItems.length} of {items.length} items</div>
          </div>
        )}

        {/* Gantt Chart */}
        <div className="flex-1 overflow-auto">
          {/* Quarter headers */}
          <div className="flex border-b border-[#1e1e1e] sticky top-0 bg-[#0d0d0d] z-10">
            <div
              className="flex-shrink-0 bg-orange-500/10 border-r border-orange-500/20 px-6 py-2 text-xs font-bold text-orange-400 uppercase tracking-widest"
              style={{ width: `${COL_W * 4}px` }}
            >
              Q1 - FOUNDATION
            </div>
            <div className="px-6 py-2 text-xs font-bold text-[#6b7280] uppercase tracking-widest">
              Q2
            </div>
          </div>

          {/* Month headers */}
          <div className="flex border-b border-[#1e1e1e] sticky top-[33px] bg-[#0d0d0d] z-10">
            {months.map((m) => (
              <div
                key={m}
                className="flex-shrink-0 px-4 py-2 text-xs text-[#6b7280] font-medium border-r border-[#1e1e1e]"
                style={{ width: `${COL_W}px` }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Gantt rows */}
          {ganttItems.length > 0 ? (
            <div className="relative p-6" style={{ minWidth: `${COL_W * 6}px` }}>
              {/* TODAY line */}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-orange-500 z-20 pointer-events-none"
                style={{ left: `${TODAY_COL * COL_W + 24}px` }}
              >
                <div className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 mt-2 absolute whitespace-nowrap">
                  TODAY
                </div>
              </div>

              {/* Grid lines */}
              {months.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-r border-[#1a1a1a]"
                  style={{ left: `${(i + 1) * COL_W + 24}px` }}
                />
              ))}

              {/* Row 0 items */}
              <div className="relative h-28 mb-4">
                {ganttItems.filter((item) => item.row === 0).map((item) => (
                  <div
                    key={item.id}
                    className={`absolute top-2 border ${item.border} rounded-xl p-3 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group`}
                    style={{
                      left: `${item.startCol * COL_W}px`,
                      width: `${item.spanCols * COL_W - 8}px`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.title}</div>
                        {item.subtitle && <div className="text-[11px] text-[#6b7280] truncate">{item.subtitle}</div>}
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold ${item.tagColor} px-2 py-0.5 rounded-full`}>
                          {item.tag}
                        </span>
                        <button
                          onClick={() => openEdit(items.find(i => i.id === item.itemId)!)}
                          className="opacity-0 group-hover:opacity-100 text-[#4b5563] hover:text-white transition-opacity p-0.5"
                        >
                          <Edit2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 1 items */}
              <div className="relative h-28">
                {ganttItems.filter((item) => item.row === 1).map((item) => (
                  <div
                    key={item.id}
                    className={`absolute top-2 border ${item.border} rounded-xl p-3 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group`}
                    style={{
                      left: `${item.startCol * COL_W}px`,
                      width: `${item.spanCols * COL_W - 8}px`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.title}</div>
                        {item.subtitle && <div className="text-[11px] text-[#6b7280] truncate">{item.subtitle}</div>}
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold ${item.tagColor} px-2 py-0.5 rounded-full`}>
                          {item.tag}
                        </span>
                        <button
                          onClick={() => openEdit(items.find(i => i.id === item.itemId)!)}
                          className="opacity-0 group-hover:opacity-100 text-[#4b5563] hover:text-white transition-opacity p-0.5"
                        >
                          <Edit2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                  <Calendar size={28} className="text-[#6b7280]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Roadmap Items Yet</h3>
                <p className="text-[#6b7280] text-sm mb-4">Add initiatives to visualize your strategic timeline.</p>
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  Add First Initiative
                </button>
              </div>
            </div>
          )}

          {/* All items list with edit/delete/complete */}
          {filteredItems.length > 0 && (
            <div className="px-8 py-6 border-t border-[#1e1e1e]">
              <h3 className="text-sm font-bold text-white mb-4">All Initiatives</h3>
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const priority = (item.priority || 'medium').toLowerCase();
                  const priorityStyle = priorityColors[priority] || priorityColors.medium;
                  return (
                    <div key={item.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-3 flex items-center gap-3 group transition-colors">
                      <span className={`text-[10px] font-semibold ${priorityStyle} px-2 py-0.5 rounded flex-shrink-0`}>{priority}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-[#6b7280]">
                          {statusLabels[item.status] || item.status}
                          {item.assignee && ` • ${item.assignee}`}
                          {item.end_date && ` • Due ${new Date(item.end_date).toLocaleDateString()}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.progress}
                          onChange={(e) => handleProgressUpdate(item, parseInt(e.target.value))}
                          className="w-20 h-1 accent-orange-500 cursor-pointer"
                        />
                        <span className="text-[10px] text-white font-semibold w-8 text-right">{item.progress}%</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status !== 'completed' && (
                            <button
                              onClick={() => handleComplete(item)}
                              className="text-[#4b5563] hover:text-green-400 transition-colors p-1"
                              title="Mark Complete"
                            >
                              <Check size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(item)}
                            className="text-[#4b5563] hover:text-white transition-colors p-1"
                            title="Edit"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[#4b5563] hover:text-red-400 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-8 py-3 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>2024 FounderHub Mission Control</span>
          <Link to="/privacy" className="hover:text-[#9ca3af] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#9ca3af] transition-colors">Terms of Service</Link>
          <Link to="/support" className="hover:text-[#9ca3af] transition-colors">Support</Link>
        </footer>
      </div>

      {/* FAB */}
      <button
        onClick={openCreate}
        className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 hover:bg-orange-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 transition-colors z-50"
      >
        <Plus size={20} />
      </button>

      <RoadmapFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); }}
        onSubmit={editingItem ? handleEdit : handleCreate}
        initialItem={editingItem}
      />

      <AIInsightsModal
        open={showInsights}
        onClose={() => setShowInsights(false)}
        onGenerate={generateInsights}
        title="AI Roadmap Insights"
        subtitle="Strategic analysis of your roadmap initiatives"
      />
    </div>
  );
}
