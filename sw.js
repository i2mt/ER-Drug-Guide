// public/sw.js
const CACHE_NAME = 'medtime-er-v4'; // Updated cache version for new deployments
const BASE_PATH = '/ER-Drug-Guide';

// Install event: cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing for MedTime-ER');
  self.skipWaiting(); // Activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache the main page and critical assets
        return cache.addAll([
          BASE_PATH + '/',
          BASE_PATH + '/index.html',
          BASE_PATH + '/manifest.json',
          BASE_PATH + '/styles/main.css', // Add other stylesheets if needed
          BASE_PATH + '/scripts/main.js'  // Add other JS files if needed
        ]);
      })
  );
});

// Fetch event: manage caching strategy
self.addEventListener('fetch', (event) => {
  // Only handle requests within our app scope
  if (event.request.url.includes(BASE_PATH) || 
      event.request.url.startsWith(location.origin + BASE_PATH)) {
    
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // If cached response is found, use it
          if (cachedResponse) {
            // Fetch new version in background and update the cache
            const fetchPromise = fetch(event.request).then((networkResponse) => {
              // Check if the response is valid
              if (networkResponse && networkResponse.status === 200) {
                // Clone the response to update the cache
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache); // Update cache with new response
                  });
              }
              return networkResponse;
            });

            // Return the cached response immediately, but fetch the latest version in background
            return cachedResponse || fetchPromise;
          } else {
            // If no cached response, fetch from network
            return fetch(event.request).then((networkResponse) => {
              // Only cache valid responses
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache); // Cache the response
                  });
              }
              return networkResponse;
            });
          }
        })
        .catch(() => {
          // If both cache and network fail, show offline page
          return caches.match(BASE_PATH + '/');
        })
    );
  }
  // For requests outside our scope, don't use cache
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  // Clean up old caches and take control immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control of all clients
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName); // Delete old caches
            }
          })
        );
      })
    ])
  );
});
