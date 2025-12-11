/**
 * NEURAL CONSTRUCTOR ENGINE v2.0
 * ARCHITECT: MAGNUS OPUS
 */

// STATE MANAGEMENT
let selectedElement = null;
let currentPage = 'home';

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    console.log("/// BUILDER ENGINE INITIALIZED ///");
    initDragAndDrop();
    initPropertiesListeners();
    initAnalytics();
});

// --- 1. DRAG AND DROP CORE ---
function initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const zone = document.getElementById('workspace');

    // PICK UP
    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', item.getAttribute('data-type'));
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    // HOVER ZONE
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary to allow dropping
        zone.style.borderColor = '#00f3ff';
        zone.style.boxShadow = '0 0 30px rgba(0, 243, 255, 0.2)';
    });

    // LEAVE ZONE
    zone.addEventListener('dragleave', () => {
        zone.style.borderColor = 'transparent';
        zone.style.boxShadow = 'none';
    });

    // DROP (THE CREATION EVENT)
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'transparent';
        zone.style.boxShadow = 'none';
        
        const type = e.dataTransfer.getData('type');
        if(type) createComponent(type, zone);
    });
}

function createComponent(type, zone) {
    // REMOVE PLACEHOLDER IF EXISTS
    const ph = document.querySelector('.placeholder-msg');
    if(ph) ph.remove();

    const el = document.createElement('div');
    el.classList.add('element');
    el.setAttribute('data-id', Date.now());
    
    // STYLE BASE
    el.style.position = 'relative';
    el.style.marginBottom = '10px';
    el.style.transition = 'all 0.2s ease';
    
    // TEMPLATE LOGIC
    let content = '';
    
    switch(type) {
        case 'header':
            content = `<nav style="background:#111; color:#fff; padding:20px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold; font-size:1.2rem;">BRAND_LOGO</span>
                <div style="font-size:0.8rem; opacity:0.7;">LINK_1  /  LINK_2</div>
            </nav>`;
            break;
        case 'hero':
            content = `<div style="background: linear-gradient(45deg, #1a1a1a, #000); color:#fff; padding:80px 20px; text-align:center; border-bottom:1px solid #333;">
                <h1 style="font-size:3rem; margin:0 0 20px 0; text-transform:uppercase;">HERO_TITLE</h1>
                <p style="opacity:0.8; max-width:600px; margin:0 auto;">Subtitle description goes here. Edit this text in the properties panel.</p>
            </div>`;
            break;
        case 'text-block':
            content = `<div style="padding:40px; color:#000; line-height:1.6;">
                <h3 style="margin-top:0;">SECTION TITLE</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
            </div>`;
            break;
        case 'image':
            content = `<div style="width:100%; height:300px; background:#eee; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="https://via.placeholder.com/1200x600" style="width:100%; height:100%; object-fit:cover;">
            </div>`;
            break;
        case 'button':
            content = `<div style="padding:20px; text-align:center;">
                <button style="background:#00f3ff; color:#000; border:none; padding:15px 40px; font-weight:bold; font-size:1rem; cursor:pointer;">CALL TO ACTION</button>
            </div>`;
            break;
        case 'video':
            content = `<div style="width:100%; height:400px; background:#000; display:flex; align-items:center; justify-content:center; color:#fff; border:1px solid #333;">
                [VIDEO_STREAM_PLACEHOLDER]
            </div>`;
            break;
    }

    el.innerHTML = content;

    // CLICK TO SELECT (EVENT BUBBLING)
    el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent clicking "through" to the workspace
        selectComponent(el);
    });

    zone.appendChild(el);
    selectComponent(el); // Auto-select new item
}

// --- 2. PROPERTIES ENGINE ---
function selectComponent(el) {
    // DESELECT ALL
    document.querySelectorAll('.element').forEach(e => {
        e.style.outline = 'none';
        e.classList.remove('selected');
    });

    // SELECT NEW
    selectedElement = el;
    el.classList.add('selected');
    el.style.outline = '2px solid #00f3ff';

    // SHOW PANEL
    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('editor-controls').style.display = 'block';

    // POPULATE FIELDS
    // Try to find text content
    const textTarget = el.querySelector('h1, h3, p, span, button');
    if(textTarget) {
        document.getElementById('prop-text').value = textTarget.innerText;
    } else {
        document.getElementById('prop-text').value = "Container Element";
    }
}

function initPropertiesListeners() {
    // TEXT EDITOR
    document.getElementById('prop-text').addEventListener('input', (e) => {
        if(!selectedElement) return;
        const textTarget = selectedElement.querySelector('h1, h3, p, span, button');
        if(textTarget) textTarget.innerText = e.target.value;
    });

    // COLOR EDITOR
    document.getElementById('prop-color').addEventListener('input', (e) => {
        if(!selectedElement) return;
        // Apply to background of the first child div
        const child = selectedElement.firstElementChild;
        if(child) {
            child.style.background = e.target.value;
            // Also update button if it exists
            const btn = selectedElement.querySelector('button');
            if(btn) btn.style.background = e.target.value;
        }
        document.getElementById('hex-val').innerText = e.target.value;
    });
}

// --- 3. GLOBAL FUNCTIONS (Window Attached) ---

window.deleteSelected = function() {
    if(selectedElement) {
        if(confirm("DELETE ARTIFACT?")) {
            selectedElement.remove();
            selectedElement = null;
            document.getElementById('editor-controls').style.display = 'none';
            document.getElementById('no-selection').style.display = 'block';
        }
    }
};

window.switchLeftTab = function(tabName) {
    // Hide all panels
    document.querySelectorAll('.left-panel').forEach(p => p.classList.remove('active'));
    // Show target
    document.getElementById(`panel-${tabName}`).classList.add('active');
    
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

window.loadPage = function(pageName) {
    currentPage = pageName;
    document.getElementById('current-page-label').innerText = pageName.toUpperCase();
    
    // UI Update
    document.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // In a real app, this would swap the HTML of #workspace
    // For demo, we flash a notification
    const ws = document.getElementById('workspace');
    ws.style.opacity = '0.5';
    setTimeout(() => ws.style.opacity = '1', 200);
};

window.togglePreview = function() {
    document.body.classList.toggle('preview-mode');
    alert("PREVIEW MODE: UI CHROME HIDDEN");
};

// --- 4. ANALYTICS & MODALS ---

window.openAnalytics = function() {
    document.getElementById('modal-analytics').style.display = 'flex';
};

window.openSettings = function() {
    document.getElementById('modal-settings').style.display = 'flex';
};

window.closeModal = function(id) {
    document.getElementById(id).style.display = 'none';
};

function initAnalytics() {
    const ctx = document.getElementById('trafficChart');
    if(ctx && window.Chart) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'TRAFFIC',
                    data: [12, 19, 15, 25, 22, 30, 45],
                    borderColor: '#00f3ff',
                    backgroundColor: 'rgba(0, 243, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: '#222' } },
                    y: { grid: { color: '#222' } }
                }
            }
        });
    }
}

// --- 5. DEPLOYMENT ---
window.exportSite = function() {
    const btn = document.querySelector('.sys-btn.primary');
    const originalText = btn.innerText;
    
    btn.innerText = "COMPILING...";
    btn.style.background = "#fff";
    btn.style.color = "#000";
    
    setTimeout(() => {
        alert("SITE PACKAGE COMPILED. INITIATING DOWNLOAD...");
        btn.innerText = "DEPLOYED";
        btn.style.background = "#00ff00";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "var(--accent)";
        }, 2000);
    }, 1500);
};
