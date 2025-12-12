/**
 * NEURAL CONSTRUCTOR ENGINE v4.0 (ALCHEMIST EDITION)
 * ARCHITECT: MAGNUS OPUS
 * CAPABILITIES: DRAG-DROP, RESIZE, FILE INGESTION, ANALYTICS
 */

let selectedElement = null;
let currentPage = 'home';
let analyticsChart = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// NEURAL PHYSICS ENGINE: ONLINE ///", "color:#00f3ff; background:#000; padding:5px;");
    
    // 1. INITIALIZE SYSTEMS
    initDragAndDrop();
    initPropertiesListeners();
    initFileDropPhysics();
    initAnalytics(); // FIX: Now fully defined below
    
    // 2. GLOBAL LISTENERS
    const uploadInput = document.getElementById('global-upload');
    if(uploadInput) {
        uploadInput.addEventListener('change', handleFileUploadInput);
    }
});

// --- 1. DRAG AND DROP (UI ELEMENTS) ---

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const zone = document.getElementById('workspace');

    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', item.getAttribute('data-type'));
            e.dataTransfer.setData('source', 'sidebar'); // Identify source
        });
        
        // Mobile Tap-to-Add
        item.addEventListener('click', (e) => {
            if(window.innerWidth <= 768) {
                createComponent(item.getAttribute('data-type'), zone);
                toggleSidebar('left');
            }
        });
    });

    zone.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        if(!zone.classList.contains('drag-over-file')) zone.classList.add('drag-over'); 
    });
    
    zone.addEventListener('dragleave', () => { 
        zone.classList.remove('drag-over'); 
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        // Check if dropping a Sidebar Item or a Local File
        const type = e.dataTransfer.getData('type');
        const source = e.dataTransfer.getData('source');

        if(source === 'sidebar' && type) {
            createComponent(type, zone);
        }
    });
}

// --- 2. NATIVE FILE DROP PHYSICS (DESKTOP TO CANVAS) ---

function initFileDropPhysics() {
    const zone = document.getElementById('workspace');

    zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        // Check if dragging a file
        if (e.dataTransfer.types.includes('Files')) {
            zone.classList.add('drag-over-file');
        }
    });

    zone.addEventListener('dragleave', (e) => {
        // Prevent flickering when hovering over children
        if (e.target === zone) {
            zone.classList.remove('drag-over-file');
        }
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over-file');

        if (e.dataTransfer.files.length > 0) {
            handleFileIngestion(e.dataTransfer.files[0], zone);
        }
    });
}

// --- 3. COMPONENT FACTORY ---

function createComponent(type, zone, contentOverride = null) {
    // Remove placeholder
    const ph = document.querySelector('.placeholder-msg');
    if(ph) ph.remove();

    const el = document.createElement('div');
    el.classList.add('element');
    el.setAttribute('data-id', Date.now());
    
    // Inject Resizers
    const resizers = `
        <div class="resizer nw"></div>
        <div class="resizer ne"></div>
        <div class="resizer sw"></div>
        <div class="resizer se"></div>
    `;
    
    // TEMPLATE LOGIC
    let html = '';
    if(contentOverride) {
        html = contentOverride; // Used for file drops
    } else {
        switch(type) {
            case 'header-minimal':
                html = `<nav style="padding:20px; display:flex; justify-content:space-between; background:#fff; color:#000; border-bottom:1px solid #eee;"><b>BRAND</b> <div>Link 1 &nbsp; Link 2</div></nav>`; break;
            case 'header-cyber':
                html = `<nav style="padding:20px; display:flex; justify-content:space-between; background:#000; color:#00f3ff; border-bottom:1px solid #00f3ff;"><b style="letter-spacing:2px;">NEURAL_SYS</b> <div style="font-family:monospace;">[LOGIN]</div></nav>`; break;
            case 'hero-clean':
                html = `<div style="padding:100px 20px; text-align:center; background:#f8f9fa; color:#333;"><h1 style="font-size:3rem; margin:0;">The Future</h1><p>Minimalist design.</p><button style="padding:10px 20px; background:#333; color:#fff; border:none; margin-top:20px;">START</button></div>`; break;
            case 'hero-matrix':
                html = `<div style="padding:100px 20px; text-align:center; background:#000; color:#00f3ff; border-bottom:1px solid #333;"><h1 style="font-size:3rem; margin:0; text-shadow:0 0 10px #00f3ff;">WAKE_UP</h1><p style="font-family:monospace;">The Matrix has you...</p><button style="padding:10px 20px; background:transparent; color:#00f3ff; border:1px solid #00f3ff; margin-top:20px;">ENTER</button></div>`; break;
            case 'text-split':
                html = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; padding:60px 20px;"><div><h2>Header</h2><p>Content.</p></div><div style="background:#eee; height:100%;"></div></div>`; break;
            case 'features-grid':
                html = `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:60px 20px;"><div style="border:1px solid #ddd; padding:20px;"><h3>1</h3></div><div style="border:1px solid #ddd; padding:20px;"><h3>2</h3></div><div style="border:1px solid #ddd; padding:20px;"><h3>3</h3></div></div>`; break;
            case 'image':
                html = `<img src="https://via.placeholder.com/800x400" style="width:100%; height:auto; display:block;">`; break;
            case 'video':
                html = `<div style="width:100%; height:400px; background:#000; color:#fff; display:flex; justify-content:center; align-items:center;">[VIDEO]</div>`; break;
            case 'button-primary':
                html = `<div style="text-align:center; padding:20px;"><button style="background:#007bff; color:#fff; border:none; padding:15px 30px;">CLICK</button></div>`; break;
            case 'button-neon':
                html = `<div style="text-align:center; padding:20px;"><button style="background:transparent; color:#00f3ff; border:1px solid #00f3ff; padding:15px 30px; box-shadow:0 0 15px #00f3ff;">ACTIVATE</button></div>`; break;
        }
    }

    el.innerHTML = html + resizers; // Add content + resizers
    
    // CLICK TO SELECT
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectComponent(el);
    });

    // INIT RESIZERS FOR THIS ELEMENT
    initResizeLogic(el);

    zone.appendChild(el);
    selectComponent(el);
}

// --- 4. DIMENSIONAL MANIPULATION (RESIZE LOGIC) ---

function initResizeLogic(el) {
    const resizers = el.querySelectorAll('.resizer');
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;

    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Don't trigger drag/drop
            
            original_width = parseFloat(getComputedStyle(el, null).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(el, null).getPropertyValue('height').replace('px', ''));
            original_x = el.getBoundingClientRect().left;
            original_y = el.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            function resize(e) {
                if (resizer.classList.contains('se')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height + (e.pageY - original_mouse_y);
                    if (width > 50) el.style.width = width + 'px';
                    if (height > 50) el.style.height = height + 'px';
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
            }
        });
    });
}

// --- 5. ASSET INGESTION (UPLOAD) ---

window.triggerUpload = function() {
    document.getElementById('global-upload').click();
};

function handleFileUploadInput(e) {
    const file = e.target.files[0];
    if(file) processFile(file);
}

function handleFileIngestion(file, zone) {
    processFile(file, true, zone);
}

function processFile(file, isNewElement = false, zone = null) {
    if (!file.type.startsWith('image/')) {
        alert("PROTOCOL ERROR: ONLY IMAGE ARTIFACTS ACCEPTED.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        const result = evt.target.result;
        
        if (isNewElement && zone) {
            // Create a new Image Element from drop
            const imgHtml = `<img src="${result}" style="width:100%; height:auto; display:block;">`;
            createComponent('image', zone, imgHtml);
        } else if (selectedElement) {
            // Update existing selected element
            const img = selectedElement.querySelector('img');
            if(img) {
                img.src = result;
            } else {
                // If selected element isn't an image, force background
                selectedElement.style.backgroundImage = `url(${result})`;
                selectedElement.style.backgroundSize = 'cover';
                selectedElement.style.backgroundPosition = 'center';
            }
            // Update inputs
            const srcInput = document.getElementById('prop-src');
            if(srcInput) srcInput.value = file.name;
        }
    };
    reader.readAsDataURL(file);
}

// --- 6. SELECTION & PROPERTIES ---

function selectComponent(el) {
    document.querySelectorAll('.element').forEach(e => e.classList.remove('selected'));
    selectedElement = el;
    el.classList.add('selected');

    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('editor-controls').style.display = 'block';

    // Toggle Context Aware Controls
    const isImage = el.querySelector('img') || el.style.backgroundImage;
    const uploadCtrl = document.getElementById('ctrl-upload');
    const textCtrl = document.getElementById('ctrl-text');

    if(isImage) {
        uploadCtrl.style.display = 'block';
        textCtrl.style.display = 'none';
    } else {
        uploadCtrl.style.display = 'none';
        textCtrl.style.display = 'block';
        const txt = el.innerText || "";
        document.getElementById('prop-text').value = txt;
    }
}

function initPropertiesListeners() {
    document.getElementById('prop-text').addEventListener('input', (e) => {
        if(selectedElement && !selectedElement.querySelector('img')) {
             const contentNode = Array.from(selectedElement.childNodes).find(n => n.nodeType === 3 || (n.nodeType === 1 && !n.classList.contains('resizer')));
             if(contentNode) {
                 contentNode.textContent = e.target.value;
             } else {
                 const target = selectedElement.querySelector('h1, h2, h3, p, button, span');
                 if(target) target.innerText = e.target.value;
             }
        }
    });

    document.getElementById('prop-color').addEventListener('input', (e) => {
        if(selectedElement) selectedElement.style.backgroundColor = e.target.value;
    });

    document.getElementById('prop-padding').addEventListener('input', (e) => {
        if(selectedElement) selectedElement.style.padding = `${e.target.value}px`;
    });
}

// --- 7. NAVIGATION & UTILS ---

window.switchLeftTab = function(tabName) {
    document.querySelectorAll('.left-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
    document.getElementById(`panel-${tabName}`).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

window.loadPage = function(pageName) {
    document.getElementById('current-page-label').innerText = pageName.toUpperCase();
    document.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const ws = document.getElementById('workspace');
    ws.style.opacity = 0.5;
    setTimeout(() => ws.style.opacity = 1, 300);
};

window.toggleSidebar = function(side) {
    document.getElementById(`sidebar-${side}`).classList.toggle('mobile-open');
};

window.setDevice = function(mode) {
    const ws = document.getElementById('workspace');
    if(mode === 'mobile') {
        ws.style.maxWidth = '375px'; ws.style.border = '10px solid #333'; ws.style.borderRadius = '20px';
    } else {
        ws.style.maxWidth = '100%'; ws.style.border = 'none'; ws.style.borderRadius = '0';
    }
    document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

window.deleteSelected = function() {
    if(selectedElement && confirm("INCINERATE BLOCK?")) {
        selectedElement.remove();
        selectedElement = null;
        document.getElementById('editor-controls').style.display = 'none';
        document.getElementById('no-selection').style.display = 'block';
    }
};

window.togglePreview = function() {
    document.body.classList.toggle('preview-active');
};

window.openSettings = function() { document.getElementById('modal-settings').style.display = 'flex'; }
window.openAnalytics = function() { document.getElementById('modal-analytics').style.display = 'flex'; }
window.closeModal = function(id) { document.getElementById(id).style.display = 'none'; }

window.exportSite = function() {
    const btn = document.querySelector('.sys-btn.primary');
    const originalText = btn.innerText;
    btn.innerText = "COMPILING...";
    btn.style.background = "#fff";
    btn.style.color = "#000";
    
    setTimeout(() => {
        alert("NEURAL ARCHITECTURE COMPILED. DOWNLOAD INITIATED.");
        btn.innerText = "DEPLOYED";
        btn.style.background = "#00ff00";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "var(--accent)";
        }, 2000);
    }, 1500);
};

// --- 8. ANALYTICS ENGINE (MISSING PROTOCOL RESTORED) ---
function initAnalytics() {
    const ctx = document.getElementById('trafficChart');
    if(!ctx) return;

    if(analyticsChart) analyticsChart.destroy();

    analyticsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            datasets: [{
                label: 'NEURAL FLUX (TRAFFIC)',
                data: [12, 19, 3, 5, 2, 3, 45],
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#000',
                pointBorderColor: '#00f3ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { family: 'Space Mono' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#666', font: { family: 'Space Mono' } },
                    grid: { color: '#222' }
                },
                y: {
                    grid: { color: '#333' },
                    ticks: { color: '#666', font: { family: 'Space Mono' } }
                }
            }
        }
    });
}
