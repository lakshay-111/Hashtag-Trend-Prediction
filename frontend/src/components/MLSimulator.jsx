import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  Gauge, 
  Zap, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  Lightbulb,
  Sliders,
  Play,
  CheckCircle2,
  Bookmark,
  Activity,
  Flame,
  Snowflake,
  BarChart3
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { predictCustomHashtag, fetchHashtagBaselines } from '../services/api';

export default function MLSimulator() {
  const [hashtag, setHashtag] = useState('#AIRevolution');
  const [seedText, setSeedText] = useState('Astounded by the groundbreaking multimodal capabilities in the new autonomous agents release! 🚀 #AIRevolution #FutureOfWork');
  const [currentVol, setCurrentVol] = useState(25);
  const [velocity3h, setVelocity3h] = useState(5);
  const [followerTier, setFollowerTier] = useState('mid');
  const [hourOfDay, setHourOfDay] = useState(15);
  const [sentimentScore, setSentimentScore] = useState(0.45);
  
  const [baselines, setBaselines] = useState([]);
  const [activeBaseline, setActiveBaseline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // Fetch known hashtag baselines from the backend dataset
  useEffect(() => {
    const loadBaselines = async () => {
      const data = await fetchHashtagBaselines();
      if (data && data.length > 0) {
        setBaselines(data);
        // Default to first active baseline
        const first = data[0];
        setActiveBaseline(first.hashtag);
        setHashtag(first.hashtag);
        setCurrentVol(first.current_1h_volume);
        setVelocity3h(first.velocity_3h);
        setSentimentScore(first.sentiment_score);
        setFollowerTier(first.follower_tier);
        setSeedText(first.sample_text);
      }
    };
    loadBaselines();
  }, []);

  // When a known hashtag chip is selected
  const handleSelectHashtag = (base) => {
    setHashtag(base.hashtag);
    setActiveBaseline(base.hashtag);
    setCurrentVol(base.current_1h_volume);
    setVelocity3h(base.velocity_3h);
    setSentimentScore(base.sentiment_score);
    setFollowerTier(base.follower_tier);
    setSeedText(base.sample_text);
  };

  // Preset Scenario Handlers
  const applyPreset = (presetName) => {
    setActiveBaseline(null);
    if (presetName === 'mega') {
      setHashtag('#MegaViralSpike');
      setCurrentVol(95);
      setVelocity3h(32);
      setFollowerTier('mega');
      setSentimentScore(0.80);
      setSeedText('Unbelievable record-breaking announcement! The entire community is shocked by this unprecedented milestone! 🚀🔥');
    } else if (presetName === 'surging') {
      setHashtag('#SurgingTrend');
      setCurrentVol(45);
      setVelocity3h(12);
      setFollowerTier('macro');
      setSentimentScore(0.50);
      setSeedText('Exciting improvements and strong momentum observed across multiple benchmarks this morning. #TechTrends');
    } else if (presetName === 'steady') {
      setHashtag('#SteadyBuzz');
      setCurrentVol(20);
      setVelocity3h(3);
      setFollowerTier('mid');
      setSentimentScore(0.25);
      setSeedText('Solid consistent progress and daily community engagement on our routine development sprints.');
    } else if (presetName === 'cold') {
      setHashtag('#DormantTopic');
      setCurrentVol(6);
      setVelocity3h(-4);
      setFollowerTier('micro');
      setSentimentScore(-0.25);
      setSeedText('Notable concerns and lagging adoption regarding legacy workflow support and server downtime.');
    }
  };

  const handleSimulate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const payload = {
      hashtag,
      seed_text: seedText,
      current_1h_volume: parseFloat(currentVol),
      velocity_3h: parseFloat(velocity3h),
      sentiment_score: parseFloat(sentimentScore),
      follower_tier: followerTier,
      hour_of_day: parseInt(hourOfDay),
      category: 'Technology'
    };

    const res = await predictCustomHashtag(payload);
    setPredictionResult(res);
    setLoading(false);

    if (res && res.virality_index >= 75) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Mega Viral Breakout': return 'text-purple-400 border-purple-500/40 bg-purple-950/30';
      case 'Surging Trend': return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
      case 'Steady Buzz': return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
      default: return 'text-slate-400 border-slate-700 bg-slate-900/30';
    }
  };

  // Build projected curve chart data
  const buildCurveChart = () => {
    if (!predictionResult || !predictionResult.projected_curve) return { labels: [], datasets: [] };

    const labels = predictionResult.projected_curve.map(c => c.hour_offset);
    const vols = predictionResult.projected_curve.map(c => c.predicted_volume);
    const upper = predictionResult.projected_curve.map(c => c.confidence_upper);
    const lower = predictionResult.projected_curve.map(c => c.confidence_lower);

    return {
      labels,
      datasets: [
        {
          label: 'Simulated Trajectory (Hourly Tweets)',
          data: vols,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Upper 90% Bound',
          data: upper,
          borderColor: 'rgba(168, 85, 247, 0.4)',
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: '+1',
          backgroundColor: 'rgba(168, 85, 247, 0.08)'
        },
        {
          label: 'Lower 10% Bound',
          data: lower,
          borderColor: 'rgba(168, 85, 247, 0.4)',
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        }
      ]
    };
  };

  const curveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { size: 10 } }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Interactive Simulation Sandbox Controls */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        <div className="glass-panel p-5 border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  AI Virality Sandbox & Predictor
                </h2>
                <p className="text-xs text-slate-400">
                  Calibrated ML simulation for hashtag cascade dynamics
                </p>
              </div>
            </div>
          </div>

          {/* Quick Scenario Presets */}
          <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>Quick Scenario Presets:</span>
              <span className="text-[10px] text-cyan-400">One-click test configs</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('mega')}
                className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition-all flex items-center justify-center gap-1"
              >
                <Flame className="w-3 h-3 text-purple-400" />
                <span>Mega Spike</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('surging')}
                className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 transition-all flex items-center justify-center gap-1"
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>Surging</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('steady')}
                className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-center gap-1"
              >
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Steady Buzz</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('cold')}
                className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-1"
              >
                <Snowflake className="w-3 h-3 text-slate-400" />
                <span>Dormant</span>
              </button>
            </div>
          </div>

          {/* Active Dataset Hashtag Chips */}
          {baselines.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>Load Live Hashtag Baseline:</span>
                <span className="text-[10px] text-slate-500">15 Real Dataset Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 py-1">
                {baselines.map((base) => (
                  <button
                    key={base.hashtag}
                    type="button"
                    onClick={() => handleSelectHashtag(base)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                      hashtag.toLowerCase() === base.hashtag.toLowerCase()
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-sm shadow-cyan-500/30'
                        : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {base.hashtag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSimulate} className="space-y-4 text-xs">
            
            {/* Hashtag Name & Live Status */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Target Hashtag
                </label>
                {baselines.some(b => b.hashtag.toLowerCase() === hashtag.toLowerCase()) ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Live Dataset Node
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                    ✨ Novel Custom Tag
                  </span>
                )}
              </div>
              <input
                type="text"
                value={hashtag}
                onChange={(e) => {
                  setHashtag(e.target.value);
                  setActiveBaseline(null);
                }}
                placeholder="#YourHashtag"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Seed Post Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Seed Post Text (NLP Sentiment Engine)
                </label>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  sentimentScore > 0.3 ? 'text-emerald-400 bg-emerald-950/40' :
                  sentimentScore < -0.2 ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 bg-slate-800'
                }`}>
                  Polarity: {sentimentScore > 0 ? `+${sentimentScore}` : sentimentScore}
                </span>
              </div>
              <textarea
                rows={2}
                value={seedText}
                onChange={(e) => setSeedText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 outline-none resize-none"
              />
            </div>

            {/* Sentiment Slider */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Sentiment Bias Polarity (-1.0 to +1.0)</span>
                <span className="font-mono text-cyan-300 font-bold">{sentimentScore}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={sentimentScore}
                onChange={(e) => setSentimentScore(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>-1.0 (Critical / Outraged)</span>
                <span>0.0 (Neutral)</span>
                <span>+1.0 (Euphoric / Viral)</span>
              </div>
            </div>

            {/* Early 1h Volume Slider */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Initial 1-Hour Volume (t=0)</span>
                <span className="font-mono text-cyan-300 font-bold">{currentVol} tweets/hr</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={currentVol}
                onChange={(e) => setCurrentVol(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* 3h Velocity Momentum Slider */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>3-Hour Velocity Momentum (dV/dt)</span>
                <span className={`font-mono font-bold ${velocity3h >= 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
                  {velocity3h >= 0 ? `+${velocity3h}` : velocity3h}/hr
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="60"
                step="1"
                value={velocity3h}
                onChange={(e) => setVelocity3h(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Follower Base Tier */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Author & Network Influence Tier
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'micro', label: 'Micro', range: '<10k' },
                  { id: 'mid', label: 'Mid', range: '10k-100k' },
                  { id: 'macro', label: 'Macro', range: '100k-1M' },
                  { id: 'mega', label: 'Mega', range: '1M+' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFollowerTier(tier.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      followerTier === tier.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>{tier.label}</div>
                    <div className="text-[9px] text-slate-500">{tier.range}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Post Timing (Hour of Day) */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Posting Window (Hour UTC)</span>
                <span className="font-mono text-cyan-300 font-bold">{hourOfDay}:00 UTC</span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={hourOfDay}
                onChange={(e) => setHourOfDay(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="text-[10px] text-slate-500 mt-0.5">
                Diurnal peak social engagement occurs between 14:00 - 19:00 UTC
              </div>
            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cyber py-3 justify-center text-sm font-bold shadow-lg shadow-cyan-500/20 mt-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Inferring Neural Ensembles...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>⚡ Run Neural Virality Simulation</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

      {/* Right Column: Prediction Results & Trajectory Projection */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {predictionResult ? (
          <>
            {/* Top Score Banner */}
            <div className={`glass-panel p-5 border ${getTierColor(predictionResult.virality_tier)}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  {/* Circular Virality Gauge */}
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-950 border-4 border-cyan-400 shadow-lg shadow-cyan-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-black font-mono text-cyan-300">
                        {predictionResult.virality_index}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                        Score
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Predicted Virality Status
                    </span>
                    <h3 className="text-2xl font-extrabold font-heading text-white mt-0.5">
                      {predictionResult.virality_tier}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Target: <span className="font-mono text-cyan-400 font-bold">{predictionResult.hashtag}</span>
                      {predictionResult.is_known_hashtag && (
                        <span className="ml-2 text-[10px] text-emerald-400 font-mono">✓ Network Node</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Peak & Reach Metrics */}
                <div className="flex sm:flex-col items-end gap-2 text-right">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="text-slate-400">Predicted Peak</div>
                    <div className="text-lg font-bold font-mono text-white">
                      ~{predictionResult.predicted_peak_volume} <span className="text-xs text-slate-400">tweets/hr</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Peak Arrival: <span className="font-mono text-cyan-300 font-bold">~{predictionResult.peak_timing_hours}h</span>
                  </div>
                </div>

              </div>

              {/* Tier Probabilities Breakdown Bars */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Model Probability Distribution Across Virality Tiers
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(predictionResult.tier_probabilities).map(([tName, pVal]) => (
                    <div key={tName} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
                      <div className="text-slate-400 truncate">{tName}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mr-2">
                          <div
                            className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full"
                            style={{ width: `${pVal * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-white font-bold">
                          {(pVal * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 24-Hour Simulated Trajectory Curve */}
            <div className="glass-panel p-5">
              <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Simulated 24-Hour Trajectory Curve</span>
              </h3>
              <div className="h-[220px] w-full">
                <Line data={buildCurveChart()} options={curveOptions} />
              </div>
            </div>

            {/* Actionable Strategic Advice */}
            <div className="glass-panel p-4 bg-indigo-950/20 border-indigo-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2 font-heading">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>AI Strategic Campaign Insights & Growth Multipliers</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {predictionResult.strategic_insights.map((insight, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

          </>
        ) : (
          <div className="glass-panel p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full border-dashed">
            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Ready for AI Virality Simulation
            </h3>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
              Pick an active hashtag above or tune the sliders, then click "Run Neural Virality Simulation" to predict virality score, tier classification, and 24h trajectory.
            </p>
            <button
              onClick={handleSimulate}
              className="btn-cyber text-xs px-4 py-2"
            >
              <Play className="w-4 h-4" />
              <span>Simulate Current Configuration</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
