-- ==========================================
-- Recreate chat_sessions with proper camelCase columns
-- ==========================================
-- This drops and recreates the table with quoted column names
-- to preserve camelCase that PostgREST expects

-- STEP 1: Backup existing data (if any)
CREATE TABLE IF NOT EXISTS chat_sessions_backup AS
SELECT * FROM public.chat_sessions;

-- STEP 2: Drop the old table
DROP TABLE IF EXISTS public.chat_sessions CASCADE;

-- STEP 3: Create table with QUOTED column names to preserve case
CREATE TABLE public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid REFERENCES public.users(id) ON DELETE CASCADE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT timezone('utc', now()),
  title text,
  "categoryId" text,
  "categoryLabel" text,
  "subcategoryId" text,
  "subcategoryLabel" text,
  "customPrompt" text,
  prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  "generatedImages" jsonb NOT NULL DEFAULT '[]'::jsonb,
  descriptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  "promptSummaries" jsonb DEFAULT '[]'::jsonb,
  categories jsonb DEFAULT '[]'::jsonb,
  creator jsonb,
  "coinsSpent" integer,
  "sourceImage" text
);

-- STEP 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_userId ON public.chat_sessions("userId");
CREATE INDEX IF NOT EXISTS idx_chat_sessions_createdAt ON public.chat_sessions("createdAt" DESC);

-- STEP 5: Restore data if backup exists (optional - uncomment if you have data to restore)
-- INSERT INTO public.chat_sessions
-- SELECT * FROM chat_sessions_backup;

-- STEP 6: Verify columns (should show camelCase names)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
ORDER BY ordinal_position;
