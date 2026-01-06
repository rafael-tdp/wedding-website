import { getApprovedPhotos } from "@/lib/supabase/queries";
import { PhotoGalleryClient } from "./PhotoGalleryClient";

/**
 * COMPOSANT : GALERIE PHOTO
 * 
 * Server Component qui charge les photos approuvées
 * et les passe à PhotoGalleryClient pour l'affichage interactif
 */

/**
 * Composant : Galerie complète (Server Component)
 */
export async function PhotoGallery({ dict }: { dict: any }) {
  const photos = await getApprovedPhotos();
  return <PhotoGalleryClient photos={photos} dict={dict} />;
}

/**
 * Composant : Skeleton de chargement
 */
export function PhotoGallerySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}
