import React from 'react';
import { 
  MessageSquare, 
  Eye, 
  Zap, 
  Target, 
  Flame, 
  TrendingUp, 
  Smile 
} from 'lucide-react';

export default function KPICards({ overview }) {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-panel p-5 h-28 animate-pulse bg-slate-900/50" />
        ))}
      </div>
    );
  }

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  const cards = [
    {
      title: 'Posts Analyzed',
      value: formatNumber(overview.total_posts),
      subtext: 'across 15 core hashtags',
      icon: MessageSquare,
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      badge: '14-Day Stream'
    },
    {
      title: 'Total Reach / Impressions',
      value: formatNumber(overview.total_impressions),
      subtext: `${formatNumber(overview.total_engagements)} engagements`,
      icon: Eye,
      color: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      badge: 'Global Diffusion'
    },
    {
      title: 'Classifier Accuracy',
      value: `${((overview.model_accuracy || 0.953) * 100).toFixed(1)}%`,
      subtext: 'Gradient Boosting Ensemble',
      icon: Target,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      badge: '4 Virality Tiers'
    },
    {
      title: 'Forecast Model R²',
      value: `${(overview.model_r2 || 0.896).toFixed(3)}`,
      subtext: 'Quantile Multi-Horizon',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      textColor: 'text-purple-400',
      badge: 'p10 - p90 Bounds'
    },
    {
      title: 'Sentiment Polarity',
      value: `+${overview.avg_sentiment}`,
      subtext: 'NLP VADER & TextBlob',
      icon: Smile,
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      textColor: 'text-amber-400',
      badge: overview.avg_sentiment > 0.3 ? 'Bullish / Positive' : 'Balanced'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-4 bg-gradient-to-br ${card.color} border ${card.border} hover:scale-[1.02] transition-all`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-900/60 ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-white">
                {card.value}
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-700/50 text-slate-300">
                {card.badge}
              </span>
            </div>
            
            <div className="text-xs text-slate-400 mt-1 truncate">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
