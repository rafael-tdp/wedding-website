# Site de Mariage 💍

Site web moderne et serverless pour gérer les informations de mariage, les RSVP et la galerie photo collaborative.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd wedding

# Installer les dépendances
npm install
```

### 2. Configuration Supabase (REQUIS)

**⚠️ Le site ne fonctionnera pas sans cette étape !**

1. **Créez un projet Supabase** (gratuit)
   - Allez sur https://supabase.com
   - Créez un compte et un nouveau projet
   - Attendez ~2 minutes que le projet soit prêt

2. **Récupérez vos identifiants**
   - Dans votre projet : Settings > API
   - Copiez **Project URL** et **anon public key**

3. **Configurez .env.local**
   - Ouvrez le fichier `.env.local` à la racine
   - Remplacez les valeurs placeholder par les vôtres :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

4. **Créez les tables**
   - Dans Supabase : SQL Editor
   - Exécutez dans l'ordre :
     1. `supabase/schema.sql`
     2. `supabase/policies.sql`
     3. `supabase/storage.sql`

📖 **Guide détaillé : [CONFIGURATION.md](CONFIGURATION.md)**

### 3. Lancer le projet

```bash
npm run dev
```

Ouvrez http://localhost:3000 🎉

## 🏗️ Architecture

### Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Stockage** : Supabase Storage
- **Déploiement** : Vercel
- **Coût** : Minimal (free tiers)

### Choix Techniques

**Pourquoi Next.js App Router ?**
- SSR et SSG natifs pour de meilleures performances
- API Routes intégrées (pas besoin de serveur séparé)
- Optimisation automatique des images
- Déploiement zero-config sur Vercel

**Pourquoi Supabase ?**
- Free tier généreux (500 Mo de DB, 1 Go de Storage)
- PostgreSQL avec API REST automatique
- Authentification intégrée (si besoin futur)
- Realtime subscriptions disponibles
- Pas de serveur à gérer

**Pourquoi Vercel ?**
- Free tier suffisant pour un site de mariage
- Déploiement automatique depuis Git
- CDN global inclus
- Domaine custom gratuit

## 📁 Structure du Projet

```
wedding/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── layout.tsx         # Layout racine
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── globals.css        # Styles globaux
│   │   ├── infos/             # Page informations pratiques
│   │   ├── rsvp/              # Page RSVP
│   │   └── gallery/           # Page galerie photos
│   │
│   ├── components/            # Composants réutilisables
│   │   ├── layout/           # Composants de layout
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/               # Composants UI de base
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   │
│   ├── lib/                   # Utilitaires et configuration
│   │   ├── supabase/
│   │   │   └── client.ts     # Client Supabase
│   │   └── utils.ts          # Fonctions utilitaires
│   │
│   └── types/                 # Types TypeScript
│       └── index.ts          # Types globaux
│
├── public/                    # Assets statiques
│
├── .env.example              # Template variables d'environnement
├── .env.local               # Variables d'environnement (non versionnées)
├── next.config.ts           # Configuration Next.js
├── tailwind.config.ts       # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
└── package.json             # Dépendances du projet
```

## 📄 Pages Prévues

### `/` - Accueil
- Hero section avec noms des mariés
- Date et lieu du mariage
- Compte à rebours
- Lien vers RSVP

### `/infos` - Informations Pratiques
- Lieu de la cérémonie (avec carte)
- Lieu de la réception
- Hébergements recommandés
- Dress code
- Timeline de la journée

### `/rsvp` - Confirmation de Présence
- Formulaire RSVP
- Gestion des +1
- Restrictions alimentaires
- Message aux mariés

### `/gallery` - Galerie Photos
- Upload de photos par les invités
- Affichage en grille
- Téléchargement d'albums

## 🧩 Composants Globaux

### Layout
- **Header** : Navigation principale
- **Footer** : Copyright et liens

### UI
- **Button** : Bouton avec variants (primary, secondary, outline)
- **Card** : Carte de contenu avec ombre
- **Input** : Champs de formulaire stylisés (à créer selon besoins)
- **Modal** : Fenêtre modale (à créer selon besoins)

### Features
- **CountdownTimer** : Compte à rebours jusqu'au jour J (à implémenter)
- **Map** : Intégration carte Google Maps (à implémenter)
- **PhotoUpload** : Upload de photos vers Supabase Storage (à implémenter)
- **RSVPForm** : Formulaire de confirmation (à implémenter)

## 🔐 Variables d'Environnement

Créer un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optionnel : si vous avez besoin de clés d'API
# GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Obtenir les clés Supabase

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans Settings → API
4. Copier `URL` et `anon public` key

## 🚀 Démarrage

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

### Build de Production

```bash
npm run build
npm start
```

### Vérification des Types

```bash
npm run type-check
```

## 📦 Déploiement sur Vercel

### Première fois

1. Installer Vercel CLI : `npm i -g vercel`
2. Se connecter : `vercel login`
3. Déployer : `vercel`

### Déploiement automatique

1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement dans le dashboard Vercel
3. Chaque push sur `main` déclenchera un déploiement

## 🗄️ Supabase - Tables à Créer

**Note** : Créer les tables directement dans le dashboard Supabase (SQL Editor)

### Tables suggérées :
- `guests` : Informations des invités
- `rsvps` : Réponses de présence
- `photos` : Métadonnées des photos uploadées

### Storage Buckets :
- `gallery` : Bucket pour les photos de la galerie

## 📝 Prochaines Étapes

1. [ ] Configurer Supabase et créer les tables
2. [ ] Implémenter le formulaire RSVP
3. [ ] Ajouter l'upload de photos
4. [ ] Intégrer Google Maps pour les lieux
5. [ ] Personnaliser le design (couleurs, fonts)
6. [ ] Ajouter les vraies informations du mariage
7. [ ] Tester sur mobile
8. [ ] Déployer sur Vercel

## 🛠️ Scripts Utiles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build de production
npm run start        # Lance le build de production
npm run lint         # Vérifie le code avec ESLint
npm run type-check   # Vérifie les types TypeScript
```

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Vercel](https://vercel.com/docs)

## ⚠️ Important

- Ne jamais committer `.env.local` (déjà dans `.gitignore`)
- Utiliser des Row Level Security (RLS) policies dans Supabase
- Optimiser les images avant upload
- Tester sur différents devices

## 💰 Estimation des Coûts

**Free tier suffisant pour** :
- Site avec ~200 invités
- ~1000 photos dans la galerie
- Bande passante Vercel gratuite jusqu'à 100 Go/mois
- Supabase : 500 Mo DB + 1 Go Storage gratuit

**Total estimé** : 0€/mois pour un site de mariage classique
