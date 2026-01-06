"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import { type Photo } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import { useUploadModal } from "./UploadModalContext";

/**
 * Obtient l'URL publique d'une photo
 */
function getPhotoPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Extrait le nom de fichier à partir du storage path
 */
function getFilenameFromPath(storagePath: string, photoId: string): string {
  const parts = storagePath.split("/");
  const lastPart = parts[parts.length - 1];
  
  // Si c'est un UUID ou autre format sans extension, retourner avec extension
  if (!lastPart.includes(".")) {
    return `photo-${photoId}.jpg`;
  }
  
  // Si le fichier a une extension, s'assurer qu'elle est .jpg ou .jpeg
  if (!lastPart.endsWith(".jpg") && !lastPart.endsWith(".jpeg")) {
    // Retirer l'extension existante et ajouter .jpg
    const nameWithoutExt = lastPart.substring(0, lastPart.lastIndexOf("."));
    return `${nameWithoutExt}.jpg`;
  }
  
  return lastPart;
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
  isSelectionMode,
  isSelected,
  onToggleSelection,
  onDownload,
}: {
  photo: Photo;
  onPhotoClick: () => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelection: () => void;
  onDownload: () => void;
}) {
  const imageUrl = getPhotoPublicUrl(photo.storage_path);

  return (
    <div className="group relative bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3]">
      {/* Image */}
      <button
        onClick={isSelectionMode ? onToggleSelection : onPhotoClick}
        className="w-full h-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={`Photo de ${photo.uploaded_by || "Invité"}`}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </button>

      {/* Info overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

      {/* Checkbox de sélection */}
      {isSelectionMode && (
        <div className="absolute top-3 right-3">
          <button
            onClick={onToggleSelection}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "bg-primary border-primary"
                : "bg-white/80 border-gray-300 hover:border-primary"
            }`}
          >
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Bouton télécharger (non-sélection) */}
      {!isSelectionMode && (
        <button
          onClick={onDownload}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          title="Télécharger cette photo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Composant : Wrapper client pour la galerie
 */
export function PhotoGalleryClient({ photos, dict }: { photos: Photo[]; dict: any }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { onOpenUploadModal } = useUploadModal();

  // Toggle la sélection d'une photo
  const togglePhotoSelection = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  // Sélectionne/désélectionne toutes les photos
  const toggleAllPhotos = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id)));
    }
  };

  // Télécharge une photo individuelle
  const downloadPhoto = async (photo: Photo) => {
    try {
      const imageUrl = getPhotoPublicUrl(photo.storage_path);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = getFilenameFromPath(photo.storage_path, photo.id);

      // Détecte si on est sur mobile et utilise Web Share API si disponible
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobile && typeof navigator !== "undefined" && "share" in navigator) {
        // Web Share API pour mobile (sauvegarde directement en galerie)
        try {
          const file = new File([blob], filename, { type: blob.type });
          
          // Vérifier que le navigateur supporte le partage de fichiers
          if ("canShare" in navigator && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: "Photo de mariage" });
            return;
          }
        } catch (error) {
          // Si le partage échoue (utilisateur annule ou erreur), utiliser fallback
          if ((error as Error).name !== "AbortError") {
            console.error("Web Share API error:", error);
          }
        }
      }

      // Fallback : téléchargement traditionnel
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  // Télécharge les photos sélectionnées en ZIP
  const downloadSelectedPhotos = async () => {
    if (selectedPhotos.size === 0) return;

    setIsDownloading(true);
    try {
      // Importer JSZip dynamiquement
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Ajouter chaque photo au ZIP
      const selectedPhotoList = photos.filter(p => selectedPhotos.has(p.id));
      
      for (const photo of selectedPhotoList) {
        const imageUrl = getPhotoPublicUrl(photo.storage_path);
        const response = await fetch(imageUrl);
        let blob = await response.blob();
        
        // S'assurer que le blob a le bon type MIME
        if (blob.type !== "image/jpeg" && blob.type !== "image/jpg") {
          blob = blob.slice(0, blob.size, "image/jpeg");
        }
        
        const filename = getFilenameFromPath(photo.storage_path, photo.id);
        zip.file(filename, blob, { binary: true });
      }

      // Générer et télécharger le ZIP avec compression
      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photos-mariage-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Réinitialiser
      setSelectedPhotos(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error('Erreur lors du téléchargement ZIP:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

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
          {dict.gallery.gallery.empty}
        </h3>
        <p className="text-gray-600">
          {dict.gallery.gallery.emptySubtitle}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Barre d'outils */}
      {photos.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Bouton mobile pour ajouter des photos */}
            <Button
              variant="primary"
              onClick={onOpenUploadModal}
              className="sm:hidden w-full flex items-center gap-2 justify-center"
            >
              <FaPlus className="w-4 h-4" />
              {dict.gallery.addPhotos}
            </Button>

            <Button
              variant={isSelectionMode ? "primary" : "outline"}
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="w-full sm:w-auto"
            >
              {isSelectionMode ? dict.gallery.cancel : dict.gallery.selectPhotos}
            </Button>
          </div>

          {isSelectionMode && (
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllPhotos}
                className="flex-1 sm:flex-none"
              >
                {selectedPhotos.size === photos.length ? dict.gallery.deselectAll : dict.gallery.selectAll}
              </Button>

              {selectedPhotos.size > 0 && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={downloadSelectedPhotos}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">{dict.gallery.downloading}</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden sm:inline">{dict.gallery.downloadBtn} ({selectedPhotos.size})</span>
                        <span className="sm:hidden">↓ {selectedPhotos.size}</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPhotos(new Set())}
                    className="flex-1 sm:flex-none"
                  >
                    {dict.gallery.cancel}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grille de photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onPhotoClick={() => setSelectedIndex(index)}
            isSelectionMode={isSelectionMode}
            isSelected={selectedPhotos.has(photo.id)}
            onToggleSelection={() => togglePhotoSelection(photo.id)}
            onDownload={() => downloadPhoto(photo)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && !isSelectionMode && (
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
