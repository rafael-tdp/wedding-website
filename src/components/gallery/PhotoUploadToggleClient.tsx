"use client";

import { useState } from "react";
import { PhotoUpload } from "@/components/gallery/PhotoUpload";
import { MdClose } from "react-icons/md";

interface PhotoUploadToggleClientProps {
  texts: {
    name: string;
    namePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    photo: string;
    selectFile: string;
    dragDrop: string;
    compressing: string;
    remove: string;
    submit: string;
    submitting: string;
    remaining: string;
    formats: string;
    maxSize: string;
  };
}

/**
 * Composant client pour afficher le formulaire d'upload photo de manière dépliable
 * Permet d'économiser de l'espace en cachant le formulaire par défaut
 */
export function PhotoUploadToggleClient({ texts }: PhotoUploadToggleClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Bouton pour ouvrir le formulaire */}
      {!isOpen && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {texts.submit}
          </button>
        </div>
      )}

      {/* Formulaire d'upload (caché/visible selon l'état) */}
      {isOpen && (
        <div className="mb-12 p-6 bg-white rounded-lg border-2 border-primary/20 relative">
          {/* Bouton de fermeture */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
            aria-label="Fermer le formulaire"
          >
            <MdClose className="w-6 h-6" />
          </button>

          {/* Contenu du formulaire */}
          <div className="pr-12">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              {texts.submit}
            </h3>
            <p className="text-gray-600 mb-6">
              {texts.messagePlaceholder}
            </p>

            {/* Informations de limite */}
            <div className="mb-6 grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
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
                <span>{texts.formats}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
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
                <span>{texts.maxSize}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-primary"
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
                <span>5 {texts.remaining.split(" ")[0]}</span>
              </div>
            </div>

            {/* Formulaire */}
            <PhotoUpload texts={texts} />
          </div>
        </div>
      )}
    </div>
  );
}
