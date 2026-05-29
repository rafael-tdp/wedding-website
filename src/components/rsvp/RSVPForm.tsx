"use client";

import { useState, useTransition, useRef } from "react";
import { submitRSVP } from "@/app/actions/rsvp";
import Button from "@/components/ui/Button";
import { FamilyMembersSection } from "./FamilyMembersSection";

interface FamilyMember {
  id: string;
  name: string;
  attending: boolean | null;
  isChild: boolean;
  age?: number;
  dietary_restrictions: string;
  allergies: string;
}

interface RSVPFormProps {
  onSuccess?: (rsvp: any) => void;
  initialData?: {
    id?: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    attending?: boolean;
    dietary_restrictions?: string;
    allergies?: string;
    special_needs?: string;
    message?: string;
    family_members?: Array<{
      name: string;
      attending: boolean;
      isChild: boolean;
      age?: number;
      dietary_restrictions?: string;
      allergies?: string;
    }>;
  };
  texts?: any;
  errors?: any;
  success?: any;
}

/**
 * COMPOSANT : FORMULAIRE RSVP
 * 
 * Client Component avec :
 * - État local pour les champs
 * - Validation côté client (HTML5)
 * - Appel de la Server Action
 * - Gestion des erreurs et succès
 * - UX optimisée (loading, disabled)
 * - Support du groupe/famille
 */

export default function RSVPForm({ onSuccess, initialData, texts = {}, errors: errorsDict = {}, success: successDict = {} }: RSVPFormProps = {}) {
  // État du formulaire
  const [attending, setAttending] = useState<boolean | null>(initialData?.attending ?? null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    initialData?.family_members?.map((m, idx) => ({
      id: idx.toString(),
      name: m.name,
      attending: m.attending,
      isChild: m.isChild,
      age: m.age,
      dietary_restrictions: m.dietary_restrictions || "",
      allergies: m.allergies || "",
    })) ?? []
  );
  const [submitted, setSubmitted] = useState(false);
  
  // État pour les erreurs et succès
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  } | null>(null);

  // Référence pour scroller vers les erreurs
  const errorRef = useRef<HTMLDivElement>(null);
  // Référence pour scroller vers le message de succès
  const successRef = useRef<HTMLDivElement>(null);

  // useTransition pour gérer le loading state
  const [isPending, startTransition] = useTransition();

  // Changer la réponse de présence du principal. Si on passe à "absent",
  // on normalise les membres déjà saisis (tous absents, sans détails de présence).
  const handleAttendingChange = (value: boolean) => {
    setAttending(value);
    if (value === false && familyMembers.length > 0) {
      setFamilyMembers((prev) =>
        prev.map((m) => ({
          ...m,
          attending: false,
          isChild: false,
          age: undefined,
          dietary_restrictions: "",
          allergies: "",
        }))
      );
    }
  };

  // Handler de soumission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset les résultats précédents
    setResult(null);

    const formData = new FormData(e.currentTarget);

    // Ajouter l'ID si on édite
    if (initialData?.id) {
      formData.set("id", initialData.id);
    }

    // Ajouter le boolean attending au FormData
    if (attending !== null) {
      formData.set("attending", attending.toString());
    }

    // Ajouter les membres de la famille
    if (familyMembers.length > 0) {
      formData.set("family_members", JSON.stringify(familyMembers));
    }

    // Appeler la Server Action
    startTransition(async () => {
      const response = await submitRSVP(formData);
      setResult(response);
      
      if (response.success) {
        // Appeler le callback si fourni (pour mettre à jour AdminDashboard)
        if (onSuccess && response.rsvp) {
          onSuccess(response.rsvp);
        }
        setSubmitted(true);
        // Scroller vers le message de succès (sauf si on est dans un modal)
        if (!onSuccess) {
          setTimeout(() => {
            successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
        // Reset le formulaire après 5 secondes
        setTimeout(() => {
          setSubmitted(false);
          setAttending(null);
          setFamilyMembers([]);
        }, 5000);
      } else {
        // Scroller vers le message d'erreur
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    });
  };

  // Affichage après soumission réussie
  if (submitted && result?.success) {
    return (
      <div ref={successRef} className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-gray-900">
          {successDict.title || "Merci !"}
        </h3>
        <p className="text-gray-600">
          {attending ? (successDict.attending || "Votre présence est confirmée.") : (successDict.notAttending || "Merci de nous avoir prévenus.")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Message d'erreur global */}
      {result && !result.success && (
        <div 
          ref={errorRef}
          className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-4 rounded-lg"
        >
          <p className="font-bold mb-2">❌ {result.message}</p>
          
          {/* Afficher les erreurs par champ si disponibles */}
          {result.errors && Object.keys(result.errors).length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {Object.entries(result.errors).map(([field, messages]) => (
                <li key={field}>
                  <strong>{field}:</strong> {messages.join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Informations personnelles */}
      <div className="space-y-6">
        <h3 className="text-lg sm:text-xl text-gray-900 border-b border-primary/20 pb-2 font-medium">
          {texts.infoSection || "Vos informations"}
        </h3>

        {/* Nom */}
        <div>
          <label
            htmlFor="guest_name"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            {texts.name || "Nom et Prénom"} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="guest_name"
            name="guest_name"
            required
            minLength={2}
            maxLength={255}
            defaultValue={initialData?.guest_name ?? ""}
            className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={texts.namePlaceholder || "Marie Dupont"}
          />
          {result?.errors?.guest_name && (
            <p className="text-red-600 text-sm mt-1">
              {result.errors.guest_name[0]}
            </p>
          )}
        </div>

        {/* Email (optionnel maintenant) */}
        <div>
          <label
            htmlFor="guest_email"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            {texts.email || "Email"} <span className="text-gray-400 text-xs">{texts.optional || "(optionnel)"}</span>
          </label>
          <input
            type="email"
            id="guest_email"
            name="guest_email"
            maxLength={255}
            defaultValue={initialData?.guest_email ?? ""}
            className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={texts.emailPlaceholder || "marie.dupont@example.com"}
          />
          <p className="text-xs text-gray-500 mt-1">
            {texts.emailHelper || "Si vous le fournissez, nous pourrons vous contacter pour des détails pratiques"}
          </p>
          {result?.errors?.guest_email && (
            <p className="text-red-600 text-sm mt-1">
              {result.errors.guest_email[0]}
            </p>
          )}
        </div>

        {/* Téléphone (optionnel) */}
        <div>
          <label
            htmlFor="guest_phone"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            {texts.phone || "Téléphone"} <span className="text-gray-400 text-xs">{texts.optional || "(optionnel)"}</span>
          </label>
          <input
            type="tel"
            id="guest_phone"
            name="guest_phone"
            maxLength={50}
            defaultValue={initialData?.guest_phone ?? ""}
            className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="06 12 34 56 78"
          />
          {result?.errors?.guest_phone && (
            <p className="text-red-600 text-sm mt-1">
              {result.errors.guest_phone[0]}
            </p>
          )}
        </div>
      </div>

      {/* Confirmation de présence */}
      <div className="space-y-6 mt-12">
        <h3 className="text-lg sm:text-xl text-gray-900 border-b border-primary/20 pb-2 font-medium">
          {texts.attendingSection || "Confirmation de présence"}
        </h3>

        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            {texts.attending || "Serez-vous présent(e) ?"} <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => handleAttendingChange(true)}
              className={`flex-1 py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base rounded-md font-medium transition-all ${
                attending === true
                  ? "bg-primary text-white"
                  : "bg-primary/50 text-gray-700 hover:bg-primary/60"
              }`}
            >
              ✓ {texts.yes || "Oui, je serai là !"}
            </button>
            <button
              type="button"
              onClick={() => handleAttendingChange(false)}
              className={`flex-1 py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base rounded-md font-medium transition-all ${
                attending === false
                  ? "bg-gray-600 text-white"
                  : "bg-secondary/50 text-gray-700 hover:bg-secondary/60"
              }`}
            >
              ✗ {texts.no || "Non, malheureusement"}
            </button>
          </div>
          {result?.errors?.attending && (
            <p className="text-red-600 text-sm mt-2">
              {result.errors.attending[0]}
            </p>
          )}
        </div>

        {/* Section famille/groupe (présents ou absents selon la réponse du principal) */}
        {attending !== null && (
          <FamilyMembersSection
            members={familyMembers}
            onMembersChange={setFamilyMembers}
            mainGuestAttending={attending}
            texts={texts}
          />
        )}
      </div>

      {/* Détails pratiques (si présent) */}
      {attending === true && (
        <div className="space-y-6 mt-12">
          <h3 className="text-lg sm:text-xl text-gray-900 border-b border-primary/20 pb-2 font-medium">
            {texts.practicalSection || "Informations pratiques"}
          </h3>

          {/* Régime alimentaire */}
          <div>
            <label
              htmlFor="dietary_restrictions"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              {texts.dietary || "Votre régime alimentaire (végétarien, vegan, sans gluten...)"}
            </label>
            <input
              type="text"
              id="dietary_restrictions"
              name="dietary_restrictions"
              maxLength={1000}
              defaultValue={initialData?.dietary_restrictions ?? ""}
              className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={texts.dietaryPlaceholder || "Végétarien"}
            />
          </div>

          {/* Allergies */}
          <div>
            <label
              htmlFor="allergies"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              {texts.allergies || "Vos allergies alimentaires"}
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              maxLength={1000}
              defaultValue={initialData?.allergies ?? ""}
              className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={texts.allergiesPlaceholder || "Arachides, fruits de mer..."}
            />
          </div>

          {/* Besoins spéciaux */}
          <div>
            <label
              htmlFor="special_needs"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              {texts.specialNeeds || "Besoins spéciaux (PMR, poussette...)"}
            </label>
            <input
              type="text"
              id="special_needs"
              name="special_needs"
              maxLength={1000}
              defaultValue={initialData?.special_needs ?? ""}
              className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={texts.specialNeedsPlaceholder || "Accès PMR nécessaire"}
            />
          </div>
        </div>
      )}

      {/* Message */}
      <div className="mt-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {texts.message || "Message pour les mariés"} <span className="text-gray-400 text-xs">{texts.optional || "(optionnel)"}</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={initialData?.message ?? ""}
          className="w-full px-4 py-2.5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder={texts.messagePlaceholder || "Vos félicitations, questions..."}
        />
        <p className="text-xs text-gray-500 mt-1">
          {texts.messageHelper || "Max 2000 caractères"}
        </p>
      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-center pt-8 sm:pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending || attending === null}
          className="min-w-[250px]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {texts.submitting || "Envoi en cours..."}
            </span>
          ) : (
            texts.submit || "Envoyer ma réponse"
          )}
        </Button>
      </div>

      {/* Note RGPD */}
      <p className="text-xs text-center text-gray-500 mt-12">
        {texts.gdprNote || "Vos données sont stockées de manière sécurisée et ne seront utilisées que pour l'organisation du mariage. Vous pouvez modifier votre réponse à tout moment en soumettant à nouveau ce formulaire."}
      </p>
    </form>
  );
}
