import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

export interface ProfileUpdate {
  full_name?: string;
  company_name?: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

export const profileService = {
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data.publicUrl;
  },
};
