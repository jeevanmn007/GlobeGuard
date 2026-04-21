// ==========================================
// 📱 APP NAVIGATION LOGIC
// ==========================================

function openSection(sectionId) {
    document.getElementById('dashboard-menu').style.display = 'none';
    
    const sections = document.querySelectorAll('.category-box');
    sections.forEach(sec => sec.style.display = 'none');
    
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById('back-btn').style.display = 'block';
}

document.getElementById('back-btn').addEventListener('click', () => {
    const sections = document.querySelectorAll('.category-box');
    sections.forEach(sec => sec.style.display = 'none');
    
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('dashboard-menu').style.display = 'grid';
});

// ==========================================
// 🧠 LIVE DATA INJECTION ENGINE
// ==========================================

async function loadIntelligenceData() {
    try {
        const response = await fetch('alerts.json');
        const data = await response.json();

        document.getElementById('defcon-level').innerText = `LEVEL ${data.globalThreatLevel}`;
        document.getElementById('action-plan').innerText = data.strategicPlan;

        const threatColors = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#7f1d1d'];
        document.getElementById('defcon-level').style.color = threatColors[data.globalThreatLevel - 1] || '#ef4444';

        function populateSection(category) {
            const summaryElement = document.getElementById(`${category}Summary`);
            if (summaryElement && data[`${category}Summary`]) {
                summaryElement.innerText = data[`${category}Summary`];
            }

            const listElement = document.getElementById(category);
            if (listElement && data[category]) {
                listElement.innerHTML = ''; 
                data[category].forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${item.link}" target="_blank" style="color: #60a5fa; text-decoration: none;">${item.title}</a>`;
                    listElement.appendChild(li);
                });
            }
        }

        populateSection('survival');
        populateSection('stock');
        populateSection('trend');
        populateSection('seismic');

    } catch (error) {
        console.error("Error loading intelligence data:", error);
    }
}

loadIntelligenceData();