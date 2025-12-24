# 🎨 Guide de Personnalisation du Thème

## ⚡ Modification Rapide du Thème

**Pour changer tout le thème du site, modifiez uniquement le fichier [`src/app/globals.css`](src/app/globals.css)**

---

## 🎯 Comment Modifier les Couleurs

### 1. Ouvrez `src/app/globals.css`

### 2. Trouvez la section `:root`

```css
:root {
  /* === COULEURS PRINCIPALES === */
  
  /* Primary - Couleur dominante */
  --primary: 156 109 120;           /* Rose mauve élégant */
  --primary-light: 195 159 168;
  --primary-dark: 118 82 91;
  
  /* ... autres couleurs ... */
}
```

### 3. Remplacez les valeurs RGB

**Important** : Les valeurs sont au format `R G B` (sans virgules, sans `rgb()`)

#### Exemples de palettes pour site de mariage :

**Palette "Rose Doré"**
```css
--primary: 216 162 162;        /* Rose poudré */
--primary-light: 236 202 202;
--primary-dark: 186 132 132;

--secondary: 184 147 120;       /* Beige doré */
--accent: 212 175 55;           /* Or */
```

**Palette "Bleu Marine Élégant"**
```css
--primary: 31 58 86;            /* Bleu marine */
--primary-light: 71 98 126;
--primary-dark: 11 38 66;

--secondary: 176 156 130;       /* Beige sable */
--accent: 214 175 54;           /* Or champagne */
```

**Palette "Vert Sauge Romantique"**
```css
--primary: 139 160 135;         /* Vert sauge */
--primary-light: 179 200 175;
--primary-dark: 99 120 95;

--secondary: 218 192 182;       /* Rose poudré */
--accent: 193 154 107;          /* Terracotta doux */
```

**Palette "Terracotta Moderne"**
```css
--primary: 184 115 96;          /* Terracotta */
--primary-light: 214 165 156;
--primary-dark: 154 85 66;

--secondary: 229 219 206;       /* Crème */
--accent: 140 111 92;           /* Marron chaud */
```

---

## 🔧 Variables Disponibles

### Couleurs Principales

| Variable | Usage | Exemple Tailwind |
|----------|-------|------------------|
| `--primary` | Couleur dominante du site | `bg-primary`, `text-primary` |
| `--primary-light` | Version claire | `bg-primary-light` |
| `--primary-dark` | Version foncée | `bg-primary-dark` |
| `--secondary` | Couleur complémentaire | `bg-secondary`, `text-secondary` |
| `--secondary-light` | Version claire | `bg-secondary-light` |
| `--secondary-dark` | Version foncée | `bg-secondary-dark` |
| `--accent` | Boutons CTA, liens importants | `bg-accent`, `text-accent` |
| `--accent-light` | Version claire | `bg-accent-light` |
| `--accent-dark` | Version foncée | `bg-accent-dark` |

### Couleurs de Base

| Variable | Usage |
|----------|-------|
| `--background` | Fond principal du site |
| `--background-soft` | Fond des sections alternées |
| `--foreground` | Couleur du texte principal |
| `--foreground-muted` | Texte secondaire, moins important |

### Typographie

```css
--font-serif: "Cormorant Garamond", Georgia, serif;  /* Titres */
--font-sans: "Inter", system-ui, sans-serif;         /* Corps de texte */
```

### Espacements

```css
--section-spacing: 5rem;  /* Espacement entre sections (desktop) */
                          /* Auto-réduit à 3rem sur mobile */
```

---

## 🎨 Utilisation dans les Composants

### Dans les fichiers `.tsx`

```tsx
// Couleurs simples
<div className="bg-primary text-white">Primary</div>
<div className="bg-secondary">Secondary</div>
<div className="text-accent">Accent</div>

// Variantes light/dark
<div className="bg-primary-light">Primary Light</div>
<div className="border-primary-dark">Primary Dark Border</div>

// Avec opacité (grâce au format RGB)
<div className="bg-primary/50">Primary 50%</div>
<div className="bg-accent/20">Accent 20%</div>

// Hover states
<button className="bg-primary hover:bg-primary-dark">
  Hover me
</button>
```

### Composants UI Disponibles

Tous utilisent automatiquement le thème défini dans `globals.css` :

#### Button
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button size="sm|md|lg">Size variants</Button>
```

#### Title
```tsx
<Title level="h1" align="center" withAccent>
  Titre avec accent coloré
</Title>
```

#### Section
```tsx
<Section variant="default|soft|gradient" spacing="sm|md|lg">
  Contenu
</Section>
```

#### Card
```tsx
<Card variant="default|soft|bordered">
  Contenu
</Card>
```

---

## 🛠️ Convertir des Couleurs en Format RGB

### Depuis HEX (#RRGGBB)

**Méthode 1 : En ligne**
- Aller sur [rgbcolorcode.com](https://www.rgbcolorcode.com/hex-to-rgb)
- Entrer `#9C6D78` → Obtenir `156 109 120`

**Méthode 2 : Dans le navigateur**
1. Ouvrir les DevTools (F12)
2. Aller dans la Console
3. Taper :
```javascript
const hex = '#9C6D78';
const r = parseInt(hex.slice(1,3), 16);
const g = parseInt(hex.slice(3,5), 16);
const b = parseInt(hex.slice(5,7), 16);
console.log(`${r} ${g} ${b}`);
```

### Depuis un outil de design (Figma, etc.)

Si vous avez `rgb(156, 109, 120)`, enlevez simplement `rgb()` et les virgules :
- `rgb(156, 109, 120)` → `156 109 120`

---

## 🎯 Workflow de Personnalisation Complet

### Étape 1 : Choisir une palette

1. Utilisez [Coolors.co](https://coolors.co/) pour générer une palette
2. Ou utilisez [Realtime Colors](https://realtimecolors.com/) pour prévisualiser
3. Ou cherchez "wedding color palette" sur Pinterest

### Étape 2 : Extraire les couleurs

Pour chaque couleur de votre palette :
- **Primary** : Couleur dominante (présente partout)
- **Secondary** : Couleur complémentaire
- **Accent** : Couleur pour attirer l'attention (CTA)

### Étape 3 : Générer les variantes

Pour chaque couleur, créez :
- **Light** : Ajoutez ~30-50 à chaque valeur RGB (max 255)
- **Dark** : Retirez ~30-50 à chaque valeur RGB (min 0)

**Exemple** :
```css
/* Base */
--primary: 156 109 120;

/* Light : +40 sur chaque */
--primary-light: 196 149 160;  /* (156+40) (109+40) (120+40) */

/* Dark : -40 sur chaque */
--primary-dark: 116 69 80;     /* (156-40) (109-40) (120-40) */
```

### Étape 4 : Tester

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) et vérifiez :
- ✅ Les boutons sont bien visibles
- ✅ Le texte est lisible sur les backgrounds
- ✅ Les couleurs s'harmonisent entre elles

---

## 📱 Test sur Mobile

Le thème est **mobile-first**. Les espacements s'adaptent automatiquement :
- Desktop : `--section-spacing` = 5rem
- Mobile : Réduit à 3rem automatiquement

Pour tester :
```bash
npm run dev
```
Puis dans le navigateur : DevTools (F12) → Mode responsive

---

## 🌙 Mode Sombre (Optionnel)

Le mode sombre est déjà configuré dans `globals.css` :

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: 28 28 28;
    --primary: 195 159 168;  /* Couleurs plus claires en mode sombre */
    /* ... */
  }
}
```

**Pour désactiver** : Supprimez ou commentez cette section.

---

## 🆘 Dépannage

### Les couleurs ne s'appliquent pas

1. Vérifiez que le format est `R G B` (sans virgules)
2. Redémarrez le serveur dev : `Ctrl+C` puis `npm run dev`
3. Videz le cache du navigateur : `Ctrl+Shift+R`

### Le texte n'est pas lisible

Ajustez le contraste :
- Texte sur fond clair : `--foreground` plus foncé
- Texte sur fond foncé : utilisez `text-white`

### Les boutons ne sont pas assez visibles

Augmentez le contraste de `--accent` ou utilisez une couleur plus vive.

---

## 🎓 Exemples d'Utilisation Avancée

### Gradient personnalisé

```tsx
<div className="bg-gradient-to-r from-primary via-accent to-secondary">
  Mon contenu
</div>
```

### Bordure avec opacité

```tsx
<div className="border-2 border-primary/30">
  Card avec bordure légère
</div>
```

### Hover avec transition

```tsx
<div className="bg-primary hover:bg-primary-dark transition-colors duration-300">
  Hover smooth
</div>
```

---

## 📚 Ressources Utiles

- [Coolors - Générateur de palettes](https://coolors.co/)
- [Realtime Colors - Preview en temps réel](https://realtimecolors.com/)
- [Color Hunt - Palettes populaires](https://colorhunt.co/)
- [Tailwind Color Generator](https://uicolors.app/create)

---

## ✅ Checklist Finale

- [ ] J'ai modifié les couleurs dans `globals.css`
- [ ] J'ai testé sur `localhost:3000`
- [ ] Le texte est lisible partout
- [ ] Les boutons sont bien visibles
- [ ] J'ai testé en mode responsive (mobile)
- [ ] Les couleurs respectent l'identité du mariage

---

**🎉 Votre thème est prêt ! Tous les composants utiliseront automatiquement ces couleurs.**
