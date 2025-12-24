-- ============================================
-- POLITIQUES RLS (ROW LEVEL SECURITY)
-- ============================================
--
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- APRÈS avoir exécuté schema.sql
--
-- Principe :
--   - Lecture publique : Tout le monde peut lire
--   - Écriture contrôlée : Règles spécifiques par table
-- ============================================

-- ============================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================

ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hebergements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLICIES : RSVP
-- ============================================

-- Lecture publique : Tout le monde peut lire les RSVP
-- (Utile pour afficher les stats publiques, à ajuster selon besoin)
CREATE POLICY "RSVP - Public Read"
  ON public.rsvp
  FOR SELECT
  USING (true);

-- Insertion publique : N'importe qui peut créer un RSVP
CREATE POLICY "RSVP - Public Insert"
  ON public.rsvp
  FOR INSERT
  WITH CHECK (true);

-- Modification : Seulement par email (l'invité peut modifier son propre RSVP)
-- Option 1 : Modification libre (pas d'auth)
CREATE POLICY "RSVP - Public Update"
  ON public.rsvp
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Option 2 : Si vous voulez restreindre (décommenter et ajuster)
-- CREATE POLICY "RSVP - Update Own"
--   ON public.rsvp
--   FOR UPDATE
--   USING (guest_email = current_setting('request.jwt.claims', true)::json->>'email')
--   WITH CHECK (guest_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Suppression : Interdite (sauf admin via dashboard)
CREATE POLICY "RSVP - No Delete"
  ON public.rsvp
  FOR DELETE
  USING (false);

-- ============================================
-- 3. POLICIES : PROGRAMME
-- ============================================

-- Lecture publique : Tout le monde peut voir le programme
CREATE POLICY "Programme - Public Read"
  ON public.programme
  FOR SELECT
  USING (is_visible = true);

-- Écriture : Réservée aux administrateurs (via dashboard uniquement)
-- Pas de policy INSERT/UPDATE/DELETE = seuls les admins Supabase peuvent modifier

-- ============================================
-- 4. POLICIES : FAQ
-- ============================================

-- Lecture publique : Tout le monde peut lire les FAQ visibles
CREATE POLICY "FAQ - Public Read"
  ON public.faq
  FOR SELECT
  USING (is_visible = true);

-- Écriture : Réservée aux administrateurs (via dashboard uniquement)
-- Pas de policy INSERT/UPDATE/DELETE = seuls les admins Supabase peuvent modifier

-- ============================================
-- 5. POLICIES : HÉBERGEMENTS
-- ============================================

-- Lecture publique : Tout le monde peut voir les hébergements
CREATE POLICY "Hebergements - Public Read"
  ON public.hebergements
  FOR SELECT
  USING (is_visible = true);

-- Écriture : Réservée aux administrateurs (via dashboard uniquement)
-- Pas de policy INSERT/UPDATE/DELETE = seuls les admins Supabase peuvent modifier

-- ============================================
-- 6. POLICIES : PHOTOS
-- ============================================

-- Lecture publique : Seulement les photos approuvées et visibles
CREATE POLICY "Photos - Public Read Approved"
  ON public.photos
  FOR SELECT
  USING (is_approved = true AND is_visible = true);

-- Insertion publique : N'importe qui peut uploader une photo
-- (Elle sera en attente d'approbation)
CREATE POLICY "Photos - Public Insert"
  ON public.photos
  FOR INSERT
  WITH CHECK (
    is_approved = false AND 
    is_visible = false
  );

-- Modification : Interdite pour le public
-- Seuls les admins peuvent approuver/modifier via dashboard
CREATE POLICY "Photos - No Public Update"
  ON public.photos
  FOR UPDATE
  USING (false);

-- Suppression : Interdite pour le public
CREATE POLICY "Photos - No Public Delete"
  ON public.photos
  FOR DELETE
  USING (false);

-- ============================================
-- POLICIES AVANCÉES (Optionnel)
-- ============================================

-- Si vous voulez limiter le nombre de RSVP par email
-- (À activer si vous voulez éviter les doublons)

-- CREATE OR REPLACE FUNCTION public.check_rsvp_limit()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN (
--     SELECT COUNT(*) 
--     FROM public.rsvp 
--     WHERE guest_email = NEW.guest_email
--   ) < 1;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ALTER POLICY "RSVP - Public Insert" ON public.rsvp
-- WITH CHECK (check_rsvp_limit());

-- ============================================
-- VÉRIFICATION DES POLICIES
-- ============================================

-- Pour voir toutes les policies actives :
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public';

-- ============================================
-- NOTES DE SÉCURITÉ
-- ============================================

/*
✅ SÉCURITÉ PAR TABLE :

1. RSVP
   - ✅ Lecture publique (pour stats)
   - ✅ Insertion publique (formulaire)
   - ✅ Modification publique (permet de corriger)
   - ❌ Suppression interdite

2. PROGRAMME / FAQ / HÉBERGEMENTS
   - ✅ Lecture publique (affichage)
   - ❌ Modification réservée aux admins
   
3. PHOTOS
   - ✅ Lecture publique (seulement approuvées)
   - ✅ Upload public (en attente d'approbation)
   - ❌ Modification/suppression réservées aux admins

🔒 RECOMMANDATIONS :

1. Activer l'authentification Supabase si besoin de plus de sécurité
2. Limiter le nombre de RSVP par email (voir fonction ci-dessus)
3. Ajouter un rate limiting via Edge Functions si trafic élevé
4. Monitorer les uploads de photos (taille, fréquence)

⚠️ LIMITATIONS PLAN GRATUIT :

- Row Level Security : Inclus ✅
- Max 500 Mo de DB
- Max 50,000 utilisateurs actifs/mois
- Pas de limite sur les policies RLS
*/
