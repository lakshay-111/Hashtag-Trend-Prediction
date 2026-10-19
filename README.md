# TrendPulse AI: Hashtag Trend Prediction & Social Media Analytics (DVSMA)

An end-to-end, high-performance Data Visualization and Social Media Analytics suite for predicting viral breakout cascades, hashtag trajectory forecasting, and community network diffusion.

---

## 🎯 Key Project Highlights & Syllabus Alignment

### 1. 🕸️ Social Network Analysis (SNA)
- **Co-occurrence Graph Modeling**: Built from 25,000+ posts with 67 nodes and multi-weighted edges.
- **Centrality Metrics**: Degree Centrality, Betweenness Centrality (bridging potential), and Closeness Centrality.
- **Interactive Force Simulation**: D3.js physics-simulated draggable network with community clustering and node spotlighting.

### 2. 🤖 Machine Learning & Quantile Forecasting Ensembles
- **Virality Tier Classifier**: Gradient Boosting & Random Forest ensembles classifying trends into 4 stages: `Mega Viral Breakout`, `Surging Trend`, `Steady Buzz`, and `Cold / Dormant`.
  - **Accuracy**: **95.33%**
  - **Macro F1-Score**: **0.952**
- **Multi-Horizon Time-Series Forecaster**: Auto-regressive gradient boosted regressor with **80% Quantile Confidence Bands (p10 to p90 interval)**.
  - **R² Score**: **0.8965** | **MAE**: **5.25** | **RMSE**: **10.63**
- **Feature Importance Hierarchy**: Uncovers key viral triggers (e.g. 3h velocity momentum, follower density, sentiment extremity, degree centrality).

### 3. 🎭 NLP Sentiment & Emotion Spectrum
- **2D Quadrant Matrix**: Sentiment Polarity vs. Engagement Velocity (Viral Champions, Controversial Debates, Niche Positive, Dormant).
- **Fine-Grained Emotion Mining**: 8 emotional categories (*Joy, Anticipation, Surprise, Trust, Anger, Fear, Sadness, Neutral*).

### 4. 🧪 Interactive AI Virality Sandbox
- Real-time parameter tuning: Test any custom hashtag, seed text, sentiment polarity, follower influence tier, and UTC posting window.
- Instant neural simulation with peak arrival calculation and strategic AI campaign recommendations.

### 5. ⚔️ Hashtag Head-to-Head Battle & 🗺️ Global Hotspots
- 5-Axis Multi-Dimensional Virality Radar comparison.
- Regional share-of-voice distribution across 5 global continents.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & NPM

### Step 1: Run the Launcher
Simply double-click:
```bash
run_project.bat
```

Or run manually in two terminals:

#### Terminal 1: Backend
```bash
cd backend
python app.py
```
*FastAPI server runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`)*

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
*Vite frontend dashboard runs at `http://localhost:5173`*

---

## 📁 Repository Structure

```
d:\Projects\DVSMA\
├── backend/
│   ├── dataset_generator.py      # Benchmark social media dataset & graph generator
│   ├── train_models.py           # ML training pipeline for Gradient Boosting ensembles
│   ├── analytics_engine.py       # Time-series forecasting & SNA analytics engine
│   ├── app.py                    # FastAPI REST API server
│   ├── data/                     # Raw tweets (25k), hourly trends, and network cache
│   └── models/                   # Serialized ML artifacts & evaluation metrics JSON
├── frontend/
│   ├── src/
│   │   ├── components/           # TrendForecast, NetworkGraph, MLSimulator, SentimentMatrix, etc.
│   │   ├── services/api.js       # API client with FastAPI connectors
│   │   ├── App.jsx               # Tab-based dashboard router
│   │   └── index.css             # Cyber Dark & Glassmorphism Design System
│   └── package.json
└── run_project.bat               # Single-click launcher
```
