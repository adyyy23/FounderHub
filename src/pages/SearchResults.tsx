import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Users, Target, Lightbulb, Map, SquareCheck as CheckSquare, User, Loader as Loader2, Clock, X } from 'lucide-react';
import { searchService, type SearchResult } from '@/services/search';

const typeConfig: Record<string, { icon: typeof Users; label: string; color: string }> = {
  investor: { icon: Users, label: 'Investor', color: 'text-blue-400' },
  goal: { icon: Target, label: 'Goal', color: 'text-orange-400' },
  idea: { icon: Lightbulb, label: 'Idea', color: 'text-yellow-400' },
  roadmap: { icon: Map, label: 'Roadmap', color: 'text-green-400' },
  task: { icon: CheckSquare, label: 'Task', color: 'text-purple-400' },
  team_member: { icon: User, label: 'Team Member', color: 'text-pink-400' },
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(searchService.getRecentSearches());
  }, []);

  useEffect(() => {
    if (query) {
      doSearch(query);
      searchService.saveRecentSearch(query);
      setRecentSearches(searchService.getRecentSearches());
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const doSearch = async (q: string) => {
    setLoading(true);
    try {
      const data = await searchService.search(q);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClearRecent = () => {
    searchService.clearRecentSearches();
    setRecentSearches([]);
  };

  const filtered = filter === 'all' ? results : results.filter((r) => r.type === filter);
  const types = ['all', ...new Set(results.map((r) => r.type))];

  return (
    <div className="p-8 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#6b7280] hover:text-white text-sm mb-4 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Search size={24} className="text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Search Results</h1>
          <p className="text-[#6b7280] text-sm">
            {loading ? 'Searching...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        </div>
      </div>

      {!query && !loading && recentSearches.length > 0 && (
        <div className="mb-6 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#6b7280] text-xs font-semibold uppercase tracking-wider">
              <Clock size={14} />
              Recent Searches
            </div>
            <button
              onClick={handleClearRecent}
              className="flex items-center gap-1 text-[#6b7280] hover:text-white text-xs transition-colors"
            >
              <X size={12} />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleRecentSearchClick(term)}
                className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-full px-3 py-1.5 text-sm text-white transition-colors"
              >
                <Clock size={12} className="text-[#6b7280]" />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {types.length > 1 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors ${
                filter === t ? 'bg-orange-500 text-white' : 'bg-[#141414] border border-[#1e1e1e] text-[#6b7280] hover:text-white'
              }`}
            >
              {t === 'all' ? 'All' : typeConfig[t]?.label || t}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 size={24} className="text-orange-500 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((result) => {
            const config = typeConfig[result.type];
            const Icon = config.icon;
            return (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => navigate(result.url)}
                className="w-full flex items-center gap-4 bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{result.title}</div>
                  <div className="text-xs text-[#6b7280] truncate">{result.subtitle}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">{config.label}</span>
                  {result.meta && (
                    <span className="text-[10px] text-[#4b5563] bg-[#1e1e1e] px-2 py-0.5 rounded-full">{result.meta}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center">
          <Search size={32} className="text-[#4b5563] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
          <p className="text-[#6b7280] text-sm">
            {query ? `No matches for "${query}". Try a different search term.` : 'Type something in the search bar above.'}
          </p>
        </div>
      )}
    </div>
  );
}
