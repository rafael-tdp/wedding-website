import { PhotoUploadToggleClient } from "@/components/gallery/PhotoUploadToggleClient";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { weddingConfig } from "@/lib/config/wedding-config";

/**
 * Server component wrapper pour PhotoUploadToggle
 * Récupère les traductions et les passe au composant client
 */
export async function PhotoUploadToggle() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  
  // Vérifier si le mariage a eu lieu
  const weddingDate = new Date(weddingConfig.wedding.date);
  const now = new Date();
  const isWeddingPassed = now >= weddingDate;

  return <PhotoUploadToggleClient texts={dict.gallery.upload} isWeddingPassed={isWeddingPassed} />;
}
