"use client";

import { useState, ReactNode } from "react";
import { FaPlus } from "react-icons/fa6";

interface GalleryLayoutProps {
  gallery: ReactNode;
  upload: ReactNode;
}

export function GalleryLayout({ gallery, upload }: GalleryLayoutProps) {
  // État pour l'onglet actif et la modal
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <>
      {/* Desktop : Onglets + Contenu */}
      <div className="hidden lg:block w-full bg-white py-6">
        {/* Onglets */}
        <div className="border-b border-gray-200 px-4 sm:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-4 font-medium transition-all border-b-2 ${
                activeTab === "gallery"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              Galerie
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 font-medium transition-all border-b-2 ${
                activeTab === "upload"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              Ajouter des photos
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 sm:p-8">
          {activeTab === "gallery" && gallery}
          {activeTab === "upload" && upload}
        </div>
      </div>

      {/* Mobile : Galerie avec bouton flottant */}
      <div className="lg:hidden w-full bg-white py-6">
        <div className="p-4 sm:p-8">{gallery}</div>

        {/* Bouton flottant pour ouvrir la modal */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg transition-all"
          title="Ajouter des photos"
        >
            <FaPlus className="w-5 h-5" />
        </button>

        {/* Modal du formulaire sur mobile */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 transition-opacity duration-300">
            <div
              className="bg-white w-full rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300"
              style={{
                animation: "slideUp 0.3s ease-out forwards",
              }}
            >
              <style>{`
                @keyframes slideUp {
                  from {
                    opacity: 0;
                    transform: translateY(100%);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

              {/* En-tête de la modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-serif text-foreground">
                  Ajouter des photos
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contenu du formulaire */}
              <div className="p-6">{upload}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
