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

    // En-têtes CSV
    const headers = [
      "Nom",
      "Email",
      "Téléphone",
      "Présent",
      "Accompagnant",
      "Nom accompagnant",
      "Restrictions alimentaires",
      "Allergies",
      "Besoins spéciaux",
      "Message",
      "Date",
    ];

    // Rows CSV
    const rows = rsvps.map((rsvp) => [
      `"${rsvp.guest_name.replace(/"/g, '""')}"`,
      `"${rsvp.guest_email}"`,
      `"${rsvp.guest_phone || ""}"`,
      rsvp.attending ? "Oui" : "Non",
      rsvp.plus_one ? "Oui" : "Non",
      `"${rsvp.plus_one_name || ""}"`,
      `"${rsvp.dietary_restrictions || ""}"`,
      `"${rsvp.allergies || ""}"`,
      `"${rsvp.special_needs || ""}"`,
      `"${(rsvp.message || "").replace(/"/g, '""')}"`,
      new Date(rsvp.created_at).toLocaleDateString("fr-FR"),
    ]);

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
