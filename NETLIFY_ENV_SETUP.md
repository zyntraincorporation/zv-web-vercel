# Netlify Environment Setup

## 1. Add the variables in Netlify
1. Open your site in Netlify.
2. Go to `Site configuration`.
3. Click `Environment variables`.
4. Click `Add a variable`.
5. Paste each key/value below one by one.

## 2. Variables to create

### `OPENROUTER_API_KEY`
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

### `N8N_BOOKING_WEBHOOK_URL`
https://n8n-production-a1ad.up.railway.app/webhook/zyntra-booking

### `N8N_ASSISTANT_WEBHOOK_URL`
https://n8n-production-a1ad.up.railway.app/webhook/zyntra-ai-assistant

### `CONTACT_SCRIPT_URL`
https://script.google.com/macros/s/AKfycbzIVRzUmj4zTEehxL7kSk8DRjE9wLEyW5ux8waREgdHEg9LPKUBQUzomTO_QHsZe0RfAw/exec

### Optional: `SITE_URL`
https://zyntraverse.online

## 3. Apply to all deploy contexts
When Netlify asks where the variable should apply, use:
- `Production`
- `Deploy Previews`
- `Branch deploys`

## 4. Redeploy
After saving the variables:
1. Go to `Deploys`.
2. Click `Trigger deploy`.
3. Choose `Deploy site`.

## 5. Test
After deploy, your frontend will call:
- `/.netlify/functions/api-handler`

That function will securely forward requests to:
- OpenRouter
- n8n booking webhook
- n8n assistant webhook
- Google Apps Script contact endpoint
