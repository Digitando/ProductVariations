-- ==========================================
-- Add Missing Columns to chat_sessions
-- ==========================================
-- Run this to add all missing columns to the existing chat_sessions table

ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS categoryId text,
  ADD COLUMN IF NOT EXISTS categoryLabel text,
  ADD COLUMN IF NOT EXISTS subcategoryId text,
  ADD COLUMN IF NOT EXISTS subcategoryLabel text,
  ADD COLUMN IF NOT EXISTS customPrompt text,
  ADD COLUMN IF NOT EXISTS prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS generatedImages jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS descriptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS promptSummaries jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS creator jsonb,
  ADD COLUMN IF NOT EXISTS coinsSpent integer,
  ADD COLUMN IF NOT EXISTS sourceImage text;

-- Verify columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
ORDER BY ordinal_position;
