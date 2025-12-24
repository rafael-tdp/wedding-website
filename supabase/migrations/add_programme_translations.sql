-- ============================================
-- MIGRATION : Ajouter les traductions multilingues pour le PROGRAMME
-- ============================================
-- 
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- 
-- Ajoute des colonnes pour les traductions FR/PT du titre et description
-- Les colonnes existantes (title, description) deviennent la version française par défaut
-- ============================================

-- Ajouter les colonnes de traduction à la table programme
ALTER TABLE public.programme
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS title_pt TEXT,
ADD COLUMN IF NOT EXISTS description_pt TEXT;

-- Remplir les colonnes FR avec les valeurs existantes (migration de données)
UPDATE public.programme
SET title_fr = title, description_fr = description
WHERE title_fr IS NULL OR description_fr IS NULL;

-- Ajouter des commentaires pour clarifier l'utilisation
COMMENT ON COLUMN public.programme.title IS 'Titre de l''événement (par défaut en français)';
COMMENT ON COLUMN public.programme.description IS 'Description de l''événement (par défaut en français)';
COMMENT ON COLUMN public.programme.title_fr IS 'Titre en français';
COMMENT ON COLUMN public.programme.description_fr IS 'Description en français';
COMMENT ON COLUMN public.programme.title_pt IS 'Titre en portugais';
COMMENT ON COLUMN public.programme.description_pt IS 'Description en portugais';

-- ============================================
-- Schéma final pour le PROGRAMME :
-- - title / description : français (par défaut)
-- - title_fr / description_fr : français
-- - title_pt / description_pt : portugais
-- ============================================
