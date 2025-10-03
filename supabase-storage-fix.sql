-- ==========================================
-- Supabase Storage Fix: Add Missing Columns
-- ==========================================
-- Run this in Supabase SQL Editor to add missing columns to chat_sessions

-- Add missing columns to chat_sessions
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS promptSummaries jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS creator jsonb;

-- ==========================================
-- Storage Bucket and Policies Setup
-- ==========================================
-- For storage policies, use the Supabase Dashboard instead:
--
-- 1. Go to Storage → Buckets
-- 2. Create bucket named 'uploads' (if it doesn't exist)
-- 3. Make it PUBLIC
-- 4. Set max file size to 10 MB
--
-- 5. Go to Storage → Policies
-- 6. Click "New Policy" on storage.objects table
-- 7. Create these policies:
--
--    Policy 1: "Allow uploads to uploads bucket"
--    - Operations: INSERT
--    - Roles: authenticated, anon
--    - WITH CHECK: bucket_id = 'uploads'
--
--    Policy 2: "Allow public read from uploads bucket"
--    - Operations: SELECT
--    - Roles: authenticated, anon
--    - USING: bucket_id = 'uploads'
--
--    Policy 3: "Allow updates to uploads bucket"
--    - Operations: UPDATE
--    - Roles: authenticated, anon
--    - USING: bucket_id = 'uploads'
--    - WITH CHECK: bucket_id = 'uploads'
--
-- ==========================================
