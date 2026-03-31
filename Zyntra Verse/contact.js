/* ============================================================
   ZYNTRA VERSE — contact.js  v2.1
   ✅ FIXED: mode:'no-cors' + URLSearchParams for Apps Script
   ✅ FIXED: budget default value, no phone field
   ✅ Redirect to thank-you.html on success
============================================================ */
'use strict';

/* ─────────────────────────────────────────────────────────
   YOUR GOOGLE APPS SCRIPT URL (already set)
───────────────────────────────────────────────────────── */
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzIVRzUmj4zTEehxL7kSk8DRjE9wLEyW5ux8waREgdHEg9LPKUBQUzomTO_QHsZe0RfAw/exec';

/* ─────────────────────────────────────────────────────────
   BUDGET PILLS
───────────────────────────────────────────────────────── */
(function initBudgetPills() {
  const pills  = document.querySelectorAll('.budget-pill');
  const hidden = document.getElementById('budget');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (hidden) hidden.value = pill.dataset.val;
    });
  });
})();

/* ─────────────────────────────────────────────────────────
   CHARACTER COUNTER
───────────────────────────────────────────────────────── */
(function initCharCounter() {
  const ta  = document.getElementById('message');
  const cnt = document.getElementById('charCount');
  if (!ta || !cnt) return;

  ta.addEventListener('input', () => {
    const n = ta.value.length;
    cnt.textContent = n;
    cnt.style.color = n > 450 ? '#f59e0b' : '';
    if (n >= 500) cnt.style.color = '#ef4444';
  });
})();

/* ─────────────────────────────────────────────────────────
   REAL-TIME FIELD VALIDATION
───────────────────────────────────────────────────────── */
function validateField(field) {
  const group = field.closest('.form-group');
  if (!group) return true;

  const val = field.value.trim();
  let ok = true;

  if (field.id === 'name'    && val.length < 2)                          ok = false;
  if (field.id === 'email'   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ok = false;
  if (field.id === 'service' && val === '')                               ok = false;
  if (field.id === 'message' && val.length < 20)                         ok = false;

  group.classList.toggle('has-error', !ok);
  return ok;
}

function validateAll() {
  const ids = ['name', 'email', 'service', 'message'];
  let allOk = true;
  ids.forEach(id => {
    const f = document.getElementById(id);
    if (f && !validateField(f)) allOk = false;
  });
  return allOk;
}

(function attachValidation() {
  document.querySelectorAll('.form-input').forEach(f => {
    f.addEventListener('blur',  () => validateField(f));
    f.addEventListener('input', () => {
      if (f.closest('.form-group')?.classList.contains('has-error')) validateField(f);
    });
  });
})();

/* ─────────────────────────────────────────────────────────
   FORM SUBMISSION
   KEY FIX: mode:'no-cors' is REQUIRED for Google Apps Script.
   With no-cors we cannot read the response body — we assume
   success after the fetch resolves without throwing.
   Using URLSearchParams so e.parameter works in Apps Script.
───────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* 1. Validate */
    if (!validateAll()) {
      const firstErr = form.querySelector('.has-error .form-input');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErr.focus();
      }
      return;
    }

    /* 2. Build URLSearchParams — Apps Script reads e.parameter */
    const params = new URLSearchParams({
      name:    document.getElementById('name').value.trim(),
      email:   document.getElementById('email').value.trim(),
      service: document.getElementById('service').value,
      budget:  document.getElementById('budget').value || 'Not specified',
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
      source: 'ZYNTRA VERSE Website',
    });

    /* 3. Loading state */
    setLoading(true);

    try {
      /* ✅ CRITICAL: mode:'no-cors' is required.
         Without it, the browser throws a CORS error because
         Apps Script doesn't return proper CORS headers.
         no-cors means we get an "opaque" response — we can't
         read it, but the POST still reaches Apps Script. */
      await fetch(SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',                           // ← THE FIX
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    params.toString(),
      });

      /* Fetch resolved → data reached Apps Script → redirect */
      const name = document.getElementById('name').value.trim() || 'there';
      window.location.href = 'thank-you.html?name=' + encodeURIComponent(name);

    } catch (err) {
      console.error('Submission error:', err);
      setLoading(false);
      showError('কিছু সমস্যা হয়েছে। WhatsApp বা Email এ সরাসরি যোগাযোগ করুন।');
    }
  });
})();

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function setLoading(on) {
  const btn  = document.getElementById('submitBtn');
  const txt  = btn?.querySelector('.submit-text');
  const load = btn?.querySelector('.submit-loading');
  if (!btn) return;
  btn.disabled = on;
  if (txt)  txt.style.display  = on ? 'none' : 'flex';
  if (load) load.style.display = on ? 'flex' : 'none';
}

function showError(msg) {
  document.querySelector('.form-global-error')?.remove();
  const div = document.createElement('div');
  div.className = 'form-global-error';
  div.style.cssText = `
    padding:14px 18px;
    background:rgba(239,68,68,.08);
    border:1px solid rgba(239,68,68,.25);
    border-radius:10px;
    font-family:'JetBrains Mono',monospace;
    font-size:12px;
    color:#ef4444;
    margin-top:12px;
    text-align:center;
  `;
  div.textContent = '⚠️  ' + msg;
  document.getElementById('contactForm')?.appendChild(div);
  setTimeout(() => div.remove(), 6000);
}