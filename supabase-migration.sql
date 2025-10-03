-- ==========================================
-- Supabase Migration: Chat Sessions Schema
-- ==========================================
-- This migration replaces the legacy sessions table with a new chat-oriented
-- schema and ensures the users table has consistent column names.

-- STEP 0: (Optional) Backup existing data before running these commands.
-- You can export the old tables from Supabase Studio if you want to keep them.

-- STEP 1: Clean up legacy tables
-- ==========================================

-- Remove legacy session tables so we can create the new structure from scratch.
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.library_sessions CASCADE;

-- STEP 2: Ensure required extensions are available
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 3: Normalise USERS table column names
-- ==========================================

-- Drop duplicate lowercase columns (keeping camelCase versions)
ALTER TABLE public.users DROP COLUMN IF EXISTS userid;
ALTER TABLE public.users DROP COLUMN IF EXISTS createdat;
ALTER TABLE public.users DROP COLUMN IF EXISTS lastloginat;
ALTER TABLE public.users DROP COLUMN IF EXISTS googleid;
ALTER TABLE public.users DROP COLUMN IF EXISTS processedpayments;
ALTER TABLE public.users DROP COLUMN IF EXISTS referralcode;
ALTER TABLE public.users DROP COLUMN IF EXISTS referredby;

-- Ensure camelCase columns exist with correct types
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS createdAt timestamp with time zone DEFAULT timezone('utc', now()),
  ADD COLUMN IF NOT EXISTS lastLoginAt timestamp with time zone,
  ADD COLUMN IF NOT EXISTS googleId text,
  ADD COLUMN IF NOT EXISTS processedPayments jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS referralCode text,
  ADD COLUMN IF NOT EXISTS referredBy uuid;

-- Reinstate primary key on id just in case it was dropped previously
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- STEP 4: Create the new CHAT_SESSIONS table
-- ==========================================

CREATE TABLE public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId uuid REFERENCES public.users(id) ON DELETE CASCADE,
  createdAt timestamp with time zone NOT NULL DEFAULT timezone('utc', now()),
  title text,
  categoryId text,
  categoryLabel text,
  subcategoryId text,
  subcategoryLabel text,
  customPrompt text,
  prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  generatedImages jsonb NOT NULL DEFAULT '[]'::jsonb,
  descriptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  promptSummaries jsonb DEFAULT '[]'::jsonb,
  categories jsonb DEFAULT '[]'::jsonb,
  creator jsonb,
  coinsSpent integer,
  sourceImage text
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_userId ON public.chat_sessions(userId);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_createdAt ON public.chat_sessions(createdAt DESC);

-- STEP 5: Helpful indices on users table
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referralCode ON public.users(referralCode);

-- STEP 6: Verification queries
-- ==========================================
-- Run these in Supabase SQL Editor after the migration to confirm the schema.

-- Check users table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check chat_sessions table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
ORDER BY ordinal_position;

-- ==========================================
-- After running this migration:
-- ==========================================
-- 1. Go to Supabase Dashboard → Storage
-- 2. Create a bucket named `uploads`
-- 3. Make it PUBLIC
-- 4. Set max file size to 10 MB and allow image MIME types (image/png, image/jpeg, image/webp)
-- ==========================================
