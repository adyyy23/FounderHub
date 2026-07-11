import { supabase } from '@/lib/supabase';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  product_updates: boolean;
  investor_alerts: boolean;
  team_notifications: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface NotificationPreferencesUpdate {
  email_notifications?: boolean;
  product_updates?: boolean;
  investor_alerts?: boolean;
  team_notifications?: boolean;
}

export const notificationPreferencesService = {
  async get(): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async upsert(updates: NotificationPreferencesUpdate): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({ ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
