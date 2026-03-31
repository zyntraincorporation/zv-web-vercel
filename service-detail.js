/* ═══════════════════════════════════════════════════════════
   SERVICE DETAIL PAGES — service-detail.js
   Shared interactive layer
═══════════════════════════════════════════════════════════ */
'use strict';

/* ════════════ SCROLL REVEAL ════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const d = parseInt(e.target.dataset.delay || 0);
    setTimeout(() => e.target.classList.add('visible'), d);
    revObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ════════════ COUNTERS ════════════ */
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.target);
    const isFloat = el.dataset.float === 'true';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const DUR = 2200;
    const ease = t => 1 - Math.pow(1 - t, 4);
    (function tick(now) {
      const p = Math.min((now - start) / DUR, 1);
      const v = ease(p) * target;
      el.textContent = prefix + (isFloat ? v.toFixed(1) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
    })(performance.now());
    cntObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(c => cntObs.observe(c));

/* ════════════ METRIC BARS ════════════ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('counted');
    barObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.sd-metric-item').forEach(el => barObs.observe(el));

/* ════════════ NAVBAR SCROLL ════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ════════════ MOBILE MENU ════════════ */
(function() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    btn.classList.toggle('open', o);
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();

/* ════════════ CUSTOM CURSOR ════════════ */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (cur && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .sd-feat-card, .sd-faq-q, .sd-int-pill, .sd-result-card, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hov'); ring.classList.remove('hov'); });
  });
}

/* ════════════ FAQ ACCORDION ════════════ */
document.querySelectorAll('.sd-faq-item').forEach(item => {
  const q = item.querySelector('.sd-faq-q');
  const a = item.querySelector('.sd-faq-a');
  if (!q || !a) return;

  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.sd-faq-item').forEach(i => {
      i.classList.remove('open');
      const ans = i.querySelector('.sd-faq-a');
      if (ans) ans.style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* ════════════ TILT CARDS ════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-(y / r.height) * 9}deg) rotateY(${(x / r.width) * 9}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .6s cubic-bezier(0.16,1,0.3,1)';
    card.style.transform = '';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

/* ════════════ MAGNETIC ════════════ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.17}px, ${y * 0.17}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform .55s cubic-bezier(0.16,1,0.3,1)';
    btn.style.transform = '';
    setTimeout(() => { btn.style.transition = ''; }, 550);
  });
});

/* ════════════ PARTICLE CANVAS ════════════ */
(function() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });
  const COLS = [[184,255,46],[0,232,255],[255,59,107]];
  const N = window.innerWidth < 768 ? 50 : 100;
  class P {
    constructor() { this.r2(true); }
    r2(rnd) {
      this.x = Math.random() * W; this.y = rnd ? Math.random() * H : (Math.random() > 0.5 ? -2 : H + 2);
      this.vx = (Math.random() - .5) * .28; this.vy = (Math.random() - .5) * .28;
      this.r = Math.random() * 1.2 + .2; this.a = Math.random() * .35 + .05;
      this.c = COLS[Math.floor(Math.random() * COLS.length)];
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -4 || this.x > W + 4 || this.y < -4 || this.y > H + 4) this.r2();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`; ctx.fill();
    }
  }
  function init() { pts = []; for (let i = 0; i < N; i++) pts.push(new P()); }
  init();
  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      pts[i].move(); pts[i].draw();
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(184,255,46,${.045 * (1 - d/95)})`;
          ctx.lineWidth = .35;
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ════════════ CHART.JS HELPERS ════════════ */
window.ZV = window.ZV || {};

ZV.chartDefaults = {
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(7,9,18,0.95)',
      borderColor: 'rgba(184,255,46,0.25)',
      borderWidth: 1,
      titleFont: { family: "'JetBrains Mono'", size: 10 },
      bodyFont:  { family: "'JetBrains Mono'", size: 12 },
      titleColor: '#7b7f98',
      bodyColor: '#b8ff2e',
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      grid:  { color: 'rgba(255,255,255,0.04)', borderColor: 'transparent' },
      ticks: { color: '#3a3d52', font: { family: "'JetBrains Mono'", size: 9 } },
    },
    y: {
      grid:  { color: 'rgba(255,255,255,0.04)', borderColor: 'transparent' },
      ticks: { color: '#3a3d52', font: { family: "'JetBrains Mono'", size: 9 } },
      beginAtZero: true,
    }
  },
  animation: { duration: 1600, easing: 'easeOutQuart' },
  responsive: true,
  maintainAspectRatio: true,
};

ZV.gradientLime = function(ctx, chartArea) {
  if (!chartArea) return '#b8ff2e';
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, 'rgba(184,255,46,0)');
  g.addColorStop(1, 'rgba(184,255,46,0.45)');
  return g;
};

ZV.gradientCyan = function(ctx, chartArea) {
  if (!chartArea) return '#00e8ff';
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, 'rgba(0,232,255,0)');
  g.addColorStop(1, 'rgba(0,232,255,0.4)');
  return g;
};

/* Init charts only when in viewport */
ZV.lazyChart = function(canvasId, buildFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      buildFn(canvas);
      obs.unobserve(canvas);
    });
  }, { threshold: 0.4 });
  obs.observe(canvas);
};

/* ════════════ BD CLOCK ════════════ */
(function() {
  const el = document.getElementById('bdTime');
  if (!el) return;
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' });
    el.textContent = t + ' BDT';
  };
  tick(); setInterval(tick, 10000);
})();

/* ════════════ ESC KEY ════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.getElementById('menuBtn')?.classList.remove('open');
  }
});
