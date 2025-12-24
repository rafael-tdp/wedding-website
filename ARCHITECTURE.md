# ARCHITECTURE.md

## Vue d'ensemble de l'architecture

### Principe Serverless

Ce projet utilise une architecture **100% serverless** :
- **Frontend** : Next.js avec App Router (SSR + SSG)
- **Backend** : Supabase (PostgreSQL + API REST automatique)
- **Storage** : Supabase Storage (S3-like)
- **Hosting** : Vercel (CDN Edge global)

**Avantages** :
- Pas de serveur à maintenir
- Scaling automatique
- Coûts ultra-faibles (gratuit pour petit trafic)
- Déploiement en 1 clic

---

## Stack Détaillée

### Frontend

**Next.js 15 + App Router**
- Routes basées sur le système de fichiers (`src/app/`)
- Server Components par défaut (moins de JS côté client)
- Streaming et Suspense natifs
- Optimisation d'images automatique

**TypeScript**
- Type safety sur tout le projet
- Autocomplétion dans l'IDE
- Détection d'erreurs à la compilation

**Tailwind CSS**
- Utility-first CSS
- Pas de fichiers CSS à gérer
- Bundle CSS optimisé automatiquement
- Responsive design facile

### Backend (Supabase)

**PostgreSQL**
- Base de données relationnelle robuste
- Free tier : 500 Mo de data
- Row Level Security (RLS) pour sécuriser les données

**API REST Auto-générée**
- Endpoints CRUD automatiques depuis vos tables
- Filtres, tri, pagination intégrés
- Client SDK TypeScript

**Supabase Storage**
- Stockage de fichiers (photos)
- Free tier : 1 Go
- Transformation d'images à la volée
- CDN intégré

**Realtime (optionnel)**
- WebSocket pour updates en temps réel
- Utile si galerie collaborative

### Déploiement (Vercel)

- Build automatique à chaque push Git
- Preview deployments pour chaque PR
- CDN Edge global (latence minimale)
- HTTPS et domaine custom inclus
- Free tier : 100 Go de bande passante/mois

---

## Flux de Données

### RSVP Flow
```
User → Next.js Page → Supabase Client → Supabase API → PostgreSQL
```

1. L'utilisateur remplit le formulaire RSVP
2. Next.js envoie les données via `supabase.from('rsvps').insert()`
3. Supabase valide et insère dans PostgreSQL
4. Réponse retournée au frontend

### Photo Upload Flow
```
User → Next.js → Supabase Storage → CDN → Display
```

1. L'utilisateur upload une photo
2. Next.js utilise `supabase.storage.from('gallery').upload()`
3. Supabase stocke le fichier et retourne l'URL publique
4. Métadonnées sauvegardées dans la table `photos`

---

## Sécurité

### Row Level Security (RLS)

Supabase utilise RLS pour sécuriser l'accès aux données :

```sql
-- Exemple : Tout le monde peut lire les photos
CREATE POLICY "Public read access" ON photos
  FOR SELECT USING (true);

-- Seuls les utilisateurs authentifiés peuvent upload
CREATE POLICY "Authenticated upload" ON photos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

### Variables d'Environnement

- Clés API stockées dans `.env.local` (non versionnées)
- Variables exposées au client préfixées par `NEXT_PUBLIC_`
- Sur Vercel : variables configurées dans le dashboard

---

## Performance

### Optimisations Next.js

- **Server Components** : Rendu côté serveur par défaut
- **Image Optimization** : Composant `<Image>` avec lazy loading
- **Code Splitting** : JS chargé uniquement quand nécessaire
- **Static Generation** : Pages statiques quand possible

### Optimisations Supabase

- **Connection Pooling** : Gestion automatique des connexions DB
- **CDN** : Storage servi via CDN global
- **Indexes** : Ajouter des indexes sur les colonnes fréquemment requêtées

---

## Scalabilité

### Limits Free Tier

**Supabase** :
- 500 Mo de DB
- 1 Go de Storage
- 2 Go de bande passante/mois
- 50 000 utilisateurs actifs mensuels

**Vercel** :
- 100 Go de bande passante/mois
- Builds illimités
- Preview deployments illimités

### Si dépassement

**Option 1** : Upgrade Supabase Pro (~25$/mois)
- 8 Go DB
- 100 Go Storage
- 250 Go bande passante

**Option 2** : Optimiser
- Compression d'images
- Lazy loading
- Cache agressif

---

## Monitoring

### Vercel Analytics (optionnel)

```bash
npm install @vercel/analytics
```

- Web Vitals
- Trafic en temps réel
- Geographic distribution

### Supabase Dashboard

- Nombre de requêtes
- Utilisation storage
- Logs des erreurs

---

## Alternatives Considérées

### Pourquoi pas Firebase ?

- Plus cher pour le storage
- NoSQL moins adapté pour relations (invités, RSVP)
- Lock-in Google plus fort

### Pourquoi pas Netlify ?

- Vercel mieux intégré avec Next.js
- Functions limits plus restrictives

### Pourquoi pas un VPS ?

- Nécessite maintenance
- Coût minimal ~5$/mois même sans trafic
- Pas de scaling automatique
