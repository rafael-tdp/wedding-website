-- Add translation columns to hebergements table
-- This migration adds French and Portuguese translation support

ALTER TABLE IF EXISTS public.hebergements
ADD COLUMN IF NOT EXISTS name_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_pt VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_pt TEXT,
ADD COLUMN IF NOT EXISTS price_note_fr TEXT,
ADD COLUMN IF NOT EXISTS price_note_pt TEXT;

-- Set French defaults from existing columns
UPDATE public.hebergements
SET 
  name_fr = COALESCE(name_fr, name),
  description_fr = COALESCE(description_fr, description),
  price_note_fr = COALESCE(price_note_fr, price_note)
WHERE name_fr IS NULL OR description_fr IS NULL OR price_note_fr IS NULL;
