# Vercel Environment Setup

## 1. Vercel e variables add korun
1. Vercel dashboard open korun
2. Project select korun
3. `Settings` e jan
4. `Environment Variables` open korun
5. Nicher variable gulo ek ek kore add korun

## 2. Required variables

### `OPENROUTER_API_KEY`
Apnar OpenRouter secret key

### `N8N_BOOKING_WEBHOOK_URL`
Booking/demo webhook URL

### `N8N_ASSISTANT_WEBHOOK_URL`
AI assistant webhook URL

### `CONTACT_SCRIPT_URL`
Google Apps Script contact endpoint URL

### `SITE_URL`
Optional, but recommended
Example: `https://your-project.vercel.app`

## 3. Context
Variable add korar shomoy eita apply korun:
- `Production`
- `Preview`
- `Development`

## 4. Redeploy
Variable save korar por notun deploy din.

## 5. Frontend endpoint
Frontend ekhon call kore:

`/api/api-handler`

## 6. Backend file
Vercel API route file:

`api/api-handler.js`
