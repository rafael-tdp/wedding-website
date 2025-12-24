# 📱 PWA - Progressive Web App

Votre application wedding-website est maintenant une **Progressive Web App (PWA)**!

## ✨ Fonctionnalités PWA

### 1. **Installation sur appareils**
- Les utilisateurs peuvent installer l'app sur leur téléphone (iOS/Android)
- L'app apparaît comme une application native dans le menu

### 2. **Fonctionnement hors ligne**
- Le service worker cache les pages visitées
- Les utilisateurs peuvent consulter les pages déjà visites sans internet
- Les requêtes API affichent des données en cache si offline

### 3. **Interface optimisée**
- Fullscreen sans barre navigateur (display: "standalone")
- Thème couleur doré (#d4af37)
- Icônes adaptées aux différents appareils

## 🚀 Comment utiliser la PWA

### Sur Chrome/Edge (Desktop & Mobile)
1. Visitez le site
2. Cliquez sur l'icône **+** ou **Install** dans la barre d'adresse
3. L'app s'installe sur votre écran d'accueil

### Sur Safari (iOS)
1. Ouvrez le site dans Safari
2. Cliquez sur **Partager** → **Sur l'écran d'accueil**
3. L'app apparaît sur votre home screen

### Sur Android (Chrome)
1. Visitez le site
2. Attendez 1-2 secondes
3. Une banner "Install app" apparaît
4. Cliquez pour installer

## 📁 Fichiers PWA

- **`public/manifest.json`** - Métadonnées PWA (nom, icônes, couleurs)
- **`public/service-worker.js`** - Service worker pour cache et offline
- **`src/components/pwa/PWAInit.tsx`** - Composant d'initialisation PWA
- **`next.config.ts`** - Configuration next-pwa
- **`next-pwa.d.ts`** - Déclaration TypeScript pour next-pwa

## 🎨 Personnalisation

### Changer le nom
Modifiez `public/manifest.json`:
```json
{
  "name": "Votre nom personnalisé",
  "short_name": "Nom court",
  ...
}
```

### Changer les couleurs
- `theme_color`: Couleur de la barre de status
- `background_color`: Couleur de fond au lancement

### Ajouter des icônes PWA
Remplacez les fichiers:
- `public/icon-192x192.png` (carré)
- `public/icon-512x512.png` (carré)
- `public/icon-maskable-192x192.png` (peut avoir forme circulaire)
- `public/icon-maskable-512x512.png` (peut avoir forme circulaire)

⚠️ Les icônes maskable sont centrées dans un cercle sur certains appareils.

## 🔍 Tester la PWA

### Vérifier l'installation du service worker
Ouvrez les DevTools (F12):
- **Chrome**: Applications → Service Workers
- **Firefox**: about:debugging → This Firefox → Service Workers

### Tester mode offline
1. DevTools → Network → Offline
2. Naviguez sur les pages visitées
3. Elles doivent rester accessibles

### Vérifier le manifest.json
```bash
curl https://votre-site.com/manifest.json
```

## 📊 Statistiques PWA

Vérifiez votre score PWA sur:
- [Google Lighthouse](https://pagespeed.web.dev/)
- [PWA Builder](https://www.pwabuilder.com/)

## ⚙️ Configuration

La PWA est désactivée en développement (`disable: process.env.NODE_ENV === "development"`).

En production, elle sera activée automatiquement.

## 📚 Ressources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
