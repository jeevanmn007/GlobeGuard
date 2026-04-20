import os
import requests
import json
import google.generativeai as genai
import yfinance as yf
import pandas as pd 

# 1. Access the Vaults
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not NEWS_API_KEY or not GEMINI_API_KEY:
    try:
        from config import NEWS_API_KEY, GEMINI_API_KEY
    except ImportError:
        pass 

# 2. Configure the AI Strategist
genai.configure(api_key=GEMINI_API_KEY)
ai_model = genai.GenerativeModel('gemini-2.5-flash')

topics = {
    "survival": "food shortage OR energy crisis",
    "trend": "artificial intelligence OR new tech"
}

# Added the 'seismic' and 'seismicSummary' slots
globe_guard_data = {
    "globalThreatLevel": 0,    
    "strategicPlan": "Analyzing global data...",
    "survival": [],
    "stock": [],
    "trend": [],
    "seismic": [],
    "seismicSummary": "Analyzing tectonic data..."
}

print("🧠 GlobeGuard AI Strategist initializing Data Mesh...")

total_threat_score = 0
items_scanned = 0

# 3. Fetch Data & Calculate Baselines

# A. Financial Data
print("📈 Analyzing live financial volatility...")
tickers = ["NVDA", "AAPL", "MSFT", "PLTR", "AMZN"]
for ticker in tickers:
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="5d") 
        if not data.empty:
            current_price = data['Close'].iloc[-1]
            yesterday_price = data['Close'].iloc[-2]
            percent_change = ((current_price - yesterday_price) / yesterday_price) * 100
            
            total_threat_score += abs(percent_change)
            items_scanned += 1
            
            globe_guard_data["stock"].append({
                "title": f"💰 {ticker}: ${round(current_price, 2)} ({round(percent_change, 2)}%)",
                "link": f"https://finance.yahoo.com/quote/{ticker}"
            })
    except Exception as e:
        print(f"Error analyzing {ticker}: {e}")

# B. News Data
for category, query in topics.items():
    print(f"📡 Scanning news urgency: {category}...")
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    data = response.json()
    if "articles" in data:
        for article in data["articles"][:4]:
            total_threat_score += 1.5 
            items_scanned += 1
            globe_guard_data[category].append({
                "title": article["title"],
                "link": article["url"]
            })

# C. NEW: Seismic & Planetary Data (USGS API)
print("🌍 Tapping into USGS Global Seismic Network...")
try:
    # Pulls earthquakes magnitude 4.5+ from the last 24 hours
    seismic_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"
    seismic_response = requests.get(seismic_url)
    seismic_data = seismic_response.json()
    
    if "features" in seismic_data:
        # Get the top 4 strongest quakes
        quakes = sorted(seismic_data["features"], key=lambda x: x['properties']['mag'], reverse=True)[:4]
        for quake in quakes:
            mag = quake['properties']['mag']
            place = quake['properties']['place']
            url = quake['properties']['url']
            
            # Massive earthquakes heavily spike the global threat level
            if mag >= 6.0:
                total_threat_score += 5
            elif mag >= 5.0:
                total_threat_score += 2
            
            items_scanned += 1
            globe_guard_data["seismic"].append({
                "title": f"⚠️ Mag {mag} - {place}",
                "link": url
            })
except Exception as e:
    print(f"❌ Seismic Uplink Error: {e}")

# 4. Calculate Final Threat Score
if items_scanned > 0:
    base_threat = total_threat_score / items_scanned
    globe_guard_data["globalThreatLevel"] = max(1, min(5, round(base_threat / 1.5))) 
else:
    globe_guard_data["globalThreatLevel"] = 1 

# 5. Let Gemini AI create the Strategic Plan
print(f"🤖 AI generating global strategy. Current Threat: Level {globe_guard_data['globalThreatLevel']}...")
try:
    full_data_context = json.dumps(globe_guard_data, indent=2)
    
    prompt = f"""
        You are a seasoned global intelligence and risk strategist for GlobeGuard.
        Analyze the raw news, financial data, and SEISMIC earthquake data provided below.
        
        DATA:
        {full_data_context}
        
        Write a concise, authoritative Strategic Directive.
        1. Start with a direct assessment of the situation incorporating the geopolitical, financial, AND physical tectonic threats.
        2. Provide 3 specific, actionable points for the user to secure their assets and physical safety.
        
        Keep the tone professional, urgent, but calm. Your final output should be ONE paragraph.
    """
    
    response = ai_model.generate_content(prompt)
    globe_guard_data["strategicPlan"] = response.text.strip()
    
    # Generate a specific 1-sentence summary for the Seismic section
    seismic_prompt = f"Summarize this earthquake data in one short, urgent sentence: {globe_guard_data['seismic']}"
    globe_guard_data["seismicSummary"] = ai_model.generate_content(seismic_prompt).text.strip()
    
except Exception as e:
    print(f"❌ AI Strategy Error: {e}")
    globe_guard_data["strategicPlan"] = "AI systems offline. Proceed with caution."

# 6. Save the Intelli-File
with open("alerts.json", "w") as f:
    json.dump(globe_guard_data, f, indent=4)

print(f"✅ SUCCESS: GlobeGuard data saved with Threat Level {globe_guard_data['globalThreatLevel']}!")