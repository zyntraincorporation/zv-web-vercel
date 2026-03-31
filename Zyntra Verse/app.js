/* ══════════════════════════════════════════════════════
   ZYNTRA VERSE — app.js v3.0 — Fixed + Analytics
══════════════════════════════════════════════════════ */
'use strict';

/* ════════════════════════════════════
   LOADER
════════════════════════════════════ */
(function initLoader() {
  const steps = ['ls1','ls2','ls3','ls4'];
  let i = 0;
  const stepInt = setInterval(() => {
    const el = document.getElementById(steps[i]);
    if (el) el.classList.add('done');
    i++;
    if (i >= steps.length) clearInterval(stepInt);
  }, 400);

  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (!loader) return;
      loader.classList.add('out');
      staggerHero();
      document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
    }, 2200);
  });
})();

/* ════════════════════════════════════
   HERO STAGGER
════════════════════════════════════ */
function staggerHero() {
  [1,2,3,4,5].forEach(n => {
    const el = document.querySelector(`.stagger-${n}`);
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity    = '1';
      el.style.transform  = 'none';
    }, n * 160);
  });
}

/* ════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════ */
const cur     = document.getElementById('cur');
const curRing = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cur && curRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const HOV = 'a, button, .srv-item, .sp-card, .big-stat, .tstat, .tp, .proc-step, .pulse-item, .chart-card, .chart-card-sm';
  document.querySelectorAll(HOV).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.classList.add('hov'); curRing.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      cur.classList.remove('hov'); curRing.classList.remove('hov');
    });
  });
}

/* ════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); build(); });

  const COLORS = [[184,255,46],[0,232,255],[255,59,107]];
  const N = window.innerWidth < 768 ? 60 : 120;
  const DIST = 100;

  class Pt {
    constructor() { this.reset(true); }
    reset(r=false) {
      this.x  = r ? Math.random()*W : Math.random()*W;
      this.y  = r ? Math.random()*H : (Math.random()>0.5 ? -2 : H+2);
      this.vx = (Math.random()-.5)*.3;
      this.vy = (Math.random()-.5)*.3;
      this.r  = Math.random()*1.3+.2;
      this.a  = Math.random()*.4+.05;
      this.c  = COLORS[Math.floor(Math.random()*COLORS.length)];
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x<-4||this.x>W+4||this.y<-4||this.y>H+4) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${this.c[0]},${this.c[1]},${this.c[2]},${this.a})`;
      ctx.fill();
    }
  }

  function build() { pts=[]; for(let i=0;i<N;i++) pts.push(new Pt()); }
  build();

  function loop() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<pts.length;i++) {
      pts[i].move(); pts[i].draw();
      for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<DIST) {
          const a=.05*(1-d/DIST);
          ctx.beginPath();
          ctx.strokeStyle=`rgba(184,255,46,${a})`;
          ctx.lineWidth=.4;
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mousemove', e => {
    pts.forEach(p => {
      const dx=e.clientX-p.x, dy=e.clientY-p.y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if (d<80) { p.vx -= dx/d * 0.18; p.vy -= dy/d * 0.18; }
    });
  });
})();

/* ════════════════════════════════════
   NAVBAR SCROLL
════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateScrollPct();
}, { passive:true });

function updateScrollPct() {
  const el = document.getElementById('scrollPct');
  if (!el) return;
  const tot = document.documentElement.scrollHeight - window.innerHeight;
  const pct = tot > 0 ? Math.round((window.scrollY / tot) * 100) : 0;
  el.textContent = String(pct).padStart(2,'0') + '%';
}

/* ════════════════════════════════════
   MOBILE MENU
════════════════════════════════════ */
(function initMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn||!menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });
  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();

/* ════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const d = parseInt(e.target.dataset.delay||0);
    setTimeout(() => e.target.classList.add('visible'), d);
    revealObs.unobserve(e.target);
  });
}, { threshold:.08, rootMargin:'0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ════════════════════════════════════
   COUNTERS
════════════════════════════════════ */
(function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target,10);
      const start  = performance.now();
      const DUR    = 2400;
      function ease(t){ return 1-Math.pow(1-t,4); }
      (function tick(now) {
        const p = Math.min((now-start)/DUR,1);
        el.textContent = Math.round(ease(p)*target);
        if (p<1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(performance.now());
      obs.unobserve(el);
    });
  },{ threshold:.7 });
  document.querySelectorAll('.counter').forEach(c => obs.observe(c));
})();

/* ════════════════════════════════════
   RING ARC ANIMATION
════════════════════════════════════ */
(function initRings() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const arc = e.target.querySelector('.ring-arc');
      if (!arc) return;
      const target = parseInt(arc.dataset.target||0);
      arc.style.strokeDashoffset = String(327 - target);
      obs.unobserve(e.target);
    });
  },{ threshold:.6 });
  document.querySelectorAll('.big-stat').forEach(s => obs.observe(s));
})();

/* ════════════════════════════════════
   TEXT SCRAMBLE
════════════════════════════════════ */
(function initScramble() {
  const el = document.getElementById('scrambleText');
  if (!el) return;
  const words = (el.dataset.words||'').split(',').map(w=>w.trim());
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
  let wordIdx = 0;

  function scramble(target) {
    el.classList.add('glitching');
    let iter = 0;
    const maxIter = target.length * 3.5;
    const interval = setInterval(() => {
      el.textContent = target.split('').map((ch,i) => {
        if (i < iter / 3.5) return ch;
        return CHARS[Math.floor(Math.random()*CHARS.length)];
      }).join('');
      iter++;
      if (iter >= maxIter) {
        el.textContent = target;
        el.classList.remove('glitching');
        clearInterval(interval);
      }
    }, 40);
  }

  setInterval(() => {
    wordIdx = (wordIdx + 1) % words.length;
    scramble(words[wordIdx]);
  }, 3200);
})();

/* ════════════════════════════════════
   TERMINAL TYPING
════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typingLine');
  if (!el) return;
  const lines = [
    'monitoring realtime pipeline...',
    'processing order #2847...',
    'ai response time: 1.3ms',
    'customer query resolved ✓',
    'pixel event: Purchase fired',
    'database sync: complete',
    'uptime: 99.9% — all good',
  ];
  let i = 0;
  function typeNext() {
    i = (i+1) % lines.length;
    const text = lines[i];
    let pos = 0;
    el.textContent = '';
    const t = setInterval(() => {
      el.textContent = text.slice(0,pos);
      pos++;
      if (pos > text.length) {
        clearInterval(t);
        setTimeout(typeNext, 2800);
      }
    }, 55);
  }
  setTimeout(typeNext, 2000);
})();

/* ════════════════════════════════════
   TERMINAL LIVE DATA
════════════════════════════════════ */
(function initTermData() {
  const cpuEl    = document.getElementById('cpuVal');
  const ordersEl = document.getElementById('ordersVal');
  let orders = 247;

  setInterval(() => {
    const cpu = 8 + Math.floor(Math.random()*18);
    if (cpuEl) cpuEl.textContent = cpu + '%';
  }, 2200);

  setInterval(() => {
    if (Math.random() > 0.4) {
      orders++;
      if (ordersEl) ordersEl.textContent = orders;
    }
  }, 4000);
})();

/* ════════════════════════════════════
   3D TILT CARDS
════════════════════════════════════ */
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width/2;
      const y  = e.clientY - r.top  - r.height/2;
      card.style.transform = `perspective(1000px) rotateX(${(y/r.height)*-10}deg) rotateY(${(x/r.width)*10}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .6s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(()=>{ card.style.transition=''; },600);
    });
  });
})();

/* ════════════════════════════════════
   TERMINAL TILT
════════════════════════════════════ */
(function initTermTilt() {
  const wrap = document.getElementById('terminalWrap');
  if (!wrap) return;
  const term = wrap.querySelector('.terminal');
  wrap.addEventListener('mousemove', e => {
    const r  = wrap.getBoundingClientRect();
    const x  = (e.clientX - r.left - r.width/2)  / r.width;
    const y  = (e.clientY - r.top  - r.height/2) / r.height;
    if (term) {
      term.style.transform = `perspective(900px) rotateX(${-y*10}deg) rotateY(${x*10}deg)`;
      term.style.boxShadow = `0 0 0 1px rgba(184,255,46,0.06), ${x*-20}px ${y*-20}px 80px rgba(0,0,0,.7), 0 0 60px rgba(184,255,46,${0.04+Math.abs(x+y)*.06})`;
    }
  });
  wrap.addEventListener('mouseleave', () => {
    if (term) { term.style.transform=''; term.style.boxShadow=''; }
  });
})();

/* ════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════ */
(function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top  - r.height/2;
      btn.style.transform = `translate(${x*.18}px,${y*.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .55s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform  = '';
      setTimeout(()=>{ btn.style.transition=''; },550);
    });
  });
})();

/* ════════════════════════════════════
   MARQUEE PAUSE
════════════════════════════════════ */
(function initMarquee() {
  document.querySelectorAll('.marquee-strip').forEach(strip => {
    const inner = strip.querySelector('.mq-inner');
    if (!inner) return;
    strip.addEventListener('mouseenter', ()=>{ inner.style.animationPlayState='paused'; });
    strip.addEventListener('mouseleave', ()=>{ inner.style.animationPlayState='running'; });
  });
})();

/* ════════════════════════════════════
   BD CLOCK
════════════════════════════════════ */
(function initClock() {
  const el = document.getElementById('bdTime');
  if (!el) return;
  function tick() {
    const now = new Date().toLocaleTimeString('en-BD',{
      timeZone:'Asia/Dhaka', hour:'2-digit', minute:'2-digit'
    });
    el.textContent = now + ' BDT';
  }
  tick();
  setInterval(tick, 10000);
})();

/* ════════════════════════════════════
   CHART.JS — ANALYTICS SECTION
════════════════════════════════════ */
(function initCharts() {
  // Common chart defaults
  Chart.defaults.color = '#9ba0bc';
  Chart.defaults.font.family = "'JetBrains Mono', monospace";
  Chart.defaults.font.size = 10;

  const LIME = '#b8ff2e';
  const CYAN = '#00e8ff';
  const ROSE = '#ff3b6b';

  // ── Bar Chart: Monthly Orders ──
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Orders',
          data: [142,168,195,221,189,247,268,312,298,341,376,412],
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return LIME;
            const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, 'rgba(184,255,46,0.8)');
            grad.addColorStop(1, 'rgba(184,255,46,0.1)');
            return grad;
          },
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: LIME,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(7,9,18,0.95)',
            borderColor: 'rgba(184,255,46,0.3)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} orders`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#4a4f68' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#4a4f68' },
            beginAtZero: true
          }
        },
        animation: { duration: 1400, easing: 'easeOutQuart' }
      }
    });
  }

  // ── Doughnut: Traffic Sources ──
  const pieCtx = document.getElementById('pieChart');
  if (pieCtx) {
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Facebook Ads','Organic','WhatsApp'],
        datasets: [{
          data: [73, 15, 12],
          backgroundColor: [
            'rgba(184,255,46,0.85)',
            'rgba(0,232,255,0.85)',
            'rgba(255,59,107,0.85)'
          ],
          borderColor: 'rgba(7,9,18,0)',
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(7,9,18,0.95)',
            borderColor: 'rgba(184,255,46,0.3)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: ctx => ` ${ctx.parsed}%`
            }
          }
        },
        animation: { animateRotate: true, duration: 1600, easing: 'easeOutQuart' }
      }
    });
  }

  // ── Line Chart: Response + Conversion ──
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Conversion Rate %',
            data: [34.2, 36.8, 35.1, 38.4, 41.2, 39.7, 38.4],
            borderColor: LIME,
            backgroundColor: 'rgba(184,255,46,0.06)',
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointBackgroundColor: LIME,
            pointRadius: 4,
            pointHoverRadius: 7,
          },
          {
            label: 'Avg Response (ms)',
            data: [1.8, 1.5, 1.6, 1.3, 1.2, 1.4, 1.3],
            borderColor: CYAN,
            backgroundColor: 'rgba(0,232,255,0.05)',
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointBackgroundColor: CYAN,
            pointRadius: 4,
            pointHoverRadius: 7,
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#9ba0bc',
              usePointStyle: true,
              pointStyleWidth: 8,
              boxHeight: 6,
              padding: 16,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(7,9,18,0.95)',
            borderColor: 'rgba(184,255,46,0.3)',
            borderWidth: 1,
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#4a4f68' }
          },
          y: {
            position: 'left',
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#4a4f68', callback: v => v + '%' },
            beginAtZero: false,
          },
          y2: {
            position: 'right',
            grid: { display: false },
            ticks: { color: '#4a4f68', callback: v => v + 'ms' },
            beginAtZero: true,
          }
        },
        animation: { duration: 1600, easing: 'easeOutQuart' }
      }
    });
  }

  // ── Charts only render when in view ──
  const chartObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Trigger funnel bars
        document.querySelectorAll('.funnel-bar-fill').forEach(bar => {
          const w = bar.dataset.w;
          bar.style.width = w + '%';
        });
        chartObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const analyticsSection = document.getElementById('analytics');
  if (analyticsSection) chartObs.observe(analyticsSection);
})();

/* ════════════════════════════════════
   LIVE ANALYTICS TICKER
════════════════════════════════════ */
(function initLiveTicker() {
  const ordersEl = document.getElementById('liveOrders');
  const convEl   = document.getElementById('liveConv');
  let orders = 247;

  setInterval(() => {
    if (Math.random() > 0.5) {
      orders++;
      if (ordersEl) ordersEl.textContent = orders;
    }
    if (convEl && Math.random() > 0.7) {
      const val = (37.8 + Math.random() * 2).toFixed(1);
      convEl.textContent = val + '%';
    }
  }, 3500);
})();

/* ════════════════════════════════════
   CONTACT FORM
════════════════════════════════════ */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  document.querySelectorAll('.budget-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.budget-pill').forEach(p=>p.classList.remove('selected'));
      pill.classList.add('selected');
      const h = document.getElementById('budget');
      if (h) h.value = pill.dataset.val;
    });
  });

  const msg = document.getElementById('message');
  const cnt = document.getElementById('charCount');
  if (msg && cnt) {
    msg.setAttribute('maxlength','500');
    msg.addEventListener('input', ()=>{ cnt.textContent=msg.value.length; });
  }

  function validateField(field) {
    const g   = field.closest('.form-group');
    const val = field.value.trim();
    let ok = true;
    if (field.id==='name'    && val.length<2)                           ok=false;
    if (field.id==='email'   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ok=false;
    if (field.id==='phone'   && !/^[0-9]{10,14}$/.test(val.replace(/[\s\-+]/g,''))) ok=false;
    if (field.id==='service' && val==='')                               ok=false;
    if (field.id==='message' && val.length<20)                          ok=false;
    if (g) g.classList.toggle('has-error',!ok);
    return ok;
  }

  form.querySelectorAll('.form-input').forEach(f => {
    f.addEventListener('blur', ()=>validateField(f));
    f.addEventListener('input', ()=>{
      if (f.closest('.form-group')?.classList.contains('has-error')) validateField(f);
    });
  });
})();

/* ════════════════════════════════════
   TOAST
════════════════════════════════════ */
function showToast(msg, type='success') {
  document.querySelector('.zv-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'zv-toast';
  const colors = {
    success:'linear-gradient(135deg,#b8ff2e,#00e8ff)',
    error:'linear-gradient(135deg,#ff3b6b,#f59e0b)'
  };
  t.style.cssText = `
    position:fixed;bottom:32px;right:32px;z-index:9999;
    padding:14px 22px;border-radius:10px;
    font-family:'JetBrains Mono',monospace;font-size:12px;
    letter-spacing:.3px;color:#000;font-weight:600;
    background:${colors[type]||colors.success};
    box-shadow:0 12px 40px rgba(0,0,0,.45);
    transform:translateY(24px);opacity:0;
    transition:all .45s cubic-bezier(0.16,1,0.3,1);
    cursor:pointer;max-width:300px;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>{ t.style.transform='translateY(0)'; t.style.opacity='1'; });
  const dismiss = () => {
    t.style.transform='translateY(24px)'; t.style.opacity='0';
    setTimeout(()=>t.remove(),450);
  };
  t.addEventListener('click',dismiss);
  setTimeout(dismiss,3800);
}

/* ════════════════════════════════════
   ESC KEY
════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key==='Escape') {
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.getElementById('menuBtn')?.classList.remove('open');
  }
});

/* ════════════════════════════════════
   REDUCED MOTION
════════════════════════════════════ */
if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.documentElement.style.setProperty('--ease','linear');
}