-- ============================================
-- MIGRATION : Ajouter les traductions multilingues pour les FAQ
-- ============================================
-- 
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- 
-- Ajoute des colonnes pour les traductions FR/PT des questions et réponses FAQ
-- Les colonnes existantes (question, answer) deviennent la version française par défaut
-- ============================================

-- Ajouter les colonnes de traduction à la table faq
ALTER TABLE public.faq
ADD COLUMN IF NOT EXISTS question_fr TEXT,
ADD COLUMN IF NOT EXISTS answer_fr TEXT,
ADD COLUMN IF NOT EXISTS question_pt TEXT,
ADD COLUMN IF NOT EXISTS answer_pt TEXT,
ADD COLUMN IF NOT EXISTS category_fr VARCHAR(100),
ADD COLUMN IF NOT EXISTS category_pt VARCHAR(100);

-- Remplir les colonnes FR avec les valeurs existantes (migration de données)
UPDATE public.faq
SET question_fr = question, answer_fr = answer
WHERE question_fr IS NULL OR answer_fr IS NULL;

-- Remplir les catégories traduites avec les traductions par défaut
UPDATE public.faq SET category_fr = 'Transport' WHERE category = 'transport' AND category_fr IS NULL;
UPDATE public.faq SET category_fr = 'Hébergement' WHERE category = 'hebergement' AND category_fr IS NULL;
UPDATE public.faq SET category_fr = 'Tenue' WHERE category = 'tenue' AND category_fr IS NULL;
UPDATE public.faq SET category_fr = 'Général' WHERE category = 'general' AND category_fr IS NULL;
UPDATE public.faq SET category_fr = 'Enfants' WHERE category = 'enfants' AND category_fr IS NULL;
UPDATE public.faq SET category_fr = 'Repas' WHERE category = 'repas' AND category_fr IS NULL;

UPDATE public.faq SET category_pt = 'Transporte' WHERE category = 'transport' AND category_pt IS NULL;
UPDATE public.faq SET category_pt = 'Alojamento' WHERE category = 'hebergement' AND category_pt IS NULL;
UPDATE public.faq SET category_pt = 'Vestuário' WHERE category = 'tenue' AND category_pt IS NULL;
UPDATE public.faq SET category_pt = 'Geral' WHERE category = 'general' AND category_pt IS NULL;
UPDATE public.faq SET category_pt = 'Crianças' WHERE category = 'enfants' AND category_pt IS NULL;
UPDATE public.faq SET category_pt = 'Refeições' WHERE category = 'repas' AND category_pt IS NULL;

-- Ajouter des commentaires pour clarifier l'utilisation
COMMENT ON COLUMN public.faq.question IS 'Question (par défaut en français)';
COMMENT ON COLUMN public.faq.answer IS 'Réponse (par défaut en français)';
COMMENT ON COLUMN public.faq.question_fr IS 'Question en français';
COMMENT ON COLUMN public.faq.answer_fr IS 'Réponse en français';
COMMENT ON COLUMN public.faq.question_pt IS 'Question en portugais';
COMMENT ON COLUMN public.faq.answer_pt IS 'Réponse en portugais';
COMMENT ON COLUMN public.faq.category_fr IS 'Catégorie en français';
COMMENT ON COLUMN public.faq.category_pt IS 'Catégorie en portugais';

-- ============================================
-- Schéma final pour les FAQ :
-- - question / answer : français (par défaut)
-- - question_fr / answer_fr : français
-- - question_pt / answer_pt : portugais
-- - category : clé anglaise (transport, hebergement, etc.)
-- - category_fr : catégorie en français
-- - category_pt : catégorie en portugais
-- ============================================
