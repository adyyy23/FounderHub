import { supabase } from '@/lib/supabase';

export type GoalCategory = 'product' | 'growth' | 'ops';
export type GoalStatus = 'active' | 'completed' | 'archived';

export interface KeyResult {
  id: string;
  goal_id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  inverse: boolean;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  description: string | null;
  completion: number;
  confidence: string;
  status: GoalStatus;
  due_date: string | null;
  created_at: string;
  key_results?: KeyResult[];
}

export interface GoalInsert {
  title: string;
  category: GoalCategory;
  description?: string;
  completion?: number;
  confidence?: string;
  status?: GoalStatus;
  due_date?: string;
}

export interface GoalUpdate {
  title?: string;
  category?: GoalCategory;
  description?: string;
  completion?: number;
  confidence?: string;
  status?: GoalStatus;
  due_date?: string;
}

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*, key_results(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('*, key_results(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(goal: GoalInsert): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: GoalUpdate): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async archive(id: string): Promise<Goal> {
    return this.update(id, { status: 'archived' });
  },

  async complete(id: string): Promise<Goal> {
    return this.update(id, { status: 'completed', completion: 100 });
  },
};
