import os
import requests
import json

# Try to get the API key from the GitHub Secret Vault first
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")

# If the vault is empty (meaning we are on your laptop), use config.py
if not NEWS_API_KEY:
    from config import NEWS_API_KEY

# 1. The 3 Buckets
topics = {
# ... (Leave the rest of your code exactly as it is!)

# 1. The 3 Buckets
topics = {
    "survival": "food shortage OR energy crisis",
    "stock": "tech stocks OR market surge",
    "trend": "artificial intelligence OR new app"
}

# 2. Our upgraded digital box (Now holds titles AND links)
globe_guard_data = {
    "survival": [],
    "stock": [],
    "trend": []
}

print("🧠 GlobeGuard Brain upgrading...")

# 3. The Engine loop
for category, query in topics.items():
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if data.get("status") == "ok":
        top_articles = data["articles"][:10] # Grabbing the top 3
        
        for article in top_articles:
            # We save both the title and the URL as a pair!
            globe_guard_data[category].append({
                "title": article["title"],
                "link": article["url"]
            })

# 4. Save to JSON
with open("alerts.json", "w", encoding="utf-8") as file:
    json.dump(globe_guard_data, file, indent=4)

print("✅ SUCCESS: Live data WITH clickable links saved to alerts.json!")