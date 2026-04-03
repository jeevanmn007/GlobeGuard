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
// 🌍 3D HOLOGRAPHIC GLOBE BACKGROUND
// ==========================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer and make the background transparent
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Force the globe to sit locked in the background
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1'; 
document.body.appendChild(renderer.domElement);

// Build the Wireframe Earth
const geometry = new THREE.SphereGeometry(14, 32, 32); 
// We use a glowing cyan color for that "tech dashboard" vibe
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ffcc, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.15 
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Position the camera so the globe is slightly off to the side/background
camera.position.z = 25;
camera.position.x = 8;

// The Animation Loop (makes it spin slowly!)
function animateGlobe() {
    requestAnimationFrame(animateGlobe);
    globe.rotation.y += 0.001; // Slow horizontal spin
    globe.rotation.x += 0.0005; // Slight vertical tilt
    renderer.render(scene, camera);
}
animateGlobe();

// Fix the globe if the user resizes their window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});