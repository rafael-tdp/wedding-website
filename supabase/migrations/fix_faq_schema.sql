-- Migration: Fix FAQ schema to support multilingual fields
-- This removes the old generic columns and adds language-specific ones

-- Drop the old trigger first
DROP TRIGGER IF EXISTS faq_updated_at ON public.faq;

-- Drop the old indices
DROP INDEX IF EXISTS idx_faq_category;

-- Add new columns if they don't exist
ALTER TABLE public.faq
  ADD COLUMN IF NOT EXISTS question_fr TEXT,
  ADD COLUMN IF NOT EXISTS answer_fr TEXT,
  ADD COLUMN IF NOT EXISTS category_fr VARCHAR(100),
  ADD COLUMN IF NOT EXISTS question_pt TEXT,
  ADD COLUMN IF NOT EXISTS answer_pt TEXT,
  ADD COLUMN IF NOT EXISTS category_pt VARCHAR(100);

-- Migrate existing data from old columns to new multilingual columns
UPDATE public.faq
SET question_fr = COALESCE(question_fr, question),
    answer_fr = COALESCE(answer_fr, answer),
    category_fr = COALESCE(category_fr, category)
WHERE question IS NOT NULL;

-- Now make the FR columns NOT NULL and drop old columns
ALTER TABLE public.faq
  ALTER COLUMN question_fr SET NOT NULL,
  ALTER COLUMN answer_fr SET NOT NULL,
  DROP COLUMN IF EXISTS question,
  DROP COLUMN IF EXISTS answer,
  DROP COLUMN IF EXISTS category;

-- Recreate the index with new column name
CREATE INDEX IF NOT EXISTS idx_faq_category_fr ON public.faq(category_fr);

-- Recreate the trigger
CREATE TRIGGER faq_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
