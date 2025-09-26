# Product Generator

Two-part web app that turns a single product reference photo into five OpenRouter-powered image variations and three marketing descriptions.

## Stack

- React + Vite frontend (`client`)
- Express backend (`server`)
- OpenRouter models:
  - `google/gemini-2.5-flash-image-preview` for image variations ("Nano Banana" Gemini preview)
  - `openai/gpt-5-nano` for copywriting

## Prerequisites

- Node.js 18+
- An OpenRouter API key with access to the models above

## Setup

1. Copy the example environment files and supply your details:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   In `server/.env` set `OPENROUTER_API_KEY` and optional `OPENROUTER_SITE_URL` / `OPENROUTER_SITE_NAME`. For local dev keep `CLIENT_ORIGIN` at `http://localhost:5173`.

2. Install dependencies:

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Start both apps in separate terminals:

   ```bash
   cd server && npm run dev
   cd client && npm run dev
   ```

   The Vite dev server proxies `/api` requests to the Express backend on port 5050 by default. If you need publicly reachable asset links for OpenRouter, expose the dev server (e.g. via ngrok) and set `PUBLIC_ASSET_BASE_URL` to that public origin.

## Usage

1. Open `http://localhost:5173`.
2. Upload a single garment photo and choose up to five editorial prompt directions from the checklist.
3. Click **Generate product assets**.
4. The UI streams status messages while it requests image variations first, then product copy. Results render in the right-hand panel once ready.

## Notes

- Image uploads are saved under `server/uploads` and served through `/uploads` so OpenRouter can fetch them via a public URL (derive from `PUBLIC_ASSET_BASE_URL`).
- Style directions selected in the form are woven into the image prompts so every variation stays grounded in the uploaded product while exploring different lighting and ambience.
- The same reference image is passed to the description model so copy can reflect visual details (with an automatic text-only fallback if the model rejects image input).
- Description responses are requested as JSON using OpenRouter's `response_format` schema, making it easy to render structured copy.
- Adjust proxy target or deployed API base URL via `client/.env` if serving the backend elsewhere.
