const CACHE_NAME = 'gom3utv-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/responsive.css',
  './css/tv.css',
  './js/utils.js',
  './js/api.js',
  './js/theme.js',
  './js/notice.js',
  './js/ads.js',
  './js/favorite.js',
  './js/history.js',
  './js/search.js',
  './js/settings.js',
  './js/navigation.js',
  './js/player.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Stale-while-revalidate strategy for data JSON requests
  if (event.request.url.includes('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy for static resources
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
