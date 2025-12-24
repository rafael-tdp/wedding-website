"use client";

import { useEffect, useState } from "react";

/**
 * COMPOSANT : CONFIGURATION WARNING
 * 
 * Affiche un bandeau d'avertissement si Supabase n'est pas configuré.
 * Aide l'utilisateur à configurer son projet.
 */

export function ConfigWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Afficher le warning si les variables ne sont pas configurées
    const isNotConfigured =
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes("your") ||
      supabaseKey.includes("your") ||
      !supabaseUrl.startsWith("http");

    setShow(isNotConfigured);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              ⚙️ Configuration requise
            </h3>
            <p className="text-sm mb-2">
              Supabase n&apos;est pas encore configuré. Le site ne fonctionnera pas
              correctement.
            </p>
            <div className="text-sm space-y-1">
              <p className="font-medium">Étapes rapides :</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Créez un projet sur supabase.com (gratuit)</li>
                <li>
                  Copiez votre URL et clé API (Settings → API)
                </li>
                <li>
                  Modifiez le fichier <code className="bg-white/20 px-1 rounded">.env.local</code>
                </li>
                <li>Redémarrez le serveur (npm run dev)</li>
              </ol>
              <p className="mt-2">
                📖{" "}
                <span className="font-medium">
                  Guide complet : Consultez CONFIGURATION.md
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShow(false)}
            className="flex-shrink-0 hover:bg-white/10 rounded p-1 transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
