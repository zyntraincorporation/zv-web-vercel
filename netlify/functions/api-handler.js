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

function json(statusCode, payload) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(payload),
  };
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

function cleanPayload(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed. Use POST.' });
  }

  let requestBody;

  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  try {
    switch (requestBody.type) {
      case 'openrouter': {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return json(500, { error: 'OPENROUTER_API_KEY is not configured.' });
        }

        const body = cleanPayload(requestBody.body);
        if (!body.model || !Array.isArray(body.messages)) {
          return json(400, { error: 'OpenRouter requests need `body.model` and `body.messages`.' });
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
          return json(response.status, {
            error:
              upstream.data?.error?.message ||
              upstream.data?.error ||
              upstream.raw ||
              'OpenRouter request failed.',
          });
        }

        return json(200, upstream.data || { raw: upstream.raw });
      }

      case 'n8n': {
        const target = requestBody.target || 'booking';
        const envKey = N8N_TARGETS[target];
        const targetUrl = envKey ? process.env[envKey] : null;

        if (!targetUrl) {
          return json(400, { error: `Unknown or unconfigured n8n target: ${target}` });
        }

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanPayload(requestBody.payload)),
        });

        const upstream = await readResponse(response);
        if (!response.ok) {
          return json(response.status, {
            error: upstream.raw || `n8n webhook failed for target "${target}".`,
          });
        }

        return json(200, {
          ok: true,
          target,
          data: upstream.data || upstream.raw || null,
        });
      }

      case 'contact': {
        const contactUrl = process.env.CONTACT_SCRIPT_URL;
        if (!contactUrl) {
          return json(500, { error: 'CONTACT_SCRIPT_URL is not configured.' });
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
          return json(response.status, {
            error: upstream.raw || 'Contact submission failed.',
          });
        }

        return json(200, {
          ok: true,
          data: upstream.data || upstream.raw || null,
        });
      }

      default:
        return json(400, {
          error: 'Unknown request type. Use `openrouter`, `n8n`, or `contact`.',
        });
    }
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
};
