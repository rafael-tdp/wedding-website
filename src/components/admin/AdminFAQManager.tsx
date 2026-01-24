"use client";

import { useState, useTransition, useEffect } from "react";
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from "@/app/actions/admin-faq";
import Button from "@/components/ui/Button";
import { AdminFormModal } from "./AdminFormModal";
import { Title } from "../ui";
import FAQCard from "./FAQCard";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  question_fr: string;
  answer_fr: string;
  category_fr: string;
  question_pt: string;
  answer_pt: string;
  category_pt: string;
}

/**
 * COMPOSANT : ADMIN FAQ MANAGEMENT
 * 
 * Permet de gérer les FAQs (CRUD complet)
 */
export default function AdminFAQManager({ showCreateForm, setShowCreateForm, showEditForm, setShowEditForm }: { showCreateForm: boolean; setShowCreateForm: (show: boolean) => void; showEditForm: boolean; setShowEditForm: (show: boolean) => void }) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    question_fr: "",
    answer_fr: "",
    category_fr: "",
    question_pt: "",
    answer_pt: "",
    category_pt: "",
  });

  // Charger les FAQs au montage
  useEffect(() => {
    startTransition(async () => {
      const result = await getFAQs();
      if (result.success && result.data !== undefined) {
        setFaqs(result.data);
      }
    });
  }, []);

  const handleLoadFAQs = () => {
    startTransition(async () => {
      const result = await getFAQs();
      if (result.success && result.data) {
        setFaqs(result.data);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    startTransition(async () => {
      const result = editingId
        ? await updateFAQ(editingId, data)
        : await createFAQ(data);

      if (result.success) {
        setFormData({
          question_fr: "",
          answer_fr: "",
          category_fr: "",
          question_pt: "",
          answer_pt: "",
          category_pt: "",
        });
        setEditingId(null);
        setShowCreateForm(false);
        setShowEditForm(false);
        handleLoadFAQs();
      } else {
        alert(result.message || "Erreur lors de l'opération");
      }
    });
  };

  const handleEdit = (faq: FAQItem) => {
    setFormData({
      question_fr: faq.question_fr || "",
      answer_fr: faq.answer_fr || "",
      category_fr: faq.category_fr || "",
      question_pt: faq.question_pt || "",
      answer_pt: faq.answer_pt || "",
      category_pt: faq.category_pt || "",
    });
    setEditingId(faq.id);
    setShowEditForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      startTransition(async () => {
        const result = await deleteFAQ(id);
        if (result.success) {
          handleLoadFAQs();
        }
      });
    }
  };

  return (
    <>
      {/* Modal pour ajouter une FAQ */}
      <AdminFormModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Ajouter une FAQ"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Créer"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question (FR)</label>
            <input
              type="text"
              value={formData.question_fr}
              onChange={(e) => setFormData({ ...formData, question_fr: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Question (PT)</label>
            <input
              type="text"
              value={formData.question_pt}
              onChange={(e) => setFormData({ ...formData, question_pt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie (FR)</label>
            <input
              type="text"
              value={formData.category_fr}
              onChange={(e) => setFormData({ ...formData, category_fr: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie (PT)</label>
            <input
              type="text"
              value={formData.category_pt}
              onChange={(e) => setFormData({ ...formData, category_pt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Réponse (FR)</label>
            <textarea
              value={formData.answer_fr}
              onChange={(e) => setFormData({ ...formData, answer_fr: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réponse (PT)</label>
            <textarea
              value={formData.answer_pt}
              onChange={(e) => setFormData({ ...formData, answer_pt: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </AdminFormModal>

      {/* Modal pour modifier une FAQ */}
      <AdminFormModal
        isOpen={editingId !== null}
        onClose={() => {
          setEditingId(null);
          setShowEditForm(false);
          setFormData({
            question_fr: "",
            answer_fr: "",
            category_fr: "",
            question_pt: "",
            answer_pt: "",
            category_pt: "",
          });
        }}
        title="Modifier la FAQ"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Mettre à jour"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question (FR)</label>
            <input
              type="text"
              value={formData.question_fr}
              onChange={(e) => setFormData({ ...formData, question_fr: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Question (PT)</label>
            <input
              type="text"
              value={formData.question_pt}
              onChange={(e) => setFormData({ ...formData, question_pt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie (FR)</label>
            <input
              type="text"
              value={formData.category_fr}
              onChange={(e) => setFormData({ ...formData, category_fr: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie (PT)</label>
            <input
              type="text"
              value={formData.category_pt}
              onChange={(e) => setFormData({ ...formData, category_pt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Réponse (FR)</label>
            <textarea
              value={formData.answer_fr}
              onChange={(e) => setFormData({ ...formData, answer_fr: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réponse (PT)</label>
            <textarea
              value={formData.answer_pt}
              onChange={(e) => setFormData({ ...formData, answer_pt: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </AdminFormModal>
      {faqs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-muted">Aucune FAQ pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQCard
              key={faq.id}
              faq={faq}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
