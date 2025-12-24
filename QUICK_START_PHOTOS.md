# 🚀 Guide Rapide : Tester l'Upload de Photos

## ⚡ TL;DR (30 secondes)

### 1. Vérifier la configuration Supabase
```
❌ Bucket "gallery" n'existe pas ? → Créer dans Storage
❌ Table "photos" n'existe pas ? → Exécuter schema.sql
❌ Pas d'accès ? → Configurer RLS policies
```

### 2. Redémarrer le serveur
```bash
Ctrl + C
npm run dev
```

### 3. Ouvrir DevTools
```
Mac: Cmd + Option + I
Windows: F12
```

### 4. Tester un upload
- Aller à `/galerie`
- Remplir "Votre nom"
- Remplir "Votre message (optionnel)"
- Sélectionner une photo (<2MB)
- Cliquer "Partager ma photo"

### 5. Regarder la console (F12 > Console)
```
✅ Si succès:
   "Upload result:" { success: true, ... }

❌ Si erreur:
   "Upload failed:" { success: false, message: "..." }
   "Database error:" { code: "...", message: "..." }
```

---

## 📋 Checklist complète

### Configuration Supabase

- [ ] **Storage > Créer bucket "gallery"**
  1. Cliquer "Create bucket"
  2. Nom: `gallery`
  3. **Décocher** "Private bucket"
  4. Create bucket
  
- [ ] **Storage > gallery > Policies**
  1. New policy "Allow public SELECT"
  2. New policy "Allow public INSERT" → `(true)`
  3. New policy "Allow authenticated DELETE" → `(auth.role() = 'authenticated')`

- [ ] **SQL Editor > Exécuter schema.sql**
  1. Copier `supabase/schema.sql`
  2. Nouveau query
  3. Paste et Run

### Code local

- [ ] Serveur redémarré (`npm run dev`)
- [ ] Cache vidé (Cmd+Shift+Delete)
- [ ] Pas d'erreurs TypeScript visibles

### Test

- [ ] Formulaire d'upload visible à `/galerie`
- [ ] Compression fonctionne (image affiche "Compression: X MB → Y MB")
- [ ] Preview s'affiche
- [ ] Upload sans erreur en console
- [ ] Message de succès vert visible

---

## 🔄 Flux complet d'une photo

```
1. Utilisateur sélectionne une photo
   ↓
2. Client valide le fichier (type, taille)
   ↓
3. Client compresse l'image (max 2MB, 1920px)
   ↓
4. User remplit "Nom" et "Message"
   ↓
5. User clique "Partager ma photo"
   ↓
6. Server Action uploadPhoto() reçoit FormData
   ├─ Valide métadonnées (nom, message)
   ├─ Anti-spam (honeypot, timestamp, rate limit)
   ├─ Upload vers Storage: gallery/uploads/{nom}
   ├─ Génère public_url
   ├─ INSERT dans table photos
   │  ├─ uploaded_by (nom du user)
   │  ├─ caption (message)
   │  ├─ storage_path
   │  ├─ public_url
   │  ├─ filename
   │  ├─ file_size
   │  ├─ mime_type
   │  ├─ is_approved = false
   │  └─ is_visible = false
   └─ Return { success: true, photoId }
   ↓
7. Client affiche message vert "Succès"
   ↓
8. Admin voit la photo en attente dans /admin
   ↓
9. Admin l'approuve
   ↓
10. Photo apparaît dans la galerie publique
```

---

## 🔍 Logs à chercher en console

### ✅ Succès
```javascript
"Upload result:" {
  success: true,
  message: "Photo uploadée avec succès ! Elle sera visible après modération.",
  photoId: "123e4567-e89b-12d3-a456-426614174000"
}

"Upload successful!"
```

### ❌ Erreur Storage (bucket)
```javascript
"Upload error:" {
  message: "Bucket not found"
}

"Error message:" "Bucket not found"
"Storage path:" "uploads/2024-12-22_abc123.jpg"
```

**Solution**: Créer le bucket `gallery`

### ❌ Erreur Database (colonnes)
```javascript
"Database error:" {
  code: "42703",
  message: "column \"uploaded_by_name\" does not exist"
}
```

**Solution**: ✅ Déjà corrigé ! Redémarrer le serveur.

### ❌ Erreur Permissions (RLS)
```javascript
"Upload error:" {
  message: "Access denied" ou "Unauthorized"
}
```

**Solution**: Ajouter RLS policies au bucket

---

## 📊 Résultat attendu après corrections

### En base de données
```sql
SELECT * FROM photos LIMIT 1;

id                   | 'uuid'
uploaded_by          | 'Jean Dupont'           ← Corrigé ✅
caption              | 'Mariage magnifique!'    ← Corrigé ✅
storage_path         | 'uploads/2024...'        ← Corrigé ✅
filename             | 'photo.jpg'              ← Corrigé ✅
public_url           | 'https://...' (storage)  ← Ajouté ✅
file_size            | 1500000                  ← Corrigé ✅
mime_type            | 'image/jpeg'
is_approved          | false
is_visible           | false
created_at           | 2024-12-22 14:30:00
updated_at           | 2024-12-22 14:30:00
```

---

## 🛠️ Commandes utiles

```bash
# Redémarrer le serveur
Ctrl + C
npm run dev

# Vider le cache de build
rm -rf .next

# Vérifier la syntaxe TypeScript
npx tsc --noEmit --skipLibCheck

# Voir les logs Supabase
# → Supabase Dashboard > Logs > Edge Functions / Storage

# Tester les colonnes en SQL
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'photos';
```

---

## 📞 Dépannage rapide

| Symptôme | Cause | Solution |
|----------|-------|----------|
| Aucun erreur, mais photo n'apparaît pas | Pas d'erreur avant upload ? | Chercher "Upload result:" en console |
| "Erreur lors de l'upload" simple | Message d'erreur non détaillé | Ouvrir console (F12) pour voir détails |
| Upload silencieux (rien ne se passe) | Réseau/CORS bloqué | Chercher erreur réseau en "Network" tab |
| "Colonne inexistante" | Vieux code encore chargé | Redémarrer + vider cache (Cmd+Shift+Delete) |
| Rate limit " 5 photos max" | Utilisateur a uploadé 5 photos | Attendre 30 min ou utiliser incognito |
| Bucket not found | Bucket n'existe pas | Créer bucket dans Storage |
| Access denied | RLS policies insuffisantes | Ajouter policy INSERT avec `(true)` |

---

## 📚 Documentation complète

- **Erreurs détaillées** → `TROUBLESHOOTING_UPLOAD.md`
- **Configuration Supabase** → `docs/SETUP_STORAGE_BUCKET.md`
- **Vérification base** → `supabase/verify-photos.sql`
- **Résumé des fixes** → `FIXES_SUMMARY.md`

Exécuter depuis le projet:
```bash
cat FIXES_SUMMARY.md        # Résumé court
cat TROUBLESHOOTING_UPLOAD.md  # Détails complets
```

---

## ✨ Points clés des corrections

1. **Noms colonnes fixés** (uploaded_by_name → uploaded_by, etc.)
2. **public_url généré** automatiquement
3. **Erreurs détaillées** en console
4. **UI améliorée** (icône + styling)
5. **Tous les logs** en place pour déboguer

👉 C'est prêt à tester ! Bonne chance ! 🎉
