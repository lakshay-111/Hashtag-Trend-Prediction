import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  Heart, 
  Repeat, 
  MessageCircle, 
  Eye, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { fetchSamplePosts } from '../services/api';

export default function LiveFeed({ trendingList }) {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [selectedTag]);

  // Simulate real-time streaming incoming posts every 4 seconds when live streaming is toggled
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setPosts(prev => {
        if (prev.length === 0) return prev;
        const randomItem = { ...prev[Math.floor(Math.random() * Math.min(prev.length, 10))] };
        randomItem.post_id = `post_${Date.now()}`;
        randomItem.timestamp = 'Just now';
        randomItem.likes = Math.floor(Math.random() * 20);
        randomItem.retweets = Math.floor(Math.random() * 8);
        return [randomItem, ...prev.slice(0, 49)];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchSamplePosts(selectedTag === 'All' ? null : selectedTag, 50);
    setPosts(data.reverse()); // latest first
    setLoading(false);
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.post_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.author_handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Stream Controls Header */}
      <div className="glass-panel p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className={`w-5 h-5 ${isLiveStreaming ? 'animate-pulse text-cyan-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-heading">
                  Real-Time Social Stream Firehose
                </h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isLiveStreaming ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isLiveStreaming ? '● STREAMING LIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live post ingestion feed with real-time sentiment scoring & engagement counters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isLiveStreaming
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}
            </button>

            <button
              onClick={loadPosts}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search stream content or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 w-full placeholder:text-slate-500"
            />
          </div>

          {/* Hashtag Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedTag === 'All'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
              }`}
            >
              All Topics
            </button>
            {trendingList.map(t => (
              <button
                key={t.hashtag}
                onClick={() => setSelectedTag(t.hashtag)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedTag === t.hashtag
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                {t.hashtag}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Posts Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 glass-panel p-12 text-center text-cyan-400 font-mono text-xs animate-pulse">
            Connecting to Live Feed Stream...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 text-center text-slate-400 text-xs">
            No posts found matching filter criteria.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.post_id}
              className="glass-panel p-4 bg-slate-900/50 border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-xs">
                      {post.author_handle.slice(1, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white font-mono">
                          {post.author_handle}
                        </span>
                        {post.is_verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(post.author_followers || 1500).toLocaleString()} followers • {post.country || 'Global'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      post.sentiment_polarity > 0.3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      post.sentiment_polarity < 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {post.sentiment_polarity > 0 ? `+${post.sentiment_polarity}` : post.sentiment_polarity}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300">
                      {post.dominant_emotion}
                    </span>
                  </div>
                </div>

                {/* Tweet Body */}
                <p className="text-xs text-slate-200 leading-relaxed mb-3 font-normal">
                  {post.post_text}
                </p>
              </div>

              {/* Engagement Counters */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                    <Heart className="w-3.5 h-3.5 text-rose-500/70" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                    <Repeat className="w-3.5 h-3.5 text-emerald-500/70" />
                    <span>{post.retweets}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    <Eye className="w-3.5 h-3.5 text-cyan-500/70" />
                    <span>{post.impressions?.toLocaleString() || 120}</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500">
                  {post.timestamp}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
