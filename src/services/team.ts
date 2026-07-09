import { supabase } from '@/lib/supabase';

export type MemberStatus = 'active' | 'inactive';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  department: string | null;
  email: string | null;
  avatar_url: string | null;
  status: MemberStatus;
  workload: number;
  created_at: string;
}

export interface Task {
  id: string;
  team_member_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
}

export interface TeamMemberInsert {
  name: string;
  role?: string;
  department?: string;
  email?: string;
  avatar_url?: string;
  workload?: number;
}

export interface TaskInsert {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  team_member_id?: string;
  due_date?: string;
}

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(member: TeamMemberInsert): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(task: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<TaskInsert>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
