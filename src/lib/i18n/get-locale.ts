import { cookies } from 'next/headers';
import { i18n, type Locale } from './config';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Récupère la locale actuelle depuis les cookies (Server Component)
 * 
 * À utiliser dans les Server Components et Server Actions.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined;
  
  // Retourner la locale du cookie si valide, sinon la locale par défaut
  return locale && i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
}
