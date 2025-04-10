// public/sw.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('attendance-pwa').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/static/js/bundle.js',
          // Add other critical assets
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });