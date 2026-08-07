"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

/**
 * SERVER ACTION : LOGIN ADMIN
 * Vérifie les credentials et crée une session
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, message: "Configuration Supabase manquante" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authentifier avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return {
        success: false,
        message: "Email ou mot de passe incorrect",
      };
    }

    // Créer un cookie de session
    const cookieStore = await cookies();
    cookieStore.set("admin_auth_token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    return { success: true, message: "Connecté avec succès" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Erreur lors de la connexion" };
  }
}

/**
 * SERVER ACTION : LOGOUT ADMIN
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth_token");
}

/**
 * SERVER ACTION : RÉCUPÉRER LES RSVPS
 */
export async function fetchRSVPs(): Promise<
  {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_phone?: string;
    attending: boolean;
    plus_one: boolean;
    plus_one_name?: string;
    dietary_restrictions?: string;
    allergies?: string;
    special_needs?: string;
    message?: string;
    family_members?: Array<{
      name: string;
      attending: boolean;
      isChild: boolean;
      age?: number;
      dietary_restrictions?: string;
      allergies?: string;
    }>;
    created_at: string;
    updated_at: string;
  }[]
> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase config missing");
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("rsvp")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching RSVPs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching RSVPs:", error);
    return [];
  }
}

/**
 * SERVER ACTION : EXPORTER EN CSV
 */
export async function exportRSVPsAsCSV(): Promise<string> {
  try {
    const rsvps = await fetchRSVPs();

    if (rsvps.length === 0) {
      return "";
    }

    const csvCell = (value: unknown): string => {
      const normalized = value === null || value === undefined ? "" : String(value);
      return `"${normalized.replace(/"/g, '""')}"`;
    };

    const csvPhoneCell = (value: unknown): string => {
      const normalized = value === null || value === undefined ? "" : String(value).trim();

      if (!normalized) {
        return csvCell("");
      }

      const escaped = normalized.replace(/"/g, '""');
      return `"=""${escaped}"""`;
    };

    const formatDateTime = (dateString: string): string => {
      return new Date(dateString).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const toBoolean = (value: unknown, defaultValue = false): boolean => {
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value === 1;
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "oui", "yes", "y"].includes(normalized)) return true;
        if (["false", "0", "non", "no", "n"].includes(normalized)) return false;
      }
      return defaultValue;
    };

    const getFamilyMembers = (value: unknown): Array<{
      name?: string;
      attending?: unknown;
      isChild?: boolean;
      age?: number;
      dietary_restrictions?: string;
      allergies?: string;
    }> => {
      if (Array.isArray(value)) return value;

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }

      return [];
    };

    // En-têtes CSV
    const headers = [
      "Nom",
      "Email",
      "Téléphone",
      "Présent",
      "Type",
      "Âge",
      "Restrictions alimentaires",
      "Allergies",
      "Besoins spéciaux",
      "Date",
    ];

    // Rows CSV
    const rows: string[][] = [];

    rsvps.forEach((rsvp) => {
      rows.push([
        csvCell(rsvp.guest_name),
        csvCell(rsvp.guest_email),
        csvPhoneCell(rsvp.guest_phone),
        csvCell(rsvp.attending ? "Oui" : "Non"),
        csvCell("Adulte"),
        csvCell(""),
        csvCell(rsvp.dietary_restrictions),
        csvCell(rsvp.allergies),
        csvCell(rsvp.special_needs),
        csvCell(formatDateTime(rsvp.created_at)),
      ]);

      const familyMembers = getFamilyMembers(rsvp.family_members);

      familyMembers.forEach((member) => {
        rows.push([
          csvCell(member.name),
          csvCell(""),
          csvCell(""),
          csvCell(toBoolean(member.attending, true) ? "Oui" : "Non"),
          csvCell(member.isChild ? "Enfant" : "Adulte"),
          csvCell(member.isChild ? member.age ?? "" : ""),
          csvCell(member.dietary_restrictions),
          csvCell(member.allergies),
          csvCell(""),
          csvCell(formatDateTime(rsvp.created_at)),
        ]);
      });
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    return csv;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return "";
  }
}

/**
 * SERVER ACTION : APPROUVER UNE PHOTO
 */
export async function approvePhoto(
  photoId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, message: "Configuration Supabase manquante" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("photos")
      .update({ is_approved: true, is_visible: true })
      .eq("id", photoId);

    if (error) {
      console.error("Error approving photo:", error);
      return { success: false, message: "Erreur lors de l'approbation" };
    }

    return { success: true, message: "Photo approuvée" };
  } catch (error) {
    console.error("Unexpected error approving photo:", error);
    return { success: false, message: "Erreur inattendue" };
  }
}

/**
 * SERVER ACTION : REJETER UNE PHOTO
 */
export async function rejectPhoto(
  photoId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, message: "Configuration Supabase manquante" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      console.error("Error rejecting photo:", error);
      return { success: false, message: "Erreur lors du rejet" };
    }

    return { success: true, message: "Photo rejetée" };
  } catch (error) {
    console.error("Unexpected error rejecting photo:", error);
    return { success: false, message: "Erreur inattendue" };
  }
}

/**
 * SERVER ACTION : SUPPRIMER UN RSVP
 */
export async function deleteRSVP(rsvpId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const { error } = await supabase
      .from("rsvp")
      .delete()
      .eq("id", rsvpId);

    if (error) {
      console.error("Error deleting RSVP:", error);
      return { success: false, message: "Erreur lors de la suppression" };
    }

    return { success: true, message: "Invité supprimé avec succès" };
  } catch (error) {
    console.error("Unexpected error deleting RSVP:", error);
    return { success: false, message: "Erreur inattendue" };
  }
}

/**
 * SERVER ACTION : DÉSACTIVER/ACTIVER UNE PHOTO (la rendre invisible/visible)
 */
export async function hidePhoto(
  photoId: string,
  isVisible: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, message: "Configuration Supabase manquante" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("photos")
      .update({ is_visible: isVisible })
      .eq("id", photoId);

    if (error) {
      console.error("Error toggling photo visibility:", error);
      return { success: false, message: "Erreur lors de la modification" };
    }

    return { success: true, message: "Photo modifiée" };
  } catch (error) {
    console.error("Unexpected error toggling photo visibility:", error);
    return { success: false, message: "Erreur inattendue" };
  }
}

/**
 * SERVER ACTION : SUPPRIMER UNE PHOTO
 */
export async function deletePhoto(
  photoId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, message: "Configuration Supabase manquante" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      console.error("Error deleting photo:", error);
      return { success: false, message: "Erreur lors de la suppression" };
    }

    return { success: true, message: "Photo supprimée avec succès" };
  } catch (error) {
    console.error("Unexpected error deleting photo:", error);
    return { success: false, message: "Erreur inattendue" };
  }
}

// ============================================
// SERVER ACTIONS : PARAMÈTRES DU SITE
// ============================================

export type GalleryVisibilityMode = "auto" | "visible" | "hidden";

/**
 * SERVER ACTION : METTRE À JOUR LA VISIBILITÉ DE LA GALERIE
 */
export async function updateGalleryVisibility(
  mode: GalleryVisibilityMode
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, message: "Configuration Supabase manquante" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, gallery_visibility: mode });

    if (error) {
      console.error("Error updating gallery visibility:", error);
      return { success: false, message: "Erreur lors de la mise à jour" };
    }

    return { success: true, message: "Réglage mis à jour avec succès" };
  } catch (error) {
    console.error("Unexpected error updating gallery visibility:", error);
    return { success: false, message: "Erreur inattendue" };
  }
}
