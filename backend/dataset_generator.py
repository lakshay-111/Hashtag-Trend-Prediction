"""
TrendPulse AI - High Performance Social Media Dataset Generator
Course: Data Visualization and Social Media Analytics (DVSMA)
"""

import os
import json
import random
import datetime
import sys
import numpy as np
import pandas as pd

np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

HASHTAG_TOPICS = {
    "#AIRevolution": {
        "category": "Technology",
        "base_sentiment": 0.65,
        "sentiment_variance": 0.25,
        "virality_profile": "hyper_burst",
        "burst_day": 8,
        "base_volume": 550,
        "co_tags": ["#GenerativeAI", "#TechTrends", "#MachineLearning", "#OpenAI", "#FutureOfWork"],
        "keywords": ["breakthrough", "GPT-5", "neural net", "superintelligent", "automation", "efficiency", "game changer"]
    },
    "#GenerativeAI": {
        "category": "Technology",
        "base_sentiment": 0.55,
        "sentiment_variance": 0.3,
        "virality_profile": "steady_high",
        "burst_day": 5,
        "base_volume": 620,
        "co_tags": ["#AIRevolution", "#TechTrends", "#DesignAI", "#CodingWithAI"],
        "keywords": ["prompt engineering", "synthetic media", "creative workflow", "LLM", "diffusion model", "transformer"]
    },
    "#QuantumComputing": {
        "category": "Technology",
        "base_sentiment": 0.45,
        "sentiment_variance": 0.2,
        "virality_profile": "rising",
        "burst_day": 10,
        "base_volume": 220,
        "co_tags": ["#TechTrends", "#Physics", "#DeepTech", "#CyberSecurity2026"],
        "keywords": ["qubits", "entanglement", "quantum supremacy", "superconducting", "algorithms", "encryption"]
    },
    "#CyberSecurity2026": {
        "category": "Technology",
        "base_sentiment": -0.2,
        "sentiment_variance": 0.35,
        "virality_profile": "spiky",
        "burst_day": 7,
        "base_volume": 380,
        "co_tags": ["#ZeroTrust", "#DataPrivacy", "#TechTrends", "#InfoSec"],
        "keywords": ["zero-day", "ransomware", "data leak", "firewall", "encryption", "phishing alert", "vulnerability"]
    },
    "#Web3Gaming": {
        "category": "Gaming",
        "base_sentiment": 0.15,
        "sentiment_variance": 0.45,
        "virality_profile": "declining",
        "burst_day": 3,
        "base_volume": 280,
        "co_tags": ["#Metaverse", "#GamingCommunity", "#Esports", "#DigitalAssets"],
        "keywords": ["on-chain", "virtual worlds", "play-to-earn", "guilds", "graphics engine", "avatar economy"]
    },
    "#GTA6Trailer": {
        "category": "Gaming",
        "base_sentiment": 0.85,
        "sentiment_variance": 0.15,
        "virality_profile": "mega_viral",
        "burst_day": 9,
        "base_volume": 950,
        "co_tags": ["#GamingCommunity", "#RockstarGames", "#ViceCity", "#GameOfTheYear"],
        "keywords": ["jaw-dropping", "graphics", "soundtrack", "release date", "open world", "pre-order", "hype"]
    },
    "#ChampionsLeague": {
        "category": "Sports",
        "base_sentiment": 0.35,
        "sentiment_variance": 0.5,
        "virality_profile": "cyclic_burst",
        "burst_day": 6,
        "base_volume": 780,
        "co_tags": ["#Football", "#UCL", "#MatchDay", "#Golazo", "#RealMadrid", "#ManCity"],
        "keywords": ["last-minute goal", "hat-trick", "referee decision", "comeback", "stadium atmosphere", "quarterfinals"]
    },
    "#IPL2026": {
        "category": "Sports",
        "base_sentiment": 0.70,
        "sentiment_variance": 0.3,
        "virality_profile": "sustained_massive",
        "burst_day": 7,
        "base_volume": 1050,
        "co_tags": ["#CricketFever", "#MatchDay", "#Sixer", "#CricketTwitter", "#T20"],
        "keywords": ["boundary", "super over", "captaincy", "century", "stadium roar", "orange cap", "unbelievable catch"]
    },
    "#ClimateActionNow": {
        "category": "Environment",
        "base_sentiment": -0.10,
        "sentiment_variance": 0.4,
        "virality_profile": "steady_medium",
        "burst_day": 4,
        "base_volume": 320,
        "co_tags": ["#Sustainability", "#RenewableEnergy", "#CleanTech", "#EcoFriendly"],
        "keywords": ["carbon footprint", "solar energy", "net zero", "climate summit", "glacier melt", "green future"]
    },
    "#ElectricVehicles": {
        "category": "Automotive",
        "base_sentiment": 0.40,
        "sentiment_variance": 0.35,
        "virality_profile": "rising",
        "burst_day": 8,
        "base_volume": 420,
        "co_tags": ["#CleanTech", "#Sustainability", "#AutonomousDriving", "#Tesla", "#BatteryTech"],
        "keywords": ["charging network", "solid state battery", "range test", "zero emissions", "autopilot", "EV adoption"]
    },
    "#Oscars2026": {
        "category": "Entertainment",
        "base_sentiment": 0.50,
        "sentiment_variance": 0.4,
        "virality_profile": "flash_peak",
        "burst_day": 11,
        "base_volume": 700,
        "co_tags": ["#BestPicture", "#Cinema", "#RedCarpet", "#FilmTwitter", "#Hollywood"],
        "keywords": ["acceptance speech", "red carpet dress", "snubbed", "standing ovation", "director", "cinematography"]
    },
    "#StartupGrind": {
        "category": "Business",
        "base_sentiment": 0.60,
        "sentiment_variance": 0.25,
        "virality_profile": "steady_medium",
        "burst_day": 4,
        "base_volume": 310,
        "co_tags": ["#VentureCapital", "#FounderLife", "#Fintech", "#SaaS", "#AngelInvesting"],
        "keywords": ["seed round", "product-market fit", "pitch deck", "scaling", "bootstrapping", "unicorn", "revenue"]
    },
    "#DigitalNomadLife": {
        "category": "Lifestyle",
        "base_sentiment": 0.75,
        "sentiment_variance": 0.2,
        "virality_profile": "rising",
        "burst_day": 6,
        "base_volume": 260,
        "co_tags": ["#RemoteWork", "#TravelVibes", "#WorkFromAnywhere", "#SoloTravel"],
        "keywords": ["co-working", "coffee shop office", "sunrise view", "productivity", "passport stamps", "freedom"]
    },
    "#FintechInnovation": {
        "category": "Business",
        "base_sentiment": 0.45,
        "sentiment_variance": 0.3,
        "virality_profile": "steady_high",
        "burst_day": 7,
        "base_volume": 360,
        "co_tags": ["#StartupGrind", "#VentureCapital", "#DigitalBanking", "#CyberSecurity2026"],
        "keywords": ["contactless pay", "cross-border remittances", "neobank", "API banking", "financial inclusion"]
    },
    "#MetaverseWork": {
        "category": "Technology",
        "base_sentiment": -0.05,
        "sentiment_variance": 0.45,
        "virality_profile": "declining",
        "burst_day": 2,
        "base_volume": 190,
        "co_tags": ["#VirtualReality", "#FutureOfWork", "#Web3Gaming", "#SpatialComputing"],
        "keywords": ["VR headset", "virtual avatar", "remote meeting", "virtual office", "headset fatigue", "spatial audio"]
    }
}

EMOTIONS = ["Joy", "Anticipation", "Surprise", "Trust", "Anger", "Fear", "Sadness", "Neutral"]
REGIONS = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East & Africa"]
COUNTRIES = {
    "North America": ["USA", "Canada"],
    "Europe": ["UK", "Germany", "France", "Netherlands"],
    "Asia-Pacific": ["India", "Japan", "Singapore", "Australia", "South Korea"],
    "Latin America": ["Brazil", "Mexico", "Argentina"],
    "Middle East & Africa": ["UAE", "South Africa", "Nigeria", "Saudi Arabia"]
}

def generate_post_text(tag, topic_info, sentiment_score):
    keywords = topic_info["keywords"]
    co_tags = topic_info["co_tags"]
    selected_kw = random.sample(keywords, min(2, len(keywords)))
    selected_co = random.sample(co_tags, random.choice([0, 1, 2]))
    
    if sentiment_score > 0.4:
        templates = [
            f"Absolutely astonished by the {selected_kw[0]} in {tag}! This is a total milestone. {selected_kw[1]} is here. {' '.join(selected_co)}",
            f"Incredible progress today in {tag}. The speed of {selected_kw[0]} and {selected_kw[1]} is unmatched! {' '.join(selected_co)}",
            f"Can we talk about how {tag} completely changed the game regarding {selected_kw[0]}?! Exciting times ahead! {' '.join(selected_co)}"
        ]
    elif sentiment_score < -0.2:
        templates = [
            f"Serious concerns raised regarding {tag}. The issues with {selected_kw[0]} cannot be ignored anymore. {' '.join(selected_co)}",
            f"Why is nobody addressing the major flaws in {tag}? Especially around {selected_kw[0]} and {selected_kw[1]}. {' '.join(selected_co)}",
            f"Disappointed with the recent outcome of {tag}. We need higher accountability for {selected_kw[0]}. {' '.join(selected_co)}"
        ]
    else:
        templates = [
            f"Analyzing the latest benchmark for {tag}. Observing key developments in {selected_kw[0]} and {selected_kw[1]}. {' '.join(selected_co)}",
            f"Interesting perspective on {tag}. How will {selected_kw[0]} reshape industry standards? {' '.join(selected_co)}",
            f"Daily briefing: {tag} continues to evolve with notable shifts in {selected_kw[0]}. Thoughts? {' '.join(selected_co)}"
        ]
    return random.choice(templates)

def generate_synthetic_dataset(num_days=14, num_posts=25000):
    start_date = datetime.datetime.now() - datetime.timedelta(days=num_days)
    print(f"Generating dataset for {len(HASHTAG_TOPICS)} hashtags over {num_days} days...", flush=True)
    
    total_hours = num_days * 24
    hourly_records = []
    
    for tag, info in HASHTAG_TOPICS.items():
        base_vol = info["base_volume"]
        burst_day = info["burst_day"]
        profile = info["virality_profile"]
        category = info["category"]
        
        for h in range(total_hours):
            current_time = start_date + datetime.timedelta(hours=h)
            hour_of_day = current_time.hour
            day_num = h // 24
            
            diurnal = 0.4 + 0.6 * np.sin((hour_of_day - 6) / 24 * 2 * np.pi) ** 2
            
            if profile == "hyper_burst" or profile == "mega_viral":
                dist_to_burst = (h - burst_day * 24)
                if dist_to_burst < 0:
                    multiplier = np.exp(dist_to_burst / 24.0) * (5.0 if profile == "mega_viral" else 3.5)
                else:
                    multiplier = np.exp(-dist_to_burst / 36.0) * (6.0 if profile == "mega_viral" else 4.0)
                burst_factor = max(0.15, multiplier)
            elif profile == "rising":
                burst_factor = 0.3 + 2.2 * (h / total_hours) ** 1.8
            elif profile == "declining":
                burst_factor = max(0.2, 2.5 * (1 - h / total_hours) ** 1.5)
            elif profile == "cyclic_burst":
                burst_factor = 1.0 + 1.8 * (np.sin(h / 12.0) > 0.6)
            elif profile == "flash_peak":
                dist = abs(h - burst_day * 24)
                burst_factor = 0.2 + 4.5 * np.exp(- (dist ** 2) / 60.0)
            else:
                burst_factor = 1.0 + 0.2 * np.sin(h / 8.0)
            
            noise = float(np.random.normal(1.0, 0.12))
            hourly_vol = max(5, int(base_vol / 24.0 * diurnal * burst_factor * noise))
            
            base_sent = info["base_sentiment"]
            sent_var = info["sentiment_variance"]
            sent_drift = 0.1 * np.sin(h / 18.0)
            hourly_sentiment = float(np.clip(base_sent + sent_drift + np.random.normal(0, sent_var * 0.5), -1.0, 1.0))
            
            engagement_rate = max(0.015, float(0.045 + 0.03 * burst_factor + np.random.normal(0, 0.008)))
            est_reach = int(hourly_vol * np.random.randint(120, 650) * (1.0 + burst_factor * 0.4))
            
            hourly_records.append({
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "datetime_obj": current_time,
                "hashtag": tag,
                "category": category,
                "volume": hourly_vol,
                "reach": est_reach,
                "avg_sentiment": round(hourly_sentiment, 3),
                "engagement_rate": round(engagement_rate, 4),
                "virality_velocity": round(hourly_vol * engagement_rate * 10, 2),
                "hour_of_day": hour_of_day,
                "day_num": day_num
            })
            
    df_hourly = pd.DataFrame(hourly_records)
    # Save without datetime_obj
    df_hourly_save = df_hourly.drop(columns=["datetime_obj"])
    df_hourly_save.to_csv(os.path.join(DATA_DIR, "hourly_trends.csv"), index=False)
    print(f"Saved {len(df_hourly_save)} hourly time series records to hourly_trends.csv", flush=True)

    # Pre-organize hourly rows by hashtag for fast sampling
    tag_grouped = {}
    for tag in HASHTAG_TOPICS.keys():
        sub = df_hourly[df_hourly["hashtag"] == tag]
        vols = sub["volume"].values.astype(float)
        p = vols / vols.sum()
        tag_grouped[tag] = {
            "rows": sub.to_dict("records"),
            "probs": p
        }
        
    usernames = ["tech_guru", "data_wizard", "viral_hunter", "crypto_sage", "sports_insider", 
                 "ai_pulse", "future_scout", "market_hawk", "culture_hub", "eco_sentinel",
                 "code_architect", "pixel_master", "venture_lens", "global_anchor", "trend_caster"]
    
    posts = []
    post_id = 100000
    tag_keys = list(HASHTAG_TOPICS.keys())
    
    for i in range(num_posts):
        tag = random.choice(tag_keys)
        info = HASHTAG_TOPICS[tag]
        
        group = tag_grouped[tag]
        chosen_idx = np.random.choice(len(group["rows"]), p=group["probs"])
        chosen_row = group["rows"][chosen_idx]
        
        post_time = chosen_row["datetime_obj"] + datetime.timedelta(minutes=random.randint(0, 59), seconds=random.randint(0, 59))
        sentiment_score = float(np.clip(np.random.normal(chosen_row["avg_sentiment"], info["sentiment_variance"]), -1.0, 1.0))
        subjectivity = float(np.clip(random.uniform(0.3, 0.9) if abs(sentiment_score) > 0.4 else random.uniform(0.1, 0.5), 0.0, 1.0))
        
        if sentiment_score > 0.5:
            emotion = random.choice(["Joy", "Anticipation", "Surprise"])
        elif sentiment_score < -0.3:
            emotion = random.choice(["Anger", "Fear", "Sadness"])
        else:
            emotion = random.choice(["Trust", "Neutral", "Anticipation"])
            
        is_verified = random.random() < 0.18
        follower_count = int(np.random.lognormal(mean=7.5, sigma=1.8)) if not is_verified else int(np.random.lognormal(mean=11.2, sigma=1.2))
        
        virality_mult = chosen_row["virality_velocity"] / 20.0
        base_likes = max(0, int(follower_count * 0.005 * virality_mult * np.random.exponential(scale=1.0)))
        likes = max(0, base_likes + random.randint(0, 15))
        retweets = max(0, int(likes * random.uniform(0.15, 0.55)))
        quotes = max(0, int(retweets * random.uniform(0.05, 0.25)))
        replies = max(0, int(likes * random.uniform(0.08, 0.35)))
        impressions = int((likes + retweets + 1) * random.randint(18, 55) + follower_count * random.uniform(0.05, 0.2))
        
        region = random.choice(REGIONS)
        country = random.choice(COUNTRIES[region])
        text = generate_post_text(tag, info, sentiment_score)
        
        posts.append({
            "post_id": f"post_{post_id + i}",
            "timestamp": post_time.strftime("%Y-%m-%d %H:%M:%S"),
            "author_handle": f"@{random.choice(usernames)}_{random.randint(10, 999)}",
            "author_followers": follower_count,
            "is_verified": is_verified,
            "hashtag": tag,
            "category": info["category"],
            "post_text": text,
            "sentiment_polarity": round(sentiment_score, 3),
            "sentiment_subjectivity": round(subjectivity, 3),
            "dominant_emotion": emotion,
            "likes": likes,
            "retweets": retweets,
            "quotes": quotes,
            "replies": replies,
            "impressions": impressions,
            "engagement_score": round((likes + retweets * 2 + quotes * 3 + replies * 1.5) / max(10, impressions) * 100, 2),
            "region": region,
            "country": country,
            "language": "en"
        })
        
    df_posts = pd.DataFrame(posts)
    df_posts.sort_values("timestamp", inplace=True)
    df_posts.to_csv(os.path.join(DATA_DIR, "raw_tweets.csv"), index=False)
    print(f"Successfully generated {len(df_posts)} raw social media posts to raw_tweets.csv", flush=True)
    
    generate_network_graph_cache(df_posts)

def generate_network_graph_cache(df_posts):
    import networkx as nx
    
    G = nx.Graph()
    co_occurrences = {}
    tag_counts = {}
    
    for _, row in df_posts.iterrows():
        primary_tag = row["hashtag"]
        tag_counts[primary_tag] = tag_counts.get(primary_tag, 0) + 1
        
        text_words = row["post_text"].split()
        mentioned_tags = [w.strip(".,!?:") for w in text_words if w.startswith("#")]
        
        for other_tag in mentioned_tags:
            if other_tag != primary_tag:
                tag_counts[other_tag] = tag_counts.get(other_tag, 0) + 1
                pair = tuple(sorted([primary_tag, other_tag]))
                co_occurrences[pair] = co_occurrences.get(pair, 0) + 1
                
    for tag, count in tag_counts.items():
        cat = HASHTAG_TOPICS.get(tag, {}).get("category", "General")
        G.add_node(tag, volume=count, category=cat)
        
    for (u, v), weight in co_occurrences.items():
        if weight >= 2:
            G.add_edge(u, v, weight=weight)
            
    degree_cent = nx.degree_centrality(G)
    betweenness_cent = nx.betweenness_centrality(G)
    closeness_cent = nx.closeness_centrality(G)
    
    nodes_data = []
    for node in G.nodes():
        nodes_data.append({
            "id": node,
            "name": node,
            "volume": G.nodes[node].get("volume", 10),
            "category": G.nodes[node].get("category", "General"),
            "degree_centrality": round(degree_cent.get(node, 0), 4),
            "betweenness_centrality": round(betweenness_cent.get(node, 0), 4),
            "closeness_centrality": round(closeness_cent.get(node, 0), 4),
            "degree": G.degree[node]
        })
        
    links_data = []
    for u, v, data in G.edges(data=True):
        links_data.append({
            "source": u,
            "target": v,
            "weight": data["weight"]
        })
        
    network_payload = {
        "nodes": nodes_data,
        "links": links_data,
        "total_nodes": len(nodes_data),
        "total_edges": len(links_data)
    }
    
    with open(os.path.join(DATA_DIR, "hashtag_network.json"), "w") as f:
        json.dump(network_payload, f, indent=2)
    print(f"Built network graph: {len(nodes_data)} nodes, {len(links_data)} edges -> hashtag_network.json", flush=True)

if __name__ == "__main__":
    generate_synthetic_dataset()
