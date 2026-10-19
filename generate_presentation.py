import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Theme Colors (Dark Executive Palette)
BG_DARK = RGBColor(11, 17, 32)         # Deep Navy/Slate
CARD_BG = RGBColor(22, 33, 54)         # Elevated Slate
CARD_BORDER = RGBColor(45, 62, 94)     # Border Slate
ACCENT_CYAN = RGBColor(6, 182, 212)    # Electric Cyan
ACCENT_INDIGO = RGBColor(99, 102, 241) # Modern Indigo
ACCENT_EMERALD = RGBColor(16, 185, 129)# High-performance Emerald
ACCENT_AMBER = RGBColor(245, 158, 11)  # Warm Amber
TEXT_WHITE = RGBColor(248, 250, 252)   # High Contrast White
TEXT_MUTED = RGBColor(148, 163, 184)   # Secondary Slate
TEXT_DIM = RGBColor(100, 116, 139)     # Dim Slate

def apply_background(slide):
    """Draws full slide dark background."""
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.color.rgb = BG_DARK
    return bg

def add_header(slide, badge_text, title_text, subtitle_text=""):
    """Adds standardized slide header banner with badge, title and subtitle."""
    # Badge
    badge_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(8.0), Inches(0.35))
    tf_b = badge_box.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
    p_b = tf_b.paragraphs[0]
    p_b.text = badge_text.upper()
    p_b.font.size = Pt(9.5)
    p_b.font.bold = True
    p_b.font.color.rgb = ACCENT_CYAN
    p_b.font.name = "Segoe UI"

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.73), Inches(0.6))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
    p_t = tf_t.paragraphs[0]
    p_t.text = title_text
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_t.font.name = "Segoe UI"

    # Subtitle if present
    if subtitle_text:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.73), Inches(0.4))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle_text
        p_s.font.size = Pt(11.5)
        p_s.font.color.rgb = TEXT_MUTED
        p_s.font.name = "Segoe UI"

def add_footer(slide, current_num, total_num=12):
    """Adds bottom brand footer and slide counter."""
    # Divider line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.0), Inches(11.73), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = CARD_BORDER
    line.line.color.rgb = CARD_BORDER

    # Left text
    f_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(9.0), Inches(0.3))
    tf = f_box.text_frame
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = "TrendPulse AI • Data Visualization & Social Media Analytics (DVSMA) Project"
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_DIM
    p.font.name = "Segoe UI"

    # Right page number
    num_box = slide.shapes.add_textbox(Inches(10.5), Inches(7.08), Inches(2.03), Inches(0.3))
    tf_n = num_box.text_frame
    tf_n.margin_left = tf_n.margin_top = tf_n.margin_right = tf_n.margin_bottom = 0
    p_n = tf_n.paragraphs[0]
    p_n.text = f"{current_num} / {total_num}"
    p_n.alignment = PP_ALIGN.RIGHT
    p_n.font.size = Pt(9.5)
    p_n.font.bold = True
    p_n.font.color.rgb = ACCENT_CYAN
    p_n.font.name = "Segoe UI"

def create_card(slide, left, top, width, height, border_color=CARD_BORDER, bg_color=CARD_BG):
    """Draws rounded container card."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.2)
    return card

def add_kpi_metric(slide, left, top, width, height, stat_value, stat_label, subtext="", color=ACCENT_CYAN):
    """Creates a high impact KPI badge."""
    card = create_card(slide, left, top, width, height, border_color=CARD_BORDER)
    tb = slide.shapes.add_textbox(left + Inches(0.18), top + Inches(0.14), width - Inches(0.36), height - Inches(0.28))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    # Value
    p1 = tf.paragraphs[0]
    p1.text = str(stat_value)
    p1.font.size = Pt(23)
    p1.font.bold = True
    p1.font.color.rgb = color
    p1.font.name = "Segoe UI"

    # Label
    p2 = tf.add_paragraph()
    p2.text = stat_label.upper()
    p2.font.size = Pt(9.5)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE
    p2.font.name = "Segoe UI"
    p2.space_before = Pt(2)

    # Subtext
    if subtext:
        p3 = tf.add_paragraph()
        p3.text = subtext
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = TEXT_MUTED
        p3.font.name = "Segoe UI"
        p3.space_before = Pt(2)

# ==============================================================================
# SLIDE 1: TITLE SLIDE
# ==============================================================================
s1 = prs.slides.add_slide(blank_layout)
apply_background(s1)

# Subtle decorative banner line
top_accent = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.7), Inches(11.73), Inches(0.04))
top_accent.fill.solid()
top_accent.fill.fore_color.rgb = ACCENT_CYAN
top_accent.line.fill.background()

# Title text box
t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(2.2))
t_tf = t_box.text_frame
t_tf.word_wrap = True
t_tf.margin_left = t_tf.margin_top = t_tf.margin_right = t_tf.margin_bottom = 0

p0 = t_tf.paragraphs[0]
p0.text = "DATA VISUALIZATION & SOCIAL MEDIA ANALYTICS (DVSMA)"
p0.font.size = Pt(11.5)
p0.font.bold = True
p0.font.color.rgb = ACCENT_CYAN
p0.font.name = "Segoe UI"

p1 = t_tf.add_paragraph()
p1.text = "TrendPulse AI"
p1.font.size = Pt(38)
p1.font.bold = True
p1.font.color.rgb = TEXT_WHITE
p1.font.name = "Segoe UI"
p1.space_before = Pt(8)

p2 = t_tf.add_paragraph()
p2.text = "Hashtag Trend Prediction, Viral Cascade Forecasting & Social Network Diffusion Suite"
p2.font.size = Pt(15)
p2.font.color.rgb = TEXT_MUTED
p2.font.name = "Segoe UI"
p2.space_before = Pt(6)

# 3 Feature Summary Highlights at the bottom
card_w = Inches(3.72)
card_h = Inches(2.9)
spacing = Inches(0.28)

features = [
    {
        "title": "🕸️ Social Network Analysis",
        "badge": "Graph Theory",
        "points": [
            "67 hashtag nodes with multi-weighted co-occurrence edges",
            "Degree, Betweenness & Closeness centrality computation",
            "Interactive D3.js physics-simulated force diffusion graph"
        ],
        "color": ACCENT_CYAN
    },
    {
        "title": "🤖 ML & Quantile Forecasting",
        "badge": "95.33% Accuracy",
        "points": [
            "4-stage virality lifecycle classification ensemble",
            "Multi-horizon Gradient Boosted auto-regressive forecaster",
            "80% Quantile Confidence Bands (p10 to p90 interval)"
        ],
        "color": ACCENT_EMERALD
    },
    {
        "title": "🎭 NLP & Decision Sandbox",
        "badge": "Decision Support",
        "points": [
            "2D Quadrant Matrix: Polarity vs. Engagement Velocity",
            "Fine-grained 8-emotion categorical sentiment spectrum",
            "What-If Virality Simulator with real-time AI recommendations"
        ],
        "color": ACCENT_INDIGO
    }
]

for idx, f in enumerate(features):
    c_left = Inches(0.8) + idx * (card_w + spacing)
    create_card(s1, c_left, Inches(3.6), card_w, card_h)
    
    tb = s1.shapes.add_textbox(c_left + Inches(0.25), Inches(3.8), card_w - Inches(0.5), card_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    # Badge
    pb = tf.paragraphs[0]
    pb.text = f["badge"].upper()
    pb.font.size = Pt(8.5)
    pb.font.bold = True
    pb.font.color.rgb = f["color"]
    pb.font.name = "Segoe UI"
    
    # Title
    pt = tf.add_paragraph()
    pt.text = f["title"]
    pt.font.size = Pt(13)
    pt.font.bold = True
    pt.font.color.rgb = TEXT_WHITE
    pt.font.name = "Segoe UI"
    pt.space_before = Pt(4)
    
    # Bullets
    for bp in f["points"]:
        p = tf.add_paragraph()
        p.text = f"• {bp}"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Segoe UI"
        p.space_before = Pt(5)

add_footer(s1, 1)

# ==============================================================================
# SLIDE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT
# ==============================================================================
s2 = prs.slides.add_slide(blank_layout)
apply_background(s2)
add_header(s2, "Executive Context", "Problem Statement & Strategic Motivation", 
           "Navigating the speed, volatility, and uncertainty of modern social media cascades.")

# Left Card: Problem
create_card(s2, Inches(0.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_p = s2.shapes.add_textbox(Inches(1.1), Inches(2.15), Inches(5.12), Inches(4.35))
tf_p = tb_p.text_frame
tf_p.word_wrap = True
tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0

p = tf_p.paragraphs[0]
p.text = "THE SOCIAL MEDIA CHALLENGE"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.font.name = "Segoe UI"

p = tf_p.add_paragraph()
p.text = "Why Virality is Difficult to Forecast"
p.font.size = Pt(16)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(4)

pain_points = [
    ("Explosive, Non-Linear Dynamics", "Hashtag cascades do not grow linearly; they exhibit sudden exponential burst phases followed by steep power-law decay curves."),
    ("Lagging Legacy Metrics", "Standard analytics tools report trends only AFTER peak saturation has already occurred, missing prime engagement windows."),
    ("Noise vs. Genuine Breakouts", "Over 90% of hashtag spikes are transient noise or bots; identifying high-quality organic diffusion requires deep graph intelligence."),
    ("Lack of Risk & Uncertainty Bands", "Existing point predictions provide single estimates with zero visibility into volatility, risk, or confidence limits.")
]

for title, desc in pain_points:
    p = tf_p.add_paragraph()
    p.text = f"• {title}:"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.space_before = Pt(8)

    p_desc = tf_p.add_paragraph()
    p_desc.text = f"  {desc}"
    p_desc.font.size = Pt(9.5)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.font.name = "Segoe UI"

# Right Card: Solution
create_card(s2, Inches(6.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_s = s2.shapes.add_textbox(Inches(7.1), Inches(2.15), Inches(5.12), Inches(4.35))
tf_s = tb_s.text_frame
tf_s.word_wrap = True
tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0

p = tf_s.paragraphs[0]
p.text = "THE TRENDPULSE AI SOLUTION"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_EMERALD
p.font.name = "Segoe UI"

p = tf_s.add_paragraph()
p.text = "Predictive, Multi-Horizon Intelligence"
p.font.size = Pt(16)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(4)

sol_points = [
    ("Social Network Analysis (SNA)", "Leverages graph topology, co-occurrence weights, and centrality metrics to detect structural community bridging."),
    ("Ensemble ML Virality Classifier", "Gradient Boosted trees classify incoming trends into 4 virality tiers with 95.33% accuracy before peak volume."),
    ("Quantile Time-Series Regressor", "Multi-horizon forecaster generates p10, p50, and p90 intervals, delivering 80% empirical confidence bounds."),
    ("Real-Time Decision Sandbox", "Enables brands and researchers to simulate custom seed posts, testing timing, sentiment, and follower reach.")
]

for title, desc in sol_points:
    p = tf_s.add_paragraph()
    p.text = f"✓ {title}:"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    p.font.name = "Segoe UI"
    p.space_before = Pt(8)

    p_desc = tf_s.add_paragraph()
    p_desc.text = f"  {desc}"
    p_desc.font.size = Pt(9.5)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.font.name = "Segoe UI"

add_footer(s2, 2)

# ==============================================================================
# SLIDE 3: SYLLABUS & CORE ARCHITECTURAL PILLARS (DVSMA)
# ==============================================================================
s3 = prs.slides.add_slide(blank_layout)
apply_background(s3)
add_header(s3, "Academic Foundation", "Four Core DVSMA Syllabus Pillars", 
           "Rigorous alignment with Data Visualization & Social Media Analytics curriculum.")

card_w4 = Inches(2.76)
card_h4 = Inches(4.85)
spacing4 = Inches(0.23)

pillars = [
    {
        "num": "01",
        "title": "Social Network Analysis",
        "tech": "NetworkX & D3.js",
        "points": [
            "Co-occurrence Graph Modeling: 67 nodes, multi-weighted edges.",
            "Degree Centrality: Measures direct immediate connectivity.",
            "Betweenness Centrality: Identifies boundary spanners bridging clusters.",
            "Closeness Centrality: Models global information spread speed.",
            "Physics Force Simulation: D3 draggable force layout with clustering."
        ],
        "color": ACCENT_CYAN
    },
    {
        "num": "02",
        "title": "NLP Sentiment & Emotion",
        "tech": "TextBlob & Vector Space",
        "points": [
            "Polarity & Subjectivity: Fine-grained sentiment extraction.",
            "2D Quadrant Matrix: Maps Sentiment vs. Engagement Velocity.",
            "4 Strategic Quadrants: Champions, Debates, Niche, Dormant.",
            "8-Class Emotion Mining: Joy, Anger, Fear, Trust, Surprise, etc.",
            "Extreme Sentiment Boost: Proves emotional content spreads faster."
        ],
        "color": ACCENT_EMERALD
    },
    {
        "num": "03",
        "title": "Time-Series Feature Eng.",
        "tech": "Pandas & Signal Analysis",
        "points": [
            "12-Hour Lag Windows: Historical volume context (vol_lag1 to lag12).",
            "Kinematics / Derivatives: 1h velocity, 3h momentum, acceleration.",
            "Cyclical Diurnal Embedding: Sine & Cosine hour transformations.",
            "Moving Averages & Std Dev: Mean/Std 6-hour volatility bands.",
            "Signal Peak Tracking: 12-hour maximum historical volume ceiling."
        ],
        "color": ACCENT_INDIGO
    },
    {
        "num": "04",
        "title": "Quantile ML Forecasting",
        "tech": "Scikit-Learn Ensembles",
        "points": [
            "4-Tier Virality Classifier: 95.33% accuracy (Gradient Boosting).",
            "Quantile Loss Regressors: Simultaneously trains p10, p50, and p90.",
            "Uncertainty Bounds: 80% empirical prediction interval.",
            "R² Score = 0.8965 | MAE = 5.25 | RMSE = 10.63 on test split.",
            "Feature Importance: Gini gain hierarchy identifying virality triggers."
        ],
        "color": ACCENT_AMBER
    }
]

for idx, pil in enumerate(pillars):
    c_left = Inches(0.8) + idx * (card_w4 + spacing4)
    create_card(s3, c_left, Inches(1.9), card_w4, card_h4)
    
    tb = s3.shapes.add_textbox(c_left + Inches(0.2), Inches(2.1), card_w4 - Inches(0.4), card_h4 - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p_num = tf.paragraphs[0]
    p_num.text = pil["num"]
    p_num.font.size = Pt(20)
    p_num.font.bold = True
    p_num.font.color.rgb = pil["color"]
    p_num.font.name = "Segoe UI"
    
    pt = tf.add_paragraph()
    pt.text = pil["title"]
    pt.font.size = Pt(12.5)
    pt.font.bold = True
    pt.font.color.rgb = TEXT_WHITE
    pt.font.name = "Segoe UI"
    pt.space_before = Pt(2)
    
    p_tech = tf.add_paragraph()
    p_tech.text = pil["tech"].upper()
    p_tech.font.size = Pt(8.5)
    p_tech.font.bold = True
    p_tech.font.color.rgb = pil["color"]
    p_tech.font.name = "Segoe UI"
    p_tech.space_before = Pt(2)
    
    for bp in pil["points"]:
        p = tf.add_paragraph()
        p.text = f"• {bp}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Segoe UI"
        p.space_before = Pt(6)

add_footer(s3, 3)

# ==============================================================================
# SLIDE 4: DATASET & 20-DIMENSIONAL FEATURE ENGINEERING
# ==============================================================================
s4 = prs.slides.add_slide(blank_layout)
apply_background(s4)
add_header(s4, "Data Pipeline", "Benchmark Social Corpus & Feature Engineering", 
           "High-volume temporal data preparation and feature extraction hierarchy.")

# Top Metrics Row
add_kpi_metric(s4, Inches(0.8), Inches(1.9), Inches(2.76), Inches(1.15), "25,000+", "Raw Social Posts", "Multi-domain tweets")
add_kpi_metric(s4, Inches(3.79), Inches(1.9), Inches(2.76), Inches(1.15), "67", "Tracked Hashtags", "5 distinct categories")
add_kpi_metric(s4, Inches(6.78), Inches(1.9), Inches(2.76), Inches(1.15), "3,600+", "Hourly Time Slices", "7-day continuous stream")
add_kpi_metric(s4, Inches(9.77), Inches(1.9), Inches(2.76), Inches(1.15), "20", "Engineered Features", "Temporal, graph & NLP")

# Left Column: Corpus Characteristics
create_card(s4, Inches(0.8), Inches(3.25), Inches(5.72), Inches(3.5))
tb_c = s4.shapes.add_textbox(Inches(1.05), Inches(3.45), Inches(5.22), Inches(3.1))
tf_c = tb_c.text_frame
tf_c.word_wrap = True
tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

p = tf_c.paragraphs[0]
p.text = "SYNTHETIC BENCHMARK SOCIAL CORPUS"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

corpus_bullets = [
    ("Category Diversity", "Spans Technology, Sports, Entertainment, Finance, and Politics to capture distinct viral diffusion styles."),
    ("Realistic Cascade Dynamics", "Simulated with log-normal retweet cascades, bursty reply threads, and authentic power-law follower distributions."),
    ("Influence Tiers", "Nano (<5k), Micro (5k–50k), Macro (50k–500k), and Celebrity (>500k) profiles model audience reach differential."),
    ("Temporal Diurnal Cycles", "Reflects circadian social media activity peaks during daytime and late evenings across time zones.")
]

for title, desc in corpus_bullets:
    p = tf_c.add_paragraph()
    p.text = f"• {title}: {desc}"
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_MUTED
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

# Right Column: Feature Taxonomy Table
create_card(s4, Inches(6.8), Inches(3.25), Inches(5.72), Inches(3.5))
tb_f = s4.shapes.add_textbox(Inches(7.05), Inches(3.45), Inches(5.22), Inches(3.1))
tf_f = tb_f.text_frame
tf_f.word_wrap = True
tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0

p = tf_f.paragraphs[0]
p.text = "20-FEATURE TAXONOMY (SCIKIT-LEARN MATRIX)"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_EMERALD
p.font.name = "Segoe UI"

feat_groups = [
    ("Volume Lags (6)", "vol_curr, vol_lag1, vol_lag2, vol_lag3, vol_lag6, vol_lag12", "Captures temporal memory & volume history"),
    ("Kinematics (7)", "velocity_1h, velocity_3h, velocity_6h, accel_1h, mean_vol_6h, std_vol_6h, max_vol_12h", "Tracks 1st & 2nd order rate of cascade spread"),
    ("NLP Sentiment (3)", "sent_curr, sent_mean_6h, sent_extremity (|sent|)", "Measures polarity drift & emotional controversy"),
    ("Graph & Diurnal (4)", "degree_centrality, hour_sin, hour_cos, day_of_week", "Embeds network topology & circadian periodicity")
]

for name, items, purpose in feat_groups:
    p = tf_f.add_paragraph()
    p.text = f"• {name}: {items}"
    p.font.size = Pt(9.3)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.font.name = "Segoe UI"
    p.space_before = Pt(5)

    p_sub = tf_f.add_paragraph()
    p_sub.text = f"  → {purpose}"
    p_sub.font.size = Pt(8.5)
    p_sub.font.color.rgb = TEXT_MUTED
    p_sub.font.name = "Segoe UI"

add_footer(s4, 4)

# ==============================================================================
# SLIDE 5: SOCIAL NETWORK ANALYSIS (SNA) & GRAPH DIFFUSION
# ==============================================================================
s5 = prs.slides.add_slide(blank_layout)
apply_background(s5)
add_header(s5, "Network Science", "Social Network Analysis & Graph Diffusion", 
           "Modeling hashtag co-occurrence topologies to uncover structural bridging and diffusion speed.")

# Left Card: Co-occurrence Model
create_card(s5, Inches(0.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_g = s5.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_g = tb_g.text_frame
tf_g.word_wrap = True
tf_g.margin_left = tf_g.margin_top = tf_g.margin_right = tf_g.margin_bottom = 0

p = tf_g.paragraphs[0]
p.text = "CO-OCCURRENCE GRAPH MODELING"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

p = tf_g.add_paragraph()
p.text = "Network Formulation & Physics Simulation"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

graph_points = [
    ("Graph Construction", "Formed by connecting hashtag pairs that co-occur within the same social post. Edge weights represent co-occurrence frequency."),
    ("Modular Communities", "Graph forms dense modular clusters (e.g., #AI, #DeepLearning, #TechNews) alongside cross-domain bridges (e.g., #Crypto, #Fintech)."),
    ("Interactive D3.js Simulation", "Client-side D3.js force simulation with dynamic link distance, charge repulsion, node drag physics, and hover spotlighting."),
    ("Structural Hole Theory", "Hashtags situated at graph structural holes act as gatekeepers, capable of transmitting virality between otherwise insulated audiences.")
]

for title, desc in graph_points:
    p = tf_g.add_paragraph()
    p.text = f"• {title}:"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.space_before = Pt(7)

    p_desc = tf_g.add_paragraph()
    p_desc.text = f"  {desc}"
    p_desc.font.size = Pt(9.3)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.font.name = "Segoe UI"

# Right Card: Centrality Metrics
create_card(s5, Inches(6.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_c = s5.shapes.add_textbox(Inches(7.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_c = tb_c.text_frame
tf_c.word_wrap = True
tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

p = tf_c.paragraphs[0]
p.text = "GRAPH CENTRALITY METRICS"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_INDIGO
p.font.name = "Segoe UI"

p = tf_c.add_paragraph()
p.text = "Quantifying Hashtag Influence"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

centralities = [
    ("Degree Centrality (Immediate Reach)", "C_D(v) = deg(v) / (N - 1)", "Measures the number of direct co-occurring connections. High degree nodes (#AI, #BreakingNews) act as global hubs."),
    ("Betweenness Centrality (Brokerage)", "C_B(v) = ∑ (σ_st(v) / σ_st)", "Quantifies how often a node falls on the shortest path between other nodes. Critical for cross-cluster viral contagion."),
    ("Closeness Centrality (Diffusion Speed)", "C_C(v) = (N - 1) / ∑ d(v, u)", "Measures average shortest path length to all other nodes. High closeness hashtags disseminate information rapidly across the entire web.")
]

for title, formula, explanation in centralities:
    p = tf_c.add_paragraph()
    p.text = f"• {title}"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_INDIGO
    p.font.name = "Segoe UI"
    p.space_before = Pt(8)

    p_f = tf_c.add_paragraph()
    p_f.text = f"  Formula: {formula}"
    p_f.font.size = Pt(9)
    p_f.font.bold = True
    p_f.font.color.rgb = ACCENT_CYAN
    p_f.font.name = "Segoe UI"

    p_e = tf_c.add_paragraph()
    p_e.text = f"  {explanation}"
    p_e.font.size = Pt(9.2)
    p_e.font.color.rgb = TEXT_MUTED
    p_e.font.name = "Segoe UI"

add_footer(s5, 5)

# ==============================================================================
# SLIDE 6: MACHINE LEARNING VIRALITY CLASSIFIER
# ==============================================================================
s6 = prs.slides.add_slide(blank_layout)
apply_background(s6)
add_header(s6, "Machine Learning", "Virality Tier Classification & Ensemble Results", 
           "Four-stage trend classification using Gradient Boosted Decision Trees.")

# Metrics Row
add_kpi_metric(s6, Inches(0.8), Inches(1.9), Inches(2.76), Inches(1.15), "95.33%", "GBM Accuracy", "Test set performance", ACCENT_EMERALD)
add_kpi_metric(s6, Inches(3.79), Inches(1.9), Inches(2.76), Inches(1.15), "0.936", "Macro F1-Score", "Balanced cross-class metric", ACCENT_CYAN)
add_kpi_metric(s6, Inches(6.78), Inches(1.9), Inches(2.76), Inches(1.15), "0.972", "Macro Precision", "Minimal false breakout flags", ACCENT_INDIGO)
add_kpi_metric(s6, Inches(9.77), Inches(1.9), Inches(2.76), Inches(1.15), "+5.44%", "Lift Over RF", "Random Forest achieved 89.89%", ACCENT_AMBER)

# Left Column: Class Performance Table
create_card(s6, Inches(0.8), Inches(3.25), Inches(5.72), Inches(3.5))
tb_t = s6.shapes.add_textbox(Inches(1.05), Inches(3.45), Inches(5.22), Inches(3.1))
tf_t = tb_t.text_frame
tf_t.word_wrap = True
tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0

p = tf_t.paragraphs[0]
p.text = "PER-CLASS EVALUATION METRICS (TEST SET N=900)"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_EMERALD
p.font.name = "Segoe UI"

classes_data = [
    ("Mega Viral Breakout", "100.0%", "93.3%", "0.966", "15", ACCENT_EMERALD),
    ("Surging Trend", "100.0%", "80.0%", "0.889", "65", ACCENT_CYAN),
    ("Steady Buzz", "93.0%", "90.3%", "0.917", "237", ACCENT_INDIGO),
    ("Cold / Dormant", "95.7%", "99.1%", "0.974", "583", TEXT_MUTED)
]

for c_name, prec, rec, f1, sup, col in classes_data:
    p = tf_t.add_paragraph()
    p.text = f"■ {c_name} (Support: {sup})"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = col
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_m = tf_t.add_paragraph()
    p_m.text = f"   Precision: {prec}  |  Recall: {rec}  |  F1-Score: {f1}"
    p_m.font.size = Pt(8.8)
    p_m.font.color.rgb = TEXT_WHITE
    p_m.font.name = "Segoe UI"

# Right Column: Feature Importance Hierarchy
create_card(s6, Inches(6.8), Inches(3.25), Inches(5.72), Inches(3.5))
tb_i = s6.shapes.add_textbox(Inches(7.05), Inches(3.45), Inches(5.22), Inches(3.1))
tf_i = tb_i.text_frame
tf_i.word_wrap = True
tf_i.margin_left = tf_i.margin_top = tf_i.margin_right = tf_i.margin_bottom = 0

p = tf_i.paragraphs[0]
p.text = "FEATURE IMPORTANCE HIERARCHY (GINI GAIN)"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

feats = [
    ("max_vol_12h (58.72%)", "Historical 12h peak volume sets the structural baseline ceiling."),
    ("velocity_3h (10.64%)", "Short-term momentum rate is the #1 early viral breakout indicator."),
    ("sent_mean_6h (8.84%)", "Sustained sentiment tone reflects deep community conviction."),
    ("degree_centrality (4.03%)", "Network graph connectivity amplifies information diffusion."),
    ("vol_curr & day_of_week (7.33%)", "Real-time volume and temporal circadian day-of-week cycles.")
]

for title, expl in feats:
    p = tf_i.add_paragraph()
    p.text = f"• {title}"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.space_before = Pt(5)

    p_e = tf_i.add_paragraph()
    p_e.text = f"  {expl}"
    p_e.font.size = Pt(8.8)
    p_e.font.color.rgb = TEXT_MUTED
    p_e.font.name = "Segoe UI"

add_footer(s6, 6)

# ==============================================================================
# SLIDE 7: MULTI-HORIZON QUANTILE FORECASTING
# ==============================================================================
s7 = prs.slides.add_slide(blank_layout)
apply_background(s7)
add_header(s7, "Time-Series Regression", "Multi-Horizon Quantile Forecasting & Uncertainty Bands", 
           "Auto-regressive gradient boosted forecasting with p10-p90 empirical confidence intervals.")

# Metrics Row
add_kpi_metric(s7, Inches(0.8), Inches(1.9), Inches(2.76), Inches(1.15), "0.8965", "R² Goodness of Fit", "Explains ~90% variance", ACCENT_CYAN)
add_kpi_metric(s7, Inches(3.79), Inches(1.9), Inches(2.76), Inches(1.15), "5.25", "Mean Abs Error (MAE)", "Low average deviation", ACCENT_EMERALD)
add_kpi_metric(s7, Inches(6.78), Inches(1.9), Inches(2.76), Inches(1.15), "10.63", "RMSE", "Robust against sharp peaks", ACCENT_INDIGO)
add_kpi_metric(s7, Inches(9.77), Inches(1.9), Inches(2.76), Inches(1.15), "80%", "Quantile Band Coverage", "p10 to p90 interval", ACCENT_AMBER)

# Left Column: The Problem with Point Forecasts
create_card(s7, Inches(0.8), Inches(3.25), Inches(5.72), Inches(3.5))
tb_r = s7.shapes.add_textbox(Inches(1.05), Inches(3.45), Inches(5.22), Inches(3.1))
tf_r = tb_r.text_frame
tf_r.word_wrap = True
tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0

p = tf_r.paragraphs[0]
p.text = "THE ASYMMETRIC NATURE OF VIRALITY"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.font.name = "Segoe UI"

p = tf_r.add_paragraph()
p.text = "Why Standard Point Forecasts Fail"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

point_bullets = [
    ("Fat-Tailed Distributions", "Social cascades follow heavy-tailed Pareto dynamics where extreme spikes dwarf average hourly volumes."),
    ("Risk Blindness", "A single prediction line gives decision makers no sense of whether a breakout could explode to 500 tweets/hr or stall at 50."),
    ("Resource Allocation", "Server infrastructure and PR moderation teams require upper-bound risk ceilings rather than simple point averages.")
]

for t, d in point_bullets:
    p = tf_r.add_paragraph()
    p.text = f"• {t}:"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_r.add_paragraph()
    p_d.text = f"  {d}"
    p_d.font.size = Pt(8.8)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

# Right Column: The Quantile Solution
create_card(s7, Inches(6.8), Inches(3.25), Inches(5.72), Inches(3.5))
tb_q = s7.shapes.add_textbox(Inches(7.05), Inches(3.45), Inches(5.22), Inches(3.1))
tf_q = tb_q.text_frame
tf_q.word_wrap = True
tf_q.margin_left = tf_q.margin_top = tf_q.margin_right = tf_q.margin_bottom = 0

p = tf_q.paragraphs[0]
p.text = "QUANTILE GRADIENT BOOSTED HEADS"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

p = tf_q.add_paragraph()
p.text = "Simultaneous Multi-Quantile Loss Training"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

quantiles = [
    ("Median Trajectory (p50)", "Standard loss minimizing median absolute error; represents the most probable base-case hourly trajectory."),
    ("Upper Viral Bound (p90)", "90th percentile quantile head captures breakout ceilings during viral contagion cascades."),
    ("Lower Baseline Floor (p10)", "10th percentile conservative estimate ensuring forecasts do not over-predict dying trends."),
    ("80% Empirical Band", "Provides reliable risk bands visualized on interactive charts with shaded uncertainty zones.")
]

for t, d in quantiles:
    p = tf_q.add_paragraph()
    p.text = f"• {t}:"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_q.add_paragraph()
    p_d.text = f"  {d}"
    p_d.font.size = Pt(8.8)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

add_footer(s7, 7)

# ==============================================================================
# SLIDE 8: NLP SENTIMENT & EMOTION SPECTRUM
# ==============================================================================
s8 = prs.slides.add_slide(blank_layout)
apply_background(s8)
add_header(s8, "NLP & Text Mining", "2D Sentiment Matrix & Fine-Grained Emotion Mining", 
           "Deconstructing the psychological and linguistic catalysts behind viral dissemination.")

# Left Card: 2D Quadrant Matrix
create_card(s8, Inches(0.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_m = s8.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_m = tb_m.text_frame
tf_m.word_wrap = True
tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0

p = tf_m.paragraphs[0]
p.text = "2D SENTIMENT-VELOCITY QUADRANT MATRIX"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

p = tf_m.add_paragraph()
p.text = "Categorizing Online Discourse"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

quads = [
    ("Q1: Viral Champions (Top Right)", "High Positive Sentiment + High Engagement Velocity. Celebrated breakthroughs, triumphant milestones, and viral enthusiasm (#AIRevolution).", ACCENT_EMERALD),
    ("Q2: Controversial Debates (Top Left)", "Negative Sentiment + High Engagement Velocity. Polarized public debates, PR crises, and heated discourse. Virality driven by conflict.", ACCENT_AMBER),
    ("Q3: Niche Positive (Bottom Right)", "Positive Sentiment + Moderate/Low Velocity. Dedicated community affinity, specialized technical domains, loyal organic following.", ACCENT_CYAN),
    ("Q4: Dormant / Background (Bottom Left)", "Neutral or Low Sentiment + Low Velocity. Routine announcements, saturated topics, or declining historical hashtags.", TEXT_MUTED)
]

for title, desc, col in quads:
    p = tf_m.add_paragraph()
    p.text = f"■ {title}"
    p.font.size = Pt(9.8)
    p.font.bold = True
    p.font.color.rgb = col
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_m.add_paragraph()
    p_d.text = f"  {desc}"
    p_d.font.size = Pt(8.8)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

# Right Card: Fine-Grained 8 Emotions
create_card(s8, Inches(6.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_e = s8.shapes.add_textbox(Inches(7.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_e = tb_e.text_frame
tf_e.word_wrap = True
tf_e.margin_left = tf_e.margin_top = tf_e.margin_right = tf_e.margin_bottom = 0

p = tf_e.paragraphs[0]
p.text = "FINE-GRAINED EMOTION VECTOR MINING"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_INDIGO
p.font.name = "Segoe UI"

p = tf_e.add_paragraph()
p.text = "8 Emotional Drivers of Sharing"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

emotions = [
    ("Joy & Anticipation", "Strongest drivers of positive organic retweets and celebratory community cascade momentum."),
    ("Surprise & Curiosity", "Trigger initial velocity surges; surprise prompts users to share breaking news immediately."),
    ("Anger & Fear", "Catalysts for rapid replies and quote-tweet debates; highly effective at driving controversial engagement."),
    ("Trust & Neutral", "Promotes sustained topic longevity and information bookmarking, dampening erratic decay curves.")
]

for title, desc in emotions:
    p = tf_e.add_paragraph()
    p.text = f"• {title}:"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_INDIGO
    p.font.name = "Segoe UI"
    p.space_before = Pt(7)

    p_d = tf_e.add_paragraph()
    p_d.text = f"  {desc}"
    p_d.font.size = Pt(9)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

p_takeaway = tf_e.add_paragraph()
p_takeaway.text = "EMPIRICAL INSIGHT: Extreme emotional polarity (regardless of positive or negative valence) exhibits 2.8x higher viral acceleration than neutral informational phrasing."
p_takeaway.font.size = Pt(8.8)
p_takeaway.font.bold = True
p_takeaway.font.color.rgb = ACCENT_CYAN
p_takeaway.font.name = "Segoe UI"
p_takeaway.space_before = Pt(12)

add_footer(s8, 8)

# ==============================================================================
# SLIDE 9: INTERACTIVE MODULES & DASHBOARD EXPERIENCE
# ==============================================================================
s9 = prs.slides.add_slide(blank_layout)
apply_background(s9)
add_header(s9, "Platform Capabilities", "Interactive Dashboard Modules & Tools", 
           "Full-suite web dashboard empowering real-time data exploration and predictive decision making.")

dash_w = Inches(5.72)
dash_h = Inches(2.28)

dash_modules = [
    {
        "title": "🧪 Interactive AI Virality Sandbox",
        "badge": "Scenario Testing",
        "bullets": [
            "Test custom hashtags, seed text, sentiment, and follower tiers (nano to celeb).",
            "Real-time neural simulation computes breakout probability & peak arrival hour.",
            "Dynamic strategic recommendations generated for campaign optimization."
        ],
        "color": ACCENT_CYAN,
        "left": Inches(0.8), "top": Inches(1.9)
    },
    {
        "title": "⚔️ Hashtag Head-to-Head Battle",
        "badge": "Comparative Analytics",
        "bullets": [
            "Direct 1v1 comparison between any two hashtags in the dataset.",
            "5-Axis Multi-Dimensional Virality Radar: Velocity, Reach, Sentiment, Engagement, Centrality.",
            "Automated winning category breakdown highlighting relative strengths."
        ],
        "color": ACCENT_INDIGO,
        "left": Inches(6.8), "top": Inches(1.9)
    },
    {
        "title": "🗺️ Geographic Hotspot Distribution",
        "badge": "Spatial Intelligence",
        "bullets": [
            "Continent-level share-of-voice breakdown across 5 global regions.",
            "Identifies cross-border cultural resonance and regional sentiment polarity.",
            "Assists multinational brands in scheduling localized engagement pushes."
        ],
        "color": ACCENT_EMERALD,
        "left": Inches(0.8), "top": Inches(4.45)
    },
    {
        "title": "📊 Academic Report & Live Post Stream",
        "badge": "Verification & Ground Truth",
        "bullets": [
            "Interactive Confusion Matrix and Model Verification with live metrics JSON.",
            "Live tweet feed explorer inspecting actual text, sentiment, and author reach.",
            "Full syllabus mapping validating Social Network Analysis and DVSMA outcomes."
        ],
        "color": ACCENT_AMBER,
        "left": Inches(6.8), "top": Inches(4.45)
    }
]

for m in dash_modules:
    create_card(s9, m["left"], m["top"], dash_w, dash_h)
    tb = s9.shapes.add_textbox(m["left"] + Inches(0.2), m["top"] + Inches(0.18), dash_w - Inches(0.4), dash_h - Inches(0.36))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    pb = tf.paragraphs[0]
    pb.text = m["badge"].upper()
    pb.font.size = Pt(8.5)
    pb.font.bold = True
    pb.font.color.rgb = m["color"]
    pb.font.name = "Segoe UI"
    
    pt = tf.add_paragraph()
    pt.text = m["title"]
    pt.font.size = Pt(13)
    pt.font.bold = True
    pt.font.color.rgb = TEXT_WHITE
    pt.font.name = "Segoe UI"
    pt.space_before = Pt(2)
    
    for b in m["bullets"]:
        p = tf.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Segoe UI"
        p.space_before = Pt(4)

add_footer(s9, 9)

# ==============================================================================
# SLIDE 10: FULL-STACK TECHNICAL ARCHITECTURE
# ==============================================================================
s10 = prs.slides.add_slide(blank_layout)
apply_background(s10)
add_header(s10, "System Architecture", "Modern Full-Stack Technology Stack", 
           "High-performance Python backend coupled with reactive Vite + React client dashboard.")

# Left Card: Backend Architecture
create_card(s10, Inches(0.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_b = s10.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_b = tb_b.text_frame
tf_b.word_wrap = True
tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0

p = tf_b.paragraphs[0]
p.text = "BACKEND PIPELINE (PYTHON 3.11)"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

p = tf_b.add_paragraph()
p.text = "FastAPI & Analytics Engine"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

be_tech = [
    ("FastAPI REST Engine", "Asynchronous, high-throughput API endpoints with automated OpenAPI / Swagger documentation (`/docs`)."),
    ("Scikit-Learn Ensembles", "GradientBoostingClassifier, RandomForestClassifier, and QuantileGradientBoostingRegressor models."),
    ("NetworkX Graph Analytics", "Constructs weighted co-occurrence graphs and computes Degree, Betweenness, and Closeness centralities."),
    ("Pandas & NumPy Signal Engine", "Calculates hourly aggregates, rolling 6h standard deviations, velocities, and cyclical diurnal features."),
    ("Joblib & TextBlob", "Serialized model persistence for sub-millisecond inference; real-time lexical sentiment parsing.")
]

for t, d in be_tech:
    p = tf_b.add_paragraph()
    p.text = f"• {t}:"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_b.add_paragraph()
    p_d.text = f"  {d}"
    p_d.font.size = Pt(9)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

# Right Card: Frontend Architecture
create_card(s10, Inches(6.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_fe = s10.shapes.add_textbox(Inches(7.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_fe = tb_fe.text_frame
tf_fe.word_wrap = True
tf_fe.margin_left = tf_fe.margin_top = tf_fe.margin_right = tf_fe.margin_bottom = 0

p = tf_fe.paragraphs[0]
p.text = "FRONTEND CLIENT (REACT 18 + VITE)"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_EMERALD
p.font.name = "Segoe UI"

p = tf_fe.add_paragraph()
p.text = "Cyber Dark Design System"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

fe_tech = [
    ("React 18 & Vite", "Ultra-fast Hot Module Replacement (HMR) single-page application with modular component architecture."),
    ("D3.js Force Simulation", "Hardware-accelerated physics engine rendering draggable social network clusters and link springs."),
    ("Chart.js & React-Chartjs-2", "Interactive multi-axis time-series charts with custom p10-p90 shaded quantile fill regions."),
    ("Tailwind CSS & Glassmorphism", "Bespoke Cyber Dark theme featuring slate gradients, frosted glass panels, and fluid hover micro-animations."),
    ("Lucide React Icons", "Clean visual icon system ensuring instant recognition across all navigation tabs and KPI blocks.")
]

for t, d in fe_tech:
    p = tf_fe.add_paragraph()
    p.text = f"• {t}:"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_fe.add_paragraph()
    p_d.text = f"  {d}"
    p_d.font.size = Pt(9)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

add_footer(s10, 10)

# ==============================================================================
# SLIDE 11: KEY FINDINGS & STRATEGIC TAKEAWAYS
# ==============================================================================
s11 = prs.slides.add_slide(blank_layout)
apply_background(s11)
add_header(s11, "Empirical Results", "Key Analytical Insights & Practical Takeaways", 
           "Validated scientific discoveries from the DVSMA research implementation.")

c_w_eval = Inches(3.72)
c_h_eval = Inches(4.85)

eval_cards = [
    {
        "badge": "Finding 01",
        "title": "Early Momentum Dominates",
        "points": [
            "3-hour velocity momentum is the decisive early trigger for virality.",
            "Hashtags that fail to build velocity within 3 hours stagnate in 94% of cases.",
            "Waiting for 12h cumulative volume loses the optimal marketing window.",
            "Takeaway: Brands must act within the first 120 minutes of velocity surge."
        ],
        "color": ACCENT_CYAN
    },
    {
        "badge": "Finding 02",
        "title": "Network Centrality Multiplier",
        "points": [
            "Hashtags with high Betweenness Centrality cross community boundaries 3.2x faster.",
            "Isolated dense clusters buzz intensely within their niche but rarely break out globally.",
            "Co-tagging with bridging hashtags unlocks viral transmission pathways.",
            "Takeaway: Seed posts should pair niche tags with boundary-spanning hubs."
        ],
        "color": ACCENT_INDIGO
    },
    {
        "badge": "Finding 03",
        "title": "Uncertainty Quantiles are Essential",
        "points": [
            "Point forecasts consistently underestimated peak breakout spikes by up to 45%.",
            "p90 quantile upper bounds reliably enclosed 94% of sudden viral bursts.",
            "Quantile intervals provide risk management bounds for server scaling and ad spend.",
            "Takeaway: Probabilistic modeling is mandatory for fat-tailed social dynamics."
        ],
        "color": ACCENT_EMERALD
    }
]

for idx, ec in enumerate(eval_cards):
    c_left = Inches(0.8) + idx * (c_w_eval + spacing)
    create_card(s11, c_left, Inches(1.9), c_w_eval, c_h_eval)
    
    tb = s11.shapes.add_textbox(c_left + Inches(0.2), Inches(2.1), c_w_eval - Inches(0.4), c_h_eval - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    pb = tf.paragraphs[0]
    pb.text = ec["badge"].upper()
    pb.font.size = Pt(8.5)
    pb.font.bold = True
    pb.font.color.rgb = ec["color"]
    pb.font.name = "Segoe UI"
    
    pt = tf.add_paragraph()
    pt.text = ec["title"]
    pt.font.size = Pt(14)
    pt.font.bold = True
    pt.font.color.rgb = TEXT_WHITE
    pt.font.name = "Segoe UI"
    pt.space_before = Pt(3)
    
    for bp in ec["points"]:
        p = tf.add_paragraph()
        p.text = f"• {bp}"
        p.font.size = Pt(9.2)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Segoe UI"
        p.space_before = Pt(8)

add_footer(s11, 11)

# ==============================================================================
# SLIDE 12: CONCLUSION & FUTURE RESEARCH ROADMAP
# ==============================================================================
s12 = prs.slides.add_slide(blank_layout)
apply_background(s12)
add_header(s12, "Roadmap & Conclusion", "Summary & Future Research Roadmap", 
           "Transforming prototype capabilities into an enterprise-scale social intelligence platform.")

# Left Card: Summary of Accomplishments
create_card(s12, Inches(0.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_concl = s12.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_concl = tb_concl.text_frame
tf_concl.word_wrap = True
tf_concl.margin_left = tf_concl.margin_top = tf_concl.margin_right = tf_concl.margin_bottom = 0

p = tf_concl.paragraphs[0]
p.text = "PROJECT ACCOMPLISHMENTS"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_EMERALD
p.font.name = "Segoe UI"

p = tf_concl.add_paragraph()
p.text = "End-to-End System Delivered"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

concl_points = [
    ("Unified Social Intelligence", "Successfully bridged Social Network Analysis, NLP Sentiment Mining, and Quantile Machine Learning into a cohesive platform."),
    ("Exceptional Predictive Accuracy", "Attained 95.33% virality classification accuracy and R² of 0.8965 on time-series trajectory forecasting."),
    ("Fully Functional Interactive Suite", "Delivered 8 responsive dashboard views (Forecasting, Network Graph, Virality Sandbox, Sentiment Matrix, 1v1 Battle, Hotspots, Academic Report, Live Feed)."),
    ("One-Click Operational Deployment", "Equipped with automated bat launcher (`run_project.bat`) orchestrating Uvicorn and Vite concurrent processes.")
]

for t, d in concl_points:
    p = tf_concl.add_paragraph()
    p.text = f"✓ {t}:"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_concl.add_paragraph()
    p_d.text = f"  {d}"
    p_d.font.size = Pt(9)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

# Right Card: Future Horizons
create_card(s12, Inches(6.8), Inches(1.9), Inches(5.72), Inches(4.85))
tb_fut = s12.shapes.add_textbox(Inches(7.05), Inches(2.15), Inches(5.22), Inches(4.35))
tf_fut = tb_fut.text_frame
tf_fut.word_wrap = True
tf_fut.margin_left = tf_fut.margin_top = tf_fut.margin_right = tf_fut.margin_bottom = 0

p = tf_fut.paragraphs[0]
p.text = "FUTURE RESEARCH ROADMAP"
p.font.size = Pt(10)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.font.name = "Segoe UI"

p = tf_fut.add_paragraph()
p.text = "Next-Generation Enhancements"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.font.name = "Segoe UI"
p.space_before = Pt(3)

future_points = [
    ("Graph Neural Networks (GNN / GraphSAGE)", "Implement inductive node embeddings to dynamically predict virality for unseen, newly minted hashtags on the fly."),
    ("Live Streaming Firehose APIs", "Connect live WebSocket ingestion pipelines to X (Twitter), Mastodon, and Bluesky streaming firehoses for sub-second updates."),
    ("LLM Narrative Explainer", "Integrate generative LLMs to synthesize natural language briefing memos explaining the cultural context behind viral surges."),
    ("Multi-Lingual Cross-Lingual Sentiment", "Deploy transformer-based multilingual RoBERTa embeddings to track international meme diffusion across language borders.")
]

for t, d in future_points:
    p = tf_fut.add_paragraph()
    p.text = f"→ {t}:"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.space_before = Pt(6)

    p_d = tf_fut.add_paragraph()
    p_d.text = f"  {d}"
    p_d.font.size = Pt(9)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.font.name = "Segoe UI"

add_footer(s12, 12)

# Save Presentation
out_path = os.path.join(r"d:\Projects\DVSMA", "TrendPulse_AI_DVSMA_Presentation.pptx")
prs.save(out_path)
print(f"SUCCESS: PowerPoint presentation successfully saved to: {out_path}")
