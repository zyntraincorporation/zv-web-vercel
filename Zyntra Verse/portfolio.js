/* ══════════════════════════════════════════════════════════════
   PORTFOLIO PAGE — portfolio.js
   Interactive layer: typewriter · IoT sim · skill tabs · counters · tilt
══════════════════════════════════════════════════════════════ */
'use strict';

/* ────────────────────────────────────────
   HERO STAGGER — reveals on load
──────────────────────────────────────── */
(function staggerHero() {
  [1,2,3,4,5].forEach(n => {
    const el = document.querySelector(`.stagger-${n}`);
    if (!el) return;
    el.style.opacity    = '1';
    el.style.transform  = 'none';
    setTimeout(() => {
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
      // Already visible
    }, 200 + n * 150);
  });
})();

/* ────────────────────────────────────────
   TITLE TYPEWRITER
──────────────────────────────────────── */
(function initTitleTypewriter() {
  const el = document.getElementById('pfTitleText');
  if (!el) return;

  const roles = [
    'AI Engineer',
    'Web Developer',
    'IoT Builder',
    'AI Automation Expert',
    'Marketing Expert',
    'AI Agent Builder',
    'Founder & CEO',
    'Python Programmer',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let waitTimer = null;

  function type() {
    const current = roles[roleIdx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        waitTimer = setTimeout(type, 380);
        return;
      }
      waitTimer = setTimeout(type, 42);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        waitTimer = setTimeout(type, 2400);
        return;
      }
      waitTimer = setTimeout(type, 72);
    }
  }

  // Start after stagger delay
  setTimeout(type, 1200);
})();

/* ────────────────────────────────────────
   SCROLL REVEAL
──────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const d = parseInt(e.target.dataset.delay || 0);
    setTimeout(() => e.target.classList.add('visible'), d);
    revObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ────────────────────────────────────────
   COUNTERS — smooth easing
──────────────────────────────────────── */
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.target, 10);
    const DUR    = 2200;
    const start  = performance.now();
    const ease   = t => 1 - Math.pow(1 - t, 4);

    (function tick(now) {
      const p = Math.min((now - start) / DUR, 1);
      el.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(performance.now());

    cntObs.unobserve(el);
  });
}, { threshold: 0.7 });

document.querySelectorAll('.counter').forEach(c => cntObs.observe(c));

/* ────────────────────────────────────────
   SKILL BAR ANIMATION
──────────────────────────────────────── */
const skillBarObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('counted');
    skillBarObs.unobserve(e.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-item').forEach(el => skillBarObs.observe(el));

/* ────────────────────────────────────────
   SKILL TABS
──────────────────────────────────────── */
(function initSkillTabs() {
  const tabs   = document.querySelectorAll('.sk-tab');
  const panels = document.querySelectorAll('.skill-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show correct panel
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === 'tab-' + target) {
          p.classList.add('active');

          // Re-trigger skill bar animations for this panel
          p.querySelectorAll('.skill-item').forEach(item => {
            item.classList.remove('counted');
            void item.offsetWidth; // reflow
            setTimeout(() => item.classList.add('counted'), 80);
          });

          // Re-observe counters inside this panel
          p.querySelectorAll('.counter').forEach(c => {
            c.textContent = '0';
            cntObs.observe(c);
          });
        }
      });
    });
  });
})();

/* ────────────────────────────────────────
   IoT GAS DETECTOR SIMULATION
──────────────────────────────────────── */
(function initGasSim() {
  const simBtn    = document.getElementById('simGasBtn');
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeVal  = document.getElementById('gaugeVal');
  const gasVal    = document.getElementById('gasVal');
  const aqiVal    = document.getElementById('aqiVal');
  const tempVal   = document.getElementById('tempVal');
  const gasBar    = document.getElementById('gasBar');
  const aqiBar    = document.getElementById('aqiBar');
  const tempBar   = document.getElementById('tempBar');
  const statusDot = document.getElementById('gasStatusDot');
  const statusTxt = document.getElementById('gasStatusText');
  const alarmState = document.getElementById('alarmState');

  if (!simBtn) return;

  let isDanger = false;
  let liveInterval = null;

  // Normal fluctuation (safe state)
  function startNormalMode() {
    isDanger = false;
    simBtn.textContent = '⚠️ Simulate Gas Leak';
    simBtn.classList.remove('safe-mode');

    clearInterval(liveInterval);
    liveInterval = setInterval(() => {
      const gas  = 100 + Math.floor(Math.random() * 80);   // 100–180 PPM safe
      const aqi  = 20  + Math.floor(Math.random() * 20);   // 20–40 good
      const temp = (26 + Math.random() * 3).toFixed(1);    // 26–29°C
      const gasW = Math.round((gas / 1000) * 100) + '%';   // width

      updateReadings(gas, aqi, temp, gasW, ((aqi/200)*100)+'%', '55%', 'safe', '#22c55e', 251 - (gas/1000)*251);
      updateStatus('safe', 'SAFE', 'safe-ial', 'OFF');
    }, 2200);
  }

  // Danger simulation
  function startDangerMode() {
    isDanger = true;
    simBtn.textContent = '✅ Reset to Safe';
    simBtn.classList.add('safe-mode');

    clearInterval(liveInterval);
    liveInterval = setInterval(() => {
      const gas  = 600 + Math.floor(Math.random() * 300);  // 600–900 PPM danger
      const aqi  = 80  + Math.floor(Math.random() * 40);   // 80–120 danger
      const temp = (31 + Math.random() * 3).toFixed(1);    // 31–34°C elevated
      const gasW = Math.round((gas / 1000) * 100) + '%';

      updateReadings(gas, aqi, temp, gasW, ((aqi/200)*100)+'%', '75%', 'danger', '#ff3b6b', 251 - (gas/1000)*251);
      updateStatus('danger', '⚠️ DANGER!', 'danger-ial', '🔔 ON');
    }, 1000);
  }

  function updateReadings(gas, aqi, temp, gasW, aqiW, tempW, state, color, dashOffset) {
    if (gasVal)  { gasVal.textContent = gas + ' PPM'; gasVal.className = 'ir-val ' + state; }
    if (aqiVal)  aqiVal.textContent   = aqi;
    if (tempVal) tempVal.textContent  = temp + '°C';
    if (gasBar)  { gasBar.style.width = gasW; gasBar.className = 'ir-fill ' + (state === 'danger' ? 'danger-fill' : 'safe-fill'); }
    if (aqiBar)  aqiBar.style.width   = aqiW;
    if (tempBar) tempBar.style.width  = tempW;
    if (gaugeVal) { gaugeVal.textContent = gas; gaugeVal.setAttribute('fill', color); }
    if (gaugeFill) {
      gaugeFill.style.stroke = color;
      gaugeFill.setAttribute('stroke-dashoffset', Math.max(0, dashOffset).toString());
    }
  }

  function updateStatus(state, text, ialClass, alarmText) {
    if (statusDot) { statusDot.className = 'iot-status-dot ' + state; }
    if (statusTxt) { statusTxt.textContent = text; statusTxt.style.color = state === 'danger' ? '#ff3b6b' : '#22c55e'; }
    if (alarmState) { alarmState.textContent = alarmText; alarmState.className = 'ial ' + ialClass; }
  }

  simBtn.addEventListener('click', () => {
    if (isDanger) {
      startNormalMode();
      // Update immediately
      const gas  = 100 + Math.floor(Math.random() * 80);
      const aqi  = 20  + Math.floor(Math.random() * 20);
      const temp = (26 + Math.random() * 3).toFixed(1);
      const gasW = Math.round((gas / 1000) * 100) + '%';
      updateReadings(gas, aqi, temp, gasW, ((aqi/200)*100)+'%', '55%', 'safe', '#22c55e', 251 - (gas/1000)*251);
      updateStatus('safe', 'SAFE', 'safe-ial', 'OFF');
    } else {
      startDangerMode();
      // Update immediately
      const gas  = 600 + Math.floor(Math.random() * 300);
      const aqi  = 80  + Math.floor(Math.random() * 40);
      const temp = (31 + Math.random() * 3).toFixed(1);
      const gasW = Math.round((gas / 1000) * 100) + '%';
      updateReadings(gas, aqi, temp, gasW, ((aqi/200)*100)+'%', '75%', 'danger', '#ff3b6b', 251 - (gas/1000)*251);
      updateStatus('danger', '⚠️ DANGER!', 'danger-ial', '🔔 ON');
    }
  });

  // Start in safe mode
  startNormalMode();
})();

/* ────────────────────────────────────────
   NAVBAR SCROLL
──────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  // Update scroll percent for side label
  const el = document.getElementById('scrollPct');
  if (el) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    el.textContent = String(pct).padStart(2, '0') + '%';
  }
}, { passive: true });

/* ────────────────────────────────────────
   MOBILE MENU
──────────────────────────────────────── */
(function initMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

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
    if (!navbar?.contains(e.target)) {
      menu.classList.remove('open');
      btn?.classList.remove('open');
    }
  });
})();

/* ────────────────────────────────────────
   CUSTOM CURSOR (uses existing cur / cur-ring from app.js)
  If app.js is loaded first these are already active.
  This block handles cursor hover on portfolio-specific targets.
──────────────────────────────────────── */
(function portfolioCursorHovers() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;

  const targets = '.skill-item, .tool-pill, .project-card, .tl-right, .iot-sim-btn, .proj-live-link, .id-card, .av-item, .ai-item';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.classList.add('hov');
      ring.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      cur.classList.remove('hov');
      ring.classList.remove('hov');
    });
  });
})();

/* ────────────────────────────────────────
   3D TILT — portfolio-specific cards
──────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left  - r.width  / 2;
      const y  = e.clientY - r.top   - r.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-(y / r.height) * 9}deg) rotateY(${(x / r.width) * 9}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .65s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 650);
    });
  });
})();

/* ────────────────────────────────────────
   MAGNETIC BUTTONS
──────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.17}px, ${y * 0.17}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .55s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 550);
    });
  });
})();

/* ────────────────────────────────────────
   ID CARD PARALLAX TILT
──────────────────────────────────────── */
(function initIdCardTilt() {
  const wrap = document.querySelector('.pf-hero-right');
  const card = document.getElementById('idCard');
  if (!wrap || !card) return;

  wrap.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left  - r.width  / 2) / r.width;
    const y = (e.clientY - r.top   - r.height / 2) / r.height;
    card.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
    card.style.boxShadow = `
      0 0 0 1px rgba(184,255,46,0.06),
      ${x * -22}px ${y * -22}px 80px rgba(0,0,0,.75),
      0 0 60px rgba(184,255,46,${0.03 + Math.abs(x + y) * 0.06})
    `;
  });
  wrap.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.boxShadow  = '';
  });
})();

/* ────────────────────────────────────────
   MARQUEE PAUSE
──────────────────────────────────────── */
document.querySelectorAll('.marquee-strip').forEach(strip => {
  const inner = strip.querySelector('.mq-inner');
  if (!inner) return;
  strip.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  strip.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
});

/* ────────────────────────────────────────
   LIVE PVB ORDER COUNTER (project terminal)
──────────────────────────────────────── */
(function initPvbCounter() {
  const el = document.getElementById('pvbOrders');
  if (!el) return;
  let count = 247;
  setInterval(() => {
    if (Math.random() > 0.5) {
      count++;
      el.textContent = count;
    }
  }, 4500);
})();

/* ────────────────────────────────────────
   DOWNLOAD CV BUTTON — generates a simple text file
   (Replace with actual CV URL when ready)
──────────────────────────────────────── */
(function initCvDownload() {
  const btn = document.getElementById('downloadCV');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    // cv.html নতুন tab এ খুলবে
    // সেখানে "Download PDF" বাটন click করলে
    // Saiful_Islam_CV_2026.pdf download হবে
    window.open('cv.html', '_blank');
  });
})();
SAIFUL ISLAM — CEO & DEVELOPER
================================
ZYNTRA VERSE — AI Automation Studio
Chandpur, Bangladesh

CONTACT
-------
Email:    zyntraverse@gmail.com
WhatsApp: +880 1577-164596
Website:  zyntraverse.online

EDUCATION
---------
Chandpur Government University and College — Current Student

EXPERIENCE
----------
Founder & CEO — ZYNTRA VERSE (2020–Present)
  - Built 120+ AI automation systems, websites and IoT projects
  - 50+ clients across Bangladesh
  - Specialised in AI agents, Facebook CAPI, n8n automation

SKILLS
------
AI Engineering:    OpenAI API, LangChain, AI Agents, n8n, Make.com
Web Development:   HTML5, CSS3, JavaScript, Python, React, Firebase
IoT & Hardware:    Arduino, ESP32, Sensors, MQTT, Real-time displays
Marketing:         Facebook Ads, Pixel, CAPI, Conversion Optimisation

FEATURED PROJECTS
-----------------
1. Gas Leakage Detector (IoT) — Real-time safety system
2. Facebook AI Order Bot — 247+ daily automated orders
3. ZYNTRA VERSE Website — 98/100 Lighthouse score
4. Quran Combo Landing Page — 10.8% conversion rate
`;
    const blob = new Blob([cvText.trim()], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'Saiful_Islam_CV.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
})();

/* ────────────────────────────────────────
   SMOOTH SCROLL for anchor links
──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ────────────────────────────────────────
   BD CLOCK
──────────────────────────────────────── */
(function initClock() {
  const el = document.getElementById('bdTime');
  if (!el) return;
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-BD', {
      timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit'
    });
    el.textContent = t + ' BDT';
  };
  tick();
  setInterval(tick, 10000);
})();

/* ────────────────────────────────────────
   ESC key — close menu
──────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.getElementById('menuBtn')?.classList.remove('open');
  }
});