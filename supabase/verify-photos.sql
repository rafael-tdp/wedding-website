-- ============================================
-- SCRIPT DE VÉRIFICATION : UPLOAD PHOTOS
-- ============================================
-- 
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Ce script vérifie que tout est configuré pour les uploads de photos
--

-- 1️⃣ VÉRIFIER QUE LA TABLE PHOTOS EXISTE
SELECT 
  'Table photos' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'photos')
    THEN '✅ Existe'
    ELSE '❌ N\'existe pas - Exécuter schema.sql'
  END as status;

-- 2️⃣ VÉRIFIER LA STRUCTURE DES COLONNES
SELECT
  'Colonne: ' || column_name as check_item,
  CASE 
    WHEN data_type = 'text' THEN '✅ text'
    WHEN data_type = 'character varying' THEN '✅ varchar'
    WHEN data_type = 'integer' THEN '✅ integer'
    WHEN data_type = 'boolean' THEN '✅ boolean'
    WHEN data_type = 'timestamp with time zone' THEN '✅ timestamp'
    WHEN data_type = 'uuid' THEN '✅ uuid'
    ELSE '⚠️ ' || data_type
  END as type
FROM information_schema.columns
WHERE table_name = 'photos'
ORDER BY ordinal_position;

-- 3️⃣ VÉRIFIER QUE LES COLONNES CRITIQUES EXISTENT
-- (Celles qui sont utilisées par le code d'upload)
SELECT 
  'Colonnes requises' as check_item,
  CASE 
    WHEN (
      SELECT COUNT(*) FROM information_schema.columns 
      WHERE table_name = 'photos'
      AND column_name IN (
        'storage_path', 'public_url', 'filename', 'file_size',
        'mime_type', 'uploaded_by', 'caption', 'is_approved', 'is_visible'
      )
    ) = 9
    THEN '✅ Toutes présentes (9/9)'
    ELSE '❌ Certaines colonnes manquent'
  END as status;

-- 4️⃣ COMPTER LES PHOTOS UPLOADÉES
SELECT
  'Photos uploadées' as check_item,
  COUNT(*) || ' photo(s) en base' as status
FROM public.photos;

-- 5️⃣ VÉRIFIER LES PHOTOS EN ATTENTE DE MODÉRATION
SELECT
  'Photos en attente' as check_item,
  COUNT(*) || ' (is_approved = false)' as status
FROM public.photos
WHERE is_approved = false;

-- 6️⃣ VÉRIFIER LES PHOTOS APPROUVÉES
SELECT
  'Photos approuvées' as check_item,
  COUNT(*) || ' (is_approved = true)' as status
FROM public.photos
WHERE is_approved = true;

-- ============================================
-- RÉSULTATS ATTENDUS ✅
-- ============================================
-- 
-- 1. Table photos : ✅ Existe
-- 2. Colonnes : Toutes les types corrects (text, varchar, integer, boolean, uuid, timestamp)
-- 3. Colonnes requises : ✅ Toutes présentes (9/9)
-- 4. Photos uploadées : X photo(s) en base
-- 5. Photos en attente : Y (attente modération)
-- 6. Photos approuvées : Z (visibles publiquement)
--
-- Si une vérification échoue, consulter TROUBLESHOOTING_UPLOAD.md
--

-- ============================================
-- BONUS : VOIR LES DÉTAILS D'UNE PHOTO
-- ============================================
-- 
-- Décommenter et exécuter pour voir les dernières photos uploadées :
--

/*
SELECT 
  id,
  filename,
  uploaded_by,
  file_size,
  is_approved,
  is_visible,
  created_at,
  public_url
FROM public.photos
ORDER BY created_at DESC
LIMIT 5;
*/

-- ============================================
-- BONUS : TESTER L'UPLOAD (Manuel)
-- ============================================
--
-- Si vous voulez insérer une photo de test directement :
--

/*
INSERT INTO public.photos (
  storage_path,
  public_url,
  filename,
  file_size,
  mime_type,
  uploaded_by,
  caption,
  is_approved,
  is_visible
) VALUES (
  'uploads/test-photo.jpg',
  'https://your-storage-url.supabaseusercontent.com/object/public/gallery/uploads/test-photo.jpg',
  'test-photo.jpg',
  1024,
  'image/jpeg',
  'Utilisateur Test',
  'Une photo de test',
  true,  -- Approuvée
  true   -- Visible
)
RETURNING id;
*/
