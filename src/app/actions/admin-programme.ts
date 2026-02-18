"use server";

import { supabase } from "@/lib/supabase/client";

/**
 * SERVER ACTIONS : CRUD PROGRAMME
 * 
 * Gère les opérations Create, Read, Update, Delete sur la table Programme
 */

// READ - Récupérer tous les événements
export async function getProgramme() {
  try {
    const { data, error } = await supabase
      .from("programme")
      .select("*")
      .order("event_time", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, data: [], message: `Supabase error: ${error.message}` };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Exception in getProgramme:", error);
    return { success: false, data: [], message: `Exception: ${error?.message || String(error)}` };
  }
}

// CREATE - Ajouter un nouvel événement
export async function createProgrammeEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const event_time = formData.get("event_time") as string;
    const duration_minutes = formData.get("duration_minutes") as string;
    const location = formData.get("location") as string;
    const icon = formData.get("icon") as string;
    const title_fr = formData.get("title_fr") as string;
    const description_fr = formData.get("description_fr") as string;
    const title_pt = formData.get("title_pt") as string;
    const description_pt = formData.get("description_pt") as string;

    const { error } = await supabase.from("programme").insert([
      {
        title,
        description,
        event_time,
        duration_minutes: duration_minutes ? parseInt(duration_minutes) : null,
        location,
        icon,
        title_fr,
        description_fr,
        title_pt,
        description_pt,
      },
    ]);

    if (error) throw error;
    return { success: true, message: "Événement créé avec succès" };
  } catch (error) {
    console.error("Error creating programme event:", error);
    return { success: false, message: "Erreur lors de la création de l'événement" };
  }
}

// UPDATE - Mettre à jour un événement
export async function updateProgrammeEvent(id: string, formData: FormData) {
  try {
    const duration_minutes_raw = formData.get("duration_minutes") as string;
    
    const updates = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      event_time: formData.get("event_time") as string,
      duration_minutes: duration_minutes_raw ? parseInt(duration_minutes_raw) : null,
      location: formData.get("location") as string,
      icon: formData.get("icon") as string,
      title_fr: formData.get("title_fr") as string,
      description_fr: formData.get("description_fr") as string,
      title_pt: formData.get("title_pt") as string,
      description_pt: formData.get("description_pt") as string,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("programme")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return { success: true, message: "Événement mis à jour avec succès" };
  } catch (error) {
    console.error("Error updating programme event:", error);
    return { success: false, message: "Erreur lors de la mise à jour de l'événement" };
  }
}

// DELETE - Supprimer un événement
export async function deleteProgrammeEvent(id: string) {
  try {
    const { error } = await supabase.from("programme").delete().eq("id", id);

    if (error) throw error;
    return { success: true, message: "Événement supprimé avec succès" };
  } catch (error) {
    console.error("Error deleting programme event:", error);
    return { success: false, message: "Erreur lors de la suppression de l'événement" };
  }
}

// COUNT - Récupérer le nombre d'événements
export async function getProgrammeCount() {
  try {
    const { count, error } = await supabase
      .from("programme")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error counting programme events:", error);
    return { success: false, count: 0 };
  }
}

