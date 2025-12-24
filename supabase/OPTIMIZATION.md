# 💾 Optimisation Supabase - Plan Gratuit

## 🎯 Objectif

Rester dans les limites du **free tier Supabase** pour un site de mariage (~200 invités).

---

## 📊 Limites du Free Tier

| Ressource | Limite Gratuite | Estimation Site Mariage |
|-----------|----------------|-------------------------|
| **Database** | 500 MB | ~10-50 MB ✅ |
| **Storage** | 1 GB | ~500 MB (photos) ✅ |
| **Bandwidth** | 2 GB/mois | ~1 GB ✅ |
| **MAU** (utilisateurs actifs) | 50,000/mois | ~200 ✅ |
| **Requests** | Illimités | ✅ |

**Verdict** : Le free tier est **largement suffisant** pour un site de mariage ! 🎉

---

## 🗄️ Optimisation Database (500 MB)

### Estimation de Stockage

```
Table RSVP:
- 200 invités × ~500 bytes = ~100 KB ✅

Table Programme:
- ~10 événements × ~300 bytes = ~3 KB ✅

Table FAQ:
- ~20 questions × ~400 bytes = ~8 KB ✅

Table Hébergements:
- ~15 hébergements × ~600 bytes = ~9 KB ✅

Table Photos:
- 500 photos × ~200 bytes (métadonnées) = ~100 KB ✅
  (Les images sont dans Storage, pas en DB !)

TOTAL DB: ~250 KB sur 500 MB disponibles
```

**Marge** : 99.95% de disponible ! 🚀

### ✅ Bonnes Pratiques DB

1. **Stocker seulement les métadonnées en DB**
   ```sql
   -- ✅ BON : Stocker l'URL
   public_url TEXT
   
   -- ❌ MAUVAIS : Stocker l'image en base64
   image_data TEXT -- Ne JAMAIS faire ça !
   ```

2. **Nettoyer les données de test**
   ```sql
   -- Avant de passer en production
   DELETE FROM public.rsvp WHERE guest_email LIKE '%@test.com';
   DELETE FROM public.photos WHERE is_approved = false AND created_at < now() - interval '30 days';
   ```

3. **Utiliser les indexes** (déjà fait dans `schema.sql`)
   - Les queries sont 10-100x plus rapides
   - Ne prennent quasi pas de place

4. **Limiter la longueur des TEXT**
   ```sql
   -- Au lieu de TEXT illimité, limiter si possible
   message VARCHAR(1000) -- Max 1000 caractères
   ```

---

## 📸 Optimisation Storage (1 GB)

### Estimation Photos

```
Scénario conservateur:
- 500 photos uploadées
- Taille moyenne : 1.5 MB/photo (après compression)
- TOTAL : 750 MB sur 1 GB disponible ✅

Scénario optimisé:
- Compression automatique côté frontend
- Photos en WebP (30-50% plus léger)
- TOTAL : ~400 MB ✅
```

### ✅ Stratégies d'Optimisation

#### 1. Compression Côté Frontend (Avant Upload)

```typescript
// Exemple de compression (à implémenter plus tard)
async function compressImage(file: File): Promise<Blob> {
  const maxWidth = 1920;
  const maxHeight = 1080;
  const quality = 0.85; // 85% qualité
  
  // Compression avec canvas ou librairie (browser-image-compression)
  // Réduit typiquement de 70-90% la taille
}
```

**Impact** : 5 MB → 500 KB par photo ! 🔥

#### 2. Limites d'Upload

```sql
-- Déjà configuré dans storage.sql
file_size_limit: 5242880  -- 5 MB max par fichier
```

#### 3. Format WebP

```typescript
// Forcer le format WebP lors de l'upload
const webpBlob = await convertToWebP(imageFile);
```

**Impact** : -30 à -50% de taille vs JPEG

#### 4. Suppression Auto des Photos Non Approuvées

```sql
-- Cron job (Edge Function) : supprimer photos > 30 jours non approuvées
DELETE FROM public.photos
WHERE is_approved = false 
  AND created_at < now() - interval '30 days';
```

---

## 🌐 Optimisation Bandwidth (2 GB/mois)

### Estimation Trafic

```
Scénario 200 invités sur 3 mois:
- Chaque invité visite 5 pages
- Chaque page = ~500 KB (images optimisées)
- 200 invités × 5 pages × 500 KB = 500 MB ✅

+ Galerie photos:
- 200 invités voient 50 photos chacun
- 50 photos × 400 KB × 200 = 4 GB ❌
```

**Problème** : La galerie peut dépasser !

### ✅ Solutions Bandwidth

#### 1. CDN Vercel (Recommandé)

Vercel met en cache les images Supabase automatiquement.

```typescript
// next.config.ts - Déjà configuré !
images: {
  remotePatterns: [{
    protocol: "https",
    hostname: "**.supabase.co",
  }],
}
```

**Impact** : 90% des requêtes images servent depuis le cache Vercel ✅

#### 2. Lazy Loading (Déjà natif Next.js)

```tsx
import Image from "next/image";

<Image 
  src={photoUrl} 
  loading="lazy"  // Chargé seulement quand visible
  alt="Photo"
/>
```

#### 3. Thumbnails

```typescript
// Générer des miniatures pour la galerie
const thumbnailUrl = supabase
  .storage
  .from('gallery')
  .getPublicUrl('approved/photo.jpg', {
    transform: {
      width: 400,
      height: 300,
      resize: 'cover',
    }
  });
```

**Impact** : 1.5 MB → 50 KB pour les miniatures ! 🚀

---

## 🔐 Monitoring et Alertes

### Dashboard Supabase

Vérifier régulièrement :

1. **Database**
   - Settings → Database → Usage
   - Alerter si > 400 MB

2. **Storage**
   - Settings → Storage → Usage
   - Alerter si > 800 MB

3. **Bandwidth**
   - Settings → Usage → Bandwidth
   - Monitorer semaine par semaine

### Queries SQL de Monitoring

```sql
-- Taille de la DB
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as db_size;

-- Taille par table
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Nombre de photos
SELECT 
  COUNT(*) as total_photos,
  COUNT(*) FILTER (WHERE is_approved = true) as approved,
  COUNT(*) FILTER (WHERE is_approved = false) as pending
FROM public.photos;

-- Stats RSVP
SELECT * FROM public.rsvp_stats;
```

---

## 📋 Checklist d'Optimisation

### Avant le Lancement

- [x] Schéma DB optimisé (tables, indexes)
- [x] RLS activé sur toutes les tables
- [x] Storage configuré avec limites (5 MB/fichier)
- [ ] Compression images côté frontend
- [ ] Format WebP privilégié
- [ ] Lazy loading activé
- [ ] Miniatures pour la galerie

### Pendant l'Événement

- [ ] Monitorer le dashboard Supabase quotidiennement
- [ ] Approuver les photos régulièrement
- [ ] Supprimer les photos floues/doublons
- [ ] Vérifier le bandwidth

### Après l'Événement

- [ ] Exporter toutes les photos
- [ ] Nettoyer les données de test
- [ ] Archiver les RSVP
- [ ] Désactiver les uploads de photos

---

## 🚨 Plan de Secours (si Dépassement)

### Si Storage > 1 GB

**Option 1** : Upgrade Supabase Pro
- 8$/mois (seulement 1-2 mois nécessaires)
- 100 GB de storage
- Cancel après le mariage

**Option 2** : Cloudinary (Free Tier)
- 25 GB de stockage gratuit
- Transformer + optimiser les images
- Migrer seulement la galerie photos

**Option 3** : Limiter les uploads
```typescript
// Désactiver upload si quota dépassé
const PHOTO_LIMIT = 500;
const currentCount = await getPhotoCount();
if (currentCount >= PHOTO_LIMIT) {
  throw new Error('Galerie pleine');
}
```

### Si Bandwidth > 2 GB/mois

**Option 1** : Vercel CDN fait le job ✅

**Option 2** : Activer Cloudflare (gratuit)
- Proxy devant Supabase
- Cache agressif

---

## 💡 Optimisations Futures (Nice to Have)

1. **Edge Functions pour Compression**
   ```typescript
   // Compresser automatiquement à l'upload
   Deno.serve(async (req) => {
     const file = await req.formData();
     const compressed = await compress(file);
     return new Response(compressed);
   });
   ```

2. **Backup Automatique**
   ```bash
   # Exporter la DB via CLI
   supabase db dump > backup.sql
   ```

3. **Archivage Post-Mariage**
   ```sql
   -- Migrer vers une table archive
   INSERT INTO rsvp_archive SELECT * FROM rsvp;
   TRUNCATE rsvp;
   ```

---

## 📈 Résumé

| Métrique | Limite | Utilisation Estimée | Marge |
|----------|--------|---------------------|-------|
| Database | 500 MB | < 1 MB | 99.8% ✅ |
| Storage | 1 GB | ~500 MB | 50% ✅ |
| Bandwidth | 2 GB/mois | ~1 GB | 50% ✅ |

**Conclusion** : Avec les optimisations décrites, le free tier Supabase est **parfaitement adapté** ! 🎉

Le site peut supporter :
- ✅ 200-300 invités
- ✅ 500-800 photos
- ✅ Plusieurs mois d'activité
- ✅ Coût = 0€

---

## 🔗 Ressources

- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Storage Limits](https://supabase.com/docs/guides/storage/limits)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Browser Image Compression](https://github.com/Donaldcwl/browser-image-compression)
