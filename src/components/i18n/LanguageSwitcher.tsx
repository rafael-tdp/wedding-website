"use client";

import { useRouter } from "next/navigation";
import { i18n, languages, type Locale } from "@/lib/i18n/config";
import { useState, useTransition, useEffect } from "react";
import { LOCALE_COOKIE } from "@/middleware";

/**
 * LANGUAGE SWITCHER (Cookie-based)
 * 
 * Composant pour changer de langue via cookie.
 * Pas de navigation URL, juste un refresh de la page.
 * Adapt ses couleurs selon le state de la navbar (scrolled ou non)
 */

export function LanguageSwitcher({ isScrolled = false }: { isScrolled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Lire les cookies uniquement côté client après montage
  useEffect(() => {
    const locale = (document.cookie
      .split('; ')
      .find(row => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split('=')[1] as Locale) || i18n.defaultLocale;
    
    setCurrentLocale(locale);
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      // Définir le cookie
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      
      // Mettre à jour l'état local
      setCurrentLocale(newLocale);
      
      // Fermer le dropdown
      setIsOpen(false);
      
      // Recharger la page pour appliquer la nouvelle langue
      router.refresh();
    });
  };

  // Afficher rien jusqu'au montage pour éviter hydration mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isScrolled
              ? "hover:bg-gray-100"
              : "hover:bg-white/20"
          }`}
          aria-label="Changer de langue"
          disabled={true}
        >
          <span className="text-lg">{languages[i18n.defaultLocale].flag}</span>
          <span className={`text-sm font-medium hidden sm:inline ${
            isScrolled ? "text-gray-700" : "text-white"
          }`}>
            {languages[i18n.defaultLocale].code.toUpperCase()}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Bouton langue actuelle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-0 sm:px-3 py-2 rounded-lg transition-colors ${
          isScrolled
            ? "text-gray-700 hover:bg-gray-100"
            : "text-white hover:bg-white/20"
        }`}
        aria-label="Changer de langue"
        disabled={isPending}
      >
        <span className="text-lg">{languages[currentLocale].flag}</span>
        <span className={`text-sm font-medium hidden sm:inline`}>
          {languages[currentLocale].code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${isScrolled ? "text-gray-500" : "text-gray-300"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {i18n.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                  ${
                    locale === currentLocale
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
                disabled={isPending}
              >
                <span className="text-lg">{languages[locale].flag}</span>
                <span>{languages[locale].name}</span>
                {locale === currentLocale && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
