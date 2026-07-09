import { supabase } from '@/lib/supabase';

export type InvestorStage = 'SOURCED' | 'CONTACTED' | 'INTERESTED' | 'NEGOTIATING' | 'SIGNED' | 'PASSED';

export interface Investor {
  id: string;
  user_id: string;
  name: string;
  firm: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  stage: InvestorStage;
  sentiment: string;
  commitment: number;
  portfolio_companies: string[];
  typical_check_min: number | null;
  typical_check_max: number | null;
  focus_areas: string[];
  location: string | null;
  linkedin_url: string | null;
  notes: string | null;
  last_contact_date: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestorInsert {
  name: string;
  firm?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  stage?: InvestorStage;
  sentiment?: string;
  commitment?: number;
  portfolio_companies?: string[];
  typical_check_min?: number;
  typical_check_max?: number;
  focus_areas?: string[];
  location?: string;
  linkedin_url?: string;
  notes?: string;
  last_contact_date?: string;
  next_follow_up?: string;
}

export interface InvestorUpdate {
  name?: string;
  firm?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  stage?: InvestorStage;
  sentiment?: string;
  commitment?: number;
  portfolio_companies?: string[];
  typical_check_min?: number;
  typical_check_max?: number;
  focus_areas?: string[];
  location?: string;
  linkedin_url?: string;
  notes?: string;
  last_contact_date?: string;
  next_follow_up?: string;
}

export const investorService = {
  async getAll(): Promise<Investor[]> {
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Investor | null> {
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(investor: InvestorInsert): Promise<Investor> {
    const { data, error } = await supabase
      .from('investors')
      .insert(investor)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: InvestorUpdate): Promise<Investor> {
    const { data, error } = await supabase
      .from('investors')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('investors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async moveToStage(id: string, stage: InvestorStage): Promise<Investor> {
    return this.update(id, { stage });
  },

  async getStats(): Promise<{ total: number; byStage: Record<InvestorStage, number>; totalCommitment: number }> {
    const { data, error } = await supabase
      .from('investors')
      .select('stage, commitment');

    if (error) throw error;

    const byStage: Record<InvestorStage, number> = {
      SOURCED: 0, CONTACTED: 0, INTERESTED: 0, NEGOTIATING: 0, SIGNED: 0, PASSED: 0,
    };
    let totalCommitment = 0;

    data?.forEach((inv) => {
      byStage[inv.stage as InvestorStage]++;
      totalCommitment += inv.commitment || 0;
    });

    return { total: data?.length || 0, byStage, totalCommitment };
  },
};
