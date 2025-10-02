-- ==========================================
-- Supabase Migration: Fix Schema for Library
-- ==========================================
-- This migration fixes duplicate columns and standardizes naming

-- STEP 1: Backup existing data (optional but recommended)
-- You can skip this if you don't have important data yet

-- STEP 2: Clean up USERS table - Remove duplicate columns
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
  ADD COLUMN IF NOT EXISTS userId uuid,
  ADD COLUMN IF NOT EXISTS createdAt timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS lastLoginAt timestamp with time zone,
  ADD COLUMN IF NOT EXISTS googleId text,
  ADD COLUMN IF NOT EXISTS processedPayments jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS referralCode text,
  ADD COLUMN IF NOT EXISTS referredBy uuid;

-- Make userId the primary key if not already
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- STEP 3: Clean up SESSIONS table - Remove duplicate columns
-- ==========================================

-- Drop old foreign key constraints first
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_userid_fkey;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_userId_fkey;

-- Drop duplicate lowercase columns
ALTER TABLE public.sessions DROP COLUMN IF EXISTS userid;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS createdat;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS sourceimage;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS generatedimages;

-- Ensure camelCase columns exist with correct types
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS userId uuid,
  ADD COLUMN IF NOT EXISTS createdAt timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS sourceImage text,
  ADD COLUMN IF NOT EXISTS generatedImages jsonb DEFAULT '[]'::jsonb;

-- Make userId NOT NULL if data exists
UPDATE public.sessions SET userId = id WHERE userId IS NULL;
ALTER TABLE public.sessions ALTER COLUMN userId SET NOT NULL;

-- Re-add foreign key constraint
ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_userId_fkey
  FOREIGN KEY (userId) REFERENCES public.users(id) ON DELETE CASCADE;

-- STEP 4: Add Performance Indexes
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_sessions_userId ON public.sessions(userId);
CREATE INDEX IF NOT EXISTS idx_sessions_createdAt ON public.sessions(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referralCode ON public.users(referralCode);

-- STEP 5: Verify the schema
-- ==========================================

-- Check users table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check sessions table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'sessions'
ORDER BY ordinal_position;

-- ==========================================
-- AFTER RUNNING THIS MIGRATION:
-- ==========================================
-- 1. Go to Supabase Dashboard → Storage
-- 2. Create a new bucket named: uploads
-- 3. Make it PUBLIC
-- 4. Set max file size to 10MB
-- ==========================================
