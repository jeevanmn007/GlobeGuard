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

// Build the High-Tech Earth with Continents
const textureLoader = new THREE.TextureLoader();
// 1. Swap to a vibrant, realistic daytime Earth texture
const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

const geometry = new THREE.SphereGeometry(14, 64, 64); 
const material = new THREE.MeshStandardMaterial({ 
    map: earthTexture,
    transparent: true,
    opacity: 0.85 // Slightly more solid so the landmasses pop!
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// 2. Pump up the lighting so the colors look bright and cinematic
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); 
scene.add(ambientLight);

// 3. THE MAGIC FIX: Bring the camera WAY closer to make the Earth MASSIVE
camera.position.z = 18; // (We changed this from 32 down to 18)
camera.position.x = 0;  // Dead center

// The Animation Loop 
function animateGlobe() {
    requestAnimationFrame(animateGlobe);
    globe.rotation.y += 0.0015; // Slow spin to the right
    renderer.render(scene, camera);
}
animateGlobe();
// Fix the globe if the user resizes their window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});