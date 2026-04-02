/* ══════════════════════════════════════════════════════════════
   PORTFOLIO ENHANCED — portfolio-enhanced.js
   ZYNTRA AI Terminal · Landing Slider · Live Preview · AI Cards
══════════════════════════════════════════════════════════════ */
'use strict';

function getPortfolioApi() {
  return window.ZVApi || null;
}

function hasBanglaText(text) {
  return /[\u0980-\u09FF]/.test(text);
}

function getSignatureDemoReply(mode, userMsg) {
  const text = userMsg.toLowerCase();
  const bangla = hasBanglaText(userMsg);

  if (text.includes('price') || text.includes('pricing') || text.includes('cost') || text.includes('budget')) {
    return bangla
      ? 'প্রাইসিং প্রজেক্টের scope অনুযায়ী কাস্টম হয়। আপনি service type আর business goal বললে আমি demo call suggest করতে পারি।'
      : 'Pricing is tailored to scope, integrations, and support needs. Share your business type and goal, and I can suggest the right demo path.';
  }

  if (text.includes('demo') || text.includes('book') || text.includes('contact')) {
    return bangla
      ? 'ডেমো বুক করতে আপনার নাম, Gmail, আর কোন service চান সেটা লিখুন। আমি সেটা booking flow-তে পাঠিয়ে দেব।'
      : 'To book a demo, send your name, Gmail address, and the service you want. I will route that into the booking flow.';
  }

  if (mode === 'order') {
    return bangla
      ? 'এই order engine Messenger, WhatsApp, আর website chat থেকে order collect করে Google Sheets বা CRM-এ log করতে পারে। Quantity, address, phone, delivery zone, আর confirmation পুরো flow automate করা যায়।'
      : 'This order engine captures orders from Messenger, WhatsApp, and website chat, then logs everything into Google Sheets or a CRM. Quantity, address, phone, delivery zone, and confirmations can all be automated.';
  }

  if (mode === 'support') {
    return bangla
      ? 'এই support AI order status, FAQs, অভিযোগ, আর escalation handle করতে পারে 24/7। Complex issue হলে human handoff trigger করা যায়।'
      : 'This support AI handles order status, FAQs, complaints, and escalations 24/7. When an issue is complex, it can trigger a clean handoff to a human agent.';
  }

  if (mode === 'academy') {
    return bangla
      ? 'ZYNTRA Academy mode automation strategy, Facebook CAPI, landing page conversion, আর n8n workflow নিয়ে structured guidance দেয়। চাইলে আমি আপনার use case অনুযায়ী step-by-step outline দিতে পারি।'
      : 'ZYNTRA Academy mode explains automation strategy, Facebook CAPI, landing page conversion, and n8n workflows in a structured way. If you want, I can turn your use case into a step-by-step outline.';
  }

  return bangla
    ? 'ZYNTRA AI automation, support agents, order systems, landing pages, আর tracking infrastructure build করে। আপনি চাইলে business use case বলুন, আমি best-fit solution explain করি।'
    : 'ZYNTRA AI builds automation systems, support agents, order flows, landing pages, and tracking infrastructure. Tell me your use case and I will explain the best-fit solution.';
}

function getOrderDemoReply(userMsg) {
  const text = userMsg.toLowerCase();
  const bangla = hasBanglaText(userMsg);

  if (text.includes('quran')) {
    return bangla
      ? 'Quran Combo Gift Set available আছে। Quantity, delivery area, আর phone number দিলে আমি demo order complete করে দিচ্ছি।'
      : 'Quran Combo Gift Set is available. Send the quantity, delivery area, and phone number, and I will complete the demo order.';
  }

  if (text.includes('dhaka') || text.includes('outside')) {
    return bangla
      ? 'Dhaka delivery ৳60, আর Dhaka-এর বাইরে ৳120। এখন product name আর phone number দিলেই confirmation generate হবে।'
      : 'Dhaka delivery is ৳60 and outside Dhaka is ৳120. Now send the product name and phone number to generate the confirmation.';
  }

  if ((text.includes('phone') || text.includes('number') || bangla && text.includes('নাম্বার')) && /\d{5,}/.test(text)) {
    return 'Order confirmed in demo mode. [ORDER_DONE:{"product":"Quran Combo Gift Set","total":"৳1,260","area":"Dhaka","id":"ZV-2478"}]';
  }

  return bangla
    ? 'ডেমো order শুরু হয়েছে। Product name, quantity, delivery area, আর phone number দিন।'
    : 'Demo order started. Send the product name, quantity, delivery area, and phone number.';
}

function getSupportDemoReply(userMsg) {
  const text = userMsg.toLowerCase();
  const bangla = hasBanglaText(userMsg);

  if (text.includes('return') || text.includes('refund') || (bangla && text.includes('রিটার্ন'))) {
    return bangla
      ? 'Damaged product হলে 7 দিনের মধ্যে return request করা যায়। Order ID আর issue details দিলে support team escalate করতে পারে।'
      : 'Damaged products can be returned within 7 days. If you share the order ID and issue details, the support team can escalate it quickly.';
  }

  if (text.includes('where') || text.includes('track') || text.includes('order') || (bangla && text.includes('অর্ডার'))) {
    return bangla
      ? 'Demo data অনুযায়ী `#ZV-1247` আজ delivery-তে আছে, `#ZV-1301` আগামীকাল ship করবে, আর `#ZV-1182` already delivered। চাইলে আমি specific order status format দেখাতে পারি।'
      : 'In the demo data, `#ZV-1247` is out for delivery today, `#ZV-1301` ships tomorrow, and `#ZV-1182` has already been delivered. I can also show the exact status response format if you want.';
  }

  return bangla
    ? 'আমি order tracking, delivery info, return policy, আর complaint routing handle করতে পারি। একটি order ID বা প্রশ্ন লিখুন।'
    : 'I can handle order tracking, delivery info, return policy, and complaint routing. Send an order ID or a support question.';
}

/* ══════════════════════════════════════════
   ZYNTRA AI SIGNATURE TERMINAL
══════════════════════════════════════════ */
(function initSigAiTerminal() {
  const chatEl  = document.getElementById('sigAiChat');
  const inputEl = document.getElementById('sigAiInput');
  const sendBtn = document.getElementById('sigAiSend');
  const modesEl = document.getElementById('sigTermModes');
  const chipsEl = document.getElementById('sigChips');
  const cpuEl   = document.getElementById('sigCpu');
  const ordEl   = document.getElementById('sigOrders');
  if (!chatEl || !inputEl || !sendBtn) return;

  const MODES = {
    agent: {
      welcome: `<strong>ZYNTRA AI Agent</strong> initialized 🤖<br>The flagship autonomous engine for e-commerce. Ask me anything about AI automation services.`,
      prompt: `You are ZYNTRA AI Agent — the flagship autonomous AI for ZYNTRA VERSE, an AI automation studio in Dhaka, Bangladesh. You run inside the portfolio website of Saiful Islam, CEO of ZYNTRA VERSE. Be confident, technical, and concise (2–3 sentences max).

ZYNTRA VERSE services: AI Automation (order bots, support agents, 24/7 pipelines), Database & CRM, Website Development, Landing Pages, Facebook CAPI marketing.
Key stats: 247+ orders/day, 94% AI resolution rate, 1.3ms response, 99.9% uptime, 120+ projects, 50+ clients.
TONE: Technical but accessible. Match user language — Bangla if they write Bangla, English otherwise.
If they want a demo: collect name + email, then output [BOOK:{"name":"X","email":"X@y.com","service":"X"}] silently at end.`
    },
    order: {
      welcome: `<strong>ZYNTRA Order Engine</strong> online 📦<br>Automated fulfilment pipeline — 247+ orders daily at 1.3ms. Ask me how it works.`,
      prompt: `You are the ZYNTRA Order Engine — the automated fulfilment system. You explain AI-powered order automation for e-commerce.

Order flow: Customer message → Intent detection → Data collection → Validation → DB write → Confirmation. Works on Facebook Messenger, WhatsApp, website. Connects to Google Sheets for logging.
Keep replies SHORT — 2 sentences. Match language. If they want this for their business, collect name + email and output [BOOK:{"name":"X","email":"X@y.com","service":"AI Order Engine"}].`
    },
    support: {
      welcome: `<strong>ZYNTRA Customer Assistant</strong> active 💬<br>24/7 support layer — 94% resolution rate. Test me with a real support scenario.`,
      prompt: `You are ZYNTRA Customer Assistant — the AI support layer. Demonstrate what a real support bot feels like.

Handle: FAQ, order tracking, complaints, smart escalation. 94% resolution rate, ~800ms reply time.
TONE: Warm, professional, efficient. Short replies. Match language. To get started, collect name + email and output [BOOK:{"name":"X","email":"X@y.com","service":"Support AI"}].`
    },
    academy: {
      welcome: `<strong>ZYNTRA Academy</strong> loaded 📚<br>Business intelligence layer. Ask about AI automation, Facebook marketing, or how to scale your business.`,
      prompt: `You are ZYNTRA Academy — the knowledge layer. Teach about AI automation, digital marketing, and business scaling.

Topics: How order bots work (ManyChat/n8n/OpenAI), Facebook Pixel & CAPI, landing page CRO, e-commerce automation in Bangladesh, prompt engineering, n8n workflows.
TONE: Educator — clear, structured, with examples. Match language. If they want ZYNTRA to build something, collect name + email and output [BOOK:{"name":"X","email":"X@y.com","service":"General Inquiry"}].`
    }
  };

  let currentMode = 'agent';
  let history     = [];
  let isWaiting   = false;
  let bookingDone = false;
  let chipsHidden = false;
  let orders      = 247;

  /* ── Live tickers ── */
  setInterval(() => { if (cpuEl) cpuEl.textContent = (8 + Math.floor(Math.random() * 18)) + '%'; }, 2200);
  setInterval(() => {
    if (Math.random() > 0.45) { orders++; if (ordEl) ordEl.textContent = orders; }
  }, 4000);

  /* ── Helpers ── */
  function scrollChat() { chatEl.scrollTop = chatEl.scrollHeight; }

  function hideChips() {
    if (!chipsHidden && chipsEl) { chipsEl.style.display = 'none'; chipsHidden = true; }
  }

  function addMsg(text, type) {
    const row = document.createElement('div');
    row.className = 'sig-msg' + (type === 'user' ? ' user-msg' : '');

    if (type === 'sys' || type === 'ok') {
      const b = document.createElement('div');
      b.className = 'sig-bubble ' + type;
      b.innerHTML = text;
      row.appendChild(b);
    } else {
      const av = document.createElement('span');
      av.className = 'sig-av';
      av.textContent = type === 'user' ? '>' : 'AI';
      const b = document.createElement('div');
      b.className = 'sig-bubble ' + (type === 'user' ? 'user' : 'bot');
      b.innerHTML = text.replace(/\n/g, '<br>');
      if (type === 'user') { row.appendChild(b); row.appendChild(av); }
      else                 { row.appendChild(av); row.appendChild(b); }
    }
    chatEl.appendChild(row);
    scrollChat();
  }

  function showTyping() {
    const row = document.createElement('div');
    row.id = 'sigTyping';
    row.className = 'sig-msg';
    const av = document.createElement('span');
    av.className = 'sig-av'; av.textContent = 'AI';
    const dots = document.createElement('div');
    dots.className = 'sig-typing';
    dots.innerHTML = '<div class="sig-td"></div><div class="sig-td"></div><div class="sig-td"></div>';
    row.appendChild(av); row.appendChild(dots);
    chatEl.appendChild(row); scrollChat();
  }

  function removeTyping() { document.getElementById('sigTyping')?.remove(); }

  function setLoading(on) {
    isWaiting = on;
    inputEl.disabled = on;
    sendBtn.disabled = on;
    sendBtn.textContent = on ? '···' : 'EXEC';
  }

  function parseBooking(text) {
    const m = text.match(/\[BOOK:\s*(\{[\s\S]*?\})\s*\]/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
  }

  function stripMarker(text) {
    return text.replace(/\[BOOK:\s*\{[\s\S]*?\}\s*\]/g, '').trim();
  }

  /* ── AI call via ZVApi (same pattern as showcase) ── */
  async function callAI(userMsg) {
    const mode = MODES[currentMode];
    const api = getPortfolioApi();
    history.push({ role: 'user', content: userMsg });

    /* Primary: ZVApi OpenRouter */
    if (api && api.openrouter) {
      const data = await api.openrouter({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'system', content: mode.prompt }, ...history],
        max_tokens: 480,
        temperature: 0.72,
        referer: window.location.origin || 'https://zyntraverse.online',
        title: 'ZYNTRA VERSE',
      });
      const reply = data.choices?.[0]?.message?.content || 'Error: no response.';
      history.push({ role: 'assistant', content: reply });
      return reply;
    }

    /* Fallback: Anthropic API (when zyntra-ai-widget.js provides it) */
    if (api && api.anthropic) {
      const data = await api.anthropic({
        model: 'claude-haiku-4-5-20251001',
        system: mode.prompt,
        messages: history,
        max_tokens: 480,
      });
      const reply = data.content?.[0]?.text || 'Error: no response.';
      history.push({ role: 'assistant', content: reply });
      return reply;
    }

    const reply = getSignatureDemoReply(currentMode, userMsg);
    history.push({ role: 'assistant', content: reply });
    return reply;
  }

  async function sendMsg(text) {
    if (!text || isWaiting) return;
    hideChips();
    addMsg(text, 'user');
    setLoading(true);
    showTyping();

    try {
      const reply  = await callAI(text);
      removeTyping();
      const booking = parseBooking(reply);
      const clean   = booking ? stripMarker(reply) : reply;
      if (clean) addMsg(clean, 'bot');
      if (booking && !bookingDone) {
        bookingDone = true;
        setTimeout(async () => {
          addMsg(`⏳ Sending confirmation to <strong>${booking.email}</strong>…`, 'sys');
          const api = getPortfolioApi();
          if (api && api.webhook) {
            await api.webhook({
              target: 'booking',
              payload: { ...booking, timestamp: new Date().toISOString(), source: 'Portfolio — AI Terminal' }
            }).catch(console.warn);
          }
          setTimeout(() => {
            addMsg(`✅ Confirmed! Email sent to <strong>${booking.email}</strong>. Our team will reach out within 24h. Welcome, ${booking.name}! 🚀`, 'ok');
          }, 1200);
        }, 400);
      }
    } catch (err) {
      removeTyping();
      addMsg(`System error: ${err.message}. Retry or contact <strong>zyntraverse@gmail.com</strong>`, 'bot');
    } finally {
      setLoading(false);
    }
  }

  function switchMode(mode) {
    if (!MODES[mode]) return;
    currentMode = mode;
    history     = [];
    bookingDone = false;

    modesEl?.querySelectorAll('.sig-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.mode === mode)
    );

    chatEl.innerHTML = '';
    if (chipsEl) { chipsEl.style.display = ''; chipsHidden = false; }
    addMsg(MODES[mode].welcome, 'bot');
  }

  /* ── Events ── */
  sendBtn.addEventListener('click', () => {
    const t = inputEl.value.trim(); inputEl.value = ''; sendMsg(t);
  });
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const t = inputEl.value.trim(); inputEl.value = ''; sendMsg(t);
    }
  });

  modesEl?.querySelectorAll('.sig-tab').forEach(tab =>
    tab.addEventListener('click', () => switchMode(tab.dataset.mode))
  );

  chipsEl?.querySelectorAll('.sig-chip').forEach(chip =>
    chip.addEventListener('click', () => sendMsg(chip.dataset.msg))
  );

  /* ── Init ── */
  setTimeout(() => addMsg(MODES['agent'].welcome, 'bot'), 1200);
})();


/* ══════════════════════════════════════════
   ORDER BOT (in Projects section)
══════════════════════════════════════════ */
(function initOrderBot() {
  const msgsEl  = document.getElementById('pfOrderMsgs');
  const inputEl = document.getElementById('pfOrderInput');
  const sendBtn = document.getElementById('pfOrderSend');
  const countEl = document.getElementById('pfOrderCount');
  if (!msgsEl || !inputEl || !sendBtn) return;

  const PROMPT = `You are ZYNTRA Order Bot — a demo AI order system for Bangladeshi e-commerce. You collect orders, confirm addresses, and log everything.

Demo products: Quran Combo Gift Set (৳1,200), Prayer Mat Premium (৳850), Attar Gift Box (৳1,500), Islamic Book Collection (৳2,000).
Order flow: Greet → Take order → Confirm quantity → Get delivery area → Get phone → Calculate total (Delivery: ৳60 Dhaka, ৳120 outside) → Generate Order ID (format: ZV-XXXX) → Confirm.
Rules: Keep replies SHORT (1-3 sentences). Match language (Bangla/English/Banglish). Warm and efficient tone.
When order confirmed, output silently: [ORDER_DONE:{"product":"X","total":"৳X","area":"X","id":"ZV-XXXX"}]`;

  const history = [];
  let isWaiting = false;
  let count = 247;

  setInterval(() => {
    if (Math.random() > 0.5) { count++; if (countEl) countEl.textContent = count; }
  }, 5000);

  function scrollMsgs() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  function addMsg(text, type) {
    const wrap = document.createElement('div');
    wrap.className = 'ai-msg' + (type === 'user' ? ' user' : '');

    if (type === 'ok') {
      const b = document.createElement('div');
      b.className = 'ai-bubble ok'; b.innerHTML = text;
      wrap.appendChild(b);
    } else {
      const av = document.createElement('span');
      av.className = 'ai-av'; av.textContent = type === 'user' ? '>' : 'AI';
      const b = document.createElement('div');
      b.className = 'ai-bubble ' + (type === 'user' ? 'user' : 'bot');
      b.innerHTML = text.replace(/\n/g, '<br>');
      if (type === 'user') { wrap.appendChild(b); wrap.appendChild(av); }
      else                 { wrap.appendChild(av); wrap.appendChild(b); }
    }
    msgsEl.appendChild(wrap); scrollMsgs();
  }

  function showTyping() {
    const t = document.createElement('div');
    t.id = 'obTyping'; t.className = 'ai-msg';
    t.innerHTML = `<span class="ai-av">AI</span><div class="ai-typing"><div class="ai-td"></div><div class="ai-td"></div><div class="ai-td"></div></div>`;
    msgsEl.appendChild(t); scrollMsgs();
  }
  function removeTyping() { document.getElementById('obTyping')?.remove(); }

  function setLoading(on) {
    isWaiting = on; inputEl.disabled = on; sendBtn.disabled = on;
    sendBtn.textContent = on ? '···' : 'SEND';
  }

  async function sendMsg(text) {
    if (!text || isWaiting) return;
    addMsg(text, 'user');
    setLoading(true); showTyping();
    try {
      const api = getPortfolioApi();
      history.push({ role: 'user', content: text });
      let reply = getOrderDemoReply(text);

      if (api && api.openrouter) {
        const data = await api.openrouter({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'system', content: PROMPT }, ...history],
          max_tokens: 300, temperature: 0.7,
          referer: window.location.origin, title: 'ZYNTRA VERSE'
        });
        reply = data.choices?.[0]?.message?.content || reply;
      }
      history.push({ role: 'assistant', content: reply });

      removeTyping();
      const clean = reply.replace(/\[ORDER_DONE:[\s\S]*?\]/g, '').trim();
      if (clean) addMsg(clean, 'bot');

      const m = reply.match(/\[ORDER_DONE:\s*(\{[\s\S]*?\})\s*\]/);
      if (m) {
        try {
          const o = JSON.parse(m[1]);
          setTimeout(() => {
            count++;
            if (countEl) countEl.textContent = count;
            addMsg(`✅ <strong>${o.id}</strong> confirmed! Total: <strong>${o.total}</strong>. Thank you!`, 'ok');
          }, 600);
        } catch {}
      }
    } catch (err) {
      removeTyping();
      addMsg('System error. Please try again.', 'bot');
    } finally {
      setLoading(false);
    }
  }

  sendBtn.addEventListener('click', () => {
    const t = inputEl.value.trim(); inputEl.value = ''; sendMsg(t);
  });
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault(); const t = inputEl.value.trim(); inputEl.value = ''; sendMsg(t);
    }
  });

  setTimeout(() => {
    addMsg('স্বাগতম! 🛍️ আমি ZYNTRA Order Bot। কি অর্ডার করতে চান?<br><small style="opacity:0.5;font-size:10px;">(Write in Bangla or English)</small>', 'bot');
  }, 2000);
})();


/* ══════════════════════════════════════════
   SUPPORT AGENT (in Projects section)
══════════════════════════════════════════ */
(function initSupportAgent() {
  const msgsEl  = document.getElementById('pfSupportMsgs');
  const inputEl = document.getElementById('pfSupportInput');
  const sendBtn = document.getElementById('pfSupportSend');
  if (!msgsEl || !inputEl || !sendBtn) return;

  const PROMPT = `You are ZYNTRA Customer Assistant — AI support for a Bangladeshi e-commerce store. Demo on ZYNTRA VERSE portfolio.

Handle: Order tracking, FAQs, complaints, delivery info, returns. Escalate complex issues.
Demo orders: #ZV-1247 (Quran Combo — out for delivery today), #ZV-1182 (Prayer Mat — delivered), #ZV-1301 (Attar Gift Box — ships tomorrow).
Policies: Delivery 2-3 days Dhaka, 4-5 days outside. 7-day return if damaged.
Rules: SHORT replies (1-3 sentences). Warm and empathetic. Match language (Bangla/English). Sound like a real support agent.`;

  const history = [];
  let isWaiting = false;

  function scrollMsgs() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  function addMsg(text, type) {
    const wrap = document.createElement('div');
    wrap.className = 'ai-msg' + (type === 'user' ? ' user' : '');
    const av = document.createElement('span');
    av.className = 'ai-av'; av.textContent = type === 'user' ? '>' : 'AI';
    const b = document.createElement('div');
    b.className = 'ai-bubble ' + (type === 'user' ? 'user' : 'bot');
    b.innerHTML = text.replace(/\n/g, '<br>');
    if (type === 'user') { wrap.appendChild(b); wrap.appendChild(av); }
    else                 { wrap.appendChild(av); wrap.appendChild(b); }
    msgsEl.appendChild(wrap); scrollMsgs();
  }

  function showTyping() {
    const t = document.createElement('div');
    t.id = 'spTyping'; t.className = 'ai-msg';
    t.innerHTML = `<span class="ai-av">AI</span><div class="ai-typing"><div class="ai-td"></div><div class="ai-td"></div><div class="ai-td"></div></div>`;
    msgsEl.appendChild(t); scrollMsgs();
  }
  function removeTyping() { document.getElementById('spTyping')?.remove(); }

  function setLoading(on) {
    isWaiting = on; inputEl.disabled = on; sendBtn.disabled = on;
    sendBtn.textContent = on ? '···' : 'SEND';
  }

  async function sendMsg(text) {
    if (!text || isWaiting) return;
    addMsg(text, 'user');
    setLoading(true); showTyping();
    try {
      const api = getPortfolioApi();
      history.push({ role: 'user', content: text });
      let reply = getSupportDemoReply(text);
      if (api && api.openrouter) {
        const data = await api.openrouter({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'system', content: PROMPT }, ...history],
          max_tokens: 280, temperature: 0.65,
          referer: window.location.origin, title: 'ZYNTRA VERSE'
        });
        reply = data.choices?.[0]?.message?.content || reply;
      }
      history.push({ role: 'assistant', content: reply });
      removeTyping();
      addMsg(reply, 'bot');
    } catch {
      removeTyping();
      addMsg('System error. Please try again.', 'bot');
    } finally {
      setLoading(false);
    }
  }

  sendBtn.addEventListener('click', () => {
    const t = inputEl.value.trim(); inputEl.value = ''; sendMsg(t);
  });
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault(); const t = inputEl.value.trim(); inputEl.value = ''; sendMsg(t);
    }
  });

  setTimeout(() => {
    addMsg(`Hello! 👋 I'm ZYNTRA Customer Assistant. How can I help you today?<br><small style="opacity:0.5;font-size:10px;">(Try: "Where is my order?" or "What's your return policy?")</small>`, 'bot');
  }, 2400);
})();


/* ══════════════════════════════════════════
   LANDING PAGE SLIDER
══════════════════════════════════════════ */
(function initLpSlider() {
  const track       = document.getElementById('lpTrack');
  const viewport    = document.getElementById('lpViewport');
  const prevBtn     = document.getElementById('lpPrev');
  const nextBtn     = document.getElementById('lpNext');
  const dotsWrap    = document.getElementById('lpDots');
  const previewPanel = document.getElementById('lpPreviewPanel');
  const previewFrame = document.getElementById('lpFrame');
  const previewUrl  = document.getElementById('lpPreviewUrl');
  const previewClose = document.getElementById('lpPreviewClose');
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.lp-card'));
  const dots  = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.lp-dot')) : [];
  let current = 0;
  const isMobile = () => window.innerWidth < 860;

  function getCardWidth() {
    return cards[0] ? cards[0].offsetWidth + 20 : 320; // card + gap
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(cards.length - 1, idx));
    current = idx;

    cards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));

    /* Center the active card */
    const cardW = cards[0]?.offsetWidth || 300;
    const gapW  = 20;
    const viewW = viewport.offsetWidth;
    const totalCardW = cardW + gapW;
    const offset = idx * totalCardW - (viewW / 2) - (cardW / 2);
    track.style.transform = `translateX(${-Math.max(0, offset)}px)`;

    /* Update nav buttons */
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === cards.length - 1;

    /* Close preview if card changes */
    closePreview();
  }

  function openPreview(url) {
    if (isMobile()) {
      window.open(url, '_blank');
      return;
    }
    if (!previewPanel || !previewFrame || !url) return;
    if (previewUrl) previewUrl.textContent = url.replace(/^https?:\/\//, '');
    previewFrame.src = '';
    previewPanel.classList.remove('visible');

    /* Show loading state */
    previewFrame.style.display = 'none';
    const loading = document.createElement('div');
    loading.className = 'lp-preview-loading';
    loading.id = 'lpLoadingState';
    loading.innerHTML = `
      <div style="width:32px;height:32px;border:2px solid rgba(184,255,46,0.2);border-top-color:var(--lime);border-radius:50%;animation:spin 1s linear infinite;"></div>
      <span>Loading preview…</span>`;
    previewPanel.appendChild(loading);
    previewPanel.classList.add('visible');

    setTimeout(() => {
      if (previewFrame) {
        previewFrame.src = url;
        previewFrame.style.display = 'block';
      }
      document.getElementById('lpLoadingState')?.remove();
    }, 300);

    /* Smooth scroll to preview */
    setTimeout(() => {
      previewPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  }

  function closePreview() {
    if (!previewPanel) return;
    previewPanel.classList.remove('visible');
    setTimeout(() => { if (previewFrame) previewFrame.src = ''; }, 400);
  }

  /* ── Events ── */
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  /* Click on card to focus it */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => { if (current !== i) goTo(i); });
  });

  /* Preview buttons */
  track.querySelectorAll('.lp-preview-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const url = btn.dataset.url;
      if (url) openPreview(url);
    });
  });

  previewClose?.addEventListener('click', closePreview);

  /* Keyboard navigation */
  document.addEventListener('keydown', e => {
    const panel = document.getElementById('zyntra-ai') || document.getElementById('landing-pages');
    if (!panel) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* Init */
  goTo(0);
  window.addEventListener('resize', () => goTo(current));
})();


/* ══════════════════════════════════════════
   PUSPALOY / ECOMMERCE PREVIEW
══════════════════════════════════════════ */
(function initEcPreview() {
  const loadBtn   = document.getElementById('ecLoadBtn');
  const iframe    = document.getElementById('ecIframe');
  const placehold = document.getElementById('ecPlaceholder');
  const mobileBtn = document.getElementById('ecMobileVisit');
  if (!loadBtn && !mobileBtn) return;

  const EC_URL = 'https://puspaloygadget-fan.netlify.app/';

  function isMobile() { return window.innerWidth < 860; }

  function loadPreview() {
    if (isMobile()) {
      window.open(EC_URL, '_blank');
      return;
    }
    if (!iframe || !placehold) return;

    /* Loading state */
    placehold.innerHTML = `
      <div class="ec-loading-state">
        <div class="ec-loading-spinner"></div>
        <span style="font-family:var(--f-mono);font-size:12px;color:var(--muted)">Loading Puspaloy…</span>
      </div>`;

    iframe.src = EC_URL;
    iframe.style.display = 'block';
    iframe.addEventListener('load', () => {
      placehold.style.display = 'none';
    }, { once: true });
  }

  loadBtn?.addEventListener('click', loadPreview);
  mobileBtn?.addEventListener('click', () => window.open(EC_URL, '_blank'));
})();


/* ══════════════════════════════════════════
   ENHANCED REVEAL + SCROLL OBSERVER
   (Supplement portfolio.js's existing reveal)
══════════════════════════════════════════ */
(function initEnhancedReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('visible'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) obs.observe(el);
  });
})();


/* ══════════════════════════════════════════
   TILT EFFECT for new cards
══════════════════════════════════════════ */
(function initEnhancedTilt() {
  const selector = '.sig-terminal, .ai-project-card, .ec-card, .lp-card.is-active';
  function applyTilt() {
    document.querySelectorAll(selector).forEach(card => {
      if (card._tiltBound) return;
      card._tiltBound = true;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top  - r.height / 2) / r.height;
        card.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform  = '';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }
  applyTilt();
  /* Re-apply when slider cards become active */
  const observer = new MutationObserver(applyTilt);
  const track = document.getElementById('lpTrack');
  if (track) observer.observe(track, { subtree: true, attributeFilter: ['class'] });
})();


/* ══════════════════════════════════════════
   MAGNETIC BUTTONS (new elements)
══════════════════════════════════════════ */
(function initEnhancedMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    if (btn._magBound) return;
    btn._magBound = true;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
})();


/* ══════════════════════════════════════════
   ANIMATED COUNTER (new counter elements)
══════════════════════════════════════════ */
(function initEnhancedCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      const DUR  = 2000;
      const start = performance.now();
      const ease  = t => 1 - Math.pow(1 - t, 4);
      (function tick(now) {
        const p = Math.min((now - start) / DUR, 1);
        el.textContent = Math.round(ease(p) * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(performance.now());
      obs.unobserve(el);
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('.sig-stat-val .counter, .ai-result-val .counter').forEach(c => obs.observe(c));
})();
