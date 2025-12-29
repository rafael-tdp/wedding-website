/**
 * Types pour le mode portfolio (Supabase supprimé)
 */

export interface Programme {
  id: string;
  title: string;
  title_fr: string | null;
  title_pt: string | null;
  description: string | null;
  description_fr: string | null;
  description_pt: string | null;
  event_time: string;
  duration_minutes: number;
  location: string;
  address: string | null;
  icon: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  category_fr: string | null;
  category_pt: string | null;
  question_fr: string;
  question_pt: string;
  answer_fr: string;
  answer_pt: string;
  display_order?: number;
  is_visible?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hebergement {
  id: string;
  name: string;
  type: "hotel" | "gite" | "chambres_hotes" | "airbnb";
  description: string;
  address: string;
  city?: string;
  postal_code?: string;
  phone: string;
  email: string;
  website: string | null;
  price_per_night?: number;
  price_range?: string;
  price_note?: string;
  distance_km: number;
  display_order?: number;
  is_recommended: boolean;
  is_visible?: boolean;
  image_url: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  user_name?: string;
  uploaded_by?: string;
  uploader_email?: string;
  file_name?: string;
  filename?: string;
  storage_path: string;
  public_url?: string;
  alt_text?: string;
  caption?: string;
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
  likes_count?: number;
  comments_count?: number;
}

