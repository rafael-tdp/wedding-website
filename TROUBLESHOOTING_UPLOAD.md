# 🔧 Troubleshooting : Erreur lors de l'upload de photos

## Symptômes

L'utilisateur voit : **"Erreur lors de l'upload. Veuillez réessayer."**

Mais aucun détail sur la cause réelle.

## ✅ Améliorations apportées

Nous avons ajouté un **logging détaillé** dans :

### 1. **Serveur** (`src/app/actions/photo.ts`)
- ❌ **Anciennement** : Message d'erreur générique, pas de détails
- ✅ **Maintenant** : Logs détaillés incluant :
  - Error code: `dbError.code` 
  - Error message: `dbError.message`
  - Error details: `dbError.details`
  - Storage path testé
  - Erreur complète en console

### 2. **Client** (`src/components/gallery/PhotoUpload.tsx`)
- ✅ Affichage amélioré avec :
  - Icône d'erreur
  - Titre en gras
  - Message d'erreur détaillé
  - Listage des erreurs de validation (si plusieurs)
  - Logs console : `console.log("Upload result:", result)`

### 3. **Correction de schema**
- ❌ **Avant** : Colonnes obsolètes
  - `uploaded_by_name` → ✅ `uploaded_by`
  - `message` → ✅ `caption`
  - `original_filename` → ✅ `filename`
  - `file_size_bytes` → ✅ `file_size`
  - Missing: `public_url` (généré automatiquement)

- ✅ **Maintenant** : Toutes les colonnes correctes
  ```typescript
  insert({
    storage_path: storagePath,
    public_url: publicUrl,        // Généré via getPhotoPublicUrl()
    filename: file.name,
    file_size: file.size,
    mime_type: file.type,
    uploaded_by: metadata.uploaded_by_name,
    caption: metadata.message || null,
    is_approved: false,
    is_visible: false,
  })
  ```

## 🔍 Comment déboguer

### Étape 1 : Ouvrir les DevTools
```
Mac: Cmd + Option + I
Windows/Linux: F12 ou Ctrl + Shift + I
```

### Étape 2 : Aller à l'onglet "Console"

### Étape 3 : Essayer un upload et chercher les messages :
```
[1] Console.log de succès/erreur:
    "Upload result:" { success: false, message: "...", ... }

[2] Si erreur, chercher:
    "Database error:"
    "Upload error:"
    "Error code:" 
    "Error message:"
```

### Étape 4 : Essayer les erreurs possibles

#### ❌ Erreur 1 : Bucket "gallery" n'existe pas
```
Console: 
Error code: 404
Error message: "Bucket not found"
```

**Résolution** :
1. Aller à Supabase Dashboard → Storage
2. Cliquer "Create bucket"
3. Nommer : `gallery`
4. Décocher "Private bucket" (le rendre PUBLIC)
5. Créer le bucket

---

#### ❌ Erreur 2 : Colonnes invalides
```
Console:
Error code: 42703
Error message: "column "uploaded_by_name" does not exist"
```

**Résolution** : 
Vous aviez le problème avec les anciens noms de colonnes. 
C'est maintenant ✅ **CORRIGÉ** dans le code.
Redémarrez le serveur:
```bash
Ctrl + C (arrêter)
npm run dev (redémarrer)
```

---

#### ❌ Erreur 3 : Permissions Supabase Storage
```
Console:
Error message: "Access denied" ou "Unauthorized"
```

**Résolution** :
1. Aller à Supabase Dashboard → Storage → gallery
2. Cliquer "Policies"
3. Ajouter une policy :
   - **SELECT** (lecture) : `public` (tous peuvent voir)
   - **INSERT** (upload) : `(true)` (tous peuvent uploader)
   - **DELETE** (suppression) : `auth.role() = 'authenticated'` (admin seulement)

---

#### ❌ Erreur 4 : Table "photos" n'existe pas
```
Console:
Error code: 42P01
Error message: 'relation "photos" does not exist'
```

**Résolution** :
Exécuter le schéma dans Supabase SQL Editor :
1. Aller à Supabase Dashboard → SQL Editor
2. Cliquer "New Query"
3. Copier le contenu de `supabase/schema.sql`
4. Coller et cliquer "Run"

---

#### ❌ Erreur 5 : Rate limiting
```
Console:
Error message: "Limite atteinte : 5 photos maximum par session (30 minutes)"
```

**Résolution** :
C'est normal ! L'utilisateur a uploadé 5 photos déjà.
- Attendre 30 minutes, ou
- Ouvrir dans incognito / un autre navigateur, ou
- Vider localStorage (DevTools → Application → localStorage → wedding → Clear)

---

## 📊 État de la base de données

Pour vérifier que tout est bien en place :

### Vérifier le bucket existe
```sql
-- Dans Supabase SQL Editor (pas direct, mais visuel dans Storage)
-- Allez à Storage > gallery > Voir les uploads/
```

### Vérifier la table photos existe
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'photos';
```

### Vérifier la structure photos
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'photos';
```

Vous devez voir ces colonnes :
- `id` (uuid)
- `storage_path` (text)
- `public_url` (text) ← **IMPORTANT**
- `filename` (varchar)
- `file_size` (integer)
- `mime_type` (varchar)
- `width` (integer)
- `height` (integer)
- `caption` (text)
- `alt_text` (varchar)
- `uploaded_by` (varchar)
- `uploader_email` (varchar)
- `is_approved` (boolean)
- `is_visible` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## ✅ Checklist avant de tester

- [ ] **Bucket "gallery" créé** dans Supabase Storage (public)
- [ ] **Table "photos" créée** via schema.sql
- [ ] **Permissions bucket** configurées (SELECT public, INSERT all)
- [ ] **Serveur redémarré** après les corrections (`npm run dev`)
- [ ] **DevTools console ouverte** avant de tester
- [ ] **Cache browser vidé** (Cmd+Shift+Delete ou Ctrl+Shift+Delete)

---

## 📋 Résumé des corrections

| Problème | Solution | Status |
|----------|----------|--------|
| Noms colonnes obsolètes | ✅ Corrigés dans `photo.ts` | ✅ DONE |
| Pas de public_url | ✅ Ajouté via `getPhotoPublicUrl()` | ✅ DONE |
| Messages d'erreur génériques | ✅ Détails complets en console | ✅ DONE |
| UI d'erreur peu visible | ✅ Amélioré avec icône et styling | ✅ DONE |

---

## 🆘 Erreur non listée ?

Si vous voyez une erreur non décrite ci-dessus, veuillez :

1. **Copier le message exact** de la console
2. **Reporter dans les DevTools** tous les logs du serveur
3. Envoyer une capture d'écran avec :
   - Le formulaire d'upload visible
   - L'erreur affichée
   - Les logs console (élargis)
