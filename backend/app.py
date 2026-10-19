import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import uvicorn
from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from analytics_engine import AnalyticsEngine

app = FastAPI(
    title="TrendPulse AI - Social Media Analytics & Hashtag Prediction API",
    description="Data Visualization & Social Media Analytics (DVSMA) Full Prototype Backend",
    version="2.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AnalyticsEngine()

class PredictionRequest(BaseModel):
    hashtag: str = "#AIRevolution"
    seed_text: Optional[str] = "Excited about the newest AI breakthroughs and multi-modal models!"
    current_1h_volume: float = 65.0
    velocity_3h: float = 18.5
    sentiment_score: Optional[float] = None
    follower_tier: str = "macro"
    category: str = "Technology"
    hour_of_day: int = 14

@app.get("/")
def root():
    return {
        "project": "TrendPulse AI - Hashtag Trend Prediction & Social Media Analytics",
        "course": "Data Visualization & Social Media Analytics (DVSMA)",
        "status": "Online",
        "docs_url": "/docs"
    }

@app.get("/api/overview")
def get_overview():
    return engine.get_overview_kpis()

@app.get("/api/trending")
def get_trending(category: Optional[str] = Query(None, description="Category filter (e.g. Technology, Sports)")):
    return engine.get_trending_leaderboard(category=category)

@app.get("/api/hashtag/{hashtag}/timeseries")
def get_hashtag_timeseries(hashtag: str):
    return engine.get_timeseries_and_forecast(hashtag)

@app.post("/api/predict")
def predict_hashtag(payload: PredictionRequest):
    return engine.predict_custom_hashtag(payload.model_dump())

@app.get("/api/network")
def get_network_graph():
    return engine.network_data

@app.get("/api/sentiment-matrix")
def get_sentiment_matrix():
    return engine.get_sentiment_quadrant_matrix()

@app.get("/api/geographic")
def get_geographic_hotspots():
    return engine.get_geographic_hotspots()

@app.get("/api/model-performance")
def get_model_performance():
    return engine.model_metrics

@app.get("/api/sample-posts")
def get_sample_posts(hashtag: Optional[str] = Query(None), limit: int = Query(50, le=200)):
    return engine.get_sample_posts(hashtag=hashtag, limit=limit)

@app.get("/api/hashtag-baselines")
def get_hashtag_baselines():
    return engine.get_hashtag_baselines()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
