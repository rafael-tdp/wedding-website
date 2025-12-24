"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/actions/admin";
import Button from "@/components/ui/Button";

/**
 * COMPOSANT : LOGIN ADMIN
 * Formulaire pour l'authentification des mariés
 */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);

      if (result.success) {
        setSuccess(true);
        // Rediriger après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
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
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-foreground">Connexion réussie</h2>
          <p className="text-sm sm:text-base text-foreground-muted">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full text-center space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif text-foreground">💍 Admin</h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Accès réservé aux mariés
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@mail.fr"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Info */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-foreground-muted">
            <strong>Note:</strong> Vous devez d&apos;abord créer un compte dans Supabase avec vos identifiants.
          </p>
        </div>
      </div>
    </div>
  );
}
