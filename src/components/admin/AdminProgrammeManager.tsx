"use client";

import { useState, useTransition, useEffect } from "react";
import { getProgramme, createProgrammeEvent, updateProgrammeEvent, deleteProgrammeEvent } from "@/app/actions/admin-programme";
import Button from "@/components/ui/Button";

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
export default function AdminProgrammeManager({ showForm, setShowForm }: { showForm: boolean; setShowForm: (show: boolean) => void }) {
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
        setShowForm(false);
        handleLoadEvents();
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
    setShowForm(true);
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
      {/* Liste ou Formulaire d'édition */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-muted">Aucun événement pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) =>
            editingId === event.id ? (
              /* Formulaire d'édition à la place de l'élément */
              <form key={event.id} onSubmit={handleSubmit} className="bg-background-soft p-4 sm:p-6 rounded-lg space-y-4 border border-primary">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-3 gap-4">
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

          <Button type="submit" disabled={isLoading}>
            {editingId ? "Mettre à jour" : "Créer"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
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
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
              </form>
            ) : (
              /* Affichage normal de l'élément */
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">{event.title_fr}</h3>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                      <span>{event.event_time}{event.duration_minutes ? ` (${event.duration_minutes}min)` : ""}</span>
                      {event.location && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>
                    {event.description_fr && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.description_fr}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(event)}
                      title="Modifier"
                      className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 rounded transition-all text-sm"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      title="Supprimer"
                      className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 rounded transition-all text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}
