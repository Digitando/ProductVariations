# Supabase Setup & Cleanup Guide

This repository now stores chat history in a dedicated `chat_sessions` table. Follow the steps below to migrate from the old schema (which used `sessions`) or to bootstrap a brand-new Supabase project.

## 0. Prepare (optional but recommended)
- Export the legacy `sessions`, `library_sessions`, or other custom tables from Supabase Studio if you want a backup.
- Download any assets stored outside Supabase that you still need.

## 1. Create / open your Supabase project
1. Visit [supabase.com/dashboard](https://supabase.com/dashboard) and open (or create) your project.
2. Copy the **Project URL** and **service_role key** from **Project Settings → API**. You will need them later.

## 2. Run the migration SQL
1. Open **SQL Editor** in Supabase Studio.
2. Choose **New Query**.
3. Paste the contents of `supabase-migration.sql` from this repo.
   - The script will:
     - Drop the legacy `sessions`/`library_sessions` tables.
     - Normalise the `users` table column names.
     - Create the new `chat_sessions` table with JSONB columns for prompts, images, and descriptions.
4. Execute the query (⌘+Enter / Ctrl+Enter).
5. Run the verification queries printed at the bottom of the script to confirm the schema.

## 3. Configure Supabase Storage
1. In Supabase Studio, open **Storage → Buckets**.
2. Create a bucket called `uploads`.
3. Mark the bucket as **Public**.
4. Set the maximum file size to **10 MB** and allow image MIME types (e.g. `image/png`, `image/jpeg`, `image/webp`).

## 4. Update environment variables
Set the following env vars wherever your app runs (e.g. Railway, Render, local `.env`):

```
SUPABASE_URL=<your-project-url>
SUPABASE_SERVICE_KEY=<service-role-key>
```

Restart the server after updating variables so the Supabase client picks up the changes.

## 5. Redeploy & smoke test
1. Deploy the updated backend (or restart locally).
2. Sign in, run a generation, and verify:
   - Coins are debited correctly.
   - The new chat appears in the right-hand history column.
   - Supabase Studio → Table editor → `chat_sessions` shows a new row with prompts, descriptions, and thumbnails stored as JSON.

## 6. Removing legacy tables (manual option)
If you skipped the migration script but still want to remove the old tables later, run the following SQL in Supabase Studio:

```sql
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.library_sessions CASCADE;
```

> **Tip:** If you archived those tables first, you can safely restore the exports into the new `chat_sessions` schema by mapping columns (`prompts`, `generatedImages`, `descriptions`, etc.) to JSON.

## 7. What changed
- Auth data stays in `public.users` (with camelCase JSON columns for processed payments, referrals, etc.).
- Chat history now lives in `public.chat_sessions` with fields for:
  - `title`, `categoryId`, `subcategoryId`
  - Arrays of prompts, generated images, and descriptions
  - `customPrompt`, `coinsSpent`, and `sourceImage`
- The API automatically falls back to local JSON files if Supabase is not configured, so you can test locally before wiring up the database.

You are ready to go once the new table exists and environment variables are set. All new chats will flow into `chat_sessions`, and the updated UI will render them in the history column.
