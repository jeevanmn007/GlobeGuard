import os
import requests
import json
import google.generativeai as genai

# 1. Open the Vaults
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not NEWS_API_KEY or not GEMINI_API_KEY:
    from config import NEWS_API_KEY, GEMINI_API_KEY

# Configure the AI Brain
genai.configure(api_key=GEMINI_API_KEY)
# We use 'flash' because it is insanely fast
ai_model = genai.GenerativeModel('gemini-2.5-flash')

topics = {
    "survival": "food shortage OR energy crisis",
    "stock": "tech stocks OR market surge",
    "trend": "artificial intelligence OR new app"
}

# Notice we added 'Summary' slots for the AI's thoughts!
globe_guard_data = {
    "survival": [], "survivalSummary": "Analyzing global data...",
    "stock": [], "stockSummary": "Analyzing global data...",
    "trend": [], "trendSummary": "Analyzing global data..."
}

print("🧠 GlobeGuard True Brain upgrading with Gemini AI...")

for category, query in topics.items():
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if data.get("status") == "ok":
        top_articles = data["articles"][:15]
        headlines_for_ai = [] # We will give this list to the AI
        
        for article in top_articles:
            globe_guard_data[category].append({
                "title": article["title"],
                "link": article["url"]
            })
            headlines_for_ai.append(article["title"])
        
        # --- THE AI ANALYST WAKES UP ---
        print(f"🤖 Asking AI to summarize {category}...")
        text_block = "\n".join(headlines_for_ai)
        prompt = f"You are an elite geopolitical and financial analyst. Read these 15 breaking news headlines and write a punchy, 2-sentence executive summary of the overall situation. Do not use bullet points. Headlines: {text_block}"
        
        try:
            ai_response = ai_model.generate_content(prompt)
            globe_guard_data[f"{category}Summary"] = ai_response.text.strip()
        except Exception as e:
            print(f"❌ AI Error: {e}")
            globe_guard_data[f"{category}Summary"] = "AI systems currently offline. See raw data below."

# Save to JSON
with open("alerts.json", "w", encoding="utf-8") as file:
    json.dump(globe_guard_data, file, indent=4)

print("✅ SUCCESS: Live data AND AI Summaries saved!")