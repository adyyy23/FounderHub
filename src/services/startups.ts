import { supabase } from '@/lib/supabase';

export interface Startup {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  industry: string | null;
  stage: string;
  location: string | null;
  website_url: string | null;
  founded_year: number | null;
  team_size: number;
  arr: number;
  funding_raised: number;
  logo_url: string | null;
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface StartupInsert {
  name: string;
  description?: string;
  industry?: string;
  stage?: string;
  location?: string;
  website_url?: string;
  founded_year?: number;
  team_size?: number;
  arr?: number;
  funding_raised?: number;
  logo_url?: string;
  is_public?: boolean;
  tags?: string[];
}

export interface StartupUpdate {
  name?: string;
  description?: string;
  industry?: string;
  stage?: string;
  location?: string;
  website_url?: string;
  founded_year?: number;
  team_size?: number;
  arr?: number;
  funding_raised?: number;
  logo_url?: string;
  is_public?: boolean;
  tags?: string[];
}

export interface StartupFilters {
  industry?: string;
  stage?: string;
  location?: string;
  search?: string;
  minArr?: number;
  maxArr?: number;
  minFunding?: number;
  maxFunding?: number;
}

export const startupService = {
  async getAll(filters?: StartupFilters): Promise<Startup[]> {
    let query = supabase
      .from('startups')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (filters?.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters?.stage) {
      query = query.eq('stage', filters.stage);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.minArr !== undefined) {
      query = query.gte('arr', filters.minArr);
    }
    if (filters?.maxArr !== undefined) {
      query = query.lte('arr', filters.maxArr);
    }
    if (filters?.minFunding !== undefined) {
      query = query.gte('funding_raised', filters.minFunding);
    }
    if (filters?.maxFunding !== undefined) {
      query = query.lte('funding_raised', filters.maxFunding);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  },

  async getMyStartups(): Promise<Startup[]> {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Startup | null> {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async create(startup: StartupInsert): Promise<Startup> {
    const { data, error } = await supabase
      .from('startups')
      .insert(startup)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async update(id: string, updates: StartupUpdate): Promise<Startup> {
    const { data, error } = await supabase
      .from('startups')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('startups')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async getIndustries(): Promise<string[]> {
    const { data, error } = await supabase
      .from('startups')
      .select('industry')
      .not('industry', 'is', null);

    if (error) {
      throw error;
    }

    const industries = new Set(data?.map(s => s.industry).filter(Boolean) as string[]);
    return Array.from(industries);
  },

  async getStages(): Promise<string[]> {
    const { data, error } = await supabase
      .from('startups')
      .select('stage');

    if (error) {
      throw error;
    }

    const stages = new Set(data?.map(s => s.stage).filter(Boolean) as string[]);
    return Array.from(stages);
  },
};
