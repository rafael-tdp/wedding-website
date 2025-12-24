"use server";

import { supabase } from "@/lib/supabase/client";

/**
 * SERVER ACTIONS : CRUD HEBERGEMENTS
 * 
 * Gère les opérations Create, Read, Update, Delete sur la table Hebergements
 */

// READ - Récupérer tous les hébergements
export async function getHebergements() {
  try {
    const { data, error } = await supabase
      .from("hebergements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, data: [], message: `Supabase error: ${error.message}` };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Exception in getHebergements:", error);
    return { success: false, data: [], message: `Exception: ${error?.message || String(error)}` };
  }
}

// CREATE - Ajouter un nouvel hébergement
export async function createHebergement(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const image_url = formData.get("image_url") as string;
    const name_fr = formData.get("name_fr") as string;
    const description_fr = formData.get("description_fr") as string;
    const price_note_fr = formData.get("price_note_fr") as string;
    const name_pt = formData.get("name_pt") as string;
    const description_pt = formData.get("description_pt") as string;
    const price_note_pt = formData.get("price_note_pt") as string;

    const { error } = await supabase.from("hebergements").insert([
      {
        name,
        description,
        price,
        phone,
        website,
        image_url: image_url || null,
        name_fr,
        description_fr,
        price_note_fr,
        name_pt,
        description_pt,
        price_note_pt,
      },
    ]);

    if (error) throw error;
    return { success: true, message: "Hébergement créé avec succès" };
  } catch (error) {
    console.error("Error creating hebergement:", error);
    return { success: false, message: "Erreur lors de la création de l'hébergement" };
  }
}

// UPDATE - Mettre à jour un hébergement
export async function updateHebergement(id: string, formData: FormData) {
  try {
    const image_url = formData.get("image_url") as string;
    const updates = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      image_url: image_url || null,
      name_fr: formData.get("name_fr") as string,
      description_fr: formData.get("description_fr") as string,
      price_note_fr: formData.get("price_note_fr") as string,
      name_pt: formData.get("name_pt") as string,
      description_pt: formData.get("description_pt") as string,
      price_note_pt: formData.get("price_note_pt") as string,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("hebergements")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return { success: true, message: "Hébergement mis à jour avec succès" };
  } catch (error) {
    console.error("Error updating hebergement:", error);
    return { success: false, message: "Erreur lors de la mise à jour de l'hébergement" };
  }
}

// DELETE - Supprimer un hébergement
export async function deleteHebergement(id: string) {
  try {
    const { error } = await supabase.from("hebergements").delete().eq("id", id);

    if (error) throw error;
    return { success: true, message: "Hébergement supprimé avec succès" };
  } catch (error) {
    console.error("Error deleting hebergement:", error);
    return { success: false, message: "Erreur lors de la suppression de l'hébergement" };
  }
}

// COUNT - Récupérer le nombre d'hébergements
export async function getHebergementCount() {
  try {
    const { count, error } = await supabase
      .from("hebergements")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error counting hebergements:", error);
    return { success: false, count: 0 };
  }
}

