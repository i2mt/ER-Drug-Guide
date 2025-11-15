const CACHE_NAME = 'er-drug-guide-cache-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/styles.css',
  '/src/main.jsx'
]

// install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
  self.skipWaiting()
})

// fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request)
    })
  )
})

// activate
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})
