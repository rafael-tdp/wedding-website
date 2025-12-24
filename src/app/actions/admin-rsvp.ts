"use server";

import { supabase } from "@/lib/supabase/client";

/**
 * SERVER ACTIONS : CRUD RSVP
 * 
 * Gère les opérations Read, Update, Delete sur la table RSVP
 * (Les creates sont gérées via le formulaire public)
 */

// READ - Récupérer tous les RSVPs
export async function getRSVPs() {
  try {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return { success: false, message: "Erreur lors de la récupération des RSVPs" };
  }
}

// READ - Récupérer les statistiques RSVPs
export async function getRSVPStats() {
  try {
    const { data, error } = await supabase
      .from("rsvps")
      .select("attending");

    if (error) throw error;

    const total = data?.length || 0;
    const attending = data?.filter((r) => r.attending === true).length || 0;
    const notAttending = data?.filter((r) => r.attending === false).length || 0;
    const pending = data?.filter((r) => r.attending === null).length || 0;

    return {
      success: true,
      stats: {
        total,
        attending,
        notAttending,
        pending,
        attendanceRate:
          total > 0 ? Math.round((attending / total) * 100) : 0,
      },
    };
  } catch (error) {
    console.error("Error fetching RSVP stats:", error);
    return { success: false, message: "Erreur lors de la récupération des statistiques" };
  }
}

// UPDATE - Mettre à jour un RSVP (noter, réappliquer)
export async function updateRSVP(id: string, formData: FormData) {
  try {
    const updates = {
      attending: formData.get("attending") === "true" ? true : formData.get("attending") === "false" ? false : null,
      notes: formData.get("notes") as string,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("rsvps")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return { success: true, message: "RSVP mis à jour avec succès" };
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return { success: false, message: "Erreur lors de la mise à jour du RSVP" };
  }
}

// DELETE - Supprimer un RSVP
export async function deleteRSVP(id: string) {
  try {
    const { error } = await supabase.from("rsvps").delete().eq("id", id);

    if (error) throw error;
    return { success: true, message: "RSVP supprimé avec succès" };
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return { success: false, message: "Erreur lors de la suppression du RSVP" };
  }
}
