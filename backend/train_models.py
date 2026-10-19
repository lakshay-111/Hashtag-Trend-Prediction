"""
TrendPulse AI - Machine Learning Training Pipeline
Course: Data Visualization and Social Media Analytics (DVSMA)

Trains:
1. Multi-Class Virality Tier Classifier (Gradient Boosting & Random Forest)
2. 24-Hour Multi-Horizon Time-Series Trend Forecaster
3. Sentiment-Engagement Impact Model
Exports trained models and comprehensive academic performance metrics.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def log(msg):
    print(msg, flush=True)

def load_and_engineer_features():
    log("Loading datasets for feature engineering...")
    df_hourly = pd.read_csv(os.path.join(DATA_DIR, "hourly_trends.csv"))
    
    with open(os.path.join(DATA_DIR, "hashtag_network.json"), "r") as f:
        network_data = json.load(f)
        
    centrality_map = {n["id"]: n["degree_centrality"] for n in network_data["nodes"]}
    
    df_hourly["timestamp"] = pd.to_datetime(df_hourly["timestamp"])
    df_hourly = df_hourly.sort_values(["hashtag", "timestamp"]).reset_index(drop=True)
    
    records = []
    
    for tag, group in df_hourly.groupby("hashtag"):
        deg_cent = centrality_map.get(tag, 0.05)
        
        # Extract numpy arrays for ultra-fast vector slicing
        vols = group["volume"].values.astype(float)
        sents = group["avg_sentiment"].values.astype(float)
        hours = group["hour_of_day"].values.astype(int)
        days = group["timestamp"].dt.dayofweek.values.astype(int)
        n = len(vols)
        
        for i in range(12, n - 24):
            vol_curr = vols[i]
            vol_lag1 = vols[i-1]
            vol_lag2 = vols[i-2]
            vol_lag3 = vols[i-3]
            vol_lag6 = vols[i-6]
            vol_lag12 = vols[i-12]
            
            # Velocities & accelerations
            velocity_1h = vol_curr - vol_lag1
            velocity_3h = (vol_curr - vol_lag3) / 3.0
            velocity_6h = (vol_curr - vol_lag6) / 6.0
            accel_1h = (vol_curr - 2 * vol_lag1 + vol_lag2)
            
            past_6_vols = vols[i-6:i]
            mean_vol_6h = float(np.mean(past_6_vols))
            std_vol_6h = float(np.std(past_6_vols))
            max_vol_12h = float(np.max(vols[i-12:i]))
            
            sent_curr = sents[i]
            sent_mean_6h = float(np.mean(sents[i-6:i]))
            sent_extremity = abs(sent_curr)
            
            h_val = hours[i]
            hour_sin = float(np.sin(2 * np.pi * h_val / 24.0))
            hour_cos = float(np.cos(2 * np.pi * h_val / 24.0))
            day_val = int(days[i])
            
            # Future 24h targets
            fut_vols = vols[i+1:i+25]
            future_max_vol = float(np.max(fut_vols))
            future_total_vol = float(np.sum(fut_vols))
            future_peak_step = int(np.argmax(fut_vols) + 1)
            
            # Virality tier labeling:
            # 0: Cold / Dormant
            # 1: Steady Buzz
            # 2: Surging Trend
            # 3: Mega Viral Breakout
            if future_max_vol > 180 or (future_max_vol > 100 and velocity_3h > 12):
                virality_tier = 3
            elif future_max_vol > 65 or velocity_3h > 5:
                virality_tier = 2
            elif future_max_vol > 20:
                virality_tier = 1
            else:
                virality_tier = 0
                
            records.append({
                "vol_curr": vol_curr,
                "vol_lag1": vol_lag1,
                "vol_lag2": vol_lag2,
                "vol_lag3": vol_lag3,
                "vol_lag6": vol_lag6,
                "vol_lag12": vol_lag12,
                "velocity_1h": velocity_1h,
                "velocity_3h": velocity_3h,
                "velocity_6h": velocity_6h,
                "accel_1h": accel_1h,
                "mean_vol_6h": mean_vol_6h,
                "std_vol_6h": std_vol_6h,
                "max_vol_12h": max_vol_12h,
                "sent_curr": sent_curr,
                "sent_mean_6h": sent_mean_6h,
                "sent_extremity": sent_extremity,
                "degree_centrality": deg_cent,
                "hour_sin": hour_sin,
                "hour_cos": hour_cos,
                "day_of_week": day_val,
                "virality_tier": virality_tier,
                "future_max_vol": future_max_vol,
                "future_total_vol": future_total_vol,
                "future_peak_step": future_peak_step
            })
            
    df_features = pd.DataFrame(records)
    log(f"Engineered dataset matrix with {len(df_features)} temporal sample windows.")
    return df_features

def train_and_evaluate():
    df = load_and_engineer_features()
    
    feature_cols = [
        "vol_curr", "vol_lag1", "vol_lag2", "vol_lag3", "vol_lag6", "vol_lag12",
        "velocity_1h", "velocity_3h", "velocity_6h", "accel_1h",
        "mean_vol_6h", "std_vol_6h", "max_vol_12h",
        "sent_curr", "sent_mean_6h", "sent_extremity",
        "degree_centrality", "hour_sin", "hour_cos", "day_of_week"
    ]
    
    X = df[feature_cols].values
    y_tier = df["virality_tier"].values
    y_max_vol = df["future_max_vol"].values
    
    X_train, X_test, y_train_tier, y_test_tier, y_train_max, y_test_max = train_test_split(
        X, y_tier, y_max_vol, test_size=0.2, random_state=42, stratify=y_tier
    )
    
    log("--- Training Virality Tier Classifier (Gradient Boosting) ---")
    clf = GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42)
    clf.fit(X_train, y_train_tier)
    
    rf_clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    rf_clf.fit(X_train, y_train_tier)
    
    y_pred_tier = clf.predict(X_test)
    y_pred_rf = rf_clf.predict(X_test)
    
    acc_gb = float(accuracy_score(y_test_tier, y_pred_tier))
    acc_rf = float(accuracy_score(y_test_tier, y_pred_rf))
    
    target_names = ["Cold / Dormant", "Steady Buzz", "Surging Trend", "Mega Viral Breakout"]
    cls_rep = classification_report(y_test_tier, y_pred_tier, target_names=target_names, output_dict=True)
    cm = confusion_matrix(y_test_tier, y_pred_tier).tolist()
    
    feature_importances = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in zip(feature_cols, clf.feature_importances_)
    ]
    feature_importances.sort(key=lambda x: x["importance"], reverse=True)
    
    log(f"Classifier Accuracy (GradientBoosting): {acc_gb * 100:.2f}% | (RandomForest): {acc_rf * 100:.2f}%")
    
    # Train Forecasters
    log("--- Training Multi-Horizon Trend Forecasters ---")
    reg_median = GradientBoostingRegressor(loss="squared_error", n_estimators=80, max_depth=4, random_state=42)
    reg_median.fit(X_train, y_train_max)
    
    reg_upper = GradientBoostingRegressor(loss="quantile", alpha=0.90, n_estimators=60, max_depth=3, random_state=42)
    reg_upper.fit(X_train, y_train_max)
    
    reg_lower = GradientBoostingRegressor(loss="quantile", alpha=0.10, n_estimators=60, max_depth=3, random_state=42)
    reg_lower.fit(X_train, y_train_max)
    
    y_pred_max = reg_median.predict(X_test)
    mae = float(mean_absolute_error(y_test_max, y_pred_max))
    rmse = float(np.sqrt(mean_squared_error(y_test_max, y_pred_max)))
    r2 = float(r2_score(y_test_max, y_pred_max))
    
    log(f"Regression Metrics -> MAE: {mae:.2f} | RMSE: {rmse:.2f} | R2: {r2:.4f}")
    
    # Save Model Artifacts
    joblib.dump(clf, os.path.join(MODELS_DIR, "virality_classifier.joblib"))
    joblib.dump(rf_clf, os.path.join(MODELS_DIR, "rf_classifier.joblib"))
    joblib.dump(reg_median, os.path.join(MODELS_DIR, "forecaster_median.joblib"))
    joblib.dump(reg_upper, os.path.join(MODELS_DIR, "forecaster_upper.joblib"))
    joblib.dump(reg_lower, os.path.join(MODELS_DIR, "forecaster_lower.joblib"))
    
    metrics_payload = {
        "model_metadata": {
            "name": "TrendPulse AI - Virality & Forecasting Engine",
            "framework": "Scikit-Learn Gradient Boosting & Random Forest Ensembles",
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "feature_count": len(feature_cols),
            "features": feature_cols
        },
        "classification_metrics": {
            "accuracy": round(acc_gb, 4),
            "random_forest_accuracy": round(acc_rf, 4),
            "precision_macro": round(cls_rep["macro avg"]["precision"], 4),
            "recall_macro": round(cls_rep["macro avg"]["recall"], 4),
            "f1_macro": round(cls_rep["macro avg"]["f1-score"], 4),
            "confusion_matrix": cm,
            "classes": target_names,
            "per_class": {
                name: {
                    "precision": round(cls_rep[name]["precision"], 4),
                    "recall": round(cls_rep[name]["recall"], 4),
                    "f1_score": round(cls_rep[name]["f1-score"], 4),
                    "support": cls_rep[name]["support"]
                }
                for name in target_names
            },
            "feature_importance": feature_importances
        },
        "regression_metrics": {
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "r2_score": round(r2, 4),
            "confidence_band_coverage": "80% (p10 to p90 interval)"
        }
    }
    
    with open(os.path.join(MODELS_DIR, "model_metrics.json"), "w") as f:
        json.dump(metrics_payload, f, indent=2)
        
    log("Successfully saved all trained models and metrics to backend/models/")

if __name__ == "__main__":
    train_and_evaluate()
