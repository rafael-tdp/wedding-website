import { z } from "zod";

/**
 * VALIDATION : UPLOAD DE PHOTOS
 * 
 * Schéma de validation pour l'upload de photos par les invités.
 * 
 * Contraintes :
 * - Taille max : 10 MB (compressé côté client à ~1,5 MB avant upload)
 * - Formats acceptés : JPG, PNG, WEBP, HEIC
 * - Nom de l'invité obligatoire
 * - Message optionnel (max 500 caractères)
 */

// ============================================
// CONSTANTES
// ============================================

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_NAME_LENGTH = 100;

// Limite anti-spam : nombre max de photos par session (30 minutes)
export const MAX_PHOTOS_PER_SESSION = 100;
export const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// Configuration des uploads parallèles
export const MAX_PARALLEL_UPLOADS = 3;
export const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes par upload

// ============================================
// SCHÉMA DE VALIDATION
// ============================================

/**
 * Schéma pour les métadonnées de la photo (côté serveur)
 */
export const photoMetadataSchema = z.object({
  uploaded_by_name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(MAX_NAME_LENGTH, `Le nom ne peut pas dépasser ${MAX_NAME_LENGTH} caractères`)
    .trim(),

  message: z
    .string()
    .max(MAX_MESSAGE_LENGTH, `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`)
    .trim()
    .optional()
    .nullable(),

  // Anti-spam : honeypot field (doit être vide)
  website: z
    .string()
    .max(0, "Invalid field")
    .optional()
    .nullable(),

  // Anti-spam : timestamp (pour vérifier que le formulaire n'a pas été soumis trop vite)
  timestamp: z
    .number()
    .int()
    .positive()
    .optional(),
});

export type PhotoMetadata = z.infer<typeof photoMetadataSchema>;

/**
 * Validation côté client pour le fichier image
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Vérifier le type MIME
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Format non accepté. Formats autorisés : JPG, PNG, WEBP, HEIC`,
    };
  }

  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille max : ${MAX_FILE_SIZE / 1024 / 1024} MB`,
    };
  }

  // Vérifier que c'est bien une image (nom de fichier)
  const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: "Extension de fichier invalide",
    };
  }

  return { valid: true };
}

/**
 * Génère un nom de fichier unique pour le storage
 * Format : {timestamp}-{random}-{originalName}
 */
export function generateStorageFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  
  // Nettoyer le nom original (garder uniquement l'extension)
  const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";
  
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Vérifie si l'utilisateur a atteint la limite d'upload
 * (Basé sur localStorage côté client)
 */
export function checkUploadLimit(): {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
} {
  if (typeof window === "undefined") {
    return { allowed: true, remaining: MAX_PHOTOS_PER_SESSION };
  }

  try {
    const storageKey = "wedding_photo_uploads";
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return { allowed: true, remaining: MAX_PHOTOS_PER_SESSION };
    }

    const data = JSON.parse(stored);
    const now = Date.now();

    // Réinitialiser si la session a expiré
    if (now - data.timestamp > SESSION_DURATION_MS) {
      localStorage.removeItem(storageKey);
      return { allowed: true, remaining: MAX_PHOTOS_PER_SESSION };
    }

    // Vérifier la limite
    const remaining = MAX_PHOTOS_PER_SESSION - data.count;
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: data.timestamp + SESSION_DURATION_MS,
      };
    }

    return { allowed: true, remaining };
  } catch (error) {
    console.error("Error checking upload limit:", error);
    return { allowed: true, remaining: MAX_PHOTOS_PER_SESSION };
  }
}

/**
 * Incrémente le compteur d'upload
 */
export function incrementUploadCount(): void {
  if (typeof window === "undefined") return;

  try {
    const storageKey = "wedding_photo_uploads";
    const stored = localStorage.getItem(storageKey);
    const now = Date.now();

    if (!stored) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ count: 1, timestamp: now })
      );
      return;
    }

    const data = JSON.parse(stored);

    // Réinitialiser si la session a expiré
    if (now - data.timestamp > SESSION_DURATION_MS) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ count: 1, timestamp: now })
      );
      return;
    }

    // Incrémenter
    data.count += 1;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error("Error incrementing upload count:", error);
  }
}
