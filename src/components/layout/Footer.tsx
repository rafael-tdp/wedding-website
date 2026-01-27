"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

/**
 * COMPOSANT : FOOTER
 * 
 * Pied de page du site avec :
 * - Navigation rapide
 * - Informations de contact
 * - Copyright
 */

export default function Footer() {
  const { dict } = useI18n();

  const footerLinks = [
    { href: "/schedule", label: dict?.navbar?.programme || "Programme" },
    { href: "/location", label: dict?.navbar?.venue || "Lieu & Accès" },
    { href: "/accommodations", label: dict?.navbar?.accommodation || "Hébergements" },
    { href: "/galerie", label: dict?.navbar?.gallery || "Galerie" },
    { href: "/rsvp", label: dict?.navbar?.rsvp || "RSVP" },
    { href: "/faq", label: dict?.navbar?.faq || "FAQ" },
  ];

  // Provide safe fallbacks for footer text
  const footerAboutText = dict?.footer?.about?.text || "Nous sommes ravis de partager ce jour spécial avec vous. Merci de faire partie de notre histoire.";
  const footerNavigation = dict?.footer?.navigation || "Navigation";
  const footerContactTitle = dict?.footer?.contact?.title || "Contact";
  const footerContactEmail = dict?.footer?.contact?.email || "tavaresrafael93@gmail.com";
  const footerContactPhone = dict?.footer?.contact?.phone || "06 95 22 49 32";
  const footerContactDate = dict?.footer?.contact?.date || "15 août 2026";
  const footerCopyright = dict?.footer?.copyright || "Tous droits réservés.";
  const footerMadeWith = dict?.footer?.madeWith || "Créé avec ❤️ pour notre grand jour";

  return (
    <footer className="bg-accent-dark text-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1 : About */}
          <div>
            <h3 className="text-yellow-50 font-serif text-2xl mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-parisienne)" }}>
              Ana & Rafael
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              {footerAboutText}
            </p>
          </div>

          {/* Column 2 : Navigation */}
          <div className="border-t border-accent-light/30 pt-8 sm:pt-0 sm:border-t-0">
            <h4 className="text-yellow-50 font-medium mb-4 font-gilda">{footerNavigation}</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-200 hover:text-yellow-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-gray-300 hover:text-yellow-50 transition-colors opacity-75"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 : Contact */}
          <div className="border-t border-accent-light/30 pt-8 sm:pt-0 sm:border-t-0">
            <h4 className="text-yellow-50 font-medium mb-4 font-gilda">{footerContactTitle}</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${footerContactEmail}`}
                  className="hover:text-yellow-50 transition-colors"
                >
                  {footerContactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{footerContactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{footerContactDate}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-accent-light/30 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-200">
              © {new Date().getFullYear()} Ana & Rafael. {footerCopyright}
            </p>
            <p className="text-xs text-gray-300">
              {footerMadeWith}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
