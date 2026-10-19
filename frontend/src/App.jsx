import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import TrendForecast from './components/TrendForecast';
import NetworkGraph from './components/NetworkGraph';
import MLSimulator from './components/MLSimulator';
import SentimentMatrix from './components/SentimentMatrix';
import GeoHotspots from './components/GeoHotspots';
import HashtagBattle from './components/HashtagBattle';
import AcademicReport from './components/AcademicReport';
import LiveFeed from './components/LiveFeed';

import { fetchOverview, fetchTrending } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('forecast');
  const [overview, setOverview] = useState(null);
  const [trendingList, setTrendingList] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [ovData, trData] = await Promise.all([
        fetchOverview(),
        fetchTrending('all')
      ]);
      setOverview(ovData);
      setTrendingList(trData || []);
      if (trData && trData.length > 0) {
        setSelectedTag(trData[0].hashtag);
      }
    } catch (err) {
      console.error('Error loading initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-body">
      
      {/* Top Glassmorphic Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        overviewData={overview} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Global Key Metric Cards */}
        <KPICards overview={overview} />

        {/* Tab Route Switching */}
        {activeTab === 'forecast' && (
          <TrendForecast 
            trendingList={trendingList} 
            selectedTag={selectedTag} 
            setSelectedTag={setSelectedTag} 
          />
        )}

        {activeTab === 'network' && (
          <NetworkGraph />
        )}

        {activeTab === 'simulator' && (
          <MLSimulator />
        )}

        {activeTab === 'sentiment' && (
          <SentimentMatrix />
        )}

        {activeTab === 'geo' && (
          <GeoHotspots />
        )}

        {activeTab === 'battle' && (
          <HashtagBattle trendingList={trendingList} />
        )}

        {activeTab === 'report' && (
          <AcademicReport />
        )}

        {activeTab === 'feed' && (
          <LiveFeed trendingList={trendingList} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 font-heading">TrendPulse AI</span>
            <span>•</span>
            <span>Data Visualization & Social Media Analytics (DVSMA) Working Prototype</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>FastAPI Backend (8000)</span>
            <span>•</span>
            <span>Vite React UI (5173)</span>
            <span>•</span>
            <span>Gradient Boosting Ensembles</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
