import { supabase } from '@/lib/supabase';

export type RoadmapStatus = 'backlog' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RoadmapItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  start_date: string | null;
  end_date: string | null;
  progress: number;
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoadmapItemInsert {
  title: string;
  description?: string;
  status?: RoadmapStatus;
  priority?: RoadmapPriority;
  start_date?: string;
  end_date?: string;
  progress?: number;
  assignee?: string;
}

export const roadmapService = {
  async getAll(): Promise<RoadmapItem[]> {
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(item: RoadmapItemInsert): Promise<RoadmapItem> {
    const { data, error } = await supabase
      .from('roadmap_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<RoadmapItemInsert>): Promise<RoadmapItem> {
    const { data, error } = await supabase
      .from('roadmap_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('roadmap_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
