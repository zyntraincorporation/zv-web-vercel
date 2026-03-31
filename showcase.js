/* ============================================================
   SHOWCASE PAGE — showcase.js
============================================================ */

'use strict';

/* ── CATEGORY FILTER TABS ── */
(function initFilters() {
  const tabs  = document.querySelectorAll('.sc-filter');
  const cards = document.querySelectorAll('.sc-project-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'filterIn 0.45s cubic-bezier(0.16,1,0.3,1) both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* Inject keyframe for filter animation */
const filterStyle = document.createElement('style');
filterStyle.textContent = `
  @keyframes filterIn {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }
`;
document.head.appendChild(filterStyle);

/* ── LAZY IFRAME LOADER ── */
(function initLazyIframes() {
  document.querySelectorAll('.load-iframe').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.iframe-overlay');
      const body    = overlay.closest('.browser-body');
      const src     = overlay.dataset.src;
      if (!src || overlay.dataset.loaded === 'true') return;

      // Show loading state
      btn.textContent = 'Loading…';
      btn.disabled = true;

      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
      iframe.setAttribute('loading', 'lazy');

      iframe.addEventListener('load', () => {
        overlay.classList.add('loaded');
        overlay.dataset.loaded = 'true';
      });

      iframe.addEventListener('error', () => {
        btn.textContent = 'Failed to Load';
        btn.disabled = false;
      });

      body.appendChild(iframe);

      // Fallback timeout if load event doesn't fire (cross-origin)
      setTimeout(() => {
        if (overlay.dataset.loaded !== 'true') {
          overlay.classList.add('loaded');
          overlay.dataset.loaded = 'true';
        }
      }, 3500);
    });
  });
})();
