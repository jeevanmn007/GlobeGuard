import os
import requests
import json
import google.generativeai as genai
import yfinance as yf

# 1. Open the Vaults
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not NEWS_API_KEY or not GEMINI_API_KEY:
    from config import NEWS_API_KEY, GEMINI_API_KEY

# Configure the AI Brain
genai.configure(api_key=GEMINI_API_KEY)
ai_model = genai.GenerativeModel('gemini-2.5-flash')

# Notice we removed "stock" from topics because it gets real data now!
topics = {
    "survival": "food shortage OR energy crisis",
    "trend": "artificial intelligence OR new app"
}

globe_guard_data = {
    "survival": [], "survivalSummary": "Analyzing global data...",
    "stock": [], "stockSummary": "Analyzing global data...",
    "trend": [], "trendSummary": "Analyzing global data..."
}

print("🧠 GlobeGuard True Brain upgrading with Gemini AI...")

# 2. Fetch News for Survival and Trend
for category, query in topics.items():
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    data = response.json()
    if "articles" in data:
        for article in data["articles"][:5]:
            globe_guard_data[category].append({
                "title": article["title"],
                "link": article["url"]
            })

# 3. NEW: Fetch LIVE Stock Market Data!
print("📈 Fetching live Wall Street data...")
tickers = ["NVDA", "AAPL", "MSFT", "PLTR", "AMZN"] 
for ticker in tickers:
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if not data.empty:
            price = data['Close'].iloc[-1]
            globe_guard_data["stock"].append({
                "title": f"💰 {ticker}: ${round(price, 2)}",
                "link": f"https://finance.yahoo.com/quote/{ticker}"
            })
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")

# 4. Generate AI Summaries
for category in ["survival", "stock", "trend"]:
    print(f"🤖 Asking AI to summarize {category}...")
    try:
        raw_text = str(globe_guard_data[category])
        prompt = f"You are a global intelligence analyst. Summarize this data into ONE punchy, urgent sentence: {raw_text}"
        response = ai_model.generate_content(prompt)
        globe_guard_data[f"{category}Summary"] = response.text.strip()
    except Exception as e:
        print(f"❌ AI Error: {e}")
        globe_guard_data[f"{category}Summary"] = "AI systems currently offline. See raw data below."

# 5. Save the File
with open("alerts.json", "w") as f:
    json.dump(globe_guard_data, f, indent=4)

print("✅ SUCCESS: Live data AND AI Summaries saved!")