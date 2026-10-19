import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement
} from 'chart.js';
import { Scatter, Doughnut } from 'react-chartjs-2';
import { BarChart3, Smile, Frown, Flame, Heart, Info } from 'lucide-react';
import { fetchSentimentMatrix } from '../services/api';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, ArcElement, CategoryScale, BarElement);

export default function SentimentMatrix() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSentimentData();
  }, []);

  const loadSentimentData = async () => {
    setLoading(true);
    const res = await fetchSentimentMatrix();
    setData(res);
    setLoading(false);
  };

  const emotionColors = {
    'Joy': '#10b981',        // Emerald
    'Anticipation': '#06b6d4',// Cyan
    'Surprise': '#f59e0b',    // Amber
    'Trust': '#8b5cf6',       // Purple
    'Anger': '#f43f5e',       // Rose
    'Fear': '#a855f7',        // Violet
    'Sadness': '#64748b',     // Slate
    'Neutral': '#94a3b8'      // Gray
  };

  // Build 2D Quadrant Scatter Chart Data
  const buildScatterData = () => {
    if (!data || !data.matrix) return { datasets: [] };

    const scatterPoints = data.matrix.map(item => ({
      x: item.sentiment_polarity,
      y: item.engagement_score,
      tag: item.hashtag,
      volume: item.volume,
      category: item.category,
      quadrant: item.quadrant
    }));

    return {
      datasets: [
        {
          label: 'Hashtag Positioning',
          data: scatterPoints,
          backgroundColor: scatterPoints.map(p => 
            p.x >= 0.2 && p.y >= 2.5 ? '#10b981' :
            p.x < 0 && p.y >= 2.5 ? '#f43f5e' :
            p.x >= 0.2 ? '#06b6d4' : '#64748b'
          ),
          borderColor: '#ffffff',
          borderWidth: 1.5,
          pointRadius: scatterPoints.map(p => Math.min(20, Math.max(6, Math.sqrt(p.volume) * 0.35 + 4))),
          pointHoverRadius: scatterPoints.map(p => Math.min(24, Math.max(8, Math.sqrt(p.volume) * 0.35 + 8)))
        }
      ]
    };
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (ctx) => ctx[0].raw.tag,
          label: (ctx) => [
            ` Category: ${ctx.raw.category}`,
            ` Sentiment Polarity: ${ctx.raw.x > 0 ? '+' : ''}${ctx.raw.x}`,
            ` Engagement Score: ${ctx.raw.y}`,
            ` Total Mentions: ${ctx.raw.volume}`,
            ` Quadrant: ${ctx.raw.quadrant}`
          ]
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sentiment Polarity (-1.0 Negative ⟵ Neutral ⟶ +1.0 Positive)',
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' }
        },
        min: -0.6,
        max: 1.0,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      },
      y: {
        title: {
          display: true,
          text: 'Engagement Velocity Score (0 to 10+)',
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' }
        },
        min: 0,
        max: 6,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      }
    }
  };

  // Build Emotion Doughnut Chart Data
  const buildEmotionData = () => {
    if (!data || !data.emotion_distribution) return { labels: [], datasets: [] };

    const labels = Object.keys(data.emotion_distribution);
    const values = Object.values(data.emotion_distribution);
    const bgColors = labels.map(l => emotionColors[l] || '#94a3b8');

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: bgColors,
          borderColor: 'rgba(15, 23, 42, 0.9)',
          borderWidth: 2
        }
      ]
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Inter' },
          usePointStyle: true,
          boxWidth: 8
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 2D Sentiment vs Engagement Scatter Quadrant */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Sentiment Polarity vs. Engagement Velocity Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quadrant analysis identifying viral champions, controversies, and sentiment clusters
              </p>
            </div>
          </div>

          {/* Quadrant Legend Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-[11px]">
            <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
              <div className="font-bold">🏆 Viral Champions</div>
              <div className="text-[10px] text-slate-400">High Polarity + High Engagement</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">
              <div className="font-bold">🔥 Controversial Debates</div>
              <div className="text-[10px] text-slate-400">Low Polarity + High Engagement</div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-300">
              <div className="font-bold">✨ Niche Positive</div>
              <div className="text-[10px] text-slate-400">High Polarity + Steady Buzz</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
              <div className="font-bold">💤 Dormant Buzz</div>
              <div className="text-[10px] text-slate-400">Low Polarity + Low Engagement</div>
            </div>
          </div>

          <div className="h-[380px] w-full relative">
            {loading ? (
              <div className="flex items-center justify-center h-full text-cyan-400 text-sm font-mono animate-pulse">
                Mapping Sentiment Clusters...
              </div>
            ) : (
              <Scatter data={buildScatterData()} options={scatterOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Emotion Spectrum Breakdown */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        <div className="glass-panel p-5">
          <h3 className="text-base font-bold text-white font-heading mb-1 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>Emotion Spectrum Distribution</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            NLP fine-grained classification across 25,000+ posts
          </p>

          <div className="h-[220px] w-full relative">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                Loading emotions...
              </div>
            ) : (
              <Doughnut data={buildEmotionData()} options={doughnutOptions} />
            )}
          </div>
        </div>

        {/* Quadrant Classification Table */}
        <div className="glass-panel p-4 max-h-[300px] overflow-y-auto space-y-2">
          <div className="text-xs font-semibold text-slate-300 mb-2">
            Hashtag Sentiment Breakdown
          </div>
          {data && data.matrix.map((item) => (
            <div
              key={item.hashtag}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white font-heading">{item.hashtag}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.category}</div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  item.sentiment_polarity > 0.3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  item.sentiment_polarity < 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.sentiment_polarity > 0 ? `+${item.sentiment_polarity}` : item.sentiment_polarity}
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Eng: {item.engagement_score}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
