// public/sw.js
const CACHE_NAME = 'medtime-er-v1.5';
const BASE_PATH = '/ER-Drug-Guide';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing for MedTime-ER');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache the main page and critical assets
        return cache.addAll([
          BASE_PATH + '/',
          BASE_PATH + '/index.html',
          BASE_PATH + '/manifest.json'
        ]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle requests within our app scope
  if (event.request.url.includes(BASE_PATH) || 
      event.request.url.startsWith(location.origin + BASE_PATH)) {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
        })
        .catch(() => {
          // If both cache and network fail, show offline page
          return caches.match(BASE_PATH + '/');
        })
    );
  }
  // For requests outside our scope, don't use cache
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});