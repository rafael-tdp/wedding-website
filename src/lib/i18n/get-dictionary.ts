import { Locale } from './config';

/**
 * DICTIONNAIRES DE TRADUCTION
 * 
 * Contient toutes les traductions statiques du site.
 * Les données dynamiques (FAQ, Programme, etc.) sont gérées en base.
 */

const dictionaries = {
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export type Dictionary = {
  [key: string]: any;
};

export type DictionaryType = Awaited<ReturnType<typeof getDictionary>>;
