-- Migration : Mettre à jour la table RSVP pour supporter family_members

-- 1. Supprimer la view qui dépend de la colonne plus_one
DROP VIEW IF EXISTS public.rsvp_stats CASCADE;

-- 2. Ajouter la colonne family_members si elle n'existe pas
ALTER TABLE public.rsvp
ADD COLUMN IF NOT EXISTS family_members JSONB;

-- 3. Rendre guest_email nullable
ALTER TABLE public.rsvp
ALTER COLUMN guest_email DROP NOT NULL;

-- 4. Supprimer les colonnes plus_one et plus_one_name
ALTER TABLE public.rsvp
DROP COLUMN IF EXISTS plus_one;

ALTER TABLE public.rsvp
DROP COLUMN IF EXISTS plus_one_name;

-- 5. Recréer la view rsvp_stats avec les bonnes colonnes
CREATE OR REPLACE VIEW public.rsvp_stats AS
SELECT
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE attending = true) as attending_count,
  COUNT(*) FILTER (WHERE attending = false) as not_attending_count,
  COUNT(*) FILTER (WHERE family_members IS NOT NULL) as with_family_members_count,
  COUNT(*) FILTER (WHERE dietary_restrictions IS NOT NULL AND dietary_restrictions != '') as dietary_restrictions_count
FROM public.rsvp;
