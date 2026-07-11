import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Loader as Loader2, CreditCard as Edit2, Trash2, Check, Filter, X, Calendar } from 'lucide-react';
import { taskService, teamService, type Task, type TaskPriority, type TaskStatus, type TeamMember } from '@/services/team';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const statusColumns: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'text-gray-400' },
  { key: 'in_progress', label: 'In Progress', color: 'text-orange-400' },
  { key: 'review', label: 'Review', color: 'text-yellow-400' },
  { key: 'done', label: 'Done', color: 'text-green-400' },
];

const priorityColors: Record<string, string> = {
  urgent: 'text-red-400 bg-red-400/10',
  high: 'text-orange-400 bg-orange-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-green-400 bg-green-400/10',
};

interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  team_member_id: string;
  due_date: string;
}

function TaskFormDialog({
  open, onClose, onSubmit, initialTask, members,
}: {
  open: boolean; onClose: () => void; onSubmit: (data: TaskFormData) => Promise<void>;
  initialTask?: Task | null; members: TeamMember[];
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '', description: '', priority: 'medium', status: 'todo', team_member_id: '', due_date: '',
  });

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description || '',
        priority: initialTask.priority,
        status: initialTask.status,
        team_member_id: initialTask.team_member_id || '',
        due_date: initialTask.due_date || '',
      });
    } else {
      setFormData({ title: '', description: '', priority: 'medium', status: 'todo', team_member_id: '', due_date: '' });
    }
  }, [initialTask, open]);

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
          <DialogTitle className="text-white">{initialTask ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Design landing page"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3a3a3a]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Assign To</label>
              <select
                value={formData.team_member_id}
                onChange={(e) => setFormData({ ...formData, team_member_id: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Due Date</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="border-[#2a2a2a] text-[#9ca3af] hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-400 text-white">
              {loading ? <Loader2 size={16} className="animate-spin" /> : initialTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TeamBacklog() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [taskData, memberData] = await Promise.all([taskService.getAll(), teamService.getAll()]);
      setTasks(taskData);
      setMembers(memberData);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: TaskFormData) => {
    try {
      await taskService.create({
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        status: data.status,
        team_member_id: data.team_member_id || undefined,
        due_date: data.due_date || undefined,
      });
      toast({ title: 'Task created successfully' });
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to create task', variant: 'destructive' });
    }
  };

  const handleEdit = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      await taskService.update(editingTask.id, {
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        status: data.status,
        team_member_id: data.team_member_id || undefined,
        due_date: data.due_date || undefined,
      });
      toast({ title: 'Task updated successfully' });
      setShowForm(false);
      setEditingTask(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update task', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskService.delete(id);
      toast({ title: 'Task deleted' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete task', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      await taskService.update(task.id, { status });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleComplete = async (task: Task) => {
    try {
      await taskService.update(task.id, { status: 'done' });
      toast({ title: 'Task completed!' });
      loadData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to complete task', variant: 'destructive' });
    }
  };

  const openEdit = (task: Task) => { setEditingTask(task); setShowForm(true); };
  const openCreate = () => { setEditingTask(null); setShowForm(true); };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (assigneeFilter !== 'all') {
        if (assigneeFilter === 'unassigned' && t.team_member_id) return false;
        if (assigneeFilter !== 'unassigned' && t.team_member_id !== assigneeFilter) return false;
      }
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, priorityFilter, assigneeFilter, searchQuery]);

  const getMemberName = (id: string | null) => members.find((m) => m.id === id)?.name || 'Unassigned';
  const activeFilters = (priorityFilter !== 'all' ? 1 : 0) + (assigneeFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);
  const clearFilters = () => { setPriorityFilter('all'); setAssigneeFilter('all'); setSearchQuery(''); };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <Link to="/team" className="flex items-center gap-2 text-[#6b7280] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Team
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Task Backlog</h1>
          <p className="text-[#6b7280] text-sm">Manage and assign tasks across your team.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 bg-[#161616] border ${activeFilters > 0 ? 'border-orange-500/50 text-orange-400' : 'border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af]'} text-xs font-medium px-3 py-2 rounded-lg transition-colors`}
          >
            <Filter size={12} /> Filter
            {activeFilters > 0 && <span className="bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>}
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={13} /> New Task
          </button>
        </div>
      </div>

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
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Search</label>
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#6b7280] mb-1.5 block uppercase tracking-wider">Priority</label>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
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
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {statusColumns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${col.color}`}>{col.label}</span>
                <span className="text-[10px] font-bold text-white bg-[#1e1e1e] rounded-full w-5 h-5 flex items-center justify-center">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div key={task.id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-3 group transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-semibold ${priorityColors[task.priority]} px-2 py-0.5 rounded`}>{task.priority}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.status !== 'done' && (
                          <button onClick={() => handleComplete(task)} className="text-[#4b5563] hover:text-green-400 p-0.5" title="Complete">
                            <Check size={11} />
                          </button>
                        )}
                        <button onClick={() => openEdit(task)} className="text-[#4b5563] hover:text-white p-0.5" title="Edit">
                          <Edit2 size={11} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="text-[#4b5563] hover:text-red-400 p-0.5" title="Delete">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{task.title}</div>
                    {task.description && <div className="text-[11px] text-[#6b7280] mb-2 line-clamp-2">{task.description}</div>}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1a1a]">
                      <span className="text-[10px] text-[#6b7280]">{getMemberName(task.team_member_id)}</span>
                      {task.due_date && (
                        <span className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                          <Calendar size={9} />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                      className="mt-2 w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded text-[10px] text-[#9ca3af] px-2 py-1 focus:outline-none focus:border-orange-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center text-xs text-[#4b5563] py-8">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && tasks.length === 0 && (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center mt-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
            <Plus size={28} className="text-[#6b7280]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Tasks Yet</h3>
          <p className="text-[#6b7280] text-sm mb-6">Create tasks and assign them to team members.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
            <Plus size={16} /> Create First Task
          </button>
        </div>
      )}

      <TaskFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        initialTask={editingTask}
        members={members}
      />

      <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
        <span>2024 FounderHub Mission Control</span>
        <span className="cursor-not-allowed opacity-60">Privacy Policy</span>
        <span className="cursor-not-allowed opacity-60">Terms of Service</span>
        <span className="cursor-not-allowed opacity-60">Support</span>
      </footer>
    </div>
  );
}
