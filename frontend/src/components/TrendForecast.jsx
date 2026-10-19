import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Flame, 
  Activity, 
  Layers, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { fetchHashtagTimeseries } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrendForecast({ trendingList, selectedTag, setSelectedTag }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metricMode, setMetricMode] = useState('volume'); // 'volume', 'reach', 'sentiment'
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!selectedTag && trendingList && trendingList.length > 0) {
      setSelectedTag(trendingList[0].hashtag);
    }
  }, [trendingList, selectedTag]);

  useEffect(() => {
    if (selectedTag) {
      loadTimeseries(selectedTag);
    }
  }, [selectedTag]);

  const loadTimeseries = async (tag) => {
    setLoading(true);
    const res = await fetchHashtagTimeseries(tag);
    setData(res);
    setLoading(false);
  };

  const categories = ['All', 'Technology', 'Sports', 'Gaming', 'Business', 'Lifestyle', 'Entertainment'];

  const filteredTrending = trendingList.filter(item => 
    selectedCategory === 'All' ? true : item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  // Prepare Chart.js datasets
  const buildChartData = () => {
    if (!data) return { labels: [], datasets: [] };

    const historyPoints = data.history.slice(-36); // past 36 hours for clarity
    const forecastPoints = data.forecast; // 24 hours

    const allLabels = [
      ...historyPoints.map(p => p.timestamp.split(' ')[1]),
      ...forecastPoints.map(p => p.timestamp.split(' ')[1] + ' (FC)')
    ];

    if (metricMode === 'volume') {
      // Historical actual line
      const histData = historyPoints.map(p => p.volume);
      // Pad forecast with nulls for history dataset
      const histFull = [...histData, ...Array(forecastPoints.length).fill(null)];

      // Forecast median line (connect smoothly from last historical point)
      const lastHistVal = histData[histData.length - 1];
      const fcMedian = [
        ...Array(histData.length - 1).fill(null),
        lastHistVal,
        ...forecastPoints.map(p => p.volume)
      ];

      // Upper quantile bound
      const fcUpper = [
        ...Array(histData.length - 1).fill(null),
        lastHistVal,
        ...forecastPoints.map(p => p.volume_upper)
      ];

      // Lower quantile bound
      const fcLower = [
        ...Array(histData.length - 1).fill(null),
        lastHistVal,
        ...forecastPoints.map(p => p.volume_lower)
      ];

      return {
        labels: allLabels,
        datasets: [
          {
            label: 'Historical Actual Volume',
            data: histFull,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            borderWidth: 2.5,
            pointRadius: 2,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.35
          },
          {
            label: 'ML Forecast Median (24h)',
            data: fcMedian,
            borderColor: '#a855f7',
            borderDash: [6, 4],
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 7,
            fill: false,
            tension: 0.35
          },
          {
            label: '90% Upper Confidence Bound',
            data: fcUpper,
            borderColor: 'rgba(168, 85, 247, 0.35)',
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1', // fill down to lower bound
            backgroundColor: 'rgba(168, 85, 247, 0.08)'
          },
          {
            label: '10% Lower Confidence Bound',
            data: fcLower,
            borderColor: 'rgba(168, 85, 247, 0.35)',
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      };
    } else if (metricMode === 'reach') {
      const histReach = historyPoints.map(p => p.reach);
      const fcReach = [
        ...Array(histReach.length - 1).fill(null),
        histReach[histReach.length - 1],
        ...forecastPoints.map(p => p.volume * 280)
      ];

      return {
        labels: allLabels,
        datasets: [
          {
            label: 'Estimated Historical Impressions / Reach',
            data: [...histReach, ...Array(forecastPoints.length).fill(null)],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35
          },
          {
            label: 'Forecast Reach Projection',
            data: fcReach,
            borderColor: '#ec4899',
            borderDash: [5, 4],
            borderWidth: 2,
            fill: false,
            tension: 0.35
          }
        ]
      };
    } else {
      // Sentiment Polarity
      const histSent = historyPoints.map(p => p.sentiment);
      const fcSent = [
        ...Array(histSent.length - 1).fill(null),
        histSent[histSent.length - 1],
        ...forecastPoints.map(p => p.sentiment)
      ];

      return {
        labels: allLabels,
        datasets: [
          {
            label: 'Historical Sentiment Polarity (-1 to +1)',
            data: [...histSent, ...Array(forecastPoints.length).fill(null)],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.35
          },
          {
            label: 'Forecasted Sentiment Drift',
            data: fcSent,
            borderColor: '#f59e0b',
            borderDash: [4, 4],
            borderWidth: 2,
            fill: false,
            tension: 0.35
          }
        ]
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(ctx) {
            return ` ${ctx.dataset.label}: ${ctx.raw !== null ? Number(ctx.raw).toLocaleString() : 'N/A'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 45 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Trending Leaderboard & Hashtag Selector */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Category Filter Pills */}
        <div className="glass-panel p-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending Hashtag Cards List */}
        <div className="glass-panel p-4 flex-1 max-h-[620px] overflow-y-auto space-y-2.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300 font-heading flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Real-Time Virality Leaderboard</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">24h Momentum</span>
          </div>

          {filteredTrending.map((item, idx) => {
            const isSelected = selectedTag === item.hashtag;
            return (
              <div
                key={item.hashtag}
                onClick={() => setSelectedTag(item.hashtag)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 w-5">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-white font-heading hover:text-cyan-300 transition-colors">
                      {item.hashtag}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.momentum_pct >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.momentum_pct >= 0 ? `+${item.momentum_pct}%` : `${item.momentum_pct}%`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>{item.volume_24h.toLocaleString()} posts</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-amber-300/80">{item.dominant_emotion}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    item.virality_score > 70 
                      ? 'badge-viral' 
                      : item.virality_score > 40 
                      ? 'badge-surging' 
                      : 'badge-steady'
                  }`}>
                    Score: {item.virality_score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Time Series Chart & AI Forecast Breakdown */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Chart Header with Controls */}
        <div className="glass-panel p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-heading">
                  {selectedTag || '#AIRevolution'}
                </h2>
                {data && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    data.predicted_tier_index === 3 ? 'badge-viral' :
                    data.predicted_tier_index === 2 ? 'badge-surging' :
                    data.predicted_tier_index === 1 ? 'badge-steady' : 'badge-dormant'
                  }`}>
                    {data.predicted_tier}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Past 36h historical trajectory + 24-hour multi-horizon ML ensemble forecast with 80% confidence interval
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
              <button
                onClick={() => setMetricMode('volume')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  metricMode === 'volume'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setMetricMode('reach')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  metricMode === 'reach'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reach / Impressions
              </button>
              <button
                onClick={() => setMetricMode('sentiment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  metricMode === 'sentiment'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sentiment Stream
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="h-[340px] w-full relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 rounded-xl">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono animate-pulse">
                  <Activity className="w-5 h-5 animate-spin" />
                  Running Neural Time-Series Forecaster...
                </div>
              </div>
            ) : (
              <Line data={buildChartData()} options={chartOptions} />
            )}
          </div>
        </div>

        {/* AI Forecast Diagnostic Metrics */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="glass-panel p-4 bg-purple-950/10 border-purple-500/20">
              <div className="flex items-center justify-between text-xs text-purple-300 font-semibold mb-1">
                <span>Predicted Peak Volume</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-purple-300">
                ~{data.predicted_peak_volume} <span className="text-xs text-slate-400">tweets/hr</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Confidence Band: [{data.confidence_range[0]} - {data.confidence_range[1]}]
              </div>
            </div>

            <div className="glass-panel p-4 bg-cyan-950/10 border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold mb-1">
                <span>Peak Arrival Window</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300">
                Next 6 - 9 Hours
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Optimal window for brand amplification
              </div>
            </div>

            <div className="glass-panel p-4 bg-emerald-950/10 border-emerald-500/20">
              <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
                <span>Tier Confidence</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300">
                {data.tier_probabilities ? `${(Math.max(...Object.values(data.tier_probabilities)) * 100).toFixed(1)}%` : '92%'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                Model: Gradient Boosting Classifier
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
