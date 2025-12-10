/**
 * NEURAL MATRIX VAULT | STABLE CORE
 * Status: HIGH VISIBILITY MODE
 */

console.log("%c/// SYSTEM: ONLINE", "background:#000; color:#00f3ff; font-weight:bold; padding:8px; border:1px solid #00f3ff;");

// --- UTILITIES ---
try { lucide.createIcons(); } catch(e) {}
let isVisible = true;
document.addEventListener("visibilitychange", () => { isVisible = !document.hidden; });
const isMobile = window.innerWidth < 768;

// --- 1. REMOVE BOOT SCREEN (INSTANT ACCESS) ---
// We removed the HTML for the boot screen to ensure content is visible immediately.
// If the element exists, we hide it immediately.
const bootOverlay = document.getElementById('boot-overlay');
if(bootOverlay) bootOverlay.style.display = 'none';

// --- 2. AUDIO ENGINE (ON INTERACTION) ---
const AudioApex = {
    ctx: null,
    
    init: function() {
        if (this.ctx) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
    },

    playInteract: function() {
        if (!this.ctx) this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Simple Click "Thud"
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.1);
    }
};

// --- 3. NEURAL BACKGROUND (LIGHTWEIGHT) ---
const canvas = document.getElementById('neural-engine');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if(this.x < 0 || this.x > width) this.vx *= -1;
            if(this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 243, 255, 0.4)'; // Brighter dots
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, Math.PI*2); // Bigger dots
            ctx.fill();
        }
    }

    // Init Logic
    for(let i=0; i<50; i++) particles.push(new Particle());

    function animate() {
        if(!isVisible) { requestAnimationFrame(animate); return; }
        ctx.clearRect(0, 0, width, height);
        
        // Draw Lines
        ctx.beginPath();
        for(let i=0; i<particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for(let j=i; j<particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 100) {
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist/100})`;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                }
            }
        }
        ctx.stroke();
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 4. 3D OBJECT (SIMPLIFIED FOR MOBILE STABILITY) ---
function init3D() {
    const container = document.getElementById('dyson-sphere');
    if(!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth/container.clientHeight, 0.1, 100);
    camera.position.z = 6;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.4 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    function animate() {
        if(isVisible) {
            sphere.rotation.y += 0.003;
            sphere.rotation.x -= 0.002;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }
    animate();
}
// Delay 3D slightly to prioritize UI render
setTimeout(init3D, 500);

// --- 5. INTERACTION ---
// Attach audio to buttons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => AudioApex.playInteract());
});

// --- 6. SMOOTH SCROLL (OPTIONAL) ---
try {
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
} catch(e) {}
