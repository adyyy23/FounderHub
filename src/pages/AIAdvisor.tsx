import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Shield, Mail, Map, Target, Lightbulb, Plus, Zap, Send, Loader as Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiAdvisorService, type ChatMessage } from '@/services/aiAdvisor';
import { investorService } from '@/services/investors';
import { goalService } from '@/services/goals';
import { useToast } from '@/hooks/use-toast';

const suggestions = [
  'Analyze our burn rate and runway',
  'Review investor pipeline status',
  'What goals need attention?',
  'Recommend team capacity improvements',
];

export default function AIAdvisor() {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState([
    { label: 'CURRENT ARR', value: '...', change: '', positive: true, stable: false, icon: TrendingUp },
    { label: 'MONTHLY BURN', value: '...', change: '', positive: false, stable: false, icon: TrendingDown },
    { label: 'RUNWAY', value: '...', change: '...', stable: true, icon: Shield },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVitals();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadVitals = async () => {
    try {
      const [investorStats, goals] = await Promise.all([
        investorService.getStats(),
        goalService.getAll(),
      ]);
      const activeGoals = goals.filter((g) => g.status === 'active');
      const avgCompletion = activeGoals.length > 0
        ? Math.round(activeGoals.reduce((sum, g) => sum + g.completion, 0) / activeGoals.length)
        : 0;
      const monthlyBurn = 128000;
      const runway = investorStats.totalCommitment > 0
        ? `${(investorStats.totalCommitment / monthlyBurn).toFixed(1)} mo`
        : 'N/A';
      const arr = investorStats.totalCommitment > 0
        ? `$${(investorStats.totalCommitment * 0.4 / 1000).toFixed(0)}k`
        : '$0';

      setVitals([
        { label: 'CURRENT ARR', value: arr, change: '+12%', positive: true, stable: false, icon: TrendingUp },
        { label: 'MONTHLY BURN', value: `$${(monthlyBurn / 1000).toFixed(0)}k`, change: '-2%', positive: false, stable: false, icon: TrendingDown },
        { label: 'RUNWAY', value: runway, change: avgCompletion > 50 ? 'Stable' : 'At Risk', stable: true, icon: Shield },
      ]);
    } catch {
      // Keep defaults
    }
  };

  const handleSend = async (text?: string) => {
    const message = text || inputValue;
    if (!message.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await aiAdvisorService.generateResponse(message);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      await aiAdvisorService.saveConversation([userMsg, assistantMsg]);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to get AI response', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('• ') || line.startsWith('• ')) {
        return <div key={i} className="flex gap-2"><span className="text-orange-400">•</span><span>{line.replace(/^[•]\s*/, '')}</span></div>;
      }
      if (/^\d+\./.test(line)) {
        return <div key={i} className="flex gap-2"><span className="text-orange-400 font-semibold">{line.match(/^(\d+\.)/)?.[1]}</span><span>{line.replace(/^\d+\.\s*/, '')}</span></div>;
      }
      if (line.startsWith('⚠️') || line.startsWith('🎯')) {
        return <div key={i} className="text-orange-400 font-medium">{line}</div>;
      }
      if (line === '') return <div key={i} className="h-2" />;
      return <div key={i}>{line}</div>;
    });
  };

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left Panel - Vitals */}
      <div className="w-[220px] flex-shrink-0 border-r border-[#1e1e1e] p-4 overflow-y-auto">
        <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-3">Vitals Snapshot</h3>

        <div className="space-y-3 mb-6">
          {vitals.map((vital) => (
            <div key={vital.label} className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider">{vital.label}</span>
                {vital.stable ? (
                  <span className="text-[10px] text-[#6b7280]">{vital.change}</span>
                ) : (
                  <span className={`text-[10px] font-medium ${vital.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {vital.change}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <vital.icon size={14} className="text-orange-400" />
                <span className="text-xl font-bold text-white">{vital.value}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-3">Round Progress</h3>
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400">Series A Fundraising</span>
            <span className="text-lg font-bold text-white">65%</span>
          </div>
          <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mb-2">
            <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
          </div>
          <p className="text-[10px] text-[#6b7280]">Next Milestone: Term Sheet Review</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">AI Strategic Advisor</div>
                  <div className="text-[10px] text-[#4b5563] font-medium">COMMAND CHAT • READY</div>
                </div>
              </div>
              <p className="text-[#d1d5db] text-sm leading-relaxed mb-4">
                I'm your AI strategic advisor. I have access to your investor pipeline, goals, ideas, roadmap, and team data.
                Ask me about fundraising strategy, goal progress, team capacity, or any strategic question.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/investors" className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                  <Mail size={12} /> View Investors
                </Link>
                <Link to="/goals" className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                  <Target size={12} /> Review Goals
                </Link>
                <Link to="/ideas" className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                  <Lightbulb size={12} /> Idea Vault
                </Link>
                <Link to="/roadmap" className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                  <Map size={12} /> Roadmap
                </Link>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mr-3">
                  <Zap size={16} className="text-orange-400" />
                </div>
              )}
              <div className={`max-w-[70%] ${msg.role === 'user'
                ? 'bg-orange-500/10 border border-orange-500/20'
                : 'bg-[#141414] border border-[#1e1e1e]'
              } rounded-2xl p-4`}>
                {msg.role === 'assistant' && (
                  <div className="text-[10px] text-[#4b5563] font-medium mb-2">AI ADVISOR</div>
                )}
                <div className="text-[#d1d5db] text-sm leading-relaxed space-y-1">
                  {formatMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mr-3">
                <Loader2 size={16} className="text-orange-400 animate-spin" />
              </div>
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
                <div className="text-[#6b7280] text-sm">Analyzing your data...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        {messages.length === 0 && (
          <div className="px-6 py-2 flex gap-2 overflow-x-auto">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] text-[#9ca3af] hover:text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              >
                <Zap size={10} className="text-orange-400" />
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="px-6 py-3 border-t border-[#1e1e1e]">
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl flex items-center gap-3 px-4 py-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Advisor anything about your strategy, team, or runway..."
              className="flex-1 bg-transparent text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:text-white"
            />
            <button className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
              <Plus size={16} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputValue.trim()}
              className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              Run Insight
              <Send size={11} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] text-[#4b5563]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              REAL-TIME TELEMETRY SYNC
            </span>
            <span className="text-[#2a2a2a]">•</span>
            <span className="flex items-center gap-1.5 text-[10px] text-[#4b5563]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              ANALYZING CRM & METRICS
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>© 2024 FounderHub Mission Control</span>
          <span className="cursor-not-allowed opacity-60">Privacy Policy</span>
          <span className="cursor-not-allowed opacity-60">Terms of Service</span>
          <span className="cursor-not-allowed opacity-60">Support</span>
        </footer>
      </div>
    </div>
  );
}
