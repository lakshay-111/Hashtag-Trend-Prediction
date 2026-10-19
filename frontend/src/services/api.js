/**
 * TrendPulse AI - API Service Layer
 * Connects to FastAPI Backend at http://127.0.0.1:8000
 */

const API_BASE = 'http://127.0.0.1:8000/api';

export const fetchOverview = async () => {
  try {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (overview):', err);
    return null;
  }
};

export const fetchTrending = async (category = 'all') => {
  try {
    const url = category && category !== 'all' ? `${API_BASE}/trending?category=${encodeURIComponent(category)}` : `${API_BASE}/trending`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (trending):', err);
    return [];
  }
};

export const fetchHashtagTimeseries = async (hashtag) => {
  try {
    const res = await fetch(`${API_BASE}/hashtag/${encodeURIComponent(hashtag)}/timeseries`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (timeseries):', err);
    return null;
  }
};

export const predictCustomHashtag = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (predict):', err);
    return null;
  }
};

export const fetchNetworkGraph = async () => {
  try {
    const res = await fetch(`${API_BASE}/network`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (network):', err);
    return null;
  }
};

export const fetchSentimentMatrix = async () => {
  try {
    const res = await fetch(`${API_BASE}/sentiment-matrix`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (sentiment):', err);
    return null;
  }
};

export const fetchGeographicHotspots = async () => {
  try {
    const res = await fetch(`${API_BASE}/geographic`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (geographic):', err);
    return [];
  }
};

export const fetchModelPerformance = async () => {
  try {
    const res = await fetch(`${API_BASE}/model-performance`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (model performance):', err);
    return null;
  }
};

export const fetchSamplePosts = async (hashtag = null, limit = 50) => {
  try {
    const url = hashtag && hashtag !== 'all' ? `${API_BASE}/sample-posts?hashtag=${encodeURIComponent(hashtag)}&limit=${limit}` : `${API_BASE}/sample-posts?limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (sample posts):', err);
    return [];
  }
};

export const fetchHashtagBaselines = async () => {
  try {
    const res = await fetch(`${API_BASE}/hashtag-baselines`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API Error (baselines):', err);
    return [];
  }
};

