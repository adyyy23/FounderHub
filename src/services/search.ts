import { supabase } from '@/lib/supabase';

export interface SearchResult {
  id: string;
  type: 'investor' | 'goal' | 'idea' | 'roadmap' | 'task' | 'team_member';
  title: string;
  subtitle: string | null;
  url: string;
  meta: string | null;
}

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    const [investors, goals, ideas, roadmap, tasks, members] = await Promise.all([
      supabase.from('investors').select('id, name, firm, stage').ilike('name', `%${q}%`),
      supabase.from('goals').select('id, title, category, status').ilike('title', `%${q}%`),
      supabase.from('ideas').select('id, title, category, status').ilike('title', `%${q}%`),
      supabase.from('roadmap_items').select('id, title, status, priority').ilike('title', `%${q}%`),
      supabase.from('tasks').select('id, title, status, priority').ilike('title', `%${q}%`),
      supabase.from('team_members').select('id, name, role, department').ilike('name', `%${q}%`),
    ]);

    investors.data?.forEach((inv) => {
      results.push({
        id: inv.id, type: 'investor', title: inv.name,
        subtitle: inv.firm || 'Investor', url: `/investors/${inv.id}`,
        meta: inv.stage,
      });
    });
    goals.data?.forEach((g) => {
      results.push({
        id: g.id, type: 'goal', title: g.title,
        subtitle: g.category || 'Goal', url: '/goals',
        meta: g.status,
      });
    });
    ideas.data?.forEach((i) => {
      results.push({
        id: i.id, type: 'idea', title: i.title,
        subtitle: i.category || 'Idea', url: '/ideas',
        meta: i.status,
      });
    });
    roadmap.data?.forEach((r) => {
      results.push({
        id: r.id, type: 'roadmap', title: r.title,
        subtitle: 'Roadmap Item', url: '/roadmap',
        meta: `${r.status} • ${r.priority}`,
      });
    });
    tasks.data?.forEach((t) => {
      results.push({
        id: t.id, type: 'task', title: t.title,
        subtitle: 'Task', url: '/team/backlog',
        meta: `${t.status} • ${t.priority}`,
      });
    });
    members.data?.forEach((m) => {
      results.push({
        id: m.id, type: 'team_member', title: m.name,
        subtitle: m.role || 'Team Member', url: '/team',
        meta: m.department,
      });
    });

    return results;
  },
};
