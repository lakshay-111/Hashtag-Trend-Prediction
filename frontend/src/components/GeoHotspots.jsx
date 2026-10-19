import React, { useEffect, useState } from 'react';
import { 
  Globe2, 
  MapPin, 
  TrendingUp, 
  Eye, 
  Smile, 
  Compass,
  ArrowUpRight 
} from 'lucide-react';
import { fetchGeographicHotspots } from '../services/api';

export default function GeoHotspots() {
  const [geoData, setGeoData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeo();
  }, []);

  const loadGeo = async () => {
    setLoading(true);
    const data = await fetchGeographicHotspots();
    setGeoData(data);
    setLoading(false);
  };

  const regions = ['All', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East & Africa'];

  const filteredGeo = geoData.filter(item => 
    selectedRegion === 'All' ? true : item.region === selectedRegion
  );

  const regionTotals = geoData.reduce((acc, item) => {
    acc[item.region] = (acc[item.region] || 0) + item.post_volume;
    return acc;
  }, {});

  const maxVolume = Math.max(...geoData.map(d => d.post_volume), 1);

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Tabs */}
      <div className="glass-panel p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-cyan-400" />
              <span>Global Viral Diffusion & Regional Hotspots</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Geographic dispersion, regional sentiment disparities, and localized viral leaders
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {regions.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Share of Voice Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(regionTotals).map(([reg, vol]) => (
          <div key={reg} className="glass-panel p-4 bg-slate-900/40 border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 truncate">{reg}</span>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {vol.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">posts</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${(vol / 25000) * 100 * 2.5}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Country Intensity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGeo.map((item) => (
          <div
            key={item.country}
            className="glass-panel p-5 bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-slate-800/80 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                  {item.region}
                </span>
                <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                  {item.country}
                </h3>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                item.avg_sentiment > 0.3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                item.avg_sentiment < 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.avg_sentiment > 0 ? `+${item.avg_sentiment}` : item.avg_sentiment}
              </span>
            </div>

            {/* Top Trending Tag Pill */}
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 mb-3 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">#1 Trending:</span>
              <span className="font-mono font-bold text-cyan-300">{item.top_trending_hashtag}</span>
            </div>

            {/* Volume & Reach Bar */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Social Post Volume</span>
                <span className="font-mono font-bold text-white">{item.post_volume.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.post_volume / maxVolume) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>Estimated Reach</span>
                <span className="font-mono text-indigo-300">{(item.total_impressions / 1000000).toFixed(1)}M impressions</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
