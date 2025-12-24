# 🚀 Configuration Rapide

## Étape 1 : Créer un projet Supabase

1. Allez sur https://supabase.com
2. Créez un compte gratuit (GitHub ou email)
3. Cliquez sur "New Project"
4. Remplissez :
   - **Name** : `wedding-site` (ou le nom de votre choix)
   - **Database Password** : Générez un mot de passe fort (sauvegardez-le !)
   - **Region** : Choisissez la région la plus proche
   - **Pricing Plan** : Free (suffisant pour ce projet)
5. Cliquez sur "Create new project" (attend ~2 minutes)

## Étape 2 : Récupérer vos identifiants

1. Dans votre projet Supabase, allez dans **Settings** (⚙️ en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez deux sections :
   - **Project URL** : Copiez l'URL (ex: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Project API keys** : Copiez la clé **anon/public** (commence par `eyJ...`)

## Étape 3 : Configurer .env.local

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs placeholder :

```env
# Remplacez ces valeurs par les vôtres
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

3. Sauvegardez le fichier

## Étape 4 : Créer les tables

1. Dans Supabase, allez dans **SQL Editor** (icône </>)
2. Cliquez sur "New query"
3. Copiez tout le contenu du fichier `supabase/schema.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" (▶️)
6. Répétez pour `supabase/policies.sql` et `supabase/storage.sql`

### Ordre d'exécution des fichiers SQL :
```
1. supabase/schema.sql     (tables + fonctions)
2. supabase/policies.sql   (sécurité RLS)
3. supabase/storage.sql    (bucket photos)
```

## Étape 5 : Vérifier que tout fonctionne

```bash
# Redémarrer le serveur de développement
npm run dev
```

Ouvrez http://localhost:3000 - vous devriez voir le site sans erreurs !

## ❓ Problèmes courants

### Erreur : "Invalid supabaseUrl"
- ✅ Vérifiez que `.env.local` existe
- ✅ Vérifiez que les valeurs ne contiennent pas "your" ou "placeholder"
- ✅ Redémarrez le serveur après modification du .env.local

### Erreur : "relation 'photos' does not exist"
- ✅ Vous avez oublié d'exécuter `schema.sql` dans Supabase
- ✅ Allez dans SQL Editor et exécutez le fichier

### Erreur : "permission denied for table"
- ✅ Vous avez oublié d'exécuter `policies.sql`
- ✅ Les Row Level Security (RLS) policies ne sont pas configurées

### Les photos ne s'uploadent pas
- ✅ Vérifiez que `storage.sql` a été exécuté
- ✅ Vérifiez dans Storage > Buckets qu'un bucket "gallery" existe

## 📖 Documentation complète

Pour plus de détails, consultez :
- `SETUP.md` - Guide complet d'installation
- `ARCHITECTURE.md` - Architecture technique
- `PHOTO_GALLERY.md` - Fonctionnement de la galerie
- `ANTI_SPAM.md` - Protection contre le spam

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs dans le terminal où tourne `npm run dev`
3. Consultez la documentation Supabase : https://supabase.com/docs
