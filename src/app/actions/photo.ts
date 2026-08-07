"use server";

import { supabase } from "@/lib/supabase/client";
import {
  photoMetadataSchema,
  generateStorageFileName,
  SESSION_DURATION_MS,
  MAX_PHOTOS_PER_SESSION,
} from "@/lib/validations/photo";
import { z } from "zod";

/**
 * SERVER ACTION : UPLOAD DE PHOTO
 * 
 * Cette action gère l'upload de photos par les invités :
 * 1. Validation des métadonnées (nom, message)
 * 2. Protection anti-spam (honeypot, rate limiting)
 * 3. Upload vers Supabase Storage (bucket: gallery/uploads/)
 * 4. Insertion dans la table photos
 * 
 * WORKFLOW :
 * - Les photos uploadées vont dans gallery/uploads/
 * - is_approved = true par défaut (visibles immédiatement)
 * - is_visible = true par défaut (affichées publiquement)
 * - L'admin peut désactiver (is_visible = false) via le dashboard
 * 
 * NOTE IMPORTANTE : La queue d'uploads côté client gère les uploads parallèles
 * et les timeouts (5 minutes par fichier). Le serveur devrait accepter les
 * uploads individuels sans problème avec ce système.
 */

// ============================================
// TYPES
// ============================================

interface UploadPhotoResult {
  success: boolean;
  message: string;
  photoId?: string;
  errors?: Record<string, string[]>;
  rateLimitError?: boolean;
}

// ============================================
// RATE LIMITING (Côté serveur - simple)
// ============================================

/**
 * Cache en mémoire pour le rate limiting côté serveur
 * En production, utiliser Redis (Upstash) ou une solution plus robuste
 */
const uploadRateLimitCache = new Map<
  string,
  { count: number; timestamp: number }
>();

/**
 * Nettoie le cache périodiquement (toutes les 5 minutes)
 */
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of uploadRateLimitCache.entries()) {
      if (now - value.timestamp > SESSION_DURATION_MS) {
        uploadRateLimitCache.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

/**
 * Vérifie le rate limit côté serveur
 * Basé sur l'IP (simulée par un hash du user-agent pour cette démo)
 */
function checkServerRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
} {
  const cached = uploadRateLimitCache.get(identifier);
  const now = Date.now();

  if (!cached) {
    return { allowed: true, remaining: MAX_PHOTOS_PER_SESSION };
  }

  // Réinitialiser si la session a expiré
  if (now - cached.timestamp > SESSION_DURATION_MS) {
    uploadRateLimitCache.delete(identifier);
    return { allowed: true, remaining: MAX_PHOTOS_PER_SESSION };
  }

  // Vérifier la limite
  const remaining = MAX_PHOTOS_PER_SESSION - cached.count;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Incrémente le compteur de rate limiting
 */
function incrementServerRateLimit(identifier: string): void {
  const cached = uploadRateLimitCache.get(identifier);
  const now = Date.now();

  if (!cached) {
    uploadRateLimitCache.set(identifier, { count: 1, timestamp: now });
    return;
  }

  // Réinitialiser si la session a expiré
  if (now - cached.timestamp > SESSION_DURATION_MS) {
    uploadRateLimitCache.set(identifier, { count: 1, timestamp: now });
    return;
  }

  // Incrémenter
  cached.count += 1;
}

// ============================================
// SERVER ACTION : UPLOAD PHOTO
// ============================================

export async function uploadPhoto(
  formData: FormData
): Promise<UploadPhotoResult> {
  try {
    // ============================================
    // 1. EXTRAIRE LES DONNÉES DU FORMDATA
    // ============================================

    const uploaded_by_name = formData.get("uploaded_by_name") as string;
    const message = formData.get("message") as string | null;
    const website = formData.get("website") as string | undefined; // Honeypot
    const timestamp = formData.get("timestamp") as string | undefined;
    const file = formData.get("file") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (!file) {
      return {
        success: false,
        message: "Aucun fichier fourni",
      };
    }

    // ============================================
    // 2. VALIDATION DES MÉTADONNÉES
    // ============================================

    console.log("Upload metadata:", {
      uploaded_by_name,
      message,
      website,
      timestamp,
    });

    const validationResult = photoMetadataSchema.safeParse({
      uploaded_by_name,
      message: message || null,
      website,
      timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
    });

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.flatten().fieldErrors);
      return {
        success: false,
        message: "Données invalides",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const metadata = validationResult.data;

    // ============================================
    // 3. PROTECTION ANTI-SPAM : HONEYPOT
    // ============================================

    if (metadata.website && metadata.website.length > 0) {
      console.warn("Honeypot triggered:", metadata.website);
      return {
        success: false,
        message: "Erreur de validation",
      };
    }

    // ============================================
    // 4. PROTECTION ANTI-SPAM : TIMESTAMP
    // ============================================

    if (metadata.timestamp) {
      const now = Date.now();
      const elapsed = now - metadata.timestamp;

      // Le formulaire doit être rempli en au moins 2 secondes (éviter les bots)
      if (elapsed < 2000) {
        console.warn("Form submitted too fast:", elapsed, "ms");
        return {
          success: false,
          message: "Veuillez prendre le temps de remplir le formulaire",
        };
      }

      // Le formulaire ne doit pas être ouvert depuis plus de 1 heure (token expiré)
      if (elapsed > 60 * 60 * 1000) {
        return {
          success: false,
          message: "Le formulaire a expiré. Veuillez recharger la page.",
        };
      }
    }

    // ============================================
    // 5. PROTECTION ANTI-SPAM : RATE LIMITING
    // ============================================

    // Simuler un identifiant utilisateur (en production, utiliser l'IP réelle)
    const userIdentifier = `user-${uploaded_by_name.toLowerCase().replace(/\s+/g, "-")}`;
    const rateLimitCheck = checkServerRateLimit(userIdentifier);

    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        message: `Limite atteinte : ${MAX_PHOTOS_PER_SESSION} photos maximum par session (30 minutes)`,
        rateLimitError: true,
      };
    }

    // ============================================
    // 6. VALIDATION DU FICHIER
    // ============================================

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        success: false,
        message: `Format non accepté. Formats autorisés : JPG, PNG, WEBP, HEIC`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: `Fichier trop volumineux. Taille max : ${MAX_FILE_SIZE / 1024 / 1024} MB`,
      };
    }

    // ============================================
    // 7. GÉNÉRER LE NOM DE FICHIER UNIQUE
    // ============================================

    const fileName = generateStorageFileName(file.name);
    const storagePath = `uploads/${fileName}`;

    // ============================================
    // 8. UPLOADER VERS SUPABASE STORAGE
    // ============================================

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false, // Ne pas écraser si existe déjà
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      console.error("Error message:", uploadError.message);
      console.error("Storage path:", storagePath);
      return {
        success: false,
        message: `Erreur lors de l'upload: ${uploadError.message || "Erreur inconnue"}`,
      };
    }

    // ============================================
    // 8bis. UPLOADER LA MINIATURE (utilisée dans les grilles)
    // ============================================

    let thumbnailStoragePath: string | null = null;

    if (thumbnailFile) {
      thumbnailStoragePath = `uploads/thumbs/${fileName}`;
      const thumbnailBuffer = new Uint8Array(await thumbnailFile.arrayBuffer());

      const { error: thumbnailUploadError } = await supabase.storage
        .from("gallery")
        .upload(thumbnailStoragePath, thumbnailBuffer, {
          contentType: thumbnailFile.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (thumbnailUploadError) {
        console.error("Thumbnail upload error:", thumbnailUploadError);
        // Non bloquant : la galerie retombera sur public_url si thumbnail_url est absent
        thumbnailStoragePath = null;
      }
    }

    // ============================================
    // 9. GÉNÉRER LES URLS PUBLIQUES
    // ============================================

    const publicUrl = await getPhotoPublicUrl(storagePath);
    const thumbnailUrl = thumbnailStoragePath
      ? await getPhotoPublicUrl(thumbnailStoragePath)
      : null;

    // ============================================
    // 10. INSÉRER DANS LA TABLE PHOTOS
    // ============================================

    const { data: photoData, error: dbError } = await supabase
      .from("photos")
      .insert({
        storage_path: storagePath,
        public_url: publicUrl,
        thumbnail_path: thumbnailStoragePath,
        thumbnail_url: thumbnailUrl,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: metadata.uploaded_by_name,
        caption: metadata.message || null,
        is_approved: true, // Photos visibles par défaut
        is_visible: true,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      console.error("Error code:", dbError.code);
      console.error("Error message:", dbError.message);
      console.error("Error details:", dbError.details);

      // Supprimer le(s) fichier(s) uploadé(s) en cas d'erreur DB
      const pathsToRemove = [storagePath];
      if (thumbnailStoragePath) pathsToRemove.push(thumbnailStoragePath);
      await supabase.storage.from("gallery").remove(pathsToRemove);

      return {
        success: false,
        message: `Erreur lors de l'enregistrement: ${dbError.message}`,
      };
    }

    // ============================================
    // 11. INCRÉMENTER LE RATE LIMIT
    // ============================================

    incrementServerRateLimit(userIdentifier);

    // ============================================
    // 12. SUCCÈS
    // ============================================

    return {
      success: true,
      message: "Photo uploadée avec succès ! Elle sera visible après modération.",
      photoId: photoData.id,
    };
  } catch (error) {
    console.error("Unexpected error in uploadPhoto:", error);
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }
}

// ============================================
// HELPER : OBTENIR L'URL PUBLIQUE D'UNE PHOTO
// ============================================

/**
 * Récupère l'URL publique d'une photo depuis le storage
 */
export async function getPhotoPublicUrl(storagePath: string): Promise<string> {
  const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Génère une URL signée pour télécharger une photo en HD
 * (Expire après X secondes - utile pour le téléchargement post-mariage)
 */
export async function getPhotoSignedUrl(
  storagePath: string,
  expiresIn: number = 3600 // 1 heure par défaut
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("gallery")
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}
