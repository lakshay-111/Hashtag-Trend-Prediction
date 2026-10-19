import React from 'react';
import { 
  TrendingUp, 
  Share2, 
  Sparkles, 
  BarChart3, 
  Globe2, 
  Swords, 
  GraduationCap, 
  Radio, 
  Activity 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, overviewData }) {
  const navItems = [
    { id: 'forecast', label: 'Trend Forecaster', icon: TrendingUp },
    { id: 'network', label: 'Network Graph (SNA)', icon: Share2 },
    { id: 'simulator', label: 'AI Predictor Sandbox', icon: Sparkles, highlight: true },
    { id: 'sentiment', label: 'Sentiment Matrix', icon: BarChart3 },
    { id: 'geo', label: 'Global Hotspots', icon: Globe2 },
    { id: 'battle', label: 'Hashtag Battle', icon: Swords },
    { id: 'report', label: 'DVSMA Evaluation', icon: GraduationCap },
    { id: 'feed', label: 'Live Stream', icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                TrendPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-mono">
                DVSMA Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hashtag Virality & Time-Series Trend Prediction Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                } ${item.highlight && !isActive ? 'text-amber-300/90' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">API: 8000 (Active)</span>
          </div>
        </div>

      </div>
    </header>
  );
}
