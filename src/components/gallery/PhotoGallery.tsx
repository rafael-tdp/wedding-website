// PORTFOLIO: Photos depuis Picsum
import { PhotoGalleryClient } from "./PhotoGalleryClient";

/**
 * COMPOSANT : GALERIE PHOTO
 * 
 * Server Component qui charge les photos approuvées
 * et les passe à PhotoGalleryClient pour l'affichage interactif
 * 
 * En mode portfolio, affiche des mock photos au lieu de vraies photos
 */

/**
 * Mock photos pour le mode portfolio
 */
const MOCK_PHOTOS = Array.from({ length: 100 }, (_, i) => ({
  id: `mock-${i + 1}`,
  uploaded_by: `Guest ${i + 1}`,
  uploader_email: `guest${i + 1}@example.com`,
  caption: [
    "Beautiful moment from the celebration",
    "Dancing the night away",
    "A magical evening",
    "Celebrating love",
    "Happy moments together",
    "Unforgettable memories",
    "Joy and laughter",
    "Precious moments",
    "Forever memories",
    "Special times",
  ][i % 10],
  alt_text: `Mock photo ${i + 1}`,
  storage_path: `mock-${i + 1}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  public_url: `https://via.placeholder.com/400?text=Photo+${i + 1}`,
  filename: `mock-photo-${i + 1}.jpg`,
  file_size: 1024000,
  mime_type: "image/jpeg",
  width: 400,
  height: 400,
  is_approved: true,
  is_visible: true,
  approved_at: new Date().toISOString(),
  approved_by: "admin",
  views_count: 0,
  likes_count: 0,
  comments_count: 0,
}));

/**
 * Composant : Galerie complète (Server Component)
 */
export async function PhotoGallery() {
  return <PhotoGalleryClient photos={MOCK_PHOTOS} />;
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
