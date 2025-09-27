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

   In `server/.env` set:

   - `OPENROUTER_API_KEY`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY` (optional, required for the in-app coin checkout)
   - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` if you want to persist users/sessions in Supabase instead of local JSON files
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for Google auth (optional)

   For local dev keep `CLIENT_ORIGIN` at `http://localhost:5173`.

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
- When `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are present the server reads/writes all user and session data from Supabase tables named `users` and `sessions`. Those tables should include JSON/JSONB columns for list fields (`referrals`, `processedPayments`, `prompts`, `generatedImages`, `descriptions`). A minimal schema looks like:

  ```sql
  create table users (
    id uuid primary key,
    email text unique not null,
    name text,
    password text,
    provider text,
    googleId text,
    avatar text,
    coins integer default 0,
    referralCode text,
    referrals jsonb default '[]'::jsonb,
    processedPayments jsonb default '[]'::jsonb,
    referredBy uuid,
    marketingOptIn boolean default false,
    privacyAcceptedAt timestamptz default now(),
    createdAt timestamptz default now(),
    lastLoginAt timestamptz
  );

  create table sessions (
    id uuid primary key,
    userId uuid references users(id) on delete cascade,
    prompts jsonb default '[]'::jsonb,
    sourceImage text,
    generatedImages jsonb default '[]'::jsonb,
    descriptions jsonb default '[]'::jsonb,
    createdAt timestamptz default now()
  );
  ```

  If the Supabase variables are omitted the server falls back to the file-based store under `server/data/`.
- Updating an existing Supabase project? Run the snippet below to add the newer columns introduced for consent/marketing tracking without touching your existing data:

  ```sql
  alter table users
    add column if not exists "marketingOptIn" boolean default false;
  alter table users
    add column if not exists "privacyAcceptedAt" timestamptz;
  ```

- During registration users must accept the privacy policy/GDPR disclaimer and can optionally opt in to promotional emails. These preferences are stored on their profile and surfaced through the API.
- Security hardening: the Express server now applies Helmet for secure headers, rate limiting for `/auth/*` and `/api/*` routes, and disables the default `x-powered-by` header. Keep the proxy setting (`app.set('trust proxy', 1)`) if you deploy behind a load balancer so limits work correctly.
- Public gallery endpoint `/api/public/gallery` returns a rotating sample of generated images across all users. The home hero and About page pull from this source so everyone sees community results—even when browsing without an account.
