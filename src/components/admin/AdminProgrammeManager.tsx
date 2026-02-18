"use client";

import { useState, useTransition, useEffect } from "react";
import { getProgramme, createProgrammeEvent, updateProgrammeEvent, deleteProgrammeEvent } from "@/app/actions/admin-programme";
import { AdminFormModal } from "./AdminFormModal";
import ProgrammeCard from "./ProgrammeCard";
import { PROGRAMME_ICON_OPTIONS } from "@/lib/config/programme-icons";

interface ProgrammeEvent {
  id: string;
  title: string;
  description: string;
  event_time: string;
  duration_minutes?: number;
  location: string;
  address?: string;
  icon?: string;
  display_order: number;
  is_visible: boolean;
  title_fr: string;
  description_fr: string;
  title_pt: string;
  description_pt: string;
}

/**
 * COMPOSANT : ADMIN PROGRAMME MANAGEMENT
 */
export default function AdminProgrammeManager({ showCreateForm, setShowCreateForm, showEditForm, setShowEditForm }: { showCreateForm: boolean; setShowCreateForm: (show: boolean) => void; showEditForm: boolean; setShowEditForm: (show: boolean) => void }) {
  const [events, setEvents] = useState<ProgrammeEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_time: "",
    duration_minutes: "",
    location: "",
    address: "",
    display_order: 0,
    icon: "",
    title_fr: "",
    description_fr: "",
    title_pt: "",
    description_pt: "",
  });

  // Charger les événements au montage
  useEffect(() => {
    startTransition(async () => {
      const result = await getProgramme();
      if (result.success && result.data !== undefined) {
        setEvents(result.data);
      }
    });
  }, []);

  const handleLoadEvents = () => {
    startTransition(async () => {
      const result = await getProgramme();
      if (result.success && result.data) {
        setEvents(result.data);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    startTransition(async () => {
      const result = editingId
        ? await updateProgrammeEvent(editingId, data)
        : await createProgrammeEvent(data);

      if (result.success) {
        setFormData({
          title: "",
          description: "",
          event_time: "",
          duration_minutes: "",
          location: "",
          address: "",
          display_order: 0,
          icon: "",
          title_fr: "",
          description_fr: "",
          title_pt: "",
          description_pt: "",
        });
        setEditingId(null);
        setShowCreateForm(false);
        setShowEditForm(false);
        handleLoadEvents();
      } else {
        alert(result.message || "Erreur lors de l'opération");
      }
    });
  };

  const handleEdit = (event: ProgrammeEvent) => {
    setFormData({
      title: event.title || "",
      description: event.description || "",
      event_time: event.event_time || "",
      duration_minutes: event.duration_minutes ? String(event.duration_minutes) : "",
      location: event.location || "",
      address: event.address || "",
      display_order: event.display_order,
      icon: event.icon || "",
      title_fr: event.title_fr || "",
      description_fr: event.description_fr || "",
      title_pt: event.title_pt || "",
      description_pt: event.description_pt || "",
    });
    setEditingId(event.id);
    setShowEditForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      startTransition(async () => {
        const result = await deleteProgrammeEvent(id);
        if (result.success) {
          handleLoadEvents();
        }
      });
    }
  };

  return (
    <>
      {/* Modal pour ajouter un événement */}
      <AdminFormModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Ajouter un événement"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Créer"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre (FR)</label>
            <input
              type="text"
              value={formData.title_fr}
              onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Titre (PT)</label>
            <input
              type="text"
              value={formData.title_pt}
              onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description (FR)</label>
            <textarea
              value={formData.description_fr}
              onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (PT)</label>
            <textarea
              value={formData.description_pt}
              onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heure</label>
            <input
              type="time"
              value={formData.event_time}
              onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Icône</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PROGRAMME_ICON_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, icon: value })}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-1 ${
                  formData.icon === value
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </AdminFormModal>

      {/* Modal pour modifier un événement */}
      <AdminFormModal
        isOpen={showEditForm}
        onClose={() => {
          setEditingId(null);
          setShowEditForm(false);
          setFormData({
            title: "",
            description: "",
            event_time: "",
            duration_minutes: "",
            location: "",
            address: "",
            display_order: 0,
            icon: "",
            title_fr: "",
            description_fr: "",
            title_pt: "",
            description_pt: "",
          });
        }}
        title="Modifier l'événement"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Mettre à jour"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre (FR)</label>
            <input
              type="text"
              value={formData.title_fr}
              onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Titre (PT)</label>
            <input
              type="text"
              value={formData.title_pt}
              onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description (FR)</label>
            <textarea
              value={formData.description_fr}
              onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (PT)</label>
            <textarea
              value={formData.description_pt}
              onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heure</label>
            <input
              type="time"
              value={formData.event_time}
              onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Icône</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PROGRAMME_ICON_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, icon: value })}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-1 ${
                  formData.icon === value
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </AdminFormModal>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-muted">Aucun événement pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <ProgrammeCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
