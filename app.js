/**
 * NEURAL MATRIX VAULT | APEX ENGINE
 * Version: 7.0 (THE 7 PILLARS BUILD)
 * Architect: Magnus Opus
 */

console.log("%c/// SYSTEM: APEX ONLINE", "background:#000; color:#00f3ff; font-weight:bold; padding:8px; border:1px solid #00f3ff;");

// --- UTILITIES ---
try { lucide.createIcons(); } catch(e) {}
let isVisible = true;
document.addEventListener("visibilitychange", () => { isVisible = !document.hidden; });
const isMobile = window.innerWidth < 768;
const cursor = { x: window.innerWidth/2, y: window.innerHeight/2 };

// --- 1. THE SONIC WARFARE ENGINE (BINAURAL) ---
const AudioApex = {
    ctx: null,
    masterGain: null,
    
    init: function() {
        if (this.ctx) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.playBootSequence();
        this.startNeuralHum();
    },

    startNeuralHum: function() {
        // Theta Wave Generator (5Hz Binaural)
        const oscL = this.ctx.createOscillator();
        const oscR = this.ctx.createOscillator();
        const panL = this.ctx.createStereoPanner();
        const panR = this.ctx.createStereoPanner();
        
        oscL.frequency.value = 60;
        oscR.frequency.value = 65;
        
        panL.pan.value = -1;
        panR.pan.value = 1;

        const droneGain = this.ctx.createGain();
        droneGain.gain.value = 0.02; // Subliminal volume

        oscL.connect(panL); panL.connect(droneGain);
        oscR.connect(panR); panR.connect(droneGain);
        droneGain.connect(this.masterGain);

        oscL.start();
        oscR.start();
    },

    playBootSequence: function() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(40, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 2.5);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(t + 3);
    },

    playInteract: function(type) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        if (type === 'hover') {
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
            gain.gain.setValueAtTime(0.03, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.1);
        } else if (type === 'click') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        }
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(t + 0.2);
    }
};

// --- 2. BOOT SEQUENCE HANDLER ---
const bootOverlay = document.getElementById('boot-overlay');
const bootFill = document.querySelector('.boot-fill');
const bootCta = document.querySelector('.boot-cta');

function initSystem() {
    AudioApex.init();
    bootOverlay.classList.add('boot-hidden');
    initNeuralEngine();
    initDysonSphere();
}

window.addEventListener('load', () => {
    bootFill.style.width = '100%';
    setTimeout(() => {
        bootCta.classList.add('ready');
        bootOverlay.addEventListener('click', initSystem);
    }, 1600);
});

// --- 3. THE NEURAL ENGINE (CANVAS PHYSICS) ---
const canvas = document.getElementById('neural-engine');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let points = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 1.5;
        }
        update() {
            // Verlet Gravity
            let dx = cursor.x - this.x;
            let dy = cursor.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if(dist < 250) {
                let force = (250 - dist) / 250;
                this.vx += (dx / dist) * force * 0.08;
                this.vy += (dy / dist) * force * 0.08;
            }

            this.x += this.vx; this.y += this.vy;
            this.vx *= 0.98; this.vy *= 0.98; // Friction

            if(this.x < 0 || this.x > width) this.vx *= -1;
            if(this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 243, 255, ${Math.random() * 0.5 + 0.2})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
        }
    }

    function initNeuralEngine() {
        for(let i=0; i<70; i++) points.push(new Point());
        animateNeural();
    }

    function animateNeural() {
        if(!isVisible) { requestAnimationFrame(animateNeural); return; }
        ctx.clearRect(0, 0, width, height);
        
        for(let i=0; i<points.length; i++) {
            points[i].update();
            points[i].draw();
            // Neural Connections
            for(let j=i; j<points.length; j++) {
                let dx = points[i].x - points[j].x;
                let dy = points[i].y - points[j].y;
                let d = Math.sqrt(dx*dx + dy*dy);
                if(d < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - d/120})`;
                    ctx.lineWidth = 0.4;
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateNeural);
    }
    
    window.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        if(!isMobile) {
            gsap.to('.cursor-tracker', { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to('.cursor-reticle', { x: e.clientX - 25, y: e.clientY - 25, duration: 0.2, ease: "power2.out" });
        }
    });
}

// --- 4. THE DYSON SPHERE (THREE.JS) ---
function initDysonSphere() {
    const container = document.getElementById('dyson-sphere');
    if(!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth/container.clientHeight, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Core
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    scene.add(core);
    // Shell
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 2), new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 }));
    scene.add(shell);
    // Orbitals
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.05, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.6 }));
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    function animate3D() {
        if(isVisible) {
            core.rotation.y += 0.005;
            shell.rotation.y -= 0.002; shell.rotation.x += 0.002;
            orbit.rotation.z += 0.01;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate3D);
    }
    animate3D();
}

// --- 5. MAGNETISM ---
const magnets = document.querySelectorAll('.magnet');
magnets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        AudioApex.playInteract('hover');
        gsap.to('.cursor-reticle', { scale: 1.5, borderColor: '#00f3ff' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to('.cursor-reticle', { scale: 1, borderColor: 'rgba(255,255,255,0.2)' });
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
    el.addEventListener('click', () => AudioApex.playInteract('click'));
    if(!isMobile) {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            gsap.to(el, { x: x*0.4, y: y*0.4, duration: 0.2 });
        });
    }
});

// --- 6. SCROLL ENTRANCE ---
try {
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".card", {
        scrollTrigger: { trigger: ".titanium-grid", start: "top 85%" },
        y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
    });
} catch(e) {}
