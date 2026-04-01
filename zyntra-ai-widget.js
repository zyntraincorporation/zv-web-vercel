/* ═══════════════════════════════════════════════════════════
   ZYNTRA VERSE — AI Assistant Widget v1.0
   Self-contained. No dependencies. Paste ONE script tag.

   SETUP: Requests are now routed via the shared Vercel API.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────── */
  const CFG = {
    MODEL              : 'openai/gpt-4o-mini',
    SITE_URL           : window.location.origin || 'https://zyntraverse.online',
    CONTACT_PHONE      : '+880 1577164596',
    CONTACT_EMAIL      : 'hello@zyntraverse.online',
    CONTACT_PAGE       : 'contact.html',
  };
  const API = window.ZVApi;

  /* ── DON'T INIT TWICE ────────────────────────────── */
  if (document.getElementById('zv-widget-root') || !API) return;

  /* ══════════════════════════════════════════════════
     SYSTEM PROMPT
  ══════════════════════════════════════════════════ */
  const SYSTEM_PROMPT = `You are ZYNTRA AI, the official AI assistant for ZYNTRA VERSE — a premium AI automation and web development agency based in Dhaka, Bangladesh. You help website visitors learn about services, answer questions, and book free demo consultations.

━━━━━━━━━━━━━━━━━━━━
ABOUT ZYNTRA VERSE
━━━━━━━━━━━━━━━━━━━━
Founded by Saiful Islam (CEO & AI Engineer). An AI-first digital agency building intelligent automation systems, websites, landing pages, and Facebook marketing solutions for businesses in Bangladesh and beyond. Based in Dhaka.

Core strengths:
• Fast delivery: most projects ship within 3–7 days
• AI-first approach: every solution enhanced with intelligent automation
• Data-driven: decisions backed by analytics and conversion data
• Secure & reliable: built with security and uptime in mind

━━━━━━━━━━━━━━━━━━━━
SERVICES & DETAILS
━━━━━━━━━━━━━━━━━━━━

01. AI AUTOMATION SYSTEMS (Most Popular)
  → AI Order Taking: Fully automated order collection from Facebook Messenger, WhatsApp Business, and website chat. Collects product, quantity, address, and phone — zero human involvement.
  → AI Customer Support Agents: Smart agents answer product questions, handle complaints, track orders, resolve issues 24/7. 94% queries resolved without human handoff.
  → WhatsApp & Messenger Integration: Native API integration for order confirmations, delivery updates, and promos.
  → 24/7 Automated Responses: System never sleeps. Handles all messages round the clock.
  → Order Tracking & Notifications: Auto status updates (confirmed, packed, shipped, delivered).
  → Setup time: 5–7 business days standard, up to 14 days for complex setups.
  → Post-launch: 2 weeks free support included, then monthly retainer available.
  → Platforms: Facebook Messenger, WhatsApp Business, Website Chat Widget, Instagram DM.
  → Stats: 247+ daily orders processed per client, 94% AI resolution rate, 70% fewer tracking queries, 99.9% uptime, ~1.3ms response time.

02. DATABASE & CRM SYSTEMS
  → Custom Order Databases: Fully structured databases specific to your workflow.
  → CRM Dashboards: Real-time metrics — orders, revenue, customer trends, delivery areas.
  → Google Sheets Integration: Instant sync from AI chatbots, forms, and order systems.
  → WhatsApp Notifications: Alerts for new orders; daily summary reports auto-sent at 9 AM.
  → Sales Report Automation: Daily, weekly, monthly reports delivered automatically.
  → Customer Profiles: Auto-built profiles for segmentation and repeat sales.
  → Stats: 100% orders captured, 0 manual data entry, 30+ report templates, real-time dashboard updates.

03. FULL WEBSITE DEVELOPMENT
  → E-commerce stores with product catalog, cart, checkout, order management, payment gateway, inventory tracking.
  → Business / portfolio sites: Home, About, Services, Contact form, WhatsApp CTA, GMB integration.
  → Performance sites scoring 98+ on Lighthouse. Sub-1.5s load time, Core Web Vitals optimised.
  → Tech stack: HTML5/CSS3, Vanilla JS, React/Next.js, Tailwind CSS, Node.js, WordPress, Vercel/Cloudflare, Firebase/Supabase.
  → Stats: 98 avg Lighthouse score, 5x faster load vs old site, 60+ sites shipped, 7-day delivery.
  → Includes: Mobile-first design, SEO, SSL & security, GA4 + Facebook Pixel + GTM setup, 2 weeks post-launch support.

04. LANDING PAGE DESIGN
  → Conversion-optimised pages for marketing campaigns, ad traffic, product launches.
  → Uses psychological persuasion: pain-focused headlines, social proof, urgency/scarcity, benefit-first bullets, action CTAs.
  → Stats: 42% avg conversion lift, 10.8% CVR achieved (industry avg 2.5%), 3-day delivery, 50+ pages shipped.
  → Includes: A/B test-ready structure, high CTR copywriting, mobile optimised, WhatsApp/Google Sheets integration.

05. FACEBOOK SALES MARKETING & PIXEL
  → Facebook Pixel Setup: Full installation via GTM or direct code. All standard + custom events.
  → Server-Side Event Tracking (CAPI): Browser-independent, iOS-proof conversion tracking.
  → Fixes iOS 14+ tracking losses, Safari ITP issues, ad blockers blocking pixel events.
  → Event Match Quality Score: Jumps from 3 → 9+ after our setup.
  → Retargeting Audiences: Website visitors, product viewers, cart abandoners, purchasers, 1–3% lookalikes.
  → Ad Account Audit & Fixing: Pixel health, event quality, campaign structure, creatives.
  → Stats: 9.4/10 avg event match score, 98% purchase events captured, +38% avg ROAS gain, 99.1% deduplication accuracy.
  → Setup time: 3–5 days. Includes audit report + video walkthrough + 2-week monitoring.

━━━━━━━━━━━━━━━━━━━━
FOUNDER
━━━━━━━━━━━━━━━━━━━━
Saiful Islam — CEO, Founder, AI Engineer
Location: Chandpur, Bangladesh
Currently studying at Chandpur Government University and College.
Expertise: AI Agent Building (OpenAI, LangChain), LLMs (GPT-4, Claude, Gemini), n8n, Make.com, Google Apps Script, ManyChat, HTML/CSS/JS, React, Facebook CAPI/GTM, Arduino/ESP32 IoT.
Notable projects: Gas Leakage Detector (IoT), Facebook AI Order Bot, ZYNTRA VERSE website, Quran Combo Gift Landing Page.

━━━━━━━━━━━━━━━━━━━━
PRICING
━━━━━━━━━━━━━━━━━━━━
Pricing depends on project scope and complexity. Never quote specific prices — always say pricing is discussed on the free demo call after understanding the client's needs. Say it's very competitive and tailored to Bangladeshi market rates.

━━━━━━━━━━━━━━━━━━━━
CONTACT
━━━━━━━━━━━━━━━━━━━━
Email: saiful@zyntraverse.online
WhatsApp / Phone: ${CFG.CONTACT_PHONE}
Response time: Within 24 hours.
Contact page: ${CFG.CONTACT_PAGE}

━━━━━━━━━━━━━━━━━━━━
DEMO BOOKING FLOW
━━━━━━━━━━━━━━━━━━━━
When a user wants to book a demo, get a quote, start a project, or talk to someone — collect these conversationally:
  1. Full name
  2. Gmail address (for confirmation email)
  3. Which service they're interested in (if not already mentioned)
  4. Budget range (optional — if they mention it, note it; if not, don't force)

Once you have name + email confirmed, end your message with this exact marker on a new line:
[BOOK:{"name":"<name>","email":"<email>","service":"<service or General Inquiry>","budget":"<budget or Not specified>"}]

Do NOT explain or mention this marker. Just write it silently at the end.

If the user wants to fill a contact form instead, tell them to click the "Contact Form" button below or visit the contact page. Or they can call/WhatsApp on ${CFG.CONTACT_PHONE}.

━━━━━━━━━━━━━━━━━━━━
LANGUAGE & TONE
━━━━━━━━━━━━━━━━━━━━
• Default language: English. If the user writes in Bangla, reply in Bangla. If Banglish (mixed), reply in Banglish. Match their language.
• Be warm, smart, and concise. Not salesy.
• Keep responses short and focused (2–4 sentences max unless they ask for details).
• Never make up facts. If unsure, say you'll have the team confirm after booking.
• Always encourage booking a free demo for detailed discussion.`;

  /* ══════════════════════════════════════════════════
     CSS — INJECT INTO <HEAD>
  ══════════════════════════════════════════════════ */
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap');

    :root {
      --zv-lime: #b8ff2e;
      --zv-cyan: #00e8ff;
      --zv-rose: #ff3b6b;
      --zv-bg: #07090e;
      --zv-bg2: #0d0f1e;
      --zv-bg3: #13162a;
      --zv-bdr: rgba(255,255,255,0.07);
      --zv-bdr-lime: rgba(184,255,46,0.25);
      --zv-text: #e8eaf6;
      --zv-dim: #7b7f98;
      --zv-mono: 'JetBrains Mono', monospace;
      --zv-body: 'Outfit', sans-serif;
      --zv-ease: cubic-bezier(0.16,1,0.3,1);
    }

    /* Floating button */
    #zv-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 999999;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--zv-bg2);
      border: 1.5px solid var(--zv-bdr-lime);
      box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 0 rgba(184,255,46,0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s var(--zv-ease), box-shadow 0.3s;
      animation: zv-pulse-ring 3s ease-in-out infinite;
    }
    #zv-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 20px rgba(184,255,46,0.2);
    }
    #zv-fab.open { animation: none; }
    @keyframes zv-pulse-ring {
      0%,100% { box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 0 rgba(184,255,46,0.35); }
      50% { box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 10px rgba(184,255,46,0); }
    }
    #zv-fab-icon, #zv-fab-close {
      position: absolute;
      transition: opacity 0.25s, transform 0.3s var(--zv-ease);
    }
    #zv-fab-close { opacity: 0; transform: scale(0.5) rotate(-90deg); }
    #zv-fab.open #zv-fab-icon { opacity: 0; transform: scale(0.5) rotate(90deg); }
    #zv-fab.open #zv-fab-close { opacity: 1; transform: scale(1) rotate(0deg); }

    /* Notification badge */
    #zv-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--zv-rose);
      border: 2px solid var(--zv-bg);
      font-family: var(--zv-mono);
      font-size: 9px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      transition: opacity 0.2s, transform 0.2s;
    }
    #zv-badge.hidden { opacity: 0; transform: scale(0); }

    /* Chat panel */
    #zv-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      z-index: 999998;
      width: min(360px, calc(100vw - 32px));
      height: min(560px, calc(100vh - 124px));
      max-height: calc(100vh - 124px);
      display: flex;
      flex-direction: column;
      background: var(--zv-bg2);
      border: 1px solid var(--zv-bdr-lime);
      border-radius: 20px;
      box-shadow: 0 40px 100px rgba(0,0,0,0.85), 0 0 80px rgba(184,255,46,0.05);
      box-sizing: border-box;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.35s var(--zv-ease), transform 0.35s var(--zv-ease);
      transform-origin: bottom right;
    }
    #zv-panel.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* Header */
    #zv-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: rgba(184,255,46,0.03);
      border-bottom: 1px solid var(--zv-bdr);
      flex-shrink: 0;
    }
    #zv-av {
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(184,255,46,0.08);
      border: 1px solid var(--zv-bdr-lime);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
      position: relative;
    }
    #zv-av::after {
      content: '';
      position: absolute;
      bottom: 1px; right: 1px;
      width: 9px; height: 9px;
      border-radius: 50%;
      background: #22c55e;
      border: 2px solid var(--zv-bg2);
      box-shadow: 0 0 6px #22c55e;
      animation: zv-dot-pulse 2.5s ease-in-out infinite;
    }
    @keyframes zv-dot-pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
    #zv-hd-name {
      font-family: var(--zv-body);
      font-size: 14px; font-weight: 700;
      color: var(--zv-text); line-height: 1.2;
    }
    #zv-hd-sub {
      font-family: var(--zv-mono);
      font-size: 9px; letter-spacing: 1px;
      text-transform: uppercase; color: var(--zv-dim);
      margin-top: 2px;
    }
    #zv-hd-status {
      margin-left: auto;
      font-family: var(--zv-mono);
      font-size: 9px; letter-spacing: 1px;
      text-transform: uppercase;
      color: #22c55e;
      display: flex; align-items: center; gap: 5px;
    }
    .zv-sd { width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e; }

    /* Quick-start chips */
    #zv-chips {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 10px 14px 0;
      flex-shrink: 0;
    }
    .zv-chip {
      font-family: var(--zv-mono);
      font-size: 10px; letter-spacing: 0.3px;
      padding: 5px 10px; border-radius: 20px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--zv-bdr);
      color: var(--zv-dim);
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
      white-space: nowrap;
    }
    .zv-chip:hover {
      border-color: var(--zv-bdr-lime);
      color: var(--zv-lime);
      background: rgba(184,255,46,0.06);
    }

    /* Messages */
    #zv-msgs {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: rgba(184,255,46,0.15) transparent;
    }
    #zv-msgs::-webkit-scrollbar { width: 4px; }
    #zv-msgs::-webkit-scrollbar-track { background: transparent; }
    #zv-msgs::-webkit-scrollbar-thumb { background: rgba(184,255,46,0.15); border-radius: 2px; }

    .zv-msg {
      display: flex; align-items: flex-end; gap: 7px;
      opacity: 0; animation: zv-msg-in 0.35s var(--zv-ease) forwards;
    }
    .zv-msg.zv-user { flex-direction: row-reverse; }
    @keyframes zv-msg-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

    .zv-bubble {
      max-width: 80%; padding: 10px 13px;
      border-radius: 14px; font-family: var(--zv-body);
      font-size: 13px; line-height: 1.65; color: var(--zv-text);
    }
    .zv-bot-b {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--zv-bdr);
      border-bottom-left-radius: 4px;
    }
    .zv-user-b {
      background: rgba(184,255,46,0.1);
      border: 1px solid rgba(184,255,46,0.2);
      border-bottom-right-radius: 4px;
      color: var(--zv-text);
    }
    .zv-sys-b {
      width: 100%; text-align: center;
      background: rgba(0,232,255,0.06);
      border: 1px solid rgba(0,232,255,0.18);
      border-radius: 8px;
      font-family: var(--zv-mono);
      font-size: 11px; color: rgba(0,232,255,0.85);
      padding: 8px 12px;
    }
    .zv-ok-b {
      width: 100%; text-align: center;
      background: rgba(184,255,46,0.07);
      border: 1px solid rgba(184,255,46,0.25);
      border-radius: 8px;
      font-family: var(--zv-mono);
      font-size: 11px; color: var(--zv-lime);
      padding: 10px 14px; line-height: 1.6;
    }
    .zv-av-sm { font-size:16px; flex-shrink:0; line-height:1; }

    /* Typing */
    #zv-typing {
      display: flex; align-items: flex-end; gap: 7px;
    }
    .zv-typing-dots {
      display: flex; gap: 4px; padding: 10px 13px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--zv-bdr);
      border-radius: 14px; border-bottom-left-radius: 4px;
    }
    .zv-td {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--zv-dim);
    }
    .zv-td:nth-child(1){animation:zv-td 1.4s ease-in-out infinite}
    .zv-td:nth-child(2){animation:zv-td 1.4s ease-in-out 0.2s infinite}
    .zv-td:nth-child(3){animation:zv-td 1.4s ease-in-out 0.4s infinite}
    @keyframes zv-td{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px);background:var(--zv-lime)}}

    /* Contact form */
    #zv-form-wrap {
      padding: 14px;
      border-top: 1px solid var(--zv-bdr);
      background: rgba(255,255,255,0.015);
      flex-shrink: 0;
      display: none;
    }
    #zv-form-wrap.show { display: block; }
    #zv-form-title {
      font-family: var(--zv-mono);
      font-size: 10px; letter-spacing: 1.5px;
      text-transform: uppercase; color: var(--zv-dim);
      margin-bottom: 10px;
    }
    .zv-form-row { margin-bottom: 8px; }
    .zv-fi {
      width: 100%; box-sizing: border-box;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--zv-bdr);
      border-radius: 8px;
      padding: 8px 12px;
      font-family: var(--zv-body);
      font-size: 12px; color: var(--zv-text);
      outline: none;
      transition: border-color 0.25s;
    }
    .zv-fi:focus { border-color: var(--zv-bdr-lime); }
    .zv-fi::placeholder { color: var(--zv-dim); }
    .zv-fi option { background: #0d0f1e; color: var(--zv-text); }
    #zv-form-btns { display: flex; gap: 8px; margin-top: 10px; }
    .zv-fbtn {
      flex: 1; padding: 9px 12px;
      border-radius: 8px; border: none;
      font-family: var(--zv-body);
      font-size: 12px; font-weight: 700;
      cursor: pointer; transition: opacity 0.2s;
    }
    .zv-fbtn:hover { opacity: 0.82; }
    .zv-fbtn-submit { background: var(--zv-lime); color: #000; }
    .zv-fbtn-cancel { background: rgba(255,255,255,0.06); color: var(--zv-dim); border: 1px solid var(--zv-bdr); }

    /* Footer / Input */
    #zv-footer {
      padding: 10px 14px 12px;
      border-top: 1px solid var(--zv-bdr);
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-shrink: 0;
    }
    #zv-input-row { display: flex; gap: 7px; }
    #zv-input {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--zv-bdr);
      border-radius: 8px;
      padding: 9px 13px;
      font-family: var(--zv-body);
      font-size: 13px; color: var(--zv-text);
      outline: none;
      transition: border-color 0.25s;
      resize: none;
    }
    #zv-input:focus { border-color: var(--zv-bdr-lime); }
    #zv-input::placeholder { color: var(--zv-dim); }
    #zv-input:disabled { opacity: 0.4; cursor: not-allowed; }
    #zv-send {
      background: var(--zv-lime);
      color: #000; border: none;
      border-radius: 8px;
      padding: 0 15px;
      font-family: var(--zv-body);
      font-size: 13px; font-weight: 700;
      cursor: pointer;
      transition: opacity 0.25s;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    #zv-send:hover { opacity: 0.82; }
    #zv-send:disabled { opacity: 0.4; cursor: not-allowed; }

    #zv-footer-actions {
      display: flex; gap: 6px;
    }
    .zv-faction {
      flex: 1; padding: 6px 8px;
      border-radius: 7px;
      border: 1px solid var(--zv-bdr);
      background: rgba(255,255,255,0.03);
      font-family: var(--zv-mono);
      font-size: 9px; letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--zv-dim);
      cursor: pointer;
      text-align: center;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
      text-decoration: none;
      display: flex; align-items: center; justify-content: center; gap: 4px;
    }
    .zv-faction:hover {
      border-color: var(--zv-bdr-lime);
      color: var(--zv-lime);
      background: rgba(184,255,46,0.05);
    }
    #zv-hint {
      font-family: var(--zv-mono);
      font-size: 9px; letter-spacing: 0.3px;
      color: var(--zv-dim);
      text-align: center;
      padding-top: 2px;
    }

    /* Mobile responsive */
    @media (max-width: 900px) {
      #zv-panel {
        right: 16px;
        bottom: 88px;
        width: min(340px, calc(100vw - 24px));
        height: min(540px, calc(100vh - 112px));
        max-height: calc(100vh - 112px);
      }
      #zv-fab {
        right: 18px;
        bottom: 18px;
      }
    }

    @media (max-width: 640px) {
      #zv-panel {
        left: 10px;
        right: 10px;
        width: auto;
        bottom: 84px;
        height: min(72vh, calc(100vh - 96px));
        max-height: calc(100vh - 96px);
        border-radius: 18px;
      }
      #zv-header { padding: 12px 14px; }
      #zv-chips { padding: 8px 12px 0; }
      #zv-msgs { padding: 12px; }
      #zv-footer { padding: 10px 12px 12px; }
      #zv-input { font-size: 16px; }
      #zv-footer-actions { flex-wrap: wrap; }
      .zv-faction {
        flex: 1 1 calc(50% - 3px);
        min-height: 34px;
      }
      #zv-fab {
        right: 12px;
        bottom: 12px;
        width: 56px;
        height: 56px;
      }
    }

    @media (max-width: 390px) {
      #zv-hd-status { display: none; }
      .zv-chip {
        font-size: 9px;
        padding: 5px 8px;
      }
      .zv-bubble {
        max-width: 88%;
        font-size: 12.5px;
      }
    }
  `;

  /* ══════════════════════════════════════════════════
     HTML STRUCTURE
  ══════════════════════════════════════════════════ */
  const CHIPS = [
    { label: '⚡ AI Automation', msg: 'Tell me about AI Automation Systems' },
    { label: '🌐 Web Dev', msg: 'Tell me about Web Development services' },
    { label: '📊 Facebook Pixel', msg: 'Tell me about Facebook Pixel & tracking' },
    { label: '📋 Landing Pages', msg: 'Tell me about landing page design' },
    { label: '💰 Pricing', msg: 'How much does it cost?' },
    { label: '📅 Book Demo', msg: 'I want to book a free demo' },
  ];

  /* ══════════════════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════════════════ */
  const style = document.createElement('style');
  style.id = 'zv-widget-styles';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════════════
     BUILD DOM
  ══════════════════════════════════════════════════ */
  const root = document.createElement('div');
  root.id = 'zv-widget-root';

  root.innerHTML = `
    <!-- FAB button -->
    <div id="zv-fab" role="button" aria-label="Open ZYNTRA AI Assistant" tabindex="0">
      <span id="zv-badge">1</span>
      <span id="zv-fab-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b8ff2e" stroke-width="1.8">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10H2l2.5-2.5A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2z"/>
          <circle cx="8" cy="12" r="1" fill="#b8ff2e"/>
          <circle cx="12" cy="12" r="1" fill="#b8ff2e"/>
          <circle cx="16" cy="12" r="1" fill="#b8ff2e"/>
        </svg>
      </span>
      <span id="zv-fab-close">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8ff2e" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </span>
    </div>

    <!-- Chat panel -->
    <div id="zv-panel" role="dialog" aria-label="ZYNTRA AI Assistant">

      <!-- Header -->
      <div id="zv-header">
        <div id="zv-av">🤖</div>
        <div>
          <div id="zv-hd-name">ZYNTRA AI</div>
          <div id="zv-hd-sub">ZYNTRA VERSE · AI Assistant</div>
        </div>
        <div id="zv-hd-status">
          <span class="zv-sd"></span>Online
        </div>
      </div>

      <!-- Quick chips -->
      <div id="zv-chips">
        ${CHIPS.map(c => `<button class="zv-chip" data-msg="${c.msg}">${c.label}</button>`).join('')}
      </div>

      <!-- Messages -->
      <div id="zv-msgs"></div>

      <!-- Contact form (hidden by default) -->
      <div id="zv-form-wrap">
        <div id="zv-form-title">📋 QUICK CONTACT FORM</div>
        <div class="zv-form-row">
          <input type="text" class="zv-fi" id="zvf-name" placeholder="Your Name *" autocomplete="name"/>
        </div>
        <div class="zv-form-row">
          <input type="email" class="zv-fi" id="zvf-email" placeholder="Email Address *" autocomplete="email"/>
        </div>
        <div class="zv-form-row">
          <select class="zv-fi" id="zvf-service">
            <option value="" disabled selected>Select a service…</option>
            <option>AI Automation Systems</option>
            <option>AI Customer Support Agent</option>
            <option>Full Website Development</option>
            <option>Landing Page Design</option>
            <option>Facebook Marketing &amp; Pixel</option>
            <option>Database &amp; CRM System</option>
            <option>Other / Custom</option>
          </select>
        </div>
        <div class="zv-form-row">
          <input type="text" class="zv-fi" id="zvf-budget" placeholder="Budget Range (optional)"/>
        </div>
        <div id="zv-form-btns">
          <button class="zv-fbtn zv-fbtn-cancel" id="zv-form-cancel">Cancel</button>
          <button class="zv-fbtn zv-fbtn-submit" id="zv-form-submit">Send Request →</button>
        </div>
      </div>

      <!-- Footer -->
      <div id="zv-footer">
        <div id="zv-input-row">
          <input type="text" id="zv-input" placeholder="Ask anything…" autocomplete="off"/>
          <button id="zv-send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div id="zv-footer-actions">
          <button class="zv-faction" id="zv-btn-form">📋 Contact Form</button>
          <a class="zv-faction" id="zv-btn-wa" href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener">💬 WhatsApp</a>
          <button class="zv-faction" id="zv-btn-book">📅 Book Demo</button>
        </div>
        <div id="zv-hint">Powered by GPT-4o Mini · ZYNTRA VERSE AI</div>
      </div>

    </div>
  `;

  document.body.appendChild(root);

  /* ══════════════════════════════════════════════════
     STATE
  ══════════════════════════════════════════════════ */
  let isOpen       = false;
  let isWaiting    = false;
  let bookingDone  = false;
  let chipsHidden  = false;
  const history    = [];

  /* ══════════════════════════════════════════════════
     ELEMENTS
  ══════════════════════════════════════════════════ */
  const fab      = document.getElementById('zv-fab');
  const panel    = document.getElementById('zv-panel');
  const msgs     = document.getElementById('zv-msgs');
  const input    = document.getElementById('zv-input');
  const sendBtn  = document.getElementById('zv-send');
  const badge    = document.getElementById('zv-badge');
  const chips    = document.getElementById('zv-chips');
  const formWrap = document.getElementById('zv-form-wrap');
  const hint     = document.getElementById('zv-hint');

  /* ══════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════ */
  function scrollBottom() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideChips() {
    if (!chipsHidden) {
      chips.style.display = 'none';
      chipsHidden = true;
    }
  }

  function addMsg(text, type) {
    const wrap = document.createElement('div');
    wrap.className = 'zv-msg' + (type === 'user' ? ' zv-user' : '');

    if (type === 'sys' || type === 'ok') {
      wrap.innerHTML = `<div class="${type === 'ok' ? 'zv-ok-b' : 'zv-sys-b'}">${text}</div>`;
    } else {
      const av = `<span class="zv-av-sm">${type === 'user' ? '👤' : '🤖'}</span>`;
      const cls = type === 'user' ? 'zv-user-b' : 'zv-bot-b';
      const bubble = `<div class="zv-bubble ${cls}">${text.replace(/\n/g, '<br>')}</div>`;
      wrap.innerHTML = type === 'user' ? bubble + av : av + bubble;
    }

    msgs.appendChild(wrap);
    scrollBottom();
  }

  function showTyping() {
    const t = document.createElement('div');
    t.id = 'zv-typing';
    t.className = 'zv-msg';
    t.innerHTML = `<span class="zv-av-sm">🤖</span>
      <div class="zv-typing-dots">
        <div class="zv-td"></div><div class="zv-td"></div><div class="zv-td"></div>
      </div>`;
    msgs.appendChild(t);
    scrollBottom();
  }

  function removeTyping() {
    document.getElementById('zv-typing')?.remove();
  }

  function setLoading(on) {
    isWaiting = on;
    input.disabled  = on;
    sendBtn.disabled = on;
  }

  /* ══════════════════════════════════════════════════
     BOOKING / WEBHOOK
  ══════════════════════════════════════════════════ */
  function parseBooking(text) {
    const m = text.match(/\[BOOK:\s*(\{[\s\S]*?\})\s*\]/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
  }

  function stripMarker(text) {
    return text.replace(/\[BOOK:\s*\{[\s\S]*?\}\s*\]/g, '').trim();
  }

  async function triggerWebhook(data) {
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'ZYNTRA VERSE — AI Widget',
      page: window.location.href,
    };
    try {
      await API.webhook({
        target: 'assistant',
        payload,
      });
    } catch (e) {
      console.warn('[ZV Widget] Webhook failed (non-critical):', e);
    }
  }

  /* ══════════════════════════════════════════════════
     OPENROUTER API
  ══════════════════════════════════════════════════ */
  async function callAI(userMsg) {
    history.push({ role: 'user', content: userMsg });

    const data = await API.openrouter({
      model: CFG.MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
      ],
      max_tokens: 500,
      temperature: 0.72,
      referer: CFG.SITE_URL,
      title: 'ZYNTRA VERSE',
    });
    const reply = data.choices?.[0]?.message?.content || 'Sorry, could not generate a response.';
    history.push({ role: 'assistant', content: reply });
    return reply;
  }

  /* ══════════════════════════════════════════════════
     SEND MESSAGE
  ══════════════════════════════════════════════════ */
  async function sendMsg(text) {
    if (!text || isWaiting) return;
    hideChips();
    addMsg(text, 'user');
    setLoading(true);
    showTyping();

    try {
      const reply = await callAI(text);
      removeTyping();

      const booking = parseBooking(reply);
      const clean   = booking ? stripMarker(reply) : reply;

      if (clean) addMsg(clean, 'bot');

      if (booking && !bookingDone) {
        bookingDone = true;
        setTimeout(async () => {
          addMsg(`⏳ Sending confirmation email to <strong>${booking.email}</strong>…`, 'sys');
          await triggerWebhook({
            name   : booking.name,
            email  : booking.email,
            service: booking.service || 'General Inquiry',
            budget : booking.budget  || 'Not specified',
          });
          setTimeout(() => {
            addMsg(
              `✅ Done! Confirmation sent to <strong>${booking.email}</strong>.<br>Our team will reach out within 24 hours. Looking forward to working with you, ${booking.name}! 🚀`,
              'ok'
            );
            hint.textContent = '✅ Demo booked! Check your inbox.';
          }, 1200);
        }, 400);
      }

    } catch (err) {
      removeTyping();
      console.error('[ZV Widget] AI error:', err);
      addMsg(
        `Oops, something went wrong! Please try again or reach us at <strong>${CFG.CONTACT_EMAIL}</strong>`,
        'bot'
      );
    } finally {
      setLoading(false);
    }
  }

  /* ══════════════════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════════════════ */
  function showForm() {
    formWrap.classList.add('show');
    msgs.style.display = 'none';
    chips.style.display = 'none';
    document.getElementById('zv-footer').style.display = 'none';
  }

  function hideForm() {
    formWrap.classList.remove('show');
    msgs.style.display = '';
    if (!chipsHidden) chips.style.display = '';
    document.getElementById('zv-footer').style.display = '';
  }

  async function submitForm() {
    const name    = document.getElementById('zvf-name').value.trim();
    const email   = document.getElementById('zvf-email').value.trim();
    const service = document.getElementById('zvf-service').value;
    const budget  = document.getElementById('zvf-budget').value.trim();

    if (!name)  { document.getElementById('zvf-name').focus();  return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { document.getElementById('zvf-email').focus(); return; }
    if (!service) { document.getElementById('zvf-service').focus(); return; }

    const btn = document.getElementById('zv-form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    await triggerWebhook({ name, email, service, budget: budget || 'Not specified', via: 'contact-form' });

    hideForm();
    hideChips();
    addMsg(
      `✅ Request received! We'll contact <strong>${email}</strong> within 24 hours regarding <strong>${service}</strong>. Thanks, ${name}! 🙌`,
      'ok'
    );
    scrollBottom();

    // Reset form
    ['zvf-name','zvf-email','zvf-budget'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('zvf-service').value = '';
    btn.textContent = 'Send Request →';
    btn.disabled = false;
  }

  /* ══════════════════════════════════════════════════
     TOGGLE PANEL
  ══════════════════════════════════════════════════ */
  function openPanel() {
    isOpen = true;
    panel.classList.add('visible');
    fab.classList.add('open');
    badge.classList.add('hidden');
    input.focus();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('visible');
    fab.classList.remove('open');
  }

  /* ══════════════════════════════════════════════════
     EVENT LISTENERS
  ══════════════════════════════════════════════════ */
  fab.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  fab.addEventListener('keydown', e => { if (e.key === 'Enter') isOpen ? closePanel() : openPanel(); });

  sendBtn.addEventListener('click', () => {
    const t = input.value.trim();
    input.value = '';
    sendMsg(t);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const t = input.value.trim();
      input.value = '';
      sendMsg(t);
    }
  });

  // Quick chips
  document.querySelectorAll('.zv-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.dataset.msg;
      sendMsg(msg);
    });
  });

  // Footer action buttons
  document.getElementById('zv-btn-form').addEventListener('click', showForm);
  document.getElementById('zv-btn-book').addEventListener('click', () => {
    sendMsg('I want to book a free demo consultation');
  });

  // Form buttons
  document.getElementById('zv-form-cancel').addEventListener('click', hideForm);
  document.getElementById('zv-form-submit').addEventListener('click', submitForm);

  // Close panel on outside click
  document.addEventListener('click', e => {
    if (isOpen && !root.contains(e.target)) closePanel();
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  /* ══════════════════════════════════════════════════
     WELCOME MESSAGE
  ══════════════════════════════════════════════════ */
  setTimeout(() => {
    addMsg(
      `👋 Hello! I'm <strong>ZYNTRA AI</strong> — your assistant for ZYNTRA VERSE.<br><br>Ask me about our services, pricing, or say <strong>"book a demo"</strong> to get a free consultation. I speak English & Bangla! 🇧🇩`,
      'bot'
    );
  }, 500);

})();
