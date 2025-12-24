import { PhotoUploadToggleClient } from "@/components/gallery/PhotoUploadToggleClient";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

/**
 * Server component wrapper pour PhotoUploadToggle
 * Récupère les traductions et les passe au composant client
 */
export async function PhotoUploadToggle() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return <PhotoUploadToggleClient texts={dict.gallery.upload} />;
}
