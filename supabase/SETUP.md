# 🚀 Configuration Supabase - Guide Complet

## 📋 Prérequis

- Un compte Supabase (gratuit) : [supabase.com](https://supabase.com)
- Avoir cloné le projet localement

---

## 🎯 Étape 1 : Créer un Projet Supabase

### 1.1 Se connecter à Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur "Start your project"
3. Se connecter avec GitHub (recommandé)

### 1.2 Créer un nouveau projet

1. Cliquer sur "New project"
2. Remplir :
   - **Organization** : Créer ou sélectionner
   - **Name** : `wedding-site` (ou votre choix)
   - **Database Password** : Générer un mot de passe fort (le sauvegarder !)
   - **Region** : Choisir le plus proche (ex: `West EU (Frankfurt)`)
   - **Plan** : **Free** ✅

3. Cliquer "Create new project"
4. ⏱️ Attendre 2-3 minutes (le projet se provisione)

---

## 🗄️ Étape 2 : Exécuter le Schéma SQL

### 2.1 Ouvrir l'éditeur SQL

1. Dans le dashboard Supabase
2. Menu de gauche → **SQL Editor**
3. Cliquer "New query"

### 2.2 Exécuter schema.sql

1. Ouvrir le fichier `supabase/schema.sql` de votre projet
2. **Copier tout le contenu**
3. Coller dans l'éditeur SQL Supabase
4. Cliquer **"Run"** (en bas à droite)
5. ✅ Vérifier : "Success. No rows returned"

### 2.3 Vérifier les tables

1. Menu gauche → **Table Editor**
2. Vous devriez voir :
   - `rsvp`
   - `programme`
   - `faq`
   - `hebergements`
   - `photos`

---

## 🔐 Étape 3 : Activer Row Level Security (RLS)

### 3.1 Exécuter policies.sql

1. Retourner dans **SQL Editor** → "New query"
2. Ouvrir le fichier `supabase/policies.sql`
3. **Copier tout le contenu**
4. Coller et cliquer **"Run"**
5. ✅ Vérifier : "Success"

### 3.2 Vérifier les policies

1. Menu gauche → **Authentication** → **Policies**
2. Vous devriez voir toutes les policies créées
3. Vérifier que RLS est **activé** (cadenas vert) sur toutes les tables

---

## 📸 Étape 4 : Configurer le Storage (Photos)

### 4.1 Créer le bucket

**Option A : Via l'interface** (Recommandé)

1. Menu gauche → **Storage**
2. Cliquer "Create a new bucket"
3. Remplir :
   - **Name** : `gallery`
   - **Public** : ✅ **OUI** (cocher la case)
   - **File size limit** : `5 MB`
   - **Allowed MIME types** : 
     ```
     image/jpeg
     image/jpg
     image/png
     image/webp
     ```
4. Cliquer "Create bucket"

**Option B : Via SQL**

1. SQL Editor → New query
2. Copier/coller le contenu de `supabase/storage.sql`
3. Run

### 4.2 Créer les dossiers dans le bucket

1. Cliquer sur le bucket `gallery`
2. Créer 2 dossiers :
   - `uploads/` (photos non approuvées)
   - `approved/` (photos visibles publiquement)

### 4.3 Vérifier les policies storage

1. Storage → `gallery` → Policies
2. Vérifier que les policies sont actives

---

## 🔑 Étape 5 : Récupérer les Clés API

### 5.1 Trouver les clés

1. Menu gauche → **Settings** → **API**
2. Copier :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (commence par `eyJhbG...`)

⚠️ **IMPORTANT** : Ne JAMAIS committer ces clés dans Git !

### 5.2 Configurer .env.local

1. Ouvrir le fichier `.env.local` à la racine du projet
2. Remplacer :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Sauvegarder

### 5.3 Tester la connexion

```bash
# Dans le terminal
npm run dev
```

Ouvrir la console du navigateur (F12) et taper :

```javascript
// Vérifier que Supabase est bien connecté
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

## 📊 Étape 6 : Insérer les Données de Test

### 6.1 Données déjà incluses

Le fichier `schema.sql` contient déjà :
- Exemples de programme (cérémonie, cocktail, etc.)
- Exemples de FAQ
- Exemples d'hébergements

### 6.2 Vérifier les données

1. Table Editor → `programme`
2. Vous devriez voir 4 événements
3. Table Editor → `faq` → 3 questions
4. Table Editor → `hebergements` → 2 hébergements

### 6.3 Modifier les données

1. Cliquer sur une ligne
2. Éditer les valeurs
3. Cliquer "Save"

**OU** via SQL :

```sql
-- Exemple : modifier le titre d'un événement
UPDATE public.programme
SET title = 'Cérémonie Laïque'
WHERE title = 'Cérémonie';
```

---

## ✅ Étape 7 : Vérifications Finales

### 7.1 Checklist

- [ ] Projet Supabase créé
- [ ] Tables créées (5 tables)
- [ ] RLS activé sur toutes les tables
- [ ] Policies créées (lecture/écriture)
- [ ] Bucket `gallery` créé (public)
- [ ] Dossiers `uploads/` et `approved/` créés
- [ ] Clés API copiées dans `.env.local`
- [ ] `npm run dev` fonctionne

### 7.2 Tester les Queries

Dans SQL Editor :

```sql
-- Compter les RSVP
SELECT COUNT(*) FROM public.rsvp;

-- Voir le programme
SELECT * FROM public.programme ORDER BY event_time;

-- Voir les FAQ par catégorie
SELECT * FROM public.faq ORDER BY category, display_order;

-- Statistiques RSVP
SELECT * FROM public.rsvp_stats;
```

### 7.3 Tester le Storage

1. Storage → `gallery` → `uploads/`
2. Upload une image de test
3. Vérifier qu'elle apparaît dans la liste
4. Copier l'URL publique et l'ouvrir dans le navigateur

---

## 🔧 Étape 8 : Configuration Avancée (Optionnel)

### 8.1 Activer Email Confirmations (si besoin futur)

1. Settings → Authentication → Email Templates
2. Personnaliser les templates

### 8.2 Configurer les Webhooks (monitoring)

1. Settings → Webhooks
2. Ajouter une URL pour recevoir les notifications

### 8.3 Backup Automatique

Le plan gratuit inclut 7 jours de backups automatiques.

Pour télécharger un backup :
1. Settings → Database → Backups
2. Download backup

---

## 📱 Étape 9 : Configuration Vercel (Déploiement)

### 9.1 Lier le projet à Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link
```

### 9.2 Ajouter les variables d'environnement

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Coller l'URL du projet

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Coller la clé anon

# Choisir : Production, Preview, Development
```

**OU** via le dashboard Vercel :

1. Projet → Settings → Environment Variables
2. Ajouter les 2 variables
3. Sélectionner tous les environnements

### 9.3 Déployer

```bash
vercel --prod
```

---

## 🚨 Troubleshooting

### Erreur : "relation does not exist"

**Cause** : Les tables ne sont pas créées

**Solution** :
1. Vérifier dans Table Editor que les tables existent
2. Réexécuter `schema.sql`

### Erreur : "permission denied for table"

**Cause** : RLS activé sans policies

**Solution** :
1. Vérifier que `policies.sql` a été exécuté
2. Table Editor → Sélectionner une table → Policies
3. Vérifier que les policies sont listées

### Erreur : "new row violates row-level security policy"

**Cause** : Policy trop restrictive

**Solution** :
1. Vérifier la policy INSERT de la table concernée
2. Exemple : Pour `photos`, vérifier que `is_approved = false` dans l'INSERT

### Images ne s'affichent pas

**Cause** : Bucket non public ou URL incorrecte

**Solution** :
1. Storage → `gallery` → Settings
2. Vérifier "Public bucket" = ON
3. Tester l'URL : `https://xxxxx.supabase.co/storage/v1/object/public/gallery/test.jpg`

### "Failed to fetch" dans le frontend

**Cause** : URL Supabase incorrecte dans `.env.local`

**Solution** :
1. Vérifier que `.env.local` contient les bonnes valeurs
2. Redémarrer le serveur : `npm run dev`
3. Vider le cache : Ctrl+Shift+R

---

## 📚 Ressources Utiles

- [Supabase Docs](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 🎉 Prêt !

Votre backend Supabase est maintenant configuré ! 

**Prochaines étapes** :
1. Implémenter le formulaire RSVP dans Next.js
2. Créer la galerie photos avec upload
3. Afficher le programme dynamiquement
4. Personnaliser le contenu

**Coût actuel** : 0€ ✅

---

## 💡 Commandes Utiles

```sql
-- Voir la taille de la DB
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Compter les lignes de chaque table
SELECT 
  'rsvp' as table_name, COUNT(*) as count FROM public.rsvp
UNION ALL
SELECT 'programme', COUNT(*) FROM public.programme
UNION ALL
SELECT 'faq', COUNT(*) FROM public.faq
UNION ALL
SELECT 'hebergements', COUNT(*) FROM public.hebergements
UNION ALL
SELECT 'photos', COUNT(*) FROM public.photos;

-- Supprimer toutes les données de test
TRUNCATE public.rsvp, public.photos RESTART IDENTITY CASCADE;

-- Réinitialiser une table
TRUNCATE public.rsvp RESTART IDENTITY;
```
