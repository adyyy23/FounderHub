import { useState, useEffect, useCallback } from 'react';
import { Zap, TrendingUp, TriangleAlert as AlertTriangle, Target, CircleCheck as CheckCircle, Activity, Loader as Loader2, RefreshCw, X } from 'lucide-react';
import type { AIAnalysisResult, AIInsight } from '@/lib/aiInsights';

interface AIInsightsModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => Promise<AIAnalysisResult>;
  title: string;
  subtitle?: string;
}

const typeConfig: Record<AIInsight['type'], { icon: typeof TrendingUp; color: string; bg: string; label: string }> = {
  opportunity: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'Growth Opportunity' },
  risk: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'Risk Alert' },
  action: { icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', label: 'Recommended Action' },
  priority: { icon: CheckCircle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', label: 'Weekly Priority' },
  health: { icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', label: 'Health Score' },
};

const severityColor: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

export default function AIInsightsModal({ open, onClose, onGenerate, title, subtitle }: AIInsightsModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await onGenerate();
      setResult(res);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onGenerate]);

  useEffect(() => {
    if (open && !result && !loading) {
      generate();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setResult(null);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center">
              <Zap size={18} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{title}</h2>
              {subtitle && <p className="text-xs text-[#6b7280]">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {result && !loading && (
              <button
                onClick={generate}
                className="flex items-center gap-1.5 bg-[#1e1e1e] hover:bg-[#252525] text-[#9ca3af] hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={12} />
                Rerun Analysis
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:text-white rounded-lg hover:bg-[#1e1e1e] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                <Loader2 size={28} className="text-orange-400 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Analyzing Your Data</h3>
              <p className="text-sm text-[#6b7280]">Cross-referencing goals, investors, and activity...</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 pulse-dot" />
                <span className="text-[10px] text-[#4b5563] uppercase tracking-widest">Processing Telemetry</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertTriangle size={32} className="text-red-400 mb-3" />
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <button
                onClick={generate}
                className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {result && !loading && !error && (
            <div className="space-y-5">
              {/* Health Score Banner */}
              <div className="bg-gradient-to-r from-[#1a1008] via-[#1e1208] to-[#141414] border border-orange-900/30 rounded-2xl p-5">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#1e1e1e" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="32"
                        fill="none" stroke="#f97316" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 32 * (result.healthScore / 100)} ${2 * Math.PI * 32}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white">{result.healthScore}</span>
                      <span className="text-[8px] text-[#6b7280] uppercase">Score</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Startup Health</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.healthScore >= 80 ? 'text-green-400 bg-green-400/10' : result.healthScore >= 60 ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {result.healthLabel}
                      </span>
                    </div>
                    <p className="text-sm text-[#9ca3af] leading-relaxed">{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Insights Grid */}
              <div>
                <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-3">Strategic Insights</h3>
                <div className="space-y-3">
                  {result.insights.map((insight) => {
                    const config = typeConfig[insight.type];
                    const Icon = config.icon;
                    return (
                      <div key={insight.id} className={`border rounded-xl p-4 ${config.bg}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-[#0d0d0d]/50 flex items-center justify-center flex-shrink-0`}>
                            <Icon size={15} className={config.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-widest">{config.label}</span>
                              {insight.severity && (
                                <span className={`text-[9px] font-bold uppercase ${severityColor[insight.severity]}`}>
                                  {insight.severity}
                                </span>
                              )}
                              {insight.metric && (
                                <span className="text-[10px] font-bold text-white bg-[#1e1e1e] px-2 py-0.5 rounded-full ml-auto">
                                  {insight.metric}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                            <p className="text-xs text-[#9ca3af] leading-relaxed">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Priorities */}
              <div>
                <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-3">Weekly Priorities</h3>
                <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                  <div className="space-y-2.5">
                    {result.weeklyPriorities.map((priority, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[9px] font-bold text-orange-400">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-[#9ca3af]">{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
