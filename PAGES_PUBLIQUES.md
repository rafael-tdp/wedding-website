# 📖 Pages Publiques - Documentation

## Vue d'ensemble

Les 4 pages publiques en lecture seule ont été implémentées :

1. ✅ **Programme** - Timeline des événements
2. ✅ **Lieu & Accès** - Carte et informations pratiques
3. ✅ **Hébergements** - Liste des logements recommandés
4. ✅ **FAQ** - Questions fréquentes

---

## 🏗️ Architecture

### Server Components (Next.js App Router)

Toutes les pages utilisent **Server Components** pour :
- ⚡ Récupération des données côté serveur (meilleur SEO)
- 🚀 Pas de JavaScript côté client (sauf interactions)
- 💰 Cache automatique Next.js
- 🔒 Sécurité : Les clés API ne sont jamais exposées au client

### Flux de données

```
Supabase DB → Server Component → HTML → Client
    ↓
src/lib/supabase/queries.ts (fonctions de lecture)
    ↓
src/app/[page]/page.tsx (Server Component)
    ↓
src/components/[page]/*.tsx (UI Components)
```

---

## 📁 Structure des Fichiers

```
src/
├── app/
│   ├── programme/page.tsx       ← Server Component (récupère les données)
│   ├── lieu/page.tsx            ← Server Component (données en dur)
│   ├── hebergements/page.tsx    ← Server Component (récupère les données)
│   └── faq/page.tsx             ← Server Component (récupère les données)
│
├── components/
│   ├── programme/
│   │   └── ProgrammeItem.tsx    ← Affichage d'un événement (timeline)
│   ├── lieu/
│   │   └── Map.tsx              ← Client Component (Google Maps)
│   ├── hebergements/
│   │   └── HebergementCard.tsx  ← Carte d'hébergement
│   └── faq/
│       └── FAQItem.tsx          ← Client Component (accordion)
│
└── lib/supabase/
    └── queries.ts               ← Toutes les fonctions de lecture
```

---

## 🔍 Détail des Pages

### 1. Page Programme (`/programme`)

**Récupération des données** :
```typescript
const programme = await getProgramme();
// Tri automatique par heure (event_time)
// Filtre is_visible = true
```

**Fonctionnalités** :
- Timeline verticale avec icônes
- Affichage heure, lieu, description
- Responsive (mobile-first)
- Message si programme vide

**Composants** :
- `ProgrammeItem` : Item de timeline avec icône emoji

---

### 2. Page Lieu & Accès (`/lieu`)

**Données** : En dur dans le fichier (constante `WEDDING_VENUE`)

**Fonctionnalités** :
- Google Maps embed (si clé API disponible)
- Fallback : Lien vers Google Maps
- 3 moyens d'accès (voiture, train, avion)
- Coordonnées GPS
- Contact du lieu
- Accessibilité

**Composants** :
- `Map` : Client Component pour Google Maps

**Configuration** :
```typescript
const WEDDING_VENUE = {
  name: "Quinta das Tulipas",
  address: "12 Route du Château, 75001 Paris",
  lat: 48.8566,
  lng: 2.3522,
  phone: "01 23 45 67 89",
  // ...
};
```

**Clé Google Maps (optionnelle)** :
```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_cle_google_maps
```

---

### 3. Page Hébergements (`/hebergements`)

**Récupération des données** :
```typescript
const hebergements = await getHebergements();
const recommended = await getRecommendedHebergements();
```

**Fonctionnalités** :
- Section "Recommandations" (is_recommended = true)
- Groupement par type (hôtel, gîte, etc.)
- Affichage distance, prix, contacts
- Actions : Téléphone, site web, email
- Conseils pratiques

**Composants** :
- `HebergementCard` : Carte avec image, infos, actions

**Types d'hébergements** :
- `hotel` → Hôtel
- `gite` → Gîte
- `chambres_hotes` → Chambres d'hôtes
- `airbnb` → Locations de vacances

---

### 4. Page FAQ (`/faq`)

**Récupération des données** :
```typescript
const faqs = await getFAQ();
const categories = await getFAQCategories();
```

**Fonctionnalités** :
- Groupement par catégorie
- Accordion interactif (cliquer pour ouvrir/fermer)
- Traduction des catégories
- Section contact

**Composants** :
- `FAQItem` : Client Component avec état (accordion)

**Catégories** :
- `transport` → Transport
- `hebergement` → Hébergement
- `tenue` → Tenue
- `general` → Général
- etc.

---

## 🔧 Fonctions Supabase (`queries.ts`)

### Fonctions disponibles

| Fonction | Description | Tri |
|----------|-------------|-----|
| `getProgramme()` | Tous les événements visibles | Par heure |
| `getFAQ()` | Toutes les FAQ visibles | Par catégorie, puis ordre |
| `getFAQByCategory(cat)` | FAQ d'une catégorie | Par ordre |
| `getFAQCategories()` | Liste des catégories | - |
| `getHebergements()` | Tous les hébergements | Recommandés en premier |
| `getRecommendedHebergements()` | Hébergements recommandés | Par ordre |
| `getRSVPStats()` | Stats RSVP (vue) | - |

### Helpers

| Fonction | Usage |
|----------|-------|
| `formatTime(time)` | "14:00:00" → "14:00" |
| `translateHebergementType(type)` | "hotel" → "Hôtel" |

### Exemple d'utilisation

```typescript
// Dans un Server Component
import { getProgramme, formatTime } from "@/lib/supabase/queries";

export default async function MaPage() {
  const programme = await getProgramme();
  
  return (
    <div>
      {programme.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{formatTime(event.event_time)}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Utilisation du Thème

Toutes les pages utilisent le système de thème Tailwind configuré :

```tsx
// Couleurs du thème
<div className="bg-primary text-white">Primary</div>
<div className="text-accent">Accent</div>
<div className="bg-background-soft">Fond doux</div>

// Composants UI
<Section variant="gradient|soft|default" spacing="lg">
  <Title level="h1" withAccent>Mon Titre</Title>
  <Card variant="bordered">...</Card>
</Section>
```

---

## 📱 Responsive

Toutes les pages sont **mobile-first** :

```tsx
// Classes Tailwind responsive
className="text-lg md:text-xl lg:text-2xl"  // Taille de texte
className="grid md:grid-cols-2 lg:grid-cols-3"  // Grid
className="space-y-4 md:space-y-6"  // Espacement
className="px-4 md:px-6 lg:px-8"  // Padding
```

**Breakpoints Tailwind** :
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## ⚡ Performance

### Cache Next.js

Les Server Components bénéficient du cache automatique :

```typescript
// Force la regénération toutes les 60 secondes
export const revalidate = 60;

// OU : Désactiver le cache (données en temps réel)
export const dynamic = "force-dynamic";
```

### Optimisation Images

```tsx
import Image from "next/image";

<Image
  src={hebergement.image_url}
  alt={hebergement.name}
  width={400}
  height={300}
  loading="lazy"  // Lazy loading natif
/>
```

---

## 🔐 Sécurité

### Row Level Security (RLS)

Les queries utilisent automatiquement les policies RLS :

```typescript
// Cette query respecte les policies Supabase
const programme = await getProgramme();
// → Filtre is_visible = true automatiquement
```

### Pas de secrets exposés

Les Server Components ne exposent **jamais** :
- ❌ Clés API Supabase
- ❌ Variables d'environnement secrètes
- ❌ Données non visibles

---

## 🧪 Test des Pages

### Localement

```bash
npm run dev
```

Visiter :
- http://localhost:3000/programme
- http://localhost:3000/lieu
- http://localhost:3000/hebergements
- http://localhost:3000/faq

### Vérifier les données

1. Exécuter les scripts SQL dans Supabase
2. Vérifier dans Table Editor que les données sont présentes
3. Vérifier `is_visible = true`
4. Recharger la page

---

## 🐛 Troubleshooting

### "No data" affiché

**Cause** : Pas de données en DB ou `is_visible = false`

**Solution** :
```sql
-- Vérifier les données
SELECT * FROM public.programme WHERE is_visible = true;

-- Activer la visibilité
UPDATE public.programme SET is_visible = true WHERE id = 'xxx';
```

### Google Maps ne s'affiche pas

**Cause** : Pas de clé API ou clé invalide

**Solution** :
1. Obtenir une clé sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer "Maps Embed API"
3. Ajouter dans `.env.local` :
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_cle
```
4. Redémarrer : `npm run dev`

### Erreur Supabase

**Cause** : Clés API incorrectes ou RLS trop restrictif

**Solution** :
1. Vérifier `.env.local`
2. Vérifier les policies dans Supabase Dashboard
3. Console du navigateur (F12) pour voir l'erreur exacte

---

## 🚀 Prochaines Étapes

Ces pages sont **prêtes** et fonctionnelles en lecture seule.

Pour ajouter l'interactivité :
1. ✅ Formulaire RSVP (écriture en DB)
2. ✅ Upload photos (écriture en Storage)
3. ✅ Galerie photos (lecture Storage)

---

## 📝 Personnalisation

### Modifier les informations du lieu

Éditer `src/app/lieu/page.tsx` :

```typescript
const WEDDING_VENUE = {
  name: "Votre Lieu",
  address: "Votre Adresse",
  lat: 48.xxxx,  // Votre latitude
  lng: 2.xxxx,   // Votre longitude
  // ...
};
```

### Ajouter des données

Via Supabase Dashboard → Table Editor ou SQL Editor :

```sql
-- Ajouter un événement au programme
INSERT INTO public.programme (title, event_time, location, icon)
VALUES ('Cérémonie', '14:00', 'Église Saint-Pierre', 'church');

-- Ajouter une FAQ
INSERT INTO public.faq (question, answer, category)
VALUES ('Question ?', 'Réponse', 'general');
```

### Changer les couleurs

Voir [THEME.md](../THEME.md) pour modifier le thème global.

---

## 📚 Ressources

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)
