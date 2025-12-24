"use client";

import { useState } from "react";
import { type Photo } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";

/**
 * Obtient l'URL publique d'une photo
 */
function getPhotoPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Composant : Lightbox modale
 */
function PhotoLightbox({
  photo,
  allPhotos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  photo: Photo;
  allPhotos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const imageUrl = getPhotoPublicUrl(photo.storage_path);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={`Photo de ${photo.uploaded_by || "Invité"}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Info */}
        <div className="bg-black/80 text-white p-4 text-center">
          <p className="font-medium">{photo.uploaded_by || "Invité"}</p>
          {photo.caption && (
            <p className="text-sm mt-2 opacity-90">{photo.caption}</p>
          )}
          <p className="text-xs mt-2 opacity-75">
            {new Date(photo.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-xs mt-3 opacity-60">
            {currentIndex + 1} / {allPhotos.length}
          </p>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          aria-label="Fermer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Boutons navigation */}
        {allPhotos.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
              aria-label="Photo précédente"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
              aria-label="Photo suivante"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Composant : Carte photo individuelle avec lightbox
 */
function PhotoCard({
  photo,
  onPhotoClick,
}: {
  photo: Photo;
  onPhotoClick: () => void;
}) {
  const imageUrl = getPhotoPublicUrl(photo.storage_path);

  return (
    <button
      onClick={onPhotoClick}
      className="group relative bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3] cursor-pointer"
    >
      {/* Image */}
      <div className="w-full h-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={`Photo de ${photo.uploaded_by || "Invité"}`}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="font-medium text-sm">{photo.uploaded_by || "Invité"}</p>
          {photo.caption && (
            <p className="text-xs mt-1 line-clamp-2 opacity-90">
              {photo.caption}
            </p>
          )}
          <p className="text-xs mt-2 opacity-75">
            {new Date(photo.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </button>
  );
}

/**
 * Composant : Wrapper client pour la galerie
 */
export function PhotoGalleryClient({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune photo pour le moment
        </h3>
        <p className="text-gray-600">
          Soyez le premier à partager vos souvenirs !
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Grille de photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onPhotoClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <PhotoLightbox
          photo={photos[selectedIndex]}
          allPhotos={photos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() =>
            setSelectedIndex((selectedIndex + 1) % photos.length)
          }
          onPrev={() =>
            setSelectedIndex(
              selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1
            )
          }
        />
      )}
    </div>
  );
}
