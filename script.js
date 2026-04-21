// GlobeGuard Real Brain - Static & Readable

async function loadLiveData() {
    try {
        const response = await fetch('alerts.json');
        const data = await response.json();
        
        // This helper function builds a clean list of clickable links
        function buildNewsList(elementId, articles, tag) {
            const listElement = document.getElementById(elementId);
            listElement.innerHTML = ""; // Clear the "Loading..." text
            
            articles.forEach(article => {
                // Creates a list item with a clickable link that opens in a new tab
                listElement.innerHTML += `
                    <li>
                        <strong>${tag}:</strong> 
                        <a href="${article.link}" target="_blank">${article.title}</a>
                    </li>`;
            });
        }
// Inject the AI Summaries into the new boxes
        document.getElementById('survival-ai').innerText = "🤖 AI Briefing: " + data.survivalSummary;
        document.getElementById('stock-ai').innerText = "🤖 AI Briefing: " + data.stockSummary;
        document.getElementById('trend-ai').innerText = "🤖 AI Briefing: " + data.trendSummary;
        // Send the data to the right HTML sections
        buildNewsList('survival-list', data.survival, 'ALERT');
        buildNewsList('stock-list', data.stock, 'ACTION');
        buildNewsList('trend-list', data.trend, 'TREND');
        
    } catch (error) {
        console.error("Error loading live data:", error);
        document.getElementById('survival-list').innerHTML = "<li>Error connecting to GlobeGuard servers.</li>";
    }
}


// Wake up the brain immediately when the page loads
loadLiveData();

// Check for new data every 60 seconds (60000 milliseconds)
setInterval(loadLiveData, 60000);
// ==========================================
// ==========================================
// 📱 APP NAVIGATION LOGIC
// ==========================================

function openSection(sectionId) {
    // 1. Hide the main menu grid
    document.getElementById('dashboard-menu').style.display = 'none';
    
    // 2. Make sure ALL data boxes are hidden first
    const sections = document.querySelectorAll('.category-box');
    sections.forEach(sec => sec.style.display = 'none');
    
    // 3. Show the specific box the user clicked on
    document.getElementById(sectionId).style.display = 'block';
    
    // 4. Show the Back Button
    document.getElementById('back-btn').style.display = 'block';
}

// What happens when you click the Back Button
document.getElementById('back-btn').addEventListener('click', () => {
    // 1. Hide all data boxes
    const sections = document.querySelectorAll('.category-box');
    sections.forEach(sec => sec.style.display = 'none');
    
    // 2. Hide the back button itself
    document.getElementById('back-btn').style.display = 'none';
    
    // 3. Bring back the main dashboard menu
    document.getElementById('dashboard-menu').style.display = 'grid';
});