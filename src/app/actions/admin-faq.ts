"use server";

import { supabase } from "@/lib/supabase/client";

/**
 * SERVER ACTIONS : CRUD FAQ
 * 
 * Gère les opérations Create, Read, Update, Delete sur la table FAQ
 */

// READ - Récupérer toutes les FAQs
export async function getFAQs() {
  try {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, data: [], message: `Supabase error: ${error.message}` };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Exception in getFAQs:", error);
    return { success: false, data: [], message: `Exception: ${error?.message || String(error)}` };
  }
}

// CREATE - Ajouter une nouvelle FAQ
export async function createFAQ(formData: FormData) {
  try {
    const question_fr = formData.get("question_fr") as string;
    const answer_fr = formData.get("answer_fr") as string;
    const category_fr = formData.get("category_fr") as string;
    const question_pt = formData.get("question_pt") as string;
    const answer_pt = formData.get("answer_pt") as string;
    const category_pt = formData.get("category_pt") as string;

    const { error } = await supabase.from("faq").insert([
      {
        question_fr,
        answer_fr,
        category_fr,
        question_pt,
        answer_pt,
        category_pt,
      },
    ]);

    if (error) throw error;
    return { success: true, message: "FAQ créée avec succès" };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, message: "Erreur lors de la création de la FAQ" };
  }
}

// UPDATE - Mettre à jour une FAQ
export async function updateFAQ(id: string, formData: FormData) {
  try {
    const updates = {
      question_fr: formData.get("question_fr") as string,
      answer_fr: formData.get("answer_fr") as string,
      category_fr: formData.get("category_fr") as string,
      question_pt: formData.get("question_pt") as string,
      answer_pt: formData.get("answer_pt") as string,
      category_pt: formData.get("category_pt") as string,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("faq").update(updates).eq("id", id);

    if (error) throw error;
    return { success: true, message: "FAQ mise à jour avec succès" };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, message: "Erreur lors de la mise à jour de la FAQ" };
  }
}

// DELETE - Supprimer une FAQ
export async function deleteFAQ(id: string) {
  try {
    const { error } = await supabase.from("faq").delete().eq("id", id);

    if (error) throw error;
    return { success: true, message: "FAQ supprimée avec succès" };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, message: "Erreur lors de la suppression de la FAQ" };
  }
}

// COUNT - Récupérer le nombre de FAQs
export async function getFAQCount() {
  try {
    const { count, error } = await supabase
      .from("faq")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error counting FAQs:", error);
    return { success: false, count: 0 };
  }
}
