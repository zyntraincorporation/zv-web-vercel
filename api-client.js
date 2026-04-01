(function (global) {
  'use strict';

 const FUNCTION_URL = '/api/api-handler';

  async function request(type, payload = {}) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...payload }),
    });

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }

    if (!response.ok) {
      throw new Error(data.error || data.raw || `Request failed with status ${response.status}`);
    }

    return data;
  }

  async function openrouter({ model, messages, max_tokens, temperature, referer, title, extra = {} }) {
    return request('openrouter', {
      referer,
      title,
      body: {
        model,
        messages,
        max_tokens,
        temperature,
        ...extra,
      },
    });
  }

  async function webhook({ target = 'booking', payload }) {
    return request('n8n', { target, payload });
  }

  async function contactForm(payload) {
    return request('contact', { payload });
  }

  global.ZVApi = {
    endpoint: FUNCTION_URL,
    request,
    openrouter,
    webhook,
    contactForm,
  };
})(window);
