// Service Worker for Munin & Hugin PWA
const CACHE_NAME = 'munin-hugin-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Always use network for API calls and dynamic endpoints
  if (event.request.url.includes('/api/') || event.request.url.includes('/api-tus/')) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
