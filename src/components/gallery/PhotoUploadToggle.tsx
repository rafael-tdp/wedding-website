import { PhotoUploadToggleClient } from "@/components/gallery/PhotoUploadToggleClient";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { isBeforeWeddingGallery } from "@/lib/config/wedding-config";

/**
 * Server component wrapper pour PhotoUploadToggle
 * Récupère les traductions et les passe au composant client
 */
export async function PhotoUploadToggle() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  // L'upload s'ouvre à l'heure de la cérémonie (date + time dans wedding-config)
  const isWeddingPassed = !isBeforeWeddingGallery();

  return <PhotoUploadToggleClient texts={dict.gallery.upload} isWeddingPassed={isWeddingPassed} />;
}
