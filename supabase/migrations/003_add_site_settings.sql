-- ============================================
-- MIGRATION : PARAMÈTRES DU SITE (visibilité galerie)
-- ============================================
--
-- Permet à l'admin de forcer l'affichage de la galerie aux invités
-- ("visible"), de la masquer ("hidden"), ou de garder le comportement
-- actuel basé sur la date/heure du mariage ("auto", valeur par défaut).
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  gallery_visibility TEXT NOT NULL DEFAULT 'auto'
    CHECK (gallery_visibility IN ('auto', 'visible', 'hidden')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

INSERT INTO public.site_settings (id, gallery_visibility)
VALUES (1, 'auto')
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site Settings - Public Read"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Écriture : réservée aux administrateurs (server actions avec la clé service_role)
