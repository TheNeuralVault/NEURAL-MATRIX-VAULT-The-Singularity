console.log("%c/// NEURAL MATRIX VAULT: ONLINE ///", "color:#00f3ff; background:#000; padding:5px; border:1px solid #00f3ff;");

const isMobile = window.innerWidth <= 768;

/**
 * /// 0. NEURAL CONFIGURATION LOADER ///
 * Reads the Architect's design from the Builder.
 * Fallback: Standard Titanium Protocol.
 */
const savedConfig = JSON.parse(localStorage.getItem('nmv_config')) || {
    matrixColors: ['#00f3ff', '#00ff00', '#ffffff', '#808080', '#ff0000'], // Default Sequence
    rainOpacity: 0.6,
    coreColor: '#000000',
    wireColor: '#00f3ff',
    speed: 4
};

/**
 * /// 1. MULTI-COLOR MATRIX RAIN ENGINE ///
 * Dynamic Palette Injection
 */
const mCanvas = document.getElementById('matrix-rain');
if (mCanvas) {
    const mCtx = mCanvas.getContext('2d');
    
    // Apply Architect's Opacity
    mCanvas.style.opacity = savedConfig.rainOpacity;

    function setCanvasDimensions() {
        mCanvas.width = window.innerWidth;
        mCanvas.height = window.innerHeight;
    }
    setCanvasDimensions();

    const chars = "01XYZA".split("");
    const fontSize = 14;
    let columns = mCanvas.width / fontSize;
    let drops = [];

    function initDrops() {
        columns = mCanvas.width / fontSize;
        drops = Array(Math.floor(columns)).fill(1);
    }
    initDrops();

    window.addEventListener('resize', () => {
        setCanvasDimensions();
        initDrops();
    });
    
    // UTILITY: Hex to RGB conversion for the engine
    function hexToRgb(hex) {
        const bigint = parseInt(hex.substring(1), 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }

    // LOAD PALETTE FROM CONFIG
    const palette = savedConfig.matrixColors.map(hex => hexToRgb(hex));
    let time = 0;

    function drawMatrix() {
        mCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
        
        time += 0.005;
        // Cycle through the saved palette over time
        const colorIdx = Math.floor(time) % palette.length;
        const c = palette[colorIdx];
        
        mCtx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        mCtx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Randomize drop resets
            if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
}

/**
 * /// 2. THE SINGULARITY (3D ARTIFACT) ///
 * Dynamic Geometry & Physics
 */
const artifactContainer = document.getElementById('singularity-vessel');
if (artifactContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, artifactContainer.clientWidth / artifactContainer.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(artifactContainer.clientWidth, artifactContainer.clientHeight);
    artifactContainer.appendChild(renderer.domElement);

    // DYNAMIC MATERIALS (From Config)
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshPhongMaterial({ 
        color: savedConfig.coreColor, 
        emissive: 0x111111, 
        flatShading: true, 
        shininess: 100 
    });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    const wireGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const wireMat = new THREE.MeshBasicMaterial({ 
        color: savedConfig.wireColor, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    const cage = new THREE.Mesh(wireGeo, wireMat);
    scene.add(cage);

    // LIGHTING SYSTEM
    const l1 = new THREE.PointLight(0x00f3ff, 2, 10); l1.position.set(3, 2, 3); scene.add(l1);
    const l2 = new THREE.PointLight(0xff0055, 2, 10); l2.position.set(-3, -2, 3); scene.add(l2);

    // ANIMATION LOOP
    function animateArtifact() {
        requestAnimationFrame(animateArtifact);
        
        // Apply Rotational Velocity from Config
        const spd = savedConfig.speed / 1000;

        core.rotation.y += spd; 
        core.rotation.x -= spd/2;
        cage.rotation.y -= spd/2;
        
        renderer.render(scene, camera);
    }
    animateArtifact();

    // Responsive Handling
    window.addEventListener('resize', () => {
        const width = artifactContainer.clientWidth;
        const height = artifactContainer.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

/**
 * /// 3. SYSTEM INITIALIZATION ///
 */
try {
    lucide.createIcons();
    // Smooth Scroll Protocol (Lenis)
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 1.2, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }
} catch(e) {
    console.warn("System Warning: Auxiliary libraries not fully loaded.", e);
}

/**
 * /// 4. AUDIO INTERFACE PROTOCOL ///
 * Interaction Feedback System
 */
const AudioEngine = {
    ctx: null,
    
    init: function() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    // Hover: High Frequency Sine Wave
    hoverTone: function() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    // Click: Low Frequency Square Wave (Mechanical Feel)
    clickTone: function() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
};

/**
 * /// 5. CINEMATIC PRELOADER SEQUENCE ///
 * Enforces immersion.
 */
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.transition = 'opacity 0.8s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 800);
        }
    }, 2000); // 2-second system initialization delay
});

/**
 * /// 6. EVENT BINDING ///
 */
document.addEventListener('DOMContentLoaded', () => {
    const interactables = document.querySelectorAll('a, button, .cell, .btn-deploy');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => AudioEngine.hoverTone());
        el.addEventListener('click', () => AudioEngine.clickTone());
    });
});
