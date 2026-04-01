const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const N8N_TARGETS = {
  booking: 'N8N_BOOKING_WEBHOOK_URL',
  assistant: 'N8N_ASSISTANT_WEBHOOK_URL',
};

function cleanPayload(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );
}

async function readResponse(response) {
  const raw = await response.text();
  if (!raw) return { raw: '', data: null };

  try {
    return { raw, data: JSON.parse(raw) };
  } catch {
    return { raw, data: null };
  }
}

module.exports = async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const requestBody = req.body || {};

  try {
    switch (requestBody.type) {
      case 'openrouter': {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured.' });
        }

        const body = cleanPayload(requestBody.body);
        if (!body.model || !Array.isArray(body.messages)) {
          return res.status(400).json({ error: 'OpenRouter requests need `body.model` and `body.messages`.' });
        }

        const response = await fetch(OPENROUTER_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': requestBody.referer || process.env.SITE_URL || 'https://zyntraverse.online',
            'X-Title': requestBody.title || 'ZYNTRA VERSE',
          },
          body: JSON.stringify(body),
        });

        const upstream = await readResponse(response);
        if (!response.ok) {
          return res.status(response.status).json({
            error:
              upstream.data?.error?.message ||
              upstream.data?.error ||
              upstream.raw ||
              'OpenRouter request failed.',
          });
        }

        return res.status(200).json(upstream.data || { raw: upstream.raw });
      }

      case 'n8n': {
        const target = requestBody.target || 'booking';
        const envKey = N8N_TARGETS[target];
        const targetUrl = envKey ? process.env[envKey] : null;

        if (!targetUrl) {
          return res.status(400).json({ error: `Unknown or unconfigured n8n target: ${target}` });
        }

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanPayload(requestBody.payload)),
        });

        const upstream = await readResponse(response);
        if (!response.ok) {
          return res.status(response.status).json({
            error: upstream.raw || `n8n webhook failed for target "${target}".`,
          });
        }

        return res.status(200).json({
          ok: true,
          target,
          data: upstream.data || upstream.raw || null,
        });
      }

      case 'contact': {
        const contactUrl = process.env.CONTACT_SCRIPT_URL;
        if (!contactUrl) {
          return res.status(500).json({ error: 'CONTACT_SCRIPT_URL is not configured.' });
        }

        const payload = cleanPayload(requestBody.payload);
        const formBody = new URLSearchParams(
          Object.entries(payload).map(([key, value]) => [key, String(value)])
        );

        const response = await fetch(contactUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody.toString(),
        });

        const upstream = await readResponse(response);
        if (!response.ok) {
          return res.status(response.status).json({
            error: upstream.raw || 'Contact submission failed.',
          });
        }

        return res.status(200).json({
          ok: true,
          data: upstream.data || upstream.raw || null,
        });
      }

      default:
        return res.status(400).json({
          error: 'Unknown request type. Use `openrouter`, `n8n`, or `contact`.',
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
};
