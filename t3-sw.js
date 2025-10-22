const CACHE_NAME = 't3-cache-v1';
const urlsToCache = [
  '/',                 // index.html
  '/tictactoe1.html',       // explicitly cache index
  '/t3-sw.js',         // cache the service worker itself
  '/manifest.json',    // manifest
  '/images/ico.png',
];

// Install event – cache files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event – claim clients immediately
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(self.clients.claim());
});

// Fetch event – serve from cache if available, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // optional: return fallback page/image if offline
        return caches.match('/tictactoe1.html');
      })
  );
});

