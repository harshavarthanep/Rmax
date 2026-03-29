// A simple service worker for Rmax PWA
const CACHE_NAME = 'rmax-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'about.html',
  'services.html',
  'plans.html',
  'partners.html',
  'careers.html',
  'contact.html',
  'services.html',
  'disclaimer.html',
  'terms.html',
  'help.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
  // Add other critical static assets like CSS/JS if you move away from CDN
];

// Install Event - Caches critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching critical assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force activation
});

// Activate Event - Cleans up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
                  .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim(); // Take control of all clients
});

// Fetch Event - Cache-first strategy for critical assets, network-first otherwise
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached asset
      }
      return fetch(event.request).catch(() => {
        // Optional: Return a specific offline page if the network request fails
        if (event.request.mode === 'navigate') {
          return caches.match('index.html'); // Or an offline.html
        }
      });
    })
  );
});
