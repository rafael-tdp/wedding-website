-- ============================================
-- MIGRATION : MINIATURES PHOTOS
-- ============================================
--
-- Ajoute une miniature (~500px, ~150 Ko) générée côté client à l'upload.
-- Utilisée dans les grilles pour réduire la bande passante Supabase
-- (la galerie affichait jusqu'ici l'image compressée pleine taille
-- (~1,5 Mo) même en miniature 4:3, ce qui consommait très vite le
-- quota gratuit de 2 Go/mois).
--
-- Les photos existantes ont thumbnail_url = NULL : le frontend retombe
-- alors sur public_url (pas de backfill nécessaire).
-- ============================================

ALTER TABLE public.photos
  ADD COLUMN IF NOT EXISTS thumbnail_path TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
