/**
 * NEURAL CONSTRUCTOR v9.0 (POINTER EVENTS EDITION)
 * ARCHITECT: MAGNUS OPUS
 * PROTOCOLS: OMNI-DEVICE PHYSICS (Touch/Mouse/Stylus Unified)
 */

let selectedElement = null;
let uploadedMedia = []; 
let zIndexCounter = 100;

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// NEURAL PHYSICS: POINTER PROTOCOL ACTIVE ///", "color:#00f3ff; background:#000; padding:5px;");
    
    // Listeners
    const mediaInput = document.getElementById('media-upload-input');
    if(mediaInput) mediaInput.addEventListener('change', handleMediaUpload);
    
    // Property Listeners
    const pText = document.getElementById('prop-text');
    const pColor = document.getElementById('prop-color');
    const pZ = document.getElementById('prop-z');
    
    if(pText) pText.addEventListener('input', updateProps);
    if(pColor) pColor.addEventListener('input', updateProps);
    if(pZ) pZ.addEventListener('input', updateProps);
    
    // Global deselect
    const ws = document.getElementById('workspace');
    if(ws) {
        ws.addEventListener('pointerdown', (e) => { 
            if(e.target.id === 'workspace') deselectAll(); 
        });
    }
});

// /// 1. INFINITE MEDIA DOCK ///

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
    
    // Use onclick for thumbnails (safe standard)
    thumb.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        spawnMedia(src, type);
    };
    
    grid.insertBefore(thumb, grid.firstElementChild);
    if(window.lucide) lucide.createIcons();
}

// /// 2. SPAWN LOGIC (CENTER SCREEN CALCULATION) ///

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
            el.innerHTML = '<button style="pointer-events:none; background:#00f3ff; border:none; padding:10px 20px; font-weight:bold;">ACTION</button>';
            break;
        case 'hero':
            el.innerHTML = '<h1 style="font-size:2rem; margin:0;">HERO</h1><p>Subtitle</p>';
            el.style.textAlign = 'center'; el.style.padding = '30px'; el.style.border = '1px dashed #444';
            el.style.width = '300px';
            break;
    }
    addToWorkspace(el);
    closeMobileSidebar();
};

function createBaseElement() {
    const el = document.createElement('div');
    el.className = 'element';
    
    // CALCULATE CENTER OF VIEWPORT
    const viewportX = window.innerWidth;
    const viewportY = window.innerHeight;
    
    // Default to center minus half element size (approx)
    el.style.left = (viewportX / 2 - 50) + 'px';
    el.style.top = (viewportY / 2 - 50) + 'px';
    el.style.zIndex = zIndexCounter++;
    el.style.touchAction = "none"; // CRITICAL: PREVENTS SCROLLING WHILE DRAGGING
    
    // Init Physics
    initPointerDrag(el);
    
    // Selection
    el.addEventListener('pointerdown', (e) => {
        // Don't select if hitting resizer
        if(!e.target.classList.contains('resizer')) {
            e.stopPropagation();
            selectComponent(el);
        }
    });

    return el;
}

function addToWorkspace(el) {
    const ws = document.getElementById('workspace');
    const ph = ws.querySelector('.placeholder-msg');
    if(ph) ph.remove();
    
    // Inject Resizer
    const r = document.createElement('div');
    r.className = 'resizer se';
    el.appendChild(r);
    initPointerResize(el, r);

    ws.appendChild(el);
    selectComponent(el);
}

// /// 3. PHYSICS ENGINE (POINTER EVENTS) ///

function initPointerDrag(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    el.addEventListener('pointerdown', (e) => {
        if(e.target.classList.contains('resizer')) return;
        
        e.preventDefault(); // Prevent text selection/scrolling
        el.setPointerCapture(e.pointerId); // Lock target
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;
        
        el.style.cursor = 'grabbing';
    });

    el.addEventListener('pointermove', (e) => {
        if(!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
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
        e.stopPropagation();
        e.preventDefault();
        resizer.setPointerCapture(e.pointerId);
        
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startW = parseInt(document.defaultView.getComputedStyle(el).width, 10);
        startH = parseInt(document.defaultView.getComputedStyle(el).height, 10);
    });

    resizer.addEventListener('pointermove', (e) => {
        if(!isResizing) return;
        
        const width = startW + (e.clientX - startX);
        const height = startH + (e.clientY - startY);
        
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
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

    const noSel = document.getElementById('no-selection');
    const controls = document.getElementById('editor-controls');
    
    if(noSel) noSel.style.display = 'none';
    if(controls) controls.style.display = 'block';
    
    // Populate properties
    const pText = document.getElementById('prop-text');
    const pZ = document.getElementById('prop-z');
    
    if(el.childNodes[0] && el.childNodes[0].nodeType === 3) {
         if(pText) pText.value = el.innerText;
    } else {
         if(pText) pText.value = "";
    }
    if(pZ) pZ.value = el.style.zIndex;

    // Mobile: Show properties sidebar if screen is small
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
        if(!selectedElement.querySelector('img') && !selectedElement.querySelector('video')) {
           selectedElement.innerText = val;
           // Re-inject resizer
           const r = document.createElement('div');
           r.className = 'resizer se';
           selectedElement.appendChild(r);
           initPointerResize(selectedElement, r);
        }
    } else if(id === 'prop-color') {
        selectedElement.style.backgroundColor = val;
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
    const build = document.getElementById('workspace').innerHTML;
    if(!build || build.includes('SPAWN')) {
        alert("VOID DETECTED. SPAWN ARTIFACTS.");
        return;
    }
    localStorage.setItem('nmv_pending_build', build);
    document.getElementById('payment-modal').style.display = 'flex';
};

window.closePayment = () => document.getElementById('payment-modal').style.display = 'none';
window.processLicense = (code, url) => {
    localStorage.setItem('nmv_active_license', code);
    window.location.href = url;
};

// UI Toggles
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
    alert("PREVIEW MODE. CLICK AGAIN TO EDIT.");
};
