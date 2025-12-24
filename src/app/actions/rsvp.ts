"use server";

import { supabase } from "@/lib/supabase/client";
import { rsvpSchema, RSVPActionResult } from "@/lib/validations/rsvp";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * SERVER ACTION : SOUMETTRE UN RSVP
 * 
 * Cette fonction est appelée côté client mais s'exécute côté serveur.
 * Elle valide les données et les insère dans Supabase.
 * 
 * Avantages :
 * - Validation serveur (sécurité)
 * - Pas besoin de Route Handler
 * - Gestion automatique des erreurs
 * - Type-safe
 */

export async function submitRSVP(
  formData: FormData
): Promise<RSVPActionResult> {
  try {
    // 1. Extraire les données du FormData
    const rsvpId = formData.get("id") as string | null;
    let familyMembers = [];
    const familyMembersRaw = formData.get("family_members") as string;
    if (familyMembersRaw) {
      familyMembers = JSON.parse(familyMembersRaw);
    }

    const rawData = {
      guest_name: formData.get("guest_name") as string,
      guest_email: (formData.get("guest_email") as string) || "",
      guest_phone: (formData.get("guest_phone") as string) || "",
      attending: formData.get("attending") === "true",
      dietary_restrictions: (formData.get("dietary_restrictions") as string) || "",
      allergies: (formData.get("allergies") as string) || "",
      special_needs: (formData.get("special_needs") as string) || "",
      message: (formData.get("message") as string) || "",
      family_members: familyMembers,
    };

    // 2. Validation avec zod
    const validatedData = rsvpSchema.parse(rawData);

    // 3. Si on édite (ID fourni), faire une mise à jour directe
    if (rsvpId) {
      const { data: updateData, error: updateError } = await supabase
        .from("rsvp")
        .update({
          guest_name: validatedData.guest_name,
          guest_email: validatedData.guest_email || null,
          guest_phone: validatedData.guest_phone || null,
          attending: validatedData.attending,
          dietary_restrictions: validatedData.dietary_restrictions || null,
          allergies: validatedData.allergies || null,
          special_needs: validatedData.special_needs || null,
          message: validatedData.message || null,
          family_members: validatedData.family_members?.length > 0 ? validatedData.family_members : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", rsvpId)
        .select();

      if (updateError) {
        console.error("Error updating RSVP:", updateError);
        return {
          success: false,
          message: "Impossible de mettre à jour votre réponse. Veuillez réessayer.",
        };
      }

      revalidatePath("/");

      return {
        success: true,
        message: "Réponse mise à jour avec succès ! 🎉",
        rsvp: updateData?.[0] || null,
      };
    }

    // 4. Sinon, vérifier si l'email existe déjà (anti-doublon pour création)
    // Si pas d'email, générer un identifiant unique basé sur le nom
    const lookupEmail = validatedData.guest_email || `guest-${validatedData.guest_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const { data: existingRSVP, error: checkError } = await supabase
      .from("rsvp")
      .select("id, guest_name")
      .eq("guest_email", lookupEmail)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing RSVP:", checkError);
      return {
        success: false,
        message: "Une erreur est survenue. Veuillez réessayer.",
      };
    }

    // Si l'email existe déjà, mettre à jour au lieu d'insérer
    if (existingRSVP) {
      const { data: updateData, error: updateError } = await supabase
        .from("rsvp")
        .update({
          guest_name: validatedData.guest_name,
          guest_phone: validatedData.guest_phone || null,
          attending: validatedData.attending,
          dietary_restrictions: validatedData.dietary_restrictions || null,
          allergies: validatedData.allergies || null,
          special_needs: validatedData.special_needs || null,
          message: validatedData.message || null,
          family_members: validatedData.family_members?.length > 0 ? validatedData.family_members : null,
          updated_at: new Date().toISOString(),
        })
        .eq("guest_email", lookupEmail)
        .select();

      if (updateError) {
        console.error("Error updating RSVP:", updateError);
        return {
          success: false,
          message: "Impossible de mettre à jour votre réponse. Veuillez réessayer.",
        };
      }

      // Revalidation du cache Next.js
      revalidatePath("/");

      return {
        success: true,
        message: "Votre réponse a été mise à jour avec succès ! 🎉",
        rsvp: updateData?.[0] || null,
      };
    }

    // 4. Insérer dans Supabase
    const { data: insertedData, error: insertError } = await supabase.from("rsvp").insert({
      guest_name: validatedData.guest_name,
      guest_email: validatedData.guest_email || null,
      guest_phone: validatedData.guest_phone || null,
      attending: validatedData.attending,
      dietary_restrictions: validatedData.dietary_restrictions || null,
      allergies: validatedData.allergies || null,
      special_needs: validatedData.special_needs || null,
      message: validatedData.message || null,
      family_members: validatedData.family_members?.length > 0 ? validatedData.family_members : null,
    }).select();

    if (insertError) {
      console.error("Error inserting RSVP:", insertError);

      // Message d'erreur personnalisé selon le code
      if (insertError.code === "23505") {
        // Duplicate key
        return {
          success: false,
          message: "Cet email a déjà été utilisé pour une réponse.",
        };
      }

      return {
        success: false,
        message: "Impossible d'enregistrer votre réponse. Veuillez réessayer.",
      };
    }

    // 5. Revalidation du cache Next.js (pour mettre à jour les stats si affichées)
    revalidatePath("/");

    // 6. Succès !
    return {
      success: true,
      message: validatedData.attending
        ? "Merci pour votre confirmation ! Nous avons hâte de vous voir ! 🎉"
        : "Merci de nous avoir prévenus. Vous allez nous manquer ! 💔",
      rsvp: insertedData?.[0] || null,
    };
  } catch (error) {
    // Erreur de validation zod
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      // Formater les erreurs zod pour le client
      error.issues.forEach((err) => {
        const field = err.path[0]?.toString() || "general";
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(err.message);
      });

      console.error("Validation errors:", errors);
      return {
        success: false,
        message: "Veuillez corriger les erreurs dans le formulaire.",
        errors,
      };
    }

    // Erreur générique
    console.error("Unexpected error in submitRSVP:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
    };
  }
}

/**
 * SERVER ACTION : VÉRIFIER SI UN EMAIL A DÉJÀ RÉPONDU
 * 
 * Utilisé pour afficher un message si l'utilisateur a déjà répondu.
 * (Optionnel - pour l'UX)
 */
export async function checkExistingRSVP(
  email: string
): Promise<{ exists: boolean; name?: string }> {
  try {
    const { data, error } = await supabase
      .from("rsvp")
      .select("guest_name")
      .eq("guest_email", email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking RSVP:", error);
      return { exists: false };
    }

    return {
      exists: !!data,
      name: data?.guest_name,
    };
  } catch (error) {
    console.error("Unexpected error in checkExistingRSVP:", error);
    return { exists: false };
  }
}
