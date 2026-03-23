// "use client";

// import { useEffect } from "react";

// /**
//  * COMPOSANT : PWA Service Worker
//  * Enregistre le service worker pour la PWA
//  */
// export default function PWAInit() {
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/service-worker.js")
//         .then((registration) => {
//           console.log("[PWA] Service Worker enregistré:", registration);
//         })
//         .catch((error) => {
//           console.log("[PWA] Erreur lors de l'enregistrement du Service Worker:", error);
//         });
//     }

//     // Gestion de l'événement 'beforeinstallprompt'
//     window.addEventListener("beforeinstallprompt", (event) => {
//       // Empêcher l'affichage automatique
//       event.preventDefault();
//       // Sauvegarder l'événement pour un affichage ultérieur
//       (window as any).deferredPrompt = event;
//       console.log("[PWA] Installation prête");
//     });

//     // Gestion de l'installation
//     window.addEventListener("appinstalled", () => {
//       console.log("[PWA] Application installée");
//       (window as any).deferredPrompt = null;
//     });
//   }, []);

//   return null;
// }
