import { supabase } from '@/lib/supabase';

export interface MonthlyMetric {
  id: string;
  month: string;
  arr: number;
  target: number;
  sort_order: number;
}

export interface AnalyticsEvent {
  id: string;
  event_name: string;
  event_category: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export const metricsService = {
  async getMonthlyMetrics(): Promise<MonthlyMetric[]> {
    const { data, error } = await supabase
      .from('monthly_metrics')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map((d) => ({
      id: d.id,
      month: d.month,
      arr: Number(d.arr) || 0,
      target: Number(d.target) || 0,
      sort_order: d.sort_order,
    }));
  },

  async addMonthlyMetric(metric: Omit<MonthlyMetric, 'id'>): Promise<MonthlyMetric> {
    const { data, error } = await supabase
      .from('monthly_metrics')
      .insert({
        month: metric.month,
        arr: metric.arr,
        target: metric.target,
        sort_order: metric.sort_order,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      month: data.month,
      arr: Number(data.arr) || 0,
      target: Number(data.target) || 0,
      sort_order: data.sort_order,
    };
  },

  async updateMonthlyMetric(id: string, updates: Partial<MonthlyMetric>): Promise<void> {
    const { error } = await supabase
      .from('monthly_metrics')
      .update({
        ...(updates.month !== undefined && { month: updates.month }),
        ...(updates.arr !== undefined && { arr: updates.arr }),
        ...(updates.target !== undefined && { target: updates.target }),
        ...(updates.sort_order !== undefined && { sort_order: updates.sort_order }),
      })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteMonthlyMetric(id: string): Promise<void> {
    const { error } = await supabase.from('monthly_metrics').delete().eq('id', id);
    if (error) throw error;
  },
};
