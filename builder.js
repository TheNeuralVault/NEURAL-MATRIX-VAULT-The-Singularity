/**
 * NEURAL CONSTRUCTOR v10.0 (OMNI-PHYSICS + LINK MATRIX)
 * ARCHITECT: MAGNUS OPUS
 */

// /// 1. PRODUCT INTELLIGENCE DATABASE ///
const PRODUCT_CATALOG = {
    core: { title: "THE NEURAL CORE", price: "$2,500.00", link: "https://buy.stripe.com/7sY7sL8dib6SbuvbPt8g001", mission: "Complete digital transformation...", tech: "Custom WebGL & Three.js..." },
    flux: { title: "FLUX VELOCITY", price: "$2,500.00", link: "https://buy.stripe.com/aFa3cv2SY3EqaqrcTx8g002", mission: "High-speed retail architecture...", tech: "Lightweight SPA & GSAP..." },
    aero: { title: "AERO PROTOCOL", price: "$2,500.00", link: "https://buy.stripe.com/bJe28r79e3Eq7efcTx8g003", mission: "Corporate precision...", tech: "Asymmetrical CSS Grid..." },
    nexus: { title: "NEXUS STREAM", price: "$2,500.00", link: "https://buy.stripe.com/3cIeVd2SY5My1TV4n18g00c", mission: "Deploy your Mobile Command Center...", tech: "PWA & Real-time API..." },
    cipher: { title: "CIPHER PROTOCOL", price: "$2,500.00", link: "https://buy.stripe.com/3cIeVddxCdf04233iX8g00d", mission: "The Granite Wealth Architecture...", tech: "AES-256 & Ticker Integration..." },
    prism: { title: "PRISM SaaS", price: "$2,500.00", link: "https://buy.stripe.com/4gM8wP65afn8buv06L8g00e", mission: "Liquid Intelligence made manifest...", tech: "React/Vue Hybrid & D3.js..." },
    omega: { title: "OMEGA REALITY", price: "$2,500.00", link: "https://buy.stripe.com/14A9AT79ea2OdCDf1F8g00f", mission: "Beyond the Screen...", tech: "Three.js & WebXR Integration..." }
};

let selectedElement = null;
let uploadedMedia = [];
let zIndexCounter = 100;
let analyticsChart = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// NEURAL SYSTEM ONLINE ///", "color:#00f3ff; background:#000; padding:5px;");
    
    // Listeners
    const mediaInput = document.getElementById('media-upload-input');
    if(mediaInput) mediaInput.addEventListener('change', handleMediaUpload);
    
    document.getElementById('prop-text').addEventListener('input', updateProps);
    document.getElementById('prop-link').addEventListener('input', updateProps);
    document.getElementById('prop-color').addEventListener('input', updateProps);
    document.getElementById('prop-z').addEventListener('input', updateProps);
    
    // Global deselect
    const ws = document.getElementById('workspace');
    if(ws) {
        ws.addEventListener('pointerdown', (e) => { 
            if(e.target.id === 'workspace') deselectAll(); 
        });
    }

    loadSpec('core');
    initAnalytics(); // Start Analytics Engine
});

// /// 2. SPAWN LOGIC ///

window.triggerMediaUpload = function() { document.getElementById('media-upload-input').click(); };

function handleMediaUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const src = evt.target.result;
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            uploadedMedia.push({ src, type });
            renderThumbnail(src, type);
        };
        reader.readAsDataURL(file);
    });
}

function renderThumbnail(src, type) {
    const grid = document.getElementById('media-grid');
    const thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    if(type === 'video') {
        thumb.innerHTML = '<i data-lucide="video" style="color:#fff;"></i>';
        thumb.style.display = 'flex'; thumb.style.alignItems = 'center'; thumb.style.justifyContent = 'center';
    } else {
        thumb.style.backgroundImage = `url(${src})`;
    }
    thumb.onclick = (e) => { e.preventDefault(); spawnMedia(src, type); };
    grid.insertBefore(thumb, grid.firstElementChild);
    if(window.lucide) lucide.createIcons();
}

window.spawnMedia = function(src, type) {
    const el = createBaseElement();
    if(type === 'video') {
        el.innerHTML = `<video src="${src}" controls style="width:100%; height:100%; object-fit:cover; pointer-events:auto;"></video>`;
        el.style.width = '300px'; el.style.height = '200px';
    } else {
        el.innerHTML = `<img src="${src}" style="width:100%; height:100%; -webkit-user-drag: none; pointer-events:none;">`;
        el.style.width = '200px'; el.style.height = '200px';
    }
    addToWorkspace(el);
    closeMobileSidebar();
};

window.spawnBlock = function(type) {
    const el = createBaseElement();
    switch(type) {
        case 'text':
            el.innerText = 'TAP TO EDIT';
            el.style.color = '#fff'; el.style.fontSize = '1.2rem'; el.style.padding = '10px';
            break;
        case 'box':
            el.style.backgroundColor = '#111'; el.style.border = '1px solid #333';
            el.style.width = '200px'; el.style.height = '200px';
            break;
        case 'button':
            // BUTTON IS NOW A LINK WRAPPER
            el.innerHTML = `<a href="#" style="background:#00f3ff; color:#000; text-decoration:none; padding:15px 30px; font-weight:bold; display:inline-block; pointer-events:none;">ACTION</a>`;
            el.style.width = 'auto'; el.style.height = 'auto';
            break;
        case 'hero':
            el.innerHTML = '<h1 style="font-size:2rem; margin:0;">HERO</h1><p>Subtitle</p>';
            el.style.textAlign = 'center'; el.style.padding = '30px'; el.style.border = '1px dashed #444'; el.style.width = '300px';
            break;
    }
    addToWorkspace(el);
    closeMobileSidebar();
};

function createBaseElement() {
    const el = document.createElement('div');
    el.className = 'element';
    const viewportX = window.innerWidth;
    const viewportY = window.innerHeight;
    el.style.left = (viewportX / 2 - 50) + 'px';
    el.style.top = (viewportY / 2 - 50) + 'px';
    el.style.zIndex = zIndexCounter++;
    el.style.touchAction = "none";
    initPointerDrag(el);
    el.addEventListener('pointerdown', (e) => {
        if(!e.target.classList.contains('resizer')) { e.stopPropagation(); selectComponent(el); }
    });
    return el;
}

function addToWorkspace(el) {
    const ws = document.getElementById('workspace');
    const ph = ws.querySelector('.placeholder-msg');
    if(ph) ph.remove();
    const r = document.createElement('div');
    r.className = 'resizer se';
    el.appendChild(r);
    initPointerResize(el, r);
    ws.appendChild(el);
    selectComponent(el);
}

// /// 3. PHYSICS ENGINE ///

function initPointerDrag(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    el.addEventListener('pointerdown', (e) => {
        if(e.target.classList.contains('resizer')) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;
        el.style.cursor = 'grabbing';
    });

    el.addEventListener('pointermove', (e) => {
        if(!isDragging) return;
        el.style.left = `${initialLeft + (e.clientX - startX)}px`;
        el.style.top = `${initialTop + (e.clientY - startY)}px`;
    });

    el.addEventListener('pointerup', (e) => {
        isDragging = false;
        el.style.cursor = 'grab';
        el.releasePointerCapture(e.pointerId);
    });
}

function initPointerResize(el, resizer) {
    let isResizing = false;
    let startX, startY, startW, startH;

    resizer.addEventListener('pointerdown', (e) => {
        e.stopPropagation(); e.preventDefault();
        resizer.setPointerCapture(e.pointerId);
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startW = parseInt(document.defaultView.getComputedStyle(el).width, 10);
        startH = parseInt(document.defaultView.getComputedStyle(el).height, 10);
    });

    resizer.addEventListener('pointermove', (e) => {
        if(!isResizing) return;
        el.style.width = `${startW + (e.clientX - startX)}px`;
        el.style.height = `${startH + (e.clientY - startY)}px`;
    });

    resizer.addEventListener('pointerup', (e) => {
        isResizing = false;
        resizer.releasePointerCapture(e.pointerId);
    });
}

// /// 4. UTILITIES ///

function selectComponent(el) {
    if(selectedElement) selectedElement.classList.remove('selected');
    selectedElement = el;
    el.classList.add('selected');
    el.style.zIndex = zIndexCounter++;

    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('editor-controls').style.display = 'block';
    
    // Populate props
    const pText = document.getElementById('prop-text');
    const pLink = document.getElementById('prop-link');
    const pZ = document.getElementById('prop-z');
    
    // Text Prop
    if(el.childNodes[0] && el.childNodes[0].nodeType === 3) {
         if(pText) pText.value = el.innerText;
    } else if(el.querySelector('a')) {
         if(pText) pText.value = el.querySelector('a').innerText;
         // Link Prop
         if(pLink) pLink.value = el.querySelector('a').getAttribute('href') !== '#' ? el.querySelector('a').getAttribute('href') : '';
    } else {
         if(pText) pText.value = "";
         if(pLink) pLink.value = "";
    }
    
    if(pZ) pZ.value = el.style.zIndex;

    if(window.innerWidth <= 768) {
        document.getElementById('sidebar-right').classList.add('mobile-open');
    }
}

function deselectAll() {
    if(selectedElement) selectedElement.classList.remove('selected');
    selectedElement = null;
    document.getElementById('editor-controls').style.display = 'none';
    document.getElementById('no-selection').style.display = 'block';
}

function updateProps(e) {
    if(!selectedElement) return;
    const val = e.target.value;
    const id = e.target.id;

    if(id === 'prop-text') {
        const link = selectedElement.querySelector('a');
        if(link) {
            link.innerText = val; // Update button text
        } else if(!selectedElement.querySelector('img') && !selectedElement.querySelector('video')) {
           selectedElement.childNodes[0].nodeValue = val; 
        }
    } else if(id === 'prop-link') {
        const link = selectedElement.querySelector('a');
        if(link) link.href = val;
    } else if(id === 'prop-color') {
        selectedElement.style.backgroundColor = val;
        // If it's a button, update inner link bg too
        const link = selectedElement.querySelector('a');
        if(link) link.style.background = val;
    } else if(id === 'prop-z') {
        selectedElement.style.zIndex = val;
    }
}

function deleteSelected() {
    if(selectedElement) {
        selectedElement.remove();
        deselectAll();
    }
}

// /// 5. DEPLOYMENT & PAYMENT ///

window.deploySequence = function() {
    console.log("INITIATING DEPLOY SEQUENCE...");
    const build = document.getElementById('workspace').innerHTML;
    // Relaxed check: Just checks if empty
    if(build.trim() === "") {
        alert("VOID DETECTED. SPAWN ARTIFACTS.");
        return;
    }
    localStorage.setItem('nmv_pending_build', build);
    document.getElementById('payment-modal').style.display = 'flex';
};

window.closePayment = () => document.getElementById('payment-modal').style.display = 'none';

// /// 6. ANALYTICS ///

window.initAnalytics = function() {
    const ctx = document.getElementById('trafficChart');
    if(!ctx) return;
    if(analyticsChart) analyticsChart.destroy();
    
    analyticsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                label: 'LIVE TRAFFIC',
                data: [5, 12, 19, 3, 5, 2, 10],
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: { x: { ticks: { color: '#666' } }, y: { ticks: { color: '#666' } } }
        }
    });
};

window.openAnalytics = () => document.getElementById('modal-analytics').style.display = 'flex';
window.closeModal = (id) => document.getElementById(id).style.display = 'none';

// /// 7. UI TOGGLES ///

window.toggleSidebar = function(side) {
    document.getElementById(`sidebar-${side}`).classList.toggle('mobile-open');
};

function closeMobileSidebar() {
    if(window.innerWidth <= 768) {
        document.getElementById('sidebar-left').classList.remove('mobile-open');
    }
}

window.togglePreview = () => {
    document.body.classList.toggle('preview-active');
};

// /// 8. SPEC SHEET LOGIC ///

window.loadSpec = function(id) {
    const data = PRODUCT_CATALOG[id] || PRODUCT_CATALOG['core'];
    const container = document.getElementById('spec-container');
    
    // Update active button state visually
    document.querySelectorAll('.arch-btn').forEach(btn => btn.classList.remove('active'));
    // (In a real app, map buttons to IDs, here we assume user clicked one)

    if(container) {
        container.innerHTML = `
            <div class="spec-header">
                <h2 class="spec-title">${data.title}</h2>
                <div class="spec-price">${data.price}</div>
            </div>
            <div class="spec-section">
                <div class="spec-label">/// THE MISSION</div>
                <div class="spec-text">${data.mission}</div>
            </div>
            <div class="spec-section">
                <div class="spec-label">/// THE TECH</div>
                <div class="spec-text">${data.tech}</div>
            </div>
            <div class="spec-actions">
                <button class="sys-btn primary" onclick="processLicense('${id}', '${data.link}')" style="width:100%; padding:20px; font-size:1rem;">
                    INITIATE TRANSFER
                </button>
            </div>
        `;
    }
};

window.processLicense = (code, url) => {
    localStorage.setItem('nmv_active_license', code);
    window.location.href = url;
};
