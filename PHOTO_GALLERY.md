# 📸 GALERIE PHOTO COLLABORATIVE

## Vue d'ensemble

La galerie photo permet aux invités d'uploader et de partager leurs photos du mariage sans authentification. Les photos sont modérées avant d'être visibles publiquement.

## Architecture

```
┌─────────────┐
│   Invité    │
└──────┬──────┘
       │ 1. Sélectionne photo + nom + message
       ↓
┌──────────────────────────────────────────────┐
│  PhotoUpload (Client Component)              │
│  - Validation côté client                    │
│  - Compression (browser-image-compression)   │
│  - Preview                                   │
│  - Rate limiting (localStorage)              │
└──────┬───────────────────────────────────────┘
       │ 2. FormData avec fichier compressé
       ↓
┌──────────────────────────────────────────────┐
│  Server Action: uploadPhoto()                │
│  - Validation serveur (zod)                  │
│  - Protection anti-spam (honeypot, rate)     │
│  - Upload vers Supabase Storage              │
│  - INSERT dans table photos                  │
└──────┬───────────────────────────────────────┘
       │ 3. Stockage + DB
       ↓
┌──────────────────────────────────────────────┐
│  Supabase Storage: gallery/uploads/          │
│  - Bucket public (lecture seule)             │
│  - 5 MB max par fichier                      │
│  - Formats: JPG, PNG, WEBP, HEIC             │
└──────────────────────────────────────────────┘
       │
┌──────────────────────────────────────────────┐
│  Table: photos                               │
│  - is_approved = false (par défaut)          │
│  - Modération admin requise                  │
└──────┬───────────────────────────────────────┘
       │ 4. Admin approuve
       ↓
┌──────────────────────────────────────────────┐
│  PhotoGallery (Server Component)             │
│  - Affiche uniquement photos approuvées      │
│  - Lazy loading des images                   │
│  - Grille responsive                         │
└──────────────────────────────────────────────┘
```

---

## Flux d'upload

### 1. Sélection de fichier (Client)

```typescript
// PhotoUpload.tsx
const handleFileChange = async (file: File) => {
  // 1. Validation initiale
  const validation = validateImageFile(file);
  if (!validation.valid) {
    setError(validation.error);
    return;
  }

  // 2. Compression côté client
  const options = {
    maxSizeMB: 2,              // Max 2 MB après compression
    maxWidthOrHeight: 1920,    // Max 1920px de largeur/hauteur
    useWebWorker: true,
    fileType: file.type,
  };
  
  const compressed = await imageCompression(file, options);
  
  // 3. Preview
  setPreviewUrl(URL.createObjectURL(compressed));
  setSelectedFile(compressed);
};
```

**Avantages :**
- ✅ Économise le quota Supabase (bande passante + storage)
- ✅ Upload plus rapide
- ✅ Expérience utilisateur améliorée

### 2. Soumission du formulaire (Client → Server)

```typescript
// PhotoUpload.tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Vérifier le rate limit local
  const limit = checkUploadLimit();
  if (!limit.allowed) {
    setError("Limite de 5 photos atteinte");
    return;
  }
  
  // Préparer FormData
  const formData = new FormData(e.currentTarget);
  formData.append("file", selectedFile);
  formData.append("timestamp", formTimestamp.current);
  
  // Appeler le Server Action
  const result = await uploadPhoto(formData);
  
  if (result.success) {
    // Incrémenter le compteur local
    incrementUploadCount();
    // Réinitialiser le formulaire
    resetForm();
  }
};
```

### 3. Server Action : Upload + Validation

```typescript
// src/app/actions/photo.ts
export async function uploadPhoto(formData: FormData) {
  // 1. Extraire les données
  const file = formData.get("file") as File;
  const uploaded_by_name = formData.get("uploaded_by_name");
  const message = formData.get("message");
  const website = formData.get("website"); // Honeypot
  const timestamp = formData.get("timestamp");
  
  // 2. Validation zod
  const validation = photoMetadataSchema.safeParse({
    uploaded_by_name,
    message,
    website,
    timestamp: parseInt(timestamp),
  });
  
  if (!validation.success) {
    return { success: false, errors: validation.error };
  }
  
  // 3. Protection anti-spam : Honeypot
  if (website && website.length > 0) {
    console.warn("Honeypot triggered");
    return { success: false, message: "Invalid" };
  }
  
  // 4. Protection anti-spam : Timestamp
  const elapsed = Date.now() - parseInt(timestamp);
  if (elapsed < 2000) { // Soumis trop vite
    return { success: false, message: "Too fast" };
  }
  
  // 5. Protection anti-spam : Rate limiting serveur
  const userIdentifier = `user-${uploaded_by_name}`;
  const rateLimit = checkServerRateLimit(userIdentifier);
  if (!rateLimit.allowed) {
    return { success: false, message: "Rate limit exceeded" };
  }
  
  // 6. Validation fichier
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { success: false, message: "Invalid format" };
  }
  
  // 7. Upload vers Supabase Storage
  const fileName = generateStorageFileName(file.name);
  const storagePath = `uploads/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from("gallery")
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: "3600",
    });
  
  if (error) {
    return { success: false, message: "Upload failed" };
  }
  
  // 8. INSERT dans la table photos
  const { data: photo, error: dbError } = await supabase
    .from("photos")
    .insert({
      uploaded_by_name,
      message,
      storage_path: storagePath,
      original_filename: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      is_approved: false, // ⚠️ Modération requise
    })
    .select("id")
    .single();
  
  if (dbError) {
    // Rollback : supprimer le fichier uploadé
    await supabase.storage.from("gallery").remove([storagePath]);
    return { success: false, message: "Database error" };
  }
  
  // 9. Incrémenter le rate limit serveur
  incrementServerRateLimit(userIdentifier);
  
  return { success: true, photoId: photo.id };
}
```

---

## Gestion des URLs signées

### URLs publiques (Galerie)

Les photos approuvées utilisent des URLs publiques directes :

```typescript
// src/lib/supabase/queries.ts
export function getPhotoPublicUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from("gallery")
    .getPublicUrl(storagePath);
  
  return data.publicUrl;
  // Ex: https://xxx.supabase.co/storage/v1/object/public/gallery/uploads/xxx.jpg
}
```

**Avantages :**
- ✅ Pas de requête serveur (direct CDN)
- ✅ Cache navigateur efficace
- ✅ Parfait pour l'affichage galerie

**Inconvénients :**
- ❌ Pas de contrôle d'accès (public = tout le monde)
- ❌ Pas d'expiration

### URLs signées (Téléchargement HD)

Pour le téléchargement post-mariage, utiliser des URLs signées :

```typescript
// src/app/actions/photo.ts
export async function getPhotoSignedUrl(
  storagePath: string,
  expiresIn: number = 3600 // 1 heure
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("gallery")
    .createSignedUrl(storagePath, expiresIn);
  
  if (error) return null;
  
  return data.signedUrl;
  // Ex: https://xxx.supabase.co/storage/v1/object/sign/gallery/xxx.jpg?token=xxx&exp=xxx
}
```

**Avantages :**
- ✅ Contrôle d'accès temporaire
- ✅ Expiration après X secondes
- ✅ Idéal pour téléchargement HD post-mariage

**Use case :**
```typescript
// Page de téléchargement (après le mariage)
export default async function DownloadPage() {
  const photos = await getApprovedPhotos();
  
  // Générer des URLs signées valables 24h
  const signedUrls = await Promise.all(
    photos.map(photo => 
      getPhotoSignedUrl(photo.storage_path, 86400) // 24h
    )
  );
  
  return (
    <div>
      {signedUrls.map((url, i) => (
        <a href={url} download key={i}>
          Télécharger photo {i + 1}
        </a>
      ))}
    </div>
  );
}
```

---

## Règles Supabase Storage

### Configuration du bucket "gallery"

```sql
-- supabase/storage.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true, -- Bucket public (lecture seule)
  5242880, -- 5 MB max par fichier
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);
```

### Policies RLS

```sql
-- Lecture publique (tout le monde peut voir)
CREATE POLICY "Gallery - Public Read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

-- Upload public (tout le monde peut uploader dans uploads/)
CREATE POLICY "Gallery - Public Upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery' AND
    (storage.foldername(name))[1] = 'uploads'
  );

-- Pas de mise à jour publique
CREATE POLICY "Gallery - No Public Update"
  ON storage.objects
  FOR UPDATE
  USING (false);

-- Pas de suppression publique
CREATE POLICY "Gallery - No Public Delete"
  ON storage.objects
  FOR DELETE
  USING (false);
```

### Structure des dossiers

```
gallery/
├── uploads/           ← Photos uploadées par les invités (non approuvées)
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.jpg
│   └── ...
└── approved/          ← Photos approuvées (déplacées manuellement)
    ├── photo-001.jpg
    ├── photo-002.jpg
    └── ...
```

**Workflow modération :**
1. Invité upload → `gallery/uploads/xxx.jpg`
2. Admin approuve → déplace vers `gallery/approved/xxx.jpg`
3. Met à jour `photos.storage_path` et `photos.is_approved = true`
4. Frontend affiche uniquement `approved/*`

---

## Protection contre les abus

### 1. Validation côté client

```typescript
// src/lib/validations/photo.ts

export function validateImageFile(file: File) {
  // Format
  const ACCEPTED_TYPES = [
    "image/jpeg", "image/jpg", "image/png", 
    "image/webp", "image/heic"
  ];
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: "Format non accepté" };
  }
  
  // Taille
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Fichier trop volumineux" };
  }
  
  // Extension
  const validExts = [".jpg", ".jpeg", ".png", ".webp", ".heic"];
  const fileName = file.name.toLowerCase();
  const hasValidExt = validExts.some(ext => fileName.endsWith(ext));
  if (!hasValidExt) {
    return { valid: false, error: "Extension invalide" };
  }
  
  return { valid: true };
}
```

### 2. Rate limiting côté client

```typescript
// src/lib/validations/photo.ts

const MAX_PHOTOS_PER_SESSION = 5;
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function checkUploadLimit() {
  const stored = localStorage.getItem("wedding_photo_uploads");
  if (!stored) return { allowed: true, remaining: 5 };
  
  const data = JSON.parse(stored);
  const now = Date.now();
  
  // Réinitialiser si session expirée
  if (now - data.timestamp > SESSION_DURATION_MS) {
    localStorage.removeItem("wedding_photo_uploads");
    return { allowed: true, remaining: 5 };
  }
  
  // Vérifier la limite
  const remaining = MAX_PHOTOS_PER_SESSION - data.count;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

export function incrementUploadCount() {
  const stored = localStorage.getItem("wedding_photo_uploads");
  const now = Date.now();
  
  if (!stored) {
    localStorage.setItem("wedding_photo_uploads", 
      JSON.stringify({ count: 1, timestamp: now })
    );
    return;
  }
  
  const data = JSON.parse(stored);
  data.count += 1;
  localStorage.setItem("wedding_photo_uploads", JSON.stringify(data));
}
```

### 3. Honeypot (anti-bot)

```tsx
// PhotoUpload.tsx
<form onSubmit={handleSubmit}>
  {/* Champ caché (les bots le remplissent automatiquement) */}
  <input
    type="text"
    name="website"
    autoComplete="off"
    tabIndex={-1}
    className="absolute left-[-9999px]"
    aria-hidden="true"
  />
  
  {/* Autres champs... */}
</form>
```

Côté serveur :
```typescript
const website = formData.get("website");
if (website && website.length > 0) {
  console.warn("Honeypot triggered - potential bot");
  return { success: false, message: "Invalid" };
}
```

### 4. Timestamp check (anti-bot)

```typescript
// PhotoUpload.tsx
const formTimestamp = useRef(Date.now());

// Soumettre le timestamp avec le formulaire
formData.append("timestamp", formTimestamp.current.toString());
```

Côté serveur :
```typescript
const timestamp = parseInt(formData.get("timestamp"));
const elapsed = Date.now() - timestamp;

// Le formulaire doit être rempli en au moins 2 secondes
if (elapsed < 2000) {
  return { success: false, message: "Too fast" };
}

// Le formulaire ne doit pas être ouvert depuis plus d'1 heure
if (elapsed > 60 * 60 * 1000) {
  return { success: false, message: "Token expired" };
}
```

### 5. Rate limiting côté serveur

```typescript
// src/app/actions/photo.ts

// Cache en mémoire (simple, pour MVP)
const uploadRateLimitCache = new Map<string, { count: number; timestamp: number }>();

function checkServerRateLimit(identifier: string) {
  const cached = uploadRateLimitCache.get(identifier);
  const now = Date.now();
  
  if (!cached) return { allowed: true, remaining: 5 };
  
  // Réinitialiser si session expirée
  if (now - cached.timestamp > SESSION_DURATION_MS) {
    uploadRateLimitCache.delete(identifier);
    return { allowed: true, remaining: 5 };
  }
  
  // Vérifier la limite
  const remaining = MAX_PHOTOS_PER_SESSION - cached.count;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

function incrementServerRateLimit(identifier: string) {
  const cached = uploadRateLimitCache.get(identifier);
  const now = Date.now();
  
  if (!cached) {
    uploadRateLimitCache.set(identifier, { count: 1, timestamp: now });
    return;
  }
  
  cached.count += 1;
}
```

**⚠️ Note :** En production, remplacer par **Upstash Redis** pour un rate limiting distribué (voir `ANTI_SPAM.md`).

### 6. Modération manuelle

```sql
-- Table photos : is_approved = false par défaut
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by_name VARCHAR(100) NOT NULL,
  message TEXT,
  storage_path TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false, -- ⚠️ Modération requise
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

**Workflow :**
1. Invité upload → `is_approved = false`
2. Admin consulte le dashboard Supabase
3. Admin vérifie la photo (contenu approprié ?)
4. Admin met à jour : `UPDATE photos SET is_approved = true WHERE id = '...'`
5. Photo visible dans la galerie publique

---

## Optimisation des quotas gratuits

### Quotas Supabase (Free Tier)

| Ressource        | Limite        | Usage type        |
|------------------|---------------|-------------------|
| Storage          | 1 GB          | Photos uploadées  |
| Bandwidth        | 2 GB / mois   | Téléchargement    |
| DB Size          | 500 MB        | Table photos      |

### Stratégies d'optimisation

#### 1. Compression côté client

```typescript
// Avant upload : 10 MB → Après compression : ~2-3 MB
const options = {
  maxSizeMB: 2,              // 70-80% de réduction
  maxWidthOrHeight: 1920,    // Suffisant pour affichage web
  useWebWorker: true,        // Non bloquant
};

const compressed = await imageCompression(file, options);
```

**Économie :** ~70% de storage + ~70% de bandwidth

#### 2. Lazy loading des images

```tsx
// PhotoGallery.tsx
<img
  src={imageUrl}
  alt={photo.uploaded_by_name}
  loading="lazy" // ← Charge uniquement les images visibles
  className="w-full h-full object-cover"
/>
```

**Économie :** ~50% de bandwidth (images hors écran non chargées)

#### 3. Cache navigateur

```typescript
// Server Action
await supabase.storage.from("gallery").upload(path, file, {
  cacheControl: "3600", // Cache 1 heure
});
```

**Économie :** Réduction des requêtes répétées

#### 4. Format WebP (optionnel)

```typescript
// Convertir JPEG/PNG en WebP côté client
const options = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  fileType: "image/webp", // ← 25-35% plus léger que JPEG
};
```

**Économie :** ~30% supplémentaire

#### 5. Modération stricte

- ❌ Refuser les photos de mauvaise qualité (floues, trop sombres)
- ❌ Refuser les doublons
- ❌ Limiter à 5 photos par invité

**Économie :** Évite le gaspillage de storage

### Estimation de capacité

Avec les optimisations :
- Photo moyenne après compression : **2 MB**
- Capacité storage (1 GB) : **500 photos**
- Capacité bandwidth (2 GB/mois) : **1000 téléchargements/mois**

Pour un mariage avec 100 invités :
- Si 50% uploadent 3 photos chacun : **150 photos = 300 MB**
- Marge restante : **700 MB** (350 photos)

✅ **Le quota gratuit est largement suffisant !**

---

## Téléchargement HD post-mariage

### Étape 1 : Créer une page de téléchargement protégée

```tsx
// src/app/telecharger/page.tsx

import { getApprovedPhotos } from "@/lib/supabase/queries";
import { getPhotoSignedUrl } from "@/app/actions/photo";

export default async function DownloadPage() {
  const photos = await getApprovedPhotos();
  
  // Générer des URLs signées valables 7 jours
  const downloads = await Promise.all(
    photos.map(async (photo) => ({
      id: photo.id,
      name: photo.uploaded_by_name,
      url: await getPhotoSignedUrl(photo.storage_path, 604800), // 7 jours
    }))
  );
  
  return (
    <div>
      <h1>Télécharger toutes les photos</h1>
      <p>Les liens expirent dans 7 jours.</p>
      
      <div className="grid gap-4">
        {downloads.map((download, i) => (
          <a
            key={download.id}
            href={download.url}
            download={`photo-${i + 1}.jpg`}
            className="flex items-center gap-4 p-4 border rounded"
          >
            <svg className="w-6 h-6">...</svg>
            <div>
              <p className="font-medium">Photo {i + 1}</p>
              <p className="text-sm text-gray-500">{download.name}</p>
            </div>
          </a>
        ))}
      </div>
      
      <button onClick={downloadAll}>
        Télécharger tout (ZIP)
      </button>
    </div>
  );
}
```

### Étape 2 : Créer un ZIP de toutes les photos

```typescript
// src/app/actions/download.ts
"use server";

import JSZip from "jszip";
import { getApprovedPhotos } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";

export async function createPhotoZip(): Promise<Blob> {
  const photos = await getApprovedPhotos();
  const zip = new JSZip();
  
  for (const photo of photos) {
    // Télécharger le fichier depuis Storage
    const { data, error } = await supabase.storage
      .from("gallery")
      .download(photo.storage_path);
    
    if (data) {
      // Ajouter au ZIP
      zip.file(`photo-${photo.id}.jpg`, data);
    }
  }
  
  // Générer le ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}
```

**⚠️ Note :** Le téléchargement ZIP consomme beaucoup de bandwidth. À activer uniquement après le mariage.

---

## Checklist de déploiement

### 1. Configuration Supabase

- [ ] Exécuter `supabase/schema.sql` (table photos)
- [ ] Exécuter `supabase/storage.sql` (bucket gallery + policies)
- [ ] Vérifier les RLS policies
- [ ] Tester l'upload depuis le dashboard

### 2. Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### 3. Installation des dépendances

```bash
npm install browser-image-compression
```

### 4. Test en local

```bash
npm run dev

# Tester :
# - Upload d'une photo
# - Compression (vérifier la taille dans la console)
# - Rate limiting (essayer 6 photos)
# - Affichage galerie (après avoir approuvé dans Supabase)
```

### 5. Déploiement Vercel

- [ ] Push sur GitHub
- [ ] Connecter Vercel
- [ ] Configurer les variables d'environnement
- [ ] Déployer
- [ ] Tester en production

### 6. Après le mariage

- [ ] Télécharger toutes les photos (backup)
- [ ] Créer le ZIP HD
- [ ] Envoyer le lien aux invités
- [ ] Archiver le projet

---

## FAQ

### Q1 : Pourquoi utiliser `browser-image-compression` ?

**R :** Pour économiser le quota Supabase. Une photo iPhone 14 fait ~10 MB. Après compression à 1920px et quality 85%, elle fait ~2-3 MB. Pour 100 photos, ça fait 200-300 MB au lieu de 1 GB.

### Q2 : Pourquoi modérer les photos ?

**R :** Pour éviter :
- ❌ Spam / contenu inapproprié
- ❌ Photos de mauvaise qualité
- ❌ Gaspillage de storage

### Q3 : Peut-on uploader depuis un mobile ?

**R :** Oui ! `browser-image-compression` fonctionne sur mobile. L'input file accepte les photos de la galerie ou de la caméra.

### Q4 : Comment gérer les formats HEIC (Apple) ?

**R :** `browser-image-compression` convertit automatiquement HEIC en JPEG. Aucune config supplémentaire.

### Q5 : Peut-on désactiver la modération ?

**R :** Oui, mais **non recommandé**. Pour désactiver :
```typescript
// src/app/actions/photo.ts
is_approved: true, // ← Au lieu de false
```

### Q6 : Comment ajouter un filtre de modération dans le dashboard ?

**R :** Dans Supabase Dashboard > Table Editor > photos :
```sql
SELECT * FROM photos WHERE is_approved = false;
```

Créer un bookmark ou une vue pour accès rapide.

---

## Améliorations futures

### 1. Interface admin de modération

Créer une page `/admin/photos` avec :
- Liste des photos en attente
- Preview
- Boutons "Approuver" / "Rejeter"

### 2. Upload multiple

Permettre de sélectionner plusieurs photos à la fois :
```tsx
<input
  type="file"
  multiple // ← Permet la sélection multiple
  accept="image/*"
/>
```

### 3. Filtre par date

Ajouter un filtre dans la galerie :
- Toutes les photos
- Cérémonie
- Vin d'honneur
- Soirée

### 4. Likes / Commentaires

Ajouter une table `photo_reactions` pour permettre aux invités de liker/commenter.

### 5. Albums automatiques

Créer des albums par période (détection de timestamp dans les EXIF).

---

## Support

- **Documentation Supabase Storage :** https://supabase.com/docs/guides/storage
- **browser-image-compression :** https://github.com/Donaldcwl/browser-image-compression
- **Next.js Server Actions :** https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

**Bon mariage ! 💍✨**
