import { createClient } from "@supabase/supabase-js";

/**
 * CLIENT SUPABASE
 * 
 * Configuration du client Supabase pour l'application.
 * Les variables d'environnement doivent être définies dans .env.local
 * 
 * Variables requises :
 * - NEXT_PUBLIC_SUPABASE_URL : URL de votre projet Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY : Clé publique (anon key)
 * 
 * Pour obtenir ces valeurs :
 * 1. Allez sur https://supabase.com/dashboard
 * 2. Sélectionnez votre projet
 * 3. Settings > API
 * 4. Copiez "Project URL" et "anon/public key"
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Configuration Supabase manquante!\n\n" +
    "Les variables d'environnement suivantes sont requises dans .env.local :\n" +
    "  - NEXT_PUBLIC_SUPABASE_URL\n" +
    "  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n" +
    "📖 Consultez SETUP.md pour les instructions de configuration.\n"
  );
}

// Vérification que les URLs sont valides
if (supabaseUrl && (supabaseUrl.includes("your") || !supabaseUrl.startsWith("http"))) {
  console.error(
    "❌ Configuration Supabase invalide!\n\n" +
    "NEXT_PUBLIC_SUPABASE_URL contient encore la valeur placeholder.\n" +
    "Remplacez-la par votre vraie URL Supabase (ex: https://xxxxx.supabase.co)\n\n" +
    "Pour obtenir votre URL :\n" +
    "1. Allez sur https://supabase.com/dashboard\n" +
    "2. Sélectionnez votre projet\n" +
    "3. Settings > API > Project URL\n"
  );
}

if (supabaseAnonKey && (supabaseAnonKey.includes("your") || supabaseAnonKey.length < 20)) {
  console.error(
    "❌ Configuration Supabase invalide!\n\n" +
    "NEXT_PUBLIC_SUPABASE_ANON_KEY contient encore la valeur placeholder.\n" +
    "Remplacez-la par votre vraie clé Supabase (commence par eyJ...)\n\n" +
    "Pour obtenir votre clé :\n" +
    "1. Allez sur https://supabase.com/dashboard\n" +
    "2. Sélectionnez votre projet\n" +
    "3. Settings > API > Project API keys > anon/public\n"
  );
}

// Utiliser des valeurs par défaut pour éviter l'erreur "Invalid URL"
// En mode développement sans configuration
const url = supabaseUrl && !supabaseUrl.includes("your") ? supabaseUrl : "https://placeholder.supabase.co";
const key = supabaseAnonKey && !supabaseAnonKey.includes("your") ? supabaseAnonKey : "placeholder-key";

export const supabase = createClient(url, key);
