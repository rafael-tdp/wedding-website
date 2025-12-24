"use client";

import { useState, useTransition, useEffect } from "react";
import { getHebergements, createHebergement, updateHebergement, deleteHebergement } from "@/app/actions/admin-hebergements";
import Button from "@/components/ui/Button";

interface Hebergement {
  id: string;
  name: string;
  description: string;
  price: string;
  phone: string;
  website: string;
  image_url: string;
  name_fr: string;
  description_fr: string;
  price_note_fr: string;
  name_pt: string;
  description_pt: string;
  price_note_pt: string;
}

/**
 * COMPOSANT : ADMIN HEBERGEMENTS MANAGEMENT
 */
export default function AdminHebergementManager({ showForm, setShowForm }: { showForm: boolean; setShowForm: (show: boolean) => void }) {
  const [hebergements, setHebergements] = useState<Hebergement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    phone: "",
    website: "",
    image_url: "",
    name_fr: "",
    description_fr: "",
    price_note_fr: "",
    name_pt: "",
    description_pt: "",
    price_note_pt: "",
  });

  // Charger les hébergements au montage
  useEffect(() => {
    startTransition(async () => {
      const result = await getHebergements();
      if (result.success && result.data !== undefined) {
        setHebergements(result.data);
      }
    });
  }, []);

  const handleLoadHebergements = () => {
    startTransition(async () => {
      const result = await getHebergements();
      if (result.success && result.data) {
        setHebergements(result.data);
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
        ? await updateHebergement(editingId, data)
        : await createHebergement(data);

      if (result.success) {
        setFormData({
          name: "",
          description: "",
          price: "",
          phone: "",
          website: "",
          image_url: "",
          name_fr: "",
          description_fr: "",
          price_note_fr: "",
          name_pt: "",
          description_pt: "",
          price_note_pt: "",
        });
        setEditingId(null);
        setShowForm(false);
        handleLoadHebergements();
      }
    });
  };

  const handleEdit = (hebergement: Hebergement) => {
    setFormData({
      name: hebergement.name || "",
      description: hebergement.description || "",
      price: hebergement.price || "",
      phone: hebergement.phone || "",
      website: hebergement.website || "",
      image_url: hebergement.image_url || "",
      name_fr: hebergement.name_fr || "",
      description_fr: hebergement.description_fr || "",
      price_note_fr: hebergement.price_note_fr || "",
      name_pt: hebergement.name_pt || "",
      description_pt: hebergement.description_pt || "",
      price_note_pt: hebergement.price_note_pt || "",
    });
    setEditingId(hebergement.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      startTransition(async () => {
        const result = await deleteHebergement(id);
        if (result.success) {
          handleLoadHebergements();
        }
      });
    }
  };

  return (
    <>
      {/* Liste ou Formulaire d'édition */}
      {hebergements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-muted">Aucun hébergement pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hebergements.map((hebergement) =>
            editingId === hebergement.id ? (
              /* Formulaire d'édition à la place de l'élément */
              <form key={hebergement.id} onSubmit={handleSubmit} className="p-4 sm:p-6 rounded-lg space-y-4 border border-primary bg-background-soft">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom (FR)</label>
                    <input
                      type="text"
                      value={formData.name_fr}
                      onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nom (PT)</label>
              <input
                type="text"
                value={formData.name_pt}
                onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description (FR)</label>
              <textarea
                value={formData.description_fr || ""}
                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (PT)</label>
              <textarea
                value={formData.description_pt || ""}
                onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="€50/nuit"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Site web</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL de l&apos;image</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {formData.image_url && (
              <div className="mt-2 w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={formData.image_url}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23eee' width='100' height='100'/%3E%3Ctext x='50' y='50' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3EErreur image%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {editingId ? "Mettre à jour" : "Créer"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                price: "",
                phone: "",
                website: "",
                image_url: "",
                name_fr: "",
                description_fr: "",
                price_note_fr: "",
                name_pt: "",
                description_pt: "",
                price_note_pt: "",
              });
            }}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
              </form>
            ) : (
              /* Affichage normal de l'élément */
              <div key={hebergement.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  {hebergement.image_url && (
                    <div className="w-full sm:w-40 sm:h-40 flex-shrink-0">
                      <img
                        src={hebergement.image_url}
                        alt={hebergement.name_fr}
                        className="w-full h-40 sm:h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900">{hebergement.name_fr}</h3>
                        {hebergement.description_fr && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{hebergement.description_fr}</p>
                        )}
                        <div className="flex flex-col gap-1 mt-2 text-xs sm:text-sm text-gray-600">
                          {hebergement.price && (
                            <span><span className="font-medium text-gray-700">Prix:</span> {hebergement.price}</span>
                          )}
                          {hebergement.phone && (
                            <span><span className="font-medium text-gray-700">Tél:</span> {hebergement.phone}</span>
                          )}
                          {hebergement.website && (
                            <span><span className="font-medium text-gray-700">Site:</span> <a href={hebergement.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">{hebergement.website}</a></span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(hebergement)}
                          title="Modifier"
                          className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 rounded transition-all text-sm"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(hebergement.id)}
                          title="Supprimer"
                          className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 rounded transition-all text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
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
