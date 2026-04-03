"use client";

import { useRouter } from "next/navigation";
import { i18n, languages, type Locale } from "@/lib/i18n/config";
import { useState, useTransition, useEffect } from "react";
import { LOCALE_COOKIE } from "@/middleware";
import { useI18n } from "@/lib/i18n/context";

/**
 * LANGUAGE SWITCHER (Cookie-based)
 * 
 * Composant pour changer de langue via cookie.
 * Pas de navigation URL, juste un refresh de la page.
 * Adapt ses couleurs selon le state de la navbar (scrolled ou non)
 */

// Composant pour afficher l'icône de la langue (emoji ou fallback SVG)
function LanguageIcon({ locale, className = "" }: { locale: Locale; className?: string }) {
  const [showEmoji, setShowEmoji] = useState<boolean | null>(null);

  // Détecter si c'est un appareil Apple au montage
  useEffect(() => {
    const isApple = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
    setShowEmoji(isApple);
  }, []);

  // En attente de détection
  if (showEmoji === null) {
    return <span className={className} />;
  }

  if (showEmoji) {
    return (
      <span 
        className={className}
        onError={() => setShowEmoji(false)}
      >
        {languages[locale].flag}
      </span>
    );
  }

  // Fallback avec SVG statique
  const svgPath = locale === "fr" ? "/images/france.svg" : "/images/portugal.svg";
  return (
    <img
      src={svgPath}
      alt={locale === "fr" ? "Français" : "Português"}
      width={18}
      height={18}
      className={`${className} inline`}
    />
  );
}

export function LanguageSwitcher({ isScrolled = false, mobile = false }: { isScrolled?: boolean; mobile?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.defaultLocale);
  const [mounted, setMounted] = useState(false);
  const { dict } = useI18n();

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

    // Définir le cookie
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    
    // Mettre à jour l'état local
    setCurrentLocale(newLocale);
    
    // Fermer le dropdown
    setIsOpen(false);
    
    // Recharger la page pour appliquer la nouvelle langue (en dehors de la transition)
    startTransition(() => {
      router.refresh();
    });
  };

  // Afficher rien jusqu'au montage pour éviter hydration mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-full transition-colors hover:bg-white/20"
          aria-label="Changer de langue"
          disabled={true}
        >
          <LanguageIcon locale={i18n.defaultLocale} className="text-lg" />
          <span className="text-sm font-medium hidden sm:inline text-gray-700">
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
        className={`flex items-center gap-2 transition-colors ${
          mobile
            ? "block px-4 py-3 text-xl font-normal text-gray-700 tracking-widest w-full text-left"
            : "px-0 sm:px-3 py-1 ml-2 rounded-full text-gray-700 hover:bg-gray-300/30"
        }`}
        aria-label="Changer de langue"
        disabled={isPending}
      >
        {mobile ? (
          <>
            <span>{dict?.common?.language || "Langue"}</span>
            <svg
              className={`w-4 h-4 transition-transform ml-auto flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              } text-gray-500`}
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
          </>
        ) : (
          <>
            <LanguageIcon locale={currentLocale} className="text-lg hidden sm:inline" />
            <span className="hidden sm:inline text-sm font-medium">
              {languages[currentLocale].code.toUpperCase()}
            </span>
            <span className="sm:hidden text-gray-700">{languages[currentLocale].name}</span>
            <svg
              className={`w-4 h-4 transition-transform text-gray-500 ${
                isOpen ? "rotate-180" : ""
              }`}
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
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          {!mobile && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          )}

          {/* Menu */}
          <div className={`absolute z-20 ${
            mobile 
              ? "left-0 right-0 mt-0 w-full" 
              : "right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1"
          }`}>
            {i18n.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`
                  w-full flex items-center gap-3 transition-colors ${
                    mobile
                      ? `px-4 pl-10 py-3 text-lg font-normal tracking-widest ${
                          locale === currentLocale
                            ? "text-primary font-medium"
                            : "text-gray-700 hover:bg-white/50"
                        }`
                      : `px-4 py-2 text-sm ${
                          locale === currentLocale
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                  }
                `}
                disabled={isPending}
              >
                {!mobile && <LanguageIcon locale={locale} className="text-lg flex-shrink-0" />}
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
