console.log("%c/// NEURAL MATRIX VAULT: ONLINE ///", "color:#00f3ff; background:#000; padding:5px; border:1px solid #00f3ff;");

const isMobile = window.innerWidth <= 768;

// 1. MULTI-COLOR MATRIX RAIN (Blue > Green > White > Grey > Red)
const mCanvas = document.getElementById('matrix-rain');
if (mCanvas) {
    const mCtx = mCanvas.getContext('2d');
    
    // Logic for setting/resetting canvas dimensions
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

    // Resize Handler
    window.addEventListener('resize', () => {
        setCanvasDimensions();
        initDrops();
    });
    
    // REQUESTED ORDER: Blue, Green, White, Grey, Red
    const palette = [
        {r:0,g:243,b:255},   // Blue
        {r:0,g:255,b:0},     // Green
        {r:255,g:255,b:255}, // White
        {r:128,g:128,b:128}, // Grey
        {r:255,g:0,b:0}      // Red
    ];
    let time = 0;

    function drawMatrix() {
        mCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
        
        time += 0.005;
        const colorIdx = Math.floor(time) % palette.length;
        const c = palette[colorIdx];
        
        mCtx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        mCtx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
}

// 2. THE 3D ARTIFACT
const artifactContainer = document.getElementById('singularity-vessel');
if (artifactContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, artifactContainer.clientWidth / artifactContainer.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(artifactContainer.clientWidth, artifactContainer.clientHeight);
    artifactContainer.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0x111111, flatShading: true, shininess: 100 });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    const wireGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    const cage = new THREE.Mesh(wireGeo, wireMat);
    scene.add(cage);

    const l1 = new THREE.PointLight(0x00f3ff, 2, 10); l1.position.set(3, 2, 3); scene.add(l1);
    const l2 = new THREE.PointLight(0xff0055, 2, 10); l2.position.set(-3, -2, 3); scene.add(l2);

    function animateArtifact() {
        requestAnimationFrame(animateArtifact);
        core.rotation.y += 0.004; core.rotation.x -= 0.002;
        cage.rotation.y -= 0.002;
        renderer.render(scene, camera);
    }
    animateArtifact();

    // Resize Handler for 3D
    window.addEventListener('resize', () => {
        const width = artifactContainer.clientWidth;
        const height = artifactContainer.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

// 3. INIT & ICONS
try {
    lucide.createIcons();
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
} catch(e) {}

// /// 4. AUDIO INTERFACE PROTOCOL ///
const AudioEngine = {
    ctx: new (window.AudioContext || window.webkitAudioContext)(),
    
    // Generate a sci-fi "blip" on hover
    hoverTone: function() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Low volume
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    // Generate a "lock-in" sound on click
    clickTone: function() {
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

// 5. CINEMATIC PRELOADER REMOVAL
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.transition = 'opacity 0.8s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 800);
        }
    }, 2000); // 2 Second forced immersion
});

// ATTACH TO DOM
document.addEventListener('DOMContentLoaded', () => {
    const interactables = document.querySelectorAll('a, button, .cell');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => AudioEngine.hoverTone());
        el.addEventListener('click', () => AudioEngine.clickTone());
    });
});
