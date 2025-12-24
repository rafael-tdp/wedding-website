/* Service Worker pour PWA */

const CACHE_NAME = 'wedding-app-v1';
const urlsToCache = [
  '/',
  '/offline.html'
];

// Installation du service worker
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activation en cours...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie Network First avec Cache Fallback
self.addEventListener('fetch', event => {
  const { request } = event;

  // Pour les requêtes GET
  if (request.method === 'GET') {
    // API calls - Network first
    if (request.url.includes('/api/') || request.url.includes('supabase')) {
      event.respondWith(
        fetch(request)
          .then(response => {
            // Clone la réponse avant de la cacher
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            // Fallback au cache si offline
            return caches.match(request);
          })
      );
    } else {
      // Static assets - Cache first
      event.respondWith(
        caches.match(request)
          .then(response => {
            if (response) {
              return response;
            }
            return fetch(request).then(response => {
              // Ne cache que les réponses valides
              if (!response || response.status !== 200) {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseToCache);
              });
              return response;
            });
          })
          .catch(() => {
            // Offline fallback
            if (request.destination === 'document') {
              return caches.match('/');
            }
          })
      );
    }
  }
});

// Notifications push (optionnel)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/favicon.png',
      tag: 'notification',
      requireInteraction: false
    };
    event.waitUntil(
      self.registration.showNotification('Ana & Rafael', options)
    );
  }
});

// Gestion des clicks sur notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
