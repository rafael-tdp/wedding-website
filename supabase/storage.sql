-- ============================================
-- CONFIGURATION SUPABASE STORAGE
-- ============================================
--
-- À exécuter dans : Supabase Dashboard > Storage
-- ============================================

-- ============================================
-- 1. CRÉER LE BUCKET POUR LES PHOTOS
-- ============================================

-- Dans le dashboard Supabase :
-- 1. Aller dans "Storage"
-- 2. Cliquer "New bucket"
-- 3. Nom : "gallery"
-- 4. Public : OUI (pour affichage direct)
-- 5. File size limit : 10 MB
-- 6. Allowed MIME types : image/jpeg, image/png, image/webp

-- OU via SQL (à exécuter dans SQL Editor) :

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760, -- 10 MB en bytes (couvre la compression 5 MB + le fallback fichier original)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Si le bucket "gallery" existe déjà (projet en cours), l'INSERT ci-dessus
-- ne le mettra PAS à jour (ON CONFLICT DO NOTHING). Exécuter à la place :
--
-- UPDATE storage.buckets SET file_size_limit = 10485760 WHERE id = 'gallery';

-- ============================================
-- 2. POLICIES STORAGE : BUCKET GALLERY
-- ============================================

-- Lecture publique : Tout le monde peut voir les photos
CREATE POLICY "Gallery - Public Read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

-- Upload public : N'importe qui peut uploader
CREATE POLICY "Gallery - Public Upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery' AND
    -- Limite de taille : 5 MB
    (storage.foldername(name))[1] = 'uploads'
  );

-- Mise à jour : Interdite (sauf admin)
CREATE POLICY "Gallery - No Public Update"
  ON storage.objects
  FOR UPDATE
  USING (false);

-- Suppression : Interdite (sauf admin)
CREATE POLICY "Gallery - No Public Delete"
  ON storage.objects
  FOR DELETE
  USING (false);

-- ============================================
-- 3. STRUCTURE DES DOSSIERS RECOMMANDÉE
-- ============================================

/*
gallery/
├── uploads/           ← Photos uploadées par les invités (non approuvées)
└── approved/          ← Photos approuvées et visibles publiquement

Workflow :
1. Invité upload → storage: gallery/uploads/xxx.jpg
2. Admin approuve → déplace vers gallery/approved/xxx.jpg
3. Frontend affiche seulement gallery/approved/*
*/

-- ============================================
-- 4. FONCTION : APPROUVER UNE PHOTO
-- ============================================

-- Fonction utilitaire pour déplacer une photo d'uploads/ vers approved/
-- (À appeler depuis le dashboard ou une Edge Function admin)

CREATE OR REPLACE FUNCTION public.approve_photo(photo_id UUID)
RETURNS void AS $$
DECLARE
  photo_record public.photos;
BEGIN
  -- Récupérer la photo
  SELECT * INTO photo_record FROM public.photos WHERE id = photo_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Photo not found';
  END IF;
  
  -- Mettre à jour le statut
  UPDATE public.photos
  SET 
    is_approved = true,
    is_visible = true,
    updated_at = now()
  WHERE id = photo_id;
  
  -- Note : Le déplacement dans Storage doit être fait manuellement
  -- ou via une Edge Function côté admin
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. TRIGGER : NETTOYER STORAGE QUAND PHOTO SUPPRIMÉE
-- ============================================

-- Quand une photo est supprimée de la table, supprimer aussi le fichier
-- (Nécessite une Edge Function - voir SUPABASE_OPTIMIZATION.md)

CREATE OR REPLACE FUNCTION public.delete_storage_object()
RETURNS TRIGGER AS $$
BEGIN
  -- Supprimer le fichier du storage (photo + miniature)
  DELETE FROM storage.objects
  WHERE bucket_id = 'gallery'
    AND name IN (OLD.storage_path, OLD.thumbnail_path);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_photo_deleted
  AFTER DELETE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_storage_object();

-- ============================================
-- 6. VÉRIFICATION
-- ============================================

-- Lister tous les buckets
SELECT * FROM storage.buckets;

-- Lister les policies du bucket gallery
SELECT *
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage';
