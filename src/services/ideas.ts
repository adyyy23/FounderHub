import { supabase } from '@/lib/supabase';

export type IdeaCategory = 'Product' | 'Growth' | 'Operations' | 'Other';
export type IdeaStatus = 'backlog' | 'scoping' | 'validation' | 'ready' | 'in_progress' | 'completed';

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: IdeaCategory;
  impact: number;
  confidence: number;
  effort: number;
  status: IdeaStatus;
  created_at: string;
  updated_at: string;
}

export interface IdeaInsert {
  title: string;
  description?: string;
  category: IdeaCategory;
  impact?: number;
  confidence?: number;
  effort?: number;
  status?: IdeaStatus;
}

export const ideaService = {
  async getAll(): Promise<Idea[]> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('impact', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(idea: IdeaInsert): Promise<Idea> {
    const { data, error } = await supabase
      .from('ideas')
      .insert(idea)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<IdeaInsert>): Promise<Idea> {
    const { data, error } = await supabase
      .from('ideas')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
