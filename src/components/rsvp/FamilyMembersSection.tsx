"use client";

import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

interface FamilyMember {
  id: string;
  name: string;
  attending: boolean | null;
  isChild: boolean;
  age?: number;
  dietary_restrictions: string;
  allergies: string;
}

interface FamilyMembersSectionProps {
  members: FamilyMember[];
  onMembersChange: (members: FamilyMember[]) => void;
  mainGuestAttending: boolean | null;
  texts?: any;
}

/**
 * Composant pour gérer les personnes du groupe/famille
 * Permet à un invité de répondre pour plusieurs personnes
 */
export function FamilyMembersSection({
  members,
  onMembersChange,
  mainGuestAttending,
  texts = {},
}: FamilyMembersSectionProps) {
  const [nextId, setNextId] = useState(Math.max(...members.map(m => parseInt(m.id) || 0), 0) + 1);

  // Quand l'invité principal ne vient pas, les personnes ajoutées sont
  // forcément absentes : on ne demande que leur nom.
  const isAbsentGroup = mainGuestAttending === false;

  const addMember = () => {
    const newMember: FamilyMember = {
      id: nextId.toString(),
      name: "",
      attending: isAbsentGroup ? false : null,
      isChild: false,
      age: undefined,
      dietary_restrictions: "",
      allergies: "",
    };
    setNextId(nextId + 1);
    onMembersChange([...members, newMember]);
  };

  const removeMember = (id: string) => {
    onMembersChange(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    onMembersChange(
      members.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Ne montrer la section qu'une fois la présence du principal renseignée
  if (mainGuestAttending === null) {
    return null;
  }

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl text-gray-900 border-b border-primary/20 pb-2 flex-1 font-medium">
          {isAbsentGroup
            ? (texts.familySectionAbsent || "Autres personnes absentes")
            : (texts.familySection || "Personnes de mon groupe/famille")}
        </h3>
        <span className="text-sm text-gray-500 ml-4">
          {members.length} {members.length === 1 ? (texts.person || "personne") : (texts.persons || "personnes")}
        </span>
      </div>

      <p className="text-gray-600 text-sm">
        {isAbsentGroup
          ? (texts.familyDescriptionAbsent || "Indiquez ici les autres personnes de votre groupe/famille qui ne pourront pas venir non plus. Cela nous aide à avoir un décompte précis des invités.")
          : (texts.familyDescription || "Vous êtes déjà comptabilisé(e). Indiquez ici les autres personnes de votre groupe/famille (conjoint(e), enfants, proches) qui assisteront au mariage. Cela nous aide à avoir un décompte précis des invités.")}
      </p>

      {/* Liste des membres */}
      <div className="space-y-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 border-2 border-primary/20 rounded-lg space-y-4 relative"
          >
            {/* Bouton supprimer */}
            <button
              type="button"
              onClick={() => removeMember(member.id)}
              className="absolute top-2 right-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
              aria-label={texts.removePerson || "Supprimer cette personne"}
            >
              <MdClose className="w-5 h-5" />
            </button>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {texts.name || "Nom"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember(member.id, { name: e.target.value })}
                minLength={2}
                maxLength={255}
                className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={texts.namePlaceholder || "Prénom Nom"}
                required
              />
            </div>

            {/* Présence (masquée si le groupe est absent : tous absents par défaut) */}
            {!isAbsentGroup && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">
                  {texts.attending || "Sera présent(e) ?"} <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateMember(member.id, { attending: true })}
                    className={`flex-1 py-2 px-3 rounded-md font-medium transition-all text-sm ${
                      member.attending === true
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-primary/10"
                    }`}
                  >
                    {texts.familyYes || texts.yes || "Oui"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMember(member.id, { attending: false })}
                    className={`flex-1 py-2 px-3 rounded-md font-medium transition-all text-sm ${
                      member.attending === false
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {texts.familyNo || texts.no || "Non"}
                  </button>
                </div>
              </div>
            )}

            {/* Type (enfant ou adulte) - seulement si présent */}
            {member.attending === true && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">
                  {texts.type || "Type"} <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateMember(member.id, { isChild: false })}
                    className={`flex-1 py-2 px-3 rounded-md font-medium transition-all text-sm ${
                      member.isChild === false
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-primary/10"
                    }`}
                  >
                    {texts.adult || "Adulte"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMember(member.id, { isChild: true })}
                    className={`flex-1 py-2 px-3 rounded-md font-medium transition-all text-sm ${
                      member.isChild === true
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-primary/10"
                    }`}
                  >
                    {texts.child || "Enfant"}
                  </button>
                </div>
              </div>
            )}

            {/* Âge (si enfant et présent) */}
            {member.attending === true && member.isChild && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {texts.age || "Âge"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={member.age || ""}
                  onChange={(e) =>
                    updateMember(member.id, { age: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  min="0"
                  max="18"
                  className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={texts.agePlaceholder || "Âge en années"}
                  required={member.attending && member.isChild}
                />
              </div>
            )}

            {/* Détails pratiques (si présent) */}
            {member.attending === true && (
              <div className="space-y-3 pt-2 border-t border-primary/10">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    {texts.dietary || "Régime alimentaire"}
                  </label>
                  <input
                    type="text"
                    value={member.dietary_restrictions}
                    onChange={(e) =>
                      updateMember(member.id, { dietary_restrictions: e.target.value })
                    }
                    maxLength={1000}
                    className="w-full px-3 py-2 text-sm border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={texts.dietaryPlaceholder || "Végétarien, vegan..."}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    {texts.allergies || "Allergies alimentaires"}
                  </label>
                  <input
                    type="text"
                    value={member.allergies}
                    onChange={(e) =>
                      updateMember(member.id, { allergies: e.target.value })
                    }
                    maxLength={1000}
                    className="w-full px-3 py-2 text-sm border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={texts.allergiesPlaceholder || "Arachides, fruits de mer..."}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bouton ajouter */}
      <button
        type="button"
        onClick={addMember}
        className="w-full py-3 px-4 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-primary font-medium"
      >
        <MdAdd className="w-5 h-5" />
        {texts.addPerson || "Ajouter une personne"}
      </button>
    </div>
  );
}
