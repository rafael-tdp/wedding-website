-- Migration: Update hebergements table schema to only keep essential columns
-- This migration removes unnecessary columns and ensures all required columns exist

BEGIN;

-- Drop old columns that are no longer needed
ALTER TABLE IF EXISTS public.hebergements
DROP COLUMN IF EXISTS address CASCADE,
DROP COLUMN IF EXISTS city CASCADE,
DROP COLUMN IF EXISTS postal_code CASCADE,
DROP COLUMN IF EXISTS distance_km CASCADE,
DROP COLUMN IF EXISTS phone CASCADE,
DROP COLUMN IF EXISTS email CASCADE,
DROP COLUMN IF EXISTS price_range CASCADE,
DROP COLUMN IF EXISTS price_note CASCADE,
DROP COLUMN IF EXISTS price_note_fr CASCADE,
DROP COLUMN IF EXISTS price_note_pt CASCADE,
DROP COLUMN IF EXISTS is_recommended CASCADE,
DROP COLUMN IF EXISTS display_order CASCADE,
DROP COLUMN IF EXISTS is_visible CASCADE,
DROP COLUMN IF EXISTS name CASCADE,
DROP COLUMN IF EXISTS description CASCADE;

-- Add required columns if they don't exist
ALTER TABLE IF EXISTS public.hebergements
ADD COLUMN IF NOT EXISTS name_fr VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'hotel',
ADD COLUMN IF NOT EXISTS price VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_pt VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_pt TEXT,
ADD COLUMN IF NOT EXISTS length VARCHAR(50);

-- Update name_fr default constraint if needed
ALTER TABLE IF EXISTS public.hebergements
ALTER COLUMN name_fr DROP DEFAULT;

COMMIT;
