import { z } from "zod";

/**
 * SCHÉMA DE VALIDATION RSVP
 * 
 * Utilisé pour :
 * - Validation côté client (avant envoi)
 * - Validation côté serveur (Server Action)
 * 
 * zod génère automatiquement les messages d'erreur
 */

/**
 * Schéma pour une personne du groupe/famille
 */
export const familyMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(255, "Le nom est trop long")
    .trim(),
  
  attending: z.boolean(),

  isChild: z.boolean().default(false),

  age: z
    .number()
    .int("L'âge doit être un nombre entier")
    .min(0, "L'âge doit être positif")
    .max(18, "L'âge doit être inférieur à 18 ans")
    .optional(),

  dietary_restrictions: z
    .string()
    .max(1000, "Le texte est trop long (max 1000 caractères)")
    .trim()
    .optional()
    .or(z.literal("")),

  allergies: z
    .string()
    .max(1000, "Le texte est trop long (max 1000 caractères)")
    .trim()
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    // Si c'est un enfant, l'âge doit être fourni
    if (data.isChild && !data.age) {
      return false;
    }
    return true;
  },
  {
    message: "L'âge est requis pour les enfants",
    path: ["age"],
  }
);

export const rsvpSchema = z.object({
  // Informations invité
  guest_name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(255, "Le nom est trop long")
    .trim(),

  guest_email: z
    .string()
    .email("Veuillez entrer une adresse email valide")
    .max(255, "L'email est trop long")
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),

  guest_phone: z
    .string()
    .refine(
      (val) => !val || val.length >= 10,
      "Le numéro de téléphone doit contenir au moins 10 chiffres"
    )
    .refine(
      (val) => !val || /^[0-9\s\+\-\(\)]+$/.test(val),
      "Format de téléphone invalide"
    )
    .max(50, "Le numéro est trop long")
    .optional()
    .or(z.literal("")),

  // Confirmation de présence
  attending: z.boolean().refine((val) => val !== undefined, {
    message: "Veuillez indiquer si vous serez présent(e)",
  }),

  // Détails pratiques
  dietary_restrictions: z
    .string()
    .max(1000, "Le texte est trop long (max 1000 caractères)")
    .trim()
    .optional()
    .or(z.literal("")),

  allergies: z
    .string()
    .max(1000, "Le texte est trop long (max 1000 caractères)")
    .trim()
    .optional()
    .or(z.literal("")),

  special_needs: z
    .string()
    .max(1000, "Le texte est trop long (max 1000 caractères)")
    .trim()
    .optional()
    .or(z.literal("")),

  // Message
  message: z
    .string()
    .max(2000, "Le message est trop long (max 2000 caractères)")
    .trim()
    .optional()
    .or(z.literal("")),

  // Groupe/Famille
  family_members: z
    .array(familyMemberSchema)
    .optional()
    .default([]),
}).refine(
  (data) => {
    // Si l'utilisateur ne vient pas, les détails pratiques ne sont pas requis
    // Donc on accepte les champs vides ou non présents
    return true;
  }
);

/**
 * Type TypeScript généré depuis le schéma
 */
export type RSVPFormData = z.infer<typeof rsvpSchema>;

/**
 * Type pour la réponse de la Server Action
 */
export type RSVPActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  rsvp?: any;
};
