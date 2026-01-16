import { supabase } from "./client";

/**
 * FONCTIONS DE LECTURE SUPABASE
 * 
 * Ces fonctions utilisent le client Supabase côté serveur.
 * Elles sont appelées depuis les Server Components Next.js.
 * 
 * Toutes les queries incluent des filtres pour ne récupérer
 * que les données visibles (is_visible = true).
 */

// ============================================
// TYPES (correspondant au schéma SQL)
// ============================================

export interface Programme {
  id: string;
  title: string;
  description: string | null;
  title_fr?: string;
  description_fr?: string | null;
  title_pt?: string;
  description_pt?: string | null;
  event_time: string; // Format: "14:00:00"
  duration_minutes: number | null;
  location: string | null;
  address: string | null;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question_fr: string;
  answer_fr: string;
  question_pt?: string;
  answer_pt?: string;
  category_fr?: string;
  category_pt?: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hebergement {
  id: string;
  name_fr: string;
  description_fr: string | null;
  type: "hotel" | "gite" | "chambres_hotes" | "airbnb";
  price: string | null;
  website: string | null;
  image_url: string | null;
  name_pt: string | null;
  description_pt: string | null;
  length: string | null;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  alt_text: string | null;
  uploaded_by: string | null;
  uploader_email: string | null;
  is_approved: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface RSVPStats {
  total_responses: number;
  attending_count: number;
  not_attending_count: number;
  plus_one_count: number;
  dietary_restrictions_count: number;
}

// ============================================
// QUERIES : PROGRAMME
// ============================================

/**
 * Récupère tous les événements du programme
 * Triés par heure (event_time) et ordre d'affichage
 */
export async function getProgramme(): Promise<Programme[]> {
  const { data, error } = await supabase
    .from("programme")
    .select("*")
    .eq("is_visible", true)
    .order("event_time", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching programme:", error);
    return [];
  }

  return data || [];
}

/**
 * Récupère un événement spécifique par ID
 */
export async function getProgrammeById(id: string): Promise<Programme | null> {
  const { data, error } = await supabase
    .from("programme")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .single();

  if (error) {
    console.error("Error fetching programme item:", error);
    return null;
  }

  return data;
}

// ============================================
// QUERIES : FAQ
// ============================================

/**
 * Récupère toutes les FAQ
 * Triées par catégorie puis par ordre d'affichage
 */
export async function getFAQ(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching FAQ:", error);
    return [];
  }

  return data || [];
}

/**
 * Récupère les FAQ par catégorie
 */
export async function getFAQByCategory(category: string): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("is_visible", true)
    .or(`category_fr.eq.${category},category_pt.eq.${category}`)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching FAQ by category:", error);
    return [];
  }

  return data || [];
}

/**
 * Récupère toutes les catégories de FAQ distinctes
 */
export async function getFAQCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("faq")
    .select("category_fr")
    .eq("is_visible", true)
    .not("category_fr", "is", null);

  if (error) {
    console.error("Error fetching FAQ categories:", error);
    return [];
  }

  // Extraire les catégories uniques
  const categories = Array.from(new Set(data.map((item) => item.category_fr)));
  return categories.filter((cat): cat is string => cat !== null);
}

// ============================================
// QUERIES : HÉBERGEMENTS
// ============================================

/**
 * Récupère tous les hébergements
 * Triés par date de création
 */
export async function getHebergements(): Promise<Hebergement[]> {
  const { data, error } = await supabase
    .from("hebergements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hebergements:", error);
    return [];
  }

  return data || [];
}

/**
 * Récupère les hébergements par type
 */
export async function getHebergementsByType(
  type: Hebergement["type"]
): Promise<Hebergement[]> {
  const { data, error } = await supabase
    .from("hebergements")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hebergements by type:", error);
    return [];
  }

  return data || [];
}

/**
 * Récupère uniquement les hébergements recommandés
 */
export async function getRecommendedHebergements(): Promise<Hebergement[]> {
  const { data, error } = await supabase
    .from("hebergements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching recommended hebergements:", error);
    return [];
  }

  return data || [];
}

// ============================================
// QUERIES : STATISTIQUES RSVP
// ============================================

/**
 * Récupère les statistiques RSVP depuis la vue
 * (Optionnel - pour afficher sur la page d'accueil)
 */
export async function getRSVPStats(): Promise<RSVPStats | null> {
  const { data, error } = await supabase
    .from("rsvp_stats")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching RSVP stats:", error);
    return null;
  }

  return data;
}

// ============================================
// QUERIES : PHOTOS
// ============================================

/**
 * Récupère toutes les photos approuvées
 * Triées par date d'upload (plus récentes en premier)
 */
export async function getApprovedPhotos(): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("id,storage_path,public_url,filename,file_size,mime_type,width,height,caption,alt_text,uploaded_by,uploader_email,is_approved,is_visible,created_at,updated_at")
      .eq("is_approved", true)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching approved photos:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching approved photos:", err);
    return [];
  }
}

/**
 * Récupère TOUTES les photos (admin only)
 * Y compris les photos non approuvées et non visibles
 */
export async function getAllPhotos(): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("id,storage_path,public_url,filename,file_size,mime_type,width,height,caption,alt_text,uploaded_by,uploader_email,is_approved,is_visible,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all photos:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching all photos:", err);
    return [];
  }
}

/**
 * Récupère une photo spécifique par ID
 */
export async function getPhotoById(id: string): Promise<Photo | null> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching photo:", error);
    return null;
  }

  return data;
}

/**
 * Récupère le nombre total de photos approuvées
 */
export async function getApprovedPhotosCount(): Promise<number> {
  const { count, error } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true);

  if (error) {
    console.error("Error fetching photos count:", error);
    return 0;
  }

  return count || 0;
}

// ============================================
// HELPERS
// ============================================

/**
 * Formate une heure au format "HH:mm:ss" en "HH:mm"
 */
export function formatTime(time: string): string {
  if (!time) return "";
  return time.substring(0, 5); // "14:00:00" -> "14:00"
}

/**
 * Traduit le type d'hébergement
 */
export function translateHebergementType(
  type: Hebergement["type"]
): string {
  const translations: Record<Hebergement["type"], string> = {
    hotel: "Hôtel",
    gite: "Gîte",
    chambres_hotes: "Chambres d'hôtes",
    airbnb: "Airbnb",
  };
  return translations[type] || type;
}

/**
 * Obtient la question, réponse et catégorie FAQ dans la langue demandée
 */
export function getFAQTranslation(
  faq: FAQ,
  locale: "fr" | "pt" = "fr"
): { question: string; answer: string; category: string } {
  if (locale === "pt") {
    return {
      question: faq.question_pt || faq.question_fr,
      answer: faq.answer_pt || faq.answer_fr,
      category: faq.category_pt || faq.category_fr || "Général",
    };
  }
  
  // Par défaut retourner le français
  return {
    question: faq.question_fr,
    answer: faq.answer_fr,
    category: faq.category_fr || "Général",
  };
}

/**
 * Obtient le titre et description du programme dans la langue demandée
 */
export function getProgrammeTranslation(
  programme: Programme,
  locale: "fr" | "pt" = "fr"
): { title: string; description: string | null } {
  if (locale === "pt") {
    return {
      title: programme.title_pt || programme.title,
      description: programme.description_pt || programme.description,
    };
  }
  
  // Par défaut retourner le français
  return {
    title: programme.title_fr || programme.title,
    description: programme.description_fr || programme.description,
  };
}