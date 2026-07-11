import { supabase } from '@/lib/supabase';

export interface SearchResult {
  id: string;
  type: 'investor' | 'goal' | 'idea' | 'roadmap' | 'task' | 'team_member';
  title: string;
  subtitle: string | null;
  url: string;
  meta: string | null;
}

const RECENT_SEARCHES_KEY = 'founderhub:recent_searches';
const MAX_RECENT_SEARCHES = 8;

/**
 * Fuzzy match: returns true if every word in the query appears (as a
 * case-insensitive substring) anywhere in the haystack. This gives partial
 * word matching and matches on any word in the query.
 */
function fuzzyMatch(query: string, haystack: string): boolean {
  const hay = haystack.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    const [investors, goals, ideas, roadmap, tasks, members] = await Promise.all([
      supabase.from('investors').select('id, name, firm, stage'),
      supabase.from('goals').select('id, title, category, status'),
      supabase.from('ideas').select('id, title, category, status'),
      supabase.from('roadmap_items').select('id, title, status, priority'),
      supabase.from('tasks').select('id, title, status, priority'),
      supabase.from('team_members').select('id, name, role, department'),
    ]);

    investors.data?.forEach((inv) => {
      const haystack = `${inv.name} ${inv.firm || ''} ${inv.stage || ''}`;
      if (fuzzyMatch(q, haystack)) {
        results.push({
          id: inv.id, type: 'investor', title: inv.name,
          subtitle: inv.firm || 'Investor', url: `/investors/${inv.id}`,
          meta: inv.stage,
        });
      }
    });
    goals.data?.forEach((g) => {
      const haystack = `${g.title} ${g.category || ''} ${g.status || ''}`;
      if (fuzzyMatch(q, haystack)) {
        results.push({
          id: g.id, type: 'goal', title: g.title,
          subtitle: g.category || 'Goal', url: '/goals',
          meta: g.status,
        });
      }
    });
    ideas.data?.forEach((i) => {
      const haystack = `${i.title} ${i.category || ''} ${i.status || ''}`;
      if (fuzzyMatch(q, haystack)) {
        results.push({
          id: i.id, type: 'idea', title: i.title,
          subtitle: i.category || 'Idea', url: '/ideas',
          meta: i.status,
        });
      }
    });
    roadmap.data?.forEach((r) => {
      const haystack = `${r.title} ${r.status || ''} ${r.priority || ''}`;
      if (fuzzyMatch(q, haystack)) {
        results.push({
          id: r.id, type: 'roadmap', title: r.title,
          subtitle: 'Roadmap Item', url: '/roadmap',
          meta: `${r.status} • ${r.priority}`,
        });
      }
    });
    tasks.data?.forEach((t) => {
      const haystack = `${t.title} ${t.status || ''} ${t.priority || ''}`;
      if (fuzzyMatch(q, haystack)) {
        results.push({
          id: t.id, type: 'task', title: t.title,
          subtitle: 'Task', url: '/team/backlog',
          meta: `${t.status} • ${t.priority}`,
        });
      }
    });
    members.data?.forEach((m) => {
      const haystack = `${m.name} ${m.role || ''} ${m.department || ''}`;
      if (fuzzyMatch(q, haystack)) {
        results.push({
          id: m.id, type: 'team_member', title: m.name,
          subtitle: m.role || 'Team Member', url: '/team',
          meta: m.department,
        });
      }
    });

    return results;
  },

  getRecentSearches(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
    } catch {
      return [];
    }
  },

  saveRecentSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;
    try {
      const existing = this.getRecentSearches();
      // De-duplicate case-insensitively and move to the front.
      const next = [trimmed, ...existing.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())];
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next.slice(0, MAX_RECENT_SEARCHES)));
    } catch {
      // Ignore storage errors (e.g. private mode / quota).
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore storage errors.
    }
  },
};
