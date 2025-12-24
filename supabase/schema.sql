-- ============================================
-- SCHÉMA SUPABASE - SITE DE MARIAGE
-- ============================================
-- 
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- 
-- Tables :
--   1. rsvp - Confirmations de présence
--   2. programme - Déroulé de la journée
--   3. faq - Questions fréquentes
--   4. hebergements - Hébergements recommandés
--   5. photos - Galerie photos
-- ============================================

-- ============================================
-- 1. TABLE : RSVP (Confirmations de présence)
-- ============================================

CREATE TABLE IF NOT EXISTS public.rsvp (
  -- Identifiants
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informations invité
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  
  -- Confirmation
  attending BOOLEAN NOT NULL DEFAULT false,
  
  -- Détails pratiques
  dietary_restrictions TEXT,
  allergies TEXT,
  special_needs TEXT,
  
  -- Groupe/Famille
  family_members JSONB,
  
  -- Message
  message TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_rsvp_email ON public.rsvp(guest_email);
CREATE INDEX IF NOT EXISTS idx_rsvp_attending ON public.rsvp(attending);
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON public.rsvp(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rsvp_updated_at
  BEFORE UPDATE ON public.rsvp
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 2. TABLE : PROGRAMME (Déroulé de la journée)
-- ============================================

CREATE TABLE IF NOT EXISTS public.programme (
  -- Identifiants
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Détails événement
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Horaires
  event_time TIME NOT NULL,
  duration_minutes INTEGER,
  
  -- Lieu
  location VARCHAR(255),
  address TEXT,
  
  -- Affichage
  icon VARCHAR(50), -- Nom d'icône (ex: "ceremony", "dinner", "party")
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour l'ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_programme_order ON public.programme(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_programme_time ON public.programme(event_time ASC);
CREATE INDEX IF NOT EXISTS idx_programme_visible ON public.programme(is_visible);

-- Trigger updated_at
CREATE TRIGGER programme_updated_at
  BEFORE UPDATE ON public.programme
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 3. TABLE : FAQ (Questions fréquentes)
-- ============================================

CREATE TABLE IF NOT EXISTS public.faq (
  -- Identifiants
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contenu français
  question_fr TEXT NOT NULL,
  answer_fr TEXT NOT NULL,
  category_fr VARCHAR(100),
  
  -- Contenu portugais
  question_pt TEXT,
  answer_pt TEXT,
  category_pt VARCHAR(100),
  
  -- Affichage
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_faq_order ON public.faq(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_faq_category_fr ON public.faq(category_fr);
CREATE INDEX IF NOT EXISTS idx_faq_visible ON public.faq(is_visible);

-- Trigger updated_at
CREATE TRIGGER faq_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 4. TABLE : HÉBERGEMENTS (Recommandations)
-- ============================================

CREATE TABLE IF NOT EXISTS public.hebergements (
  -- Identifiants
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informations établissement
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- "hotel", "gite", "chambres_hotes", "airbnb"
  description TEXT,
  
  -- Localisation
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  distance_km DECIMAL(5,2), -- Distance depuis le lieu du mariage
  
  -- Contact
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(500),
  
  -- Tarifs (estimation)
  price_range VARCHAR(20), -- Ex: "€€", "50-100€", etc.
  price_note TEXT, -- Ex: "Petit déjeuner inclus"
  
  -- Image
  image_url TEXT,
  
  -- Affichage
  is_recommended BOOLEAN DEFAULT false, -- Hébergements favoris
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_hebergements_type ON public.hebergements(type);
CREATE INDEX IF NOT EXISTS idx_hebergements_city ON public.hebergements(city);
CREATE INDEX IF NOT EXISTS idx_hebergements_recommended ON public.hebergements(is_recommended);
CREATE INDEX IF NOT EXISTS idx_hebergements_order ON public.hebergements(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_hebergements_visible ON public.hebergements(is_visible);

-- Trigger updated_at
CREATE TRIGGER hebergements_updated_at
  BEFORE UPDATE ON public.hebergements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 5. TABLE : PHOTOS (Galerie)
-- ============================================

CREATE TABLE IF NOT EXISTS public.photos (
  -- Identifiants
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Stockage
  storage_path TEXT NOT NULL UNIQUE, -- Chemin dans Supabase Storage
  public_url TEXT NOT NULL,
  
  -- Métadonnées image
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER, -- En bytes
  mime_type VARCHAR(50),
  width INTEGER,
  height INTEGER,
  
  -- Contenu
  caption TEXT,
  alt_text VARCHAR(255),
  
  -- Upload info
  uploaded_by VARCHAR(255), -- Nom de la personne qui a uploadé
  uploader_email VARCHAR(255),
  
  -- Modération
  is_approved BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT false, -- Visible seulement si approuvé
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_photos_visible ON public.photos(is_visible);
CREATE INDEX IF NOT EXISTS idx_photos_approved ON public.photos(is_approved);
CREATE INDEX IF NOT EXISTS idx_photos_created ON public.photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_uploader ON public.photos(uploader_email);

-- Trigger updated_at
CREATE TRIGGER photos_updated_at
  BEFORE UPDATE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue : Statistiques RSVP
CREATE OR REPLACE VIEW public.rsvp_stats AS
SELECT
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE attending = true) as attending_count,
  COUNT(*) FILTER (WHERE attending = false) as not_attending_count,
  COUNT(*) FILTER (WHERE family_members IS NOT NULL) as with_family_members_count,
  COUNT(*) FILTER (WHERE dietary_restrictions IS NOT NULL AND dietary_restrictions != '') as dietary_restrictions_count
FROM public.rsvp;

-- Vue : Photos approuvées seulement
CREATE OR REPLACE VIEW public.photos_public AS
SELECT
  id,
  public_url,
  filename,
  caption,
  alt_text,
  uploaded_by,
  created_at
FROM public.photos
WHERE is_approved = true AND is_visible = true
ORDER BY created_at DESC;

-- ============================================
-- COMMENTAIRES (Documentation)
-- ============================================

COMMENT ON TABLE public.rsvp IS 'Confirmations de présence des invités';
COMMENT ON TABLE public.programme IS 'Déroulé chronologique de la journée du mariage';
COMMENT ON TABLE public.faq IS 'Questions fréquemment posées par les invités';
COMMENT ON TABLE public.hebergements IS 'Liste des hébergements recommandés près du lieu';
COMMENT ON TABLE public.photos IS 'Galerie photos uploadées par les invités';

-- ============================================
-- DONNÉES DE TEST (Optionnel - à supprimer en prod)
-- ============================================

-- Programme exemple
INSERT INTO public.programme (title, description, event_time, location, icon, display_order) VALUES
  ('Cérémonie', 'Cérémonie civile à la mairie', '14:00', 'Mairie de Ville', 'ceremony', 1),
  ('Cocktail', 'Vin d''honneur dans les jardins', '15:30', 'Quinta das Tulipas', 'cocktail', 2),
  ('Dîner', 'Repas de gala', '19:00', 'Grande salle du château', 'dinner', 3),
  ('Soirée dansante', 'Ouverture de bal et DJ', '22:00', 'Grande salle du château', 'party', 4)
ON CONFLICT DO NOTHING;

-- FAQ exemple
INSERT INTO public.faq (question, answer, category, display_order) VALUES
  ('Quelle est la tenue vestimentaire ?', 'Tenue de soirée élégante. Les messieurs en costume, les dames en robe de soirée.', 'tenue', 1),
  ('Y a-t-il un parking sur place ?', 'Oui, un parking gratuit est disponible au château.', 'transport', 2),
  ('Peut-on venir avec des enfants ?', 'Les enfants sont les bienvenus ! Une animation sera prévue pour eux.', 'general', 3)
ON CONFLICT DO NOTHING;

-- Hébergements exemple
INSERT INTO public.hebergements (name, type, address, city, distance_km, phone, price_range, is_recommended, display_order) VALUES
  ('Hôtel de la Gare', 'hotel', '12 Avenue de la Gare', 'Ville', 2.5, '01 23 45 67 89', '€€', true, 1),
  ('Gîte du Moulin', 'gite', '5 Rue du Moulin', 'Village', 1.8, '01 23 45 67 90', '€€€', true, 2)
ON CONFLICT DO NOTHING;
