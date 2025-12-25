/**
 * CONFIGURATION I18N
 * 
 * Configuration centralisée pour l'internationalisation
 */

export const i18n = {
  defaultLocale: 'fr',
  locales: ['fr', 'pt'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

/**
 * Métadonnées des langues pour l'affichage
 */
export const languages = {
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    icon: 'FR',
  },
  pt: {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    icon: 'PT',
  },
} as const;
