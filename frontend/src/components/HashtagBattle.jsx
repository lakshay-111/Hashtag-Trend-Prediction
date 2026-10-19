import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';
import { 
  Swords, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Activity, 
  Smile, 
  Eye, 
  Zap 
} from 'lucide-react';
import { fetchHashtagTimeseries } from '../services/api';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function HashtagBattle({ trendingList }) {
  const [tagA, setTagA] = useState('#AIRevolution');
  const [tagB, setTagB] = useState('#GTA6Trailer');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBattleData();
  }, [tagA, tagB]);

  const loadBattleData = async () => {
    setLoading(true);
    const [resA, resB] = await Promise.all([
      fetchHashtagTimeseries(tagA),
      fetchHashtagTimeseries(tagB)
    ]);
    setDataA(resA);
    setDataB(resB);
    setLoading(false);
  };

  // Build Radar Chart Data
  const buildRadarData = () => {
    if (!dataA || !dataB) return { labels: [], datasets: [] };

    // Normalize metrics between 0 and 100 for radar
    const metricsA = [
      Math.min(100, (dataA.predicted_peak_volume / 250) * 100),
      dataA.predicted_tier_index * 33.3,
      Math.min(100, Math.abs(dataA.history[dataA.history.length - 1]?.sentiment || 0.5) * 100),
      Math.min(100, (dataA.history[dataA.history.length - 1]?.velocity || 20) * 2.5),
      Math.min(100, (dataA.history[dataA.history.length - 1]?.reach || 50000) / 1000)
    ];

    const metricsB = [
      Math.min(100, (dataB.predicted_peak_volume / 250) * 100),
      dataB.predicted_tier_index * 33.3,
      Math.min(100, Math.abs(dataB.history[dataB.history.length - 1]?.sentiment || 0.5) * 100),
      Math.min(100, (dataB.history[dataB.history.length - 1]?.velocity || 20) * 2.5),
      Math.min(100, (dataB.history[dataB.history.length - 1]?.reach || 50000) / 1000)
    ];

    return {
      labels: [
        'Predicted Peak Volume',
        'Virality Tier Index',
        'Sentiment Extremity',
        'Velocity Momentum',
        'Network Diffusion'
      ],
      datasets: [
        {
          label: tagA,
          data: metricsA,
          backgroundColor: 'rgba(6, 182, 212, 0.25)',
          borderColor: '#06b6d4',
          borderWidth: 2,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#06b6d4'
        },
        {
          label: tagB,
          data: metricsB,
          backgroundColor: 'rgba(244, 63, 94, 0.25)',
          borderColor: '#f43f5e',
          borderWidth: 2,
          pointBackgroundColor: '#f43f5e',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f43f5e'
        }
      ]
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { family: 'Inter', size: 12 } }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' }
        },
        ticks: { display: false, max: 100, min: 0 }
      }
    }
  };

  // Determine winner
  const scoreA = dataA ? dataA.predicted_peak_volume + dataA.predicted_tier_index * 40 : 0;
  const scoreB = dataB ? dataB.predicted_peak_volume + dataB.predicted_tier_index * 40 : 0;
  const winner = scoreA >= scoreB ? tagA : tagB;

  return (
    <div className="space-y-6">
      
      {/* Battle Header & Selectors */}
      <div className="glass-panel p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Swords className="w-5 h-5 text-rose-400" />
              <span>Hashtag Head-to-Head Virality Battle</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side comparative modeling of momentum, diffusion velocity, and peak forecasts
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tag A Selector */}
            <select
              value={tagA}
              onChange={(e) => setTagA(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-300 font-bold text-xs outline-none cursor-pointer"
            >
              {trendingList.map(t => (
                <option key={t.hashtag} value={t.hashtag}>{t.hashtag}</option>
              ))}
            </select>

            <span className="text-xs font-bold text-rose-400 font-mono">VS</span>

            {/* Tag B Selector */}
            <select
              value={tagB}
              onChange={(e) => setTagB(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-rose-500/50 text-rose-300 font-bold text-xs outline-none cursor-pointer"
            >
              {trendingList.map(t => (
                <option key={t.hashtag} value={t.hashtag}>{t.hashtag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Winner Banner */}
        {dataA && dataB && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-slate-300">
                Predicted High Momentum Winner:{' '}
                <strong className="text-amber-300 font-bold font-mono text-sm">{winner}</strong>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Confidence: {Math.abs(scoreA - scoreB) > 50 ? 'Dominant Lead' : 'Close Battle'}
            </span>
          </div>
        )}
      </div>

      {/* Main Battle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Comparison Chart */}
        <div className="lg:col-span-6 glass-panel p-5">
          <h3 className="text-sm font-bold text-white font-heading mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>5-Axis Multi-Dimensional Virality Radar</span>
          </h3>
          <div className="h-[380px] w-full relative">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                Computing battle vectors...
              </div>
            ) : (
              <Radar data={buildRadarData()} options={radarOptions} />
            )}
          </div>
        </div>

        {/* Side-by-Side Stat Breakdown */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* Card Tag A */}
          {dataA && (
            <div className="glass-panel p-5 border-cyan-500/30 bg-cyan-950/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400" />
                  <h4 className="text-lg font-bold text-white font-heading">{tagA}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {dataA.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-cyan-400">{dataA.predicted_tier}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Predicted Peak</div>
                  <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                    ~{dataA.predicted_peak_volume} <span className="text-[10px] text-slate-400">/hr</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Sentiment</div>
                  <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">
                    +{dataA.history[dataA.history.length - 1]?.sentiment || 0.4}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Current Velocity</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {dataA.history[dataA.history.length - 1]?.velocity || 25}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card Tag B */}
          {dataB && (
            <div className="glass-panel p-5 border-rose-500/30 bg-rose-950/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <h4 className="text-lg font-bold text-white font-heading">{tagB}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {dataB.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-rose-400">{dataB.predicted_tier}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Predicted Peak</div>
                  <div className="text-base font-bold font-mono text-rose-300 mt-0.5">
                    ~{dataB.predicted_peak_volume} <span className="text-[10px] text-slate-400">/hr</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Sentiment</div>
                  <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">
                    +{dataB.history[dataB.history.length - 1]?.sentiment || 0.4}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Current Velocity</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {dataB.history[dataB.history.length - 1]?.velocity || 25}
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
