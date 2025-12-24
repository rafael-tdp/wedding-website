# 🪣 Configuration Supabase Storage - Bucket "gallery"

## ⚡ Début rapide (2 minutes)

### Étape 1 : Créer le bucket
1. Aller à **Supabase Dashboard**
2. Cliquer sur **Storage** (menu de gauche)
3. Cliquer sur **Create bucket**
4. Nom : `gallery`
5. **Décocher** "Private bucket" (rendre PUBLIC)
6. Cliquer **Create bucket**

✅ Bucket créé !

### Étape 2 : Configurer les permissions (RLS)
1. Cliquer sur le bucket `gallery` → **Policies**
2. Cliquer **New policy** → **For public access**
   - **Name** : `Allow public SELECT`
   - **Operation** : SELECT
   - **With check** : laissez vide (déjà prérempli)
   - **Create policy**

3. Cliquer **New policy** → **For inserting data**
   - **Name** : `Allow public INSERT`
   - **Operation** : INSERT
   - **With check** : changez à `(true)`
   - **Create policy**

4. Cliquer **New policy** → **For deleting data**
   - **Name** : `Allow authenticated DELETE`
   - **Operation** : DELETE
   - **With check** : `(auth.role() = 'authenticated')`
   - **Create policy**

✅ Permissions configurées !

---

## 🔍 Vérification rapide

### Dans la console du site (F12)
```javascript
// Allez à l'onglet Console et exécutez :
const { data } = await supabaseClient
  .storage.from('gallery')
  .list('uploads', { limit: 1 });

if (data) console.log('✅ Bucket existe et est accessible');
else console.log('❌ Erreur d\'accès');
```

### Via SQL
Exécutez le script `supabase/verify-photos.sql` :
1. Supabase Dashboard → **SQL Editor**
2. **New query**
3. Copier-coller le contenu de `verify-photos.sql`
4. **Run**

Vous verrez un rapport de vérification complet.

---

## 🛠️ Résolution des problèmes

### ❌ Erreur : "Bucket not found"
- [ ] Vérifier que le bucket s'appelle exactement `gallery`
- [ ] Vérifier qu'il n'est pas privé (décoché "Private bucket")
- [ ] Attendre quelques secondes (propagation)

### ❌ Erreur : "Access denied" lors d'upload
- [ ] Vérifier les RLS policies existent
- [ ] Vérifier la policy INSERT a `(true)` comme check
- [ ] Attendre 30 secondes (propagation des RLS)

### ❌ Le bucket existe mais l'upload reste bloqué
- [ ] Vider le cache du navigateur (Ctrl+Shift+Delete)
- [ ] Redémarrer le serveur Next.js (Ctrl+C, npm run dev)
- [ ] Essayer en incognito

---

## 📝 Contenu attendu du bucket après un upload

```
gallery/
└── uploads/
    ├── 2024-12-22_abc123.jpg    (Photo 1)
    ├── 2024-12-22_def456.jpg    (Photo 2)
    └── 2024-12-22_ghi789.jpg    (Photo 3)
```

Chaque fichier généré a un nom unique : `{timestamp}_{randomId}.{extension}`

---

## 🔐 Matrice des permissions finales

| Operation | Public | Authenticated | Admin |
|-----------|--------|---------------|-------|
| **SELECT** (voir)    | ✅ | ✅ | ✅ |
| **INSERT** (uploader)| ✅ | ✅ | ✅ |
| **UPDATE** (éditer)  | ❌ | ❌ | ✅ |
| **DELETE** (supprimer)| ❌ | ✅ | ✅ |

**Explication** :
- Tous peuvent voir les photos (public)
- Tous peuvent uploader (public)
- Seuls les authentifiés (admins) peuvent supprimer

---

## 📞 Besoin d'aide ?

1. Ouvrir **DevTools** (F12)
2. Aller à l'onglet **Network**
3. Essayer un upload
4. Chercher les requêtes `storage.upload`
5. Vérifier le **status code** :
   - 200 = ✅ Succès
   - 404 = ❌ Bucket not found
   - 403 = ❌ Forbidden (permissions RLS)
   - 429 = Rate limited
   - Autre = Voir le message d'erreur

Voir **TROUBLESHOOTING_UPLOAD.md** pour plus de détails.
