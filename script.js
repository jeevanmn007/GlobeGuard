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