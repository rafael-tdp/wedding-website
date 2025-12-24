import { NextRequest, NextResponse } from 'next/server';
import { i18n, type Locale } from './lib/i18n/config';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * MIDDLEWARE I18N (Cookie-based)
 * 
 * Détecte la langue préférée via :
 * 1. Cookie existant (défini par LanguageSwitcher)
 * 2. Accept-Language header du navigateur
 * 3. Locale par défaut (fr)
 * 
 * Pas de langue dans l'URL, tout est géré via cookies.
 */

export function middleware(request: NextRequest) {
  // Récupérer la locale depuis le cookie ou détection auto
  let locale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;

  // Si pas de cookie, détecter depuis Accept-Language
  if (!locale || !i18n.locales.includes(locale)) {
    const acceptLanguage = request.headers.get('Accept-Language');
    if (acceptLanguage) {
      // Extraire les langues avec leur priorité (ex: "pt-BR,pt;q=0.9,en;q=0.8")
      const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().toLowerCase());

      // Trouver la première langue supportée
      locale = languages
        .map(lang => {
          // Vérifier correspondance exacte (pt)
          if (i18n.locales.includes(lang as Locale)) return lang as Locale;
          // Vérifier code de langue (pt-BR -> pt)
          const langCode = lang.split('-')[0];
          if (i18n.locales.includes(langCode as Locale)) return langCode as Locale;
          return null;
        })
        .find(Boolean) || i18n.defaultLocale;
    } else {
      locale = i18n.defaultLocale;
    }
  }

  // Créer la réponse et définir le cookie si nécessaire
  const response = NextResponse.next();
  
  // Toujours mettre à jour le cookie pour garantir sa présence
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  // Ne pas exécuter le middleware sur ces chemins
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - api routes
     * - static assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
