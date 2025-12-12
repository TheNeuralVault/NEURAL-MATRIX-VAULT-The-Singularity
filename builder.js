/**
 * NEURAL CONSTRUCTOR v8.0 (SPECIFICATION EDITION)
 * ARCHITECT: MAGNUS OPUS
 * PROTOCOLS: INFINITE MEDIA, OMNI-PHYSICS, PRODUCT INTELLIGENCE
 */

// /// 1. PRODUCT INTELLIGENCE DATABASE ///
const PRODUCT_CATALOG = {
    core: {
        title: "THE NEURAL CORE",
        price: "$2,500.00",
        link: "https://buy.stripe.com/7sY7sL8dib6SbuvbPt8g001",
        mission: "Complete digital transformation. We replace standard sites with high-speed, futuristic platforms.<br>• <strong>Speed:</strong> Loads instantly on any device.<br>• <strong>Visuals:</strong> Cinema-grade 3D effects for premium status.<br>• <strong>Ranking:</strong> Architected to dominate Google results.",
        tech: "• <strong>Engine:</strong> Custom WebGL & Three.js hardware acceleration.<br>• <strong>Host:</strong> High-Frequency Edge CDN (<100ms latency).<br>• <strong>SEO:</strong> AI-Structured Semantic Schema & JSON-LD.<br>• <strong>Security:</strong> Enterprise SSL & DDoS Mitigation."
    },
    flux: {
        title: "FLUX VELOCITY",
        price: "$2,500.00",
        link: "https://buy.stripe.com/aFa3cv2SY3EqaqrcTx8g002",
        mission: "High-speed retail architecture. We build kinetic, moving landing pages designed to capture attention and sell immediately.<br>• <strong>Speed:</strong> Instant load times to maximize conversion rates.<br>• <strong>Visuals:</strong> Motion graphics that keep users engaged.<br>• <strong>Best For:</strong> Product drops, portfolios, and sales pages.",
        tech: "• <strong>Engine:</strong> Lightweight Single Page Application (SPA).<br>• <strong>Motion:</strong> GSAP High-Performance Animation (60fps).<br>• <strong>Assets:</strong> WebP Next-Gen Compression.<br>• <strong>UI:</strong> Fluid Reactive Grid System."
    },
    aero: {
        title: "AERO PROTOCOL",
        price: "$2,500.00",
        link: "https://buy.stripe.com/bJe28r79e3Eq7efcTx8g003",
        mission: "Corporate precision. We build clean, 'Swiss-style' digital headquarters that project absolute stability.<br>• <strong>Clarity:</strong> Minimalist design that organizes complex data perfectly.<br>• <strong>Trust:</strong> Signals authority to high-value partners.<br>• <strong>Best For:</strong> Agencies, Firms, & Consultants.",
        tech: "• <strong>Structure:</strong> Asymmetrical CSS Grid Architecture.<br>• <strong>Type:</strong> Variable Font Rendering & Optical Sizing.<br>• <strong>Core:</strong> Static Site Generation (SSG) for 100% uptime.<br>• <strong>Standards:</strong> WCAG 2.1 AA Accessibility."
    },
    nexus: {
        title: "NEXUS STREAM",
        price: "$2,500.00",
        link: "https://buy.stripe.com/3cIeVd2SY5My1TV4n18g00c",
        mission: "Deploy your Mobile Command Center. The Nexus Stream is a sovereign dashboard architecture designed for absolute creator control. Features mobile-first logic, high-speed link aggregation, and a zero-latency interface. Own your traffic.",
        tech: "• <strong>Core:</strong> PWA (Progressive Web App) Framework.<br>• <strong>Sync:</strong> Real-time API Aggregation.<br>• <strong>Mobile:</strong> Touch-Optimized Physics Engine."
    },
    cipher: {
        title: "CIPHER PROTOCOL",
        price: "$2,500.00",
        link: "https://buy.stripe.com/3cIeVddxCdf04233iX8g00d",
        mission: "The Granite Wealth Architecture. Cipher Protocol is a fortress-grade environment engineered for FinTech and Web3 ventures. Features military-grade encryption visualization, immutable ledger aesthetics, and absolute trust-based design patterns.",
        tech: "• <strong>Security:</strong> AES-256 Encryption Visualization.<br>• <strong>Data:</strong> Real-time Ticker & API Integration.<br>• <strong>Compliance:</strong> GDPR & SOC2 Ready Framework."
    },
    prism: {
        title: "PRISM SaaS",
        price: "$2,500.00",
        link: "https://buy.stripe.com/4gM8wP65afn8buv06L8g00e",
        mission: "Liquid Intelligence made manifest. Prism SaaS is the apex UI/UX framework for AI dashboards and complex software platforms. Includes adaptive data visualization, neurological user flows, and a seamless glass-morphic interface.",
        tech: "• <strong>Framework:</strong> React/Vue Hybrid Architecture.<br>• <strong>Data:</strong> D3.js & WebGL Visualization.<br>• <strong>UX:</strong> Adaptive Dark/Light Mode & Focus States."
    },
    omega: {
        title: "OMEGA REALITY",
        price: "$2,500.00",
        link: "https://buy.stripe.com/14A9AT79ea2OdCDf1F8g00f",
        mission: "Beyond the Screen. Omega Reality is the Singularity of web architecture. A fully immersive Spatial Computing environment featuring high-fidelity WebGL rendering, VR-ready infrastructure, and volumetric design. The ultimate digital flex.",
        tech: "• <strong>Core:</strong> Three.js & WebXR Integration.<br>• <strong>Render:</strong> Ray-Tracing Simulation.<br>• <strong>Input:</strong> Spatial Hand Tracking & Gaze Detection."
    }
};

let selectedElement = null;
let uploadedMedia = [];
let zIndexCounter = 100;
let currentSpec = 'core';

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// NEURAL PHYSICS: OMNI-DEVICE ACTIVE ///", "color:#00f3ff; background:#000; padding:5px;");
    
    // Listeners
    const mediaInput = document.getElementById('media-upload-input');
    if(mediaInput) mediaInput.addEventListener('change', handleMediaUpload);
    
    document.getElementById('prop-text').addEventListener('input', updateProps);
    document.getElementById('prop-color').addEventListener('input', updateProps);
    document.getElementById('prop-z').addEventListener('input', updateProps);
    
    // Global deselect (Touch & Click)
    const ws = document.getElementById('workspace');
    ws.addEventListener('click', (e) => { if(e.target.id === 'workspace') deselectAll(); });
    ws.addEventListener('touchstart', (e) => { if(e.target.id === 'workspace') deselectAll(); }, {passive: true});

    // Init Spec Logic
    loadSpec('core');
});

// /// 2. SPEC SHEET LOGIC (THE NEW UI) ///

window.loadSpec = function(id) {
    currentSpec = id;
    const data = PRODUCT_CATALOG[id];

    // Highlight Button
    const buttons = document.querySelectorAll('.arch-btn');
    buttons.forEach(btn => {
        // Simple string matching for active class since we don't have IDs on buttons
        // Ideally update builder.html to include IDs or data attributes
        if(btn.onclick.toString().includes(id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Render Content
    const container = document.getElementById('spec-container');
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
                <button class="sys-btn primary" onclick="processPayment('${id}')" style="width:100%; padding:20px; font-size:1rem;">
                    INITIATE TRANSFER [${data.price}]
                </button>
            </div>
        `;
    }
};

window.deploySequence = function() {
    const build = document.getElementById('workspace').innerHTML;
    if(!build || build.includes('SPAWN')) {
        alert("VOID DETECTED. CONSTRUCT ARTIFACTS BEFORE DEPLOYMENT.");
        return;
    }
    // Save the build
    localStorage.setItem('nmv_pending_build', build);
    // Open the Spec Sheet
    document.getElementById('payment-modal').style.display = 'flex';
};

window.processPayment = function(id) {
    const data = PRODUCT_CATALOG[id];
    localStorage.setItem('nmv_active_license', id);
    // Redirect
    window.location.href = data.link;
};

window.closePayment = () => document.getElementById('payment-modal').style.display = 'none';

// /// 3. INFINITE MEDIA DOCK ///

window.triggerMediaUpload = function() {
    document.getElementById('media-upload-input').click();
};

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
    
    thumb.onclick = () => spawnMedia(src, type);
    grid.insertBefore(thumb, grid.firstElementChild);
    if(window.lucide) lucide.createIcons();
}

// /// 4. SPAWN LOGIC (ABSOLUTE) ///

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
    if(wind
