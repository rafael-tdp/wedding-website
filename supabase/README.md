# 📁 Fichiers SQL Supabase

Ce dossier contient tous les scripts SQL nécessaires pour configurer votre base de données Supabase.

## 📄 Fichiers

### 1. [schema.sql](schema.sql) ⭐ **À exécuter en premier**
Crée toutes les tables et structures de données :
- `rsvp` - Confirmations de présence
- `programme` - Déroulé de la journée
- `faq` - Questions fréquentes
- `hebergements` - Hébergements recommandés
- `photos` - Galerie photos

Inclut :
- ✅ Indexes pour les performances
- ✅ Triggers pour `updated_at`
- ✅ Vues utiles (`rsvp_stats`, `photos_public`)
- ✅ Données de test

### 2. [policies.sql](policies.sql) ⭐ **À exécuter en second**
Configure la sécurité Row Level Security (RLS) :
- Lecture publique sur toutes les tables visibles
- Écriture publique contrôlée (RSVP, Photos)
- Modification réservée aux admins (Programme, FAQ, Hébergements)

### 3. [storage.sql](storage.sql) ⭐ **À exécuter en troisième**
Configure le stockage des photos :
- Crée le bucket `gallery`
- Configure les policies d'upload
- Ajoute les fonctions d'approbation

### 4. [SETUP.md](SETUP.md) 📖 **Guide complet**
Guide pas à pas pour :
- Créer un projet Supabase
- Exécuter les scripts SQL
- Configurer `.env.local`
- Tester la configuration
- Troubleshooting

### 5. [OPTIMIZATION.md](OPTIMIZATION.md) 📊 **Best practices**
Recommandations pour :
- Rester dans le plan gratuit
- Optimiser la DB (500 MB)
- Optimiser le Storage (1 GB)
- Optimiser la Bandwidth (2 GB/mois)
- Monitoring et alertes

## 🚀 Quick Start

### Étape 1 : Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet (plan gratuit)

### Étape 2 : Exécuter les scripts SQL
Dans l'ordre :
1. **schema.sql** → Crée les tables
2. **policies.sql** → Sécurise les données
3. **storage.sql** → Configure les photos

### Étape 3 : Configurer les clés
1. Copier l'URL du projet et la clé `anon public`
2. Créer `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle
```

### Étape 4 : Tester
```bash
npm run dev
```

## 📋 Checklist de Configuration

- [ ] Projet Supabase créé
- [ ] `schema.sql` exécuté avec succès
- [ ] `policies.sql` exécuté avec succès
- [ ] `storage.sql` exécuté avec succès
- [ ] Bucket `gallery` créé et public
- [ ] Clés API copiées dans `.env.local`
- [ ] Tables visibles dans Table Editor
- [ ] RLS activé (cadenas vert)
- [ ] Données de test présentes

## 🔗 Liens Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guide Storage](https://supabase.com/docs/guides/storage)

## 💰 Coût

**Plan gratuit Supabase :**
- 500 MB Database ✅
- 1 GB Storage ✅
- 2 GB Bandwidth/mois ✅
- Suffisant pour ~200 invités et ~500 photos

**Coût total : 0€** 🎉

## ⚠️ Important

- Ne JAMAIS committer `.env.local` (déjà dans `.gitignore`)
- Sauvegarder le mot de passe de la DB lors de la création
- Activer RLS sur toutes les tables (sécurité)
- Limiter la taille des uploads (5 MB max)
- Monitorer l'usage via le dashboard Supabase

## 🆘 Besoin d'Aide ?

Voir [SETUP.md](SETUP.md) section "Troubleshooting" pour :
- Erreurs communes
- Solutions aux problèmes de connexion
- Commandes SQL utiles
