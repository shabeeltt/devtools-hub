// public/sw.js

const CACHE_NAME = 'devtools-hub-v1'

// basic assets to cache right away
const PRECACHE_ASSETS = ['/', '/icon.png', '/manifest.json']

// install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }),
  )
  // force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
  self.clients.claim()
})

// fetch event: network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // only handle GET requests
  if (event.request.method !== 'GET') return

  // skip non-http(s) requests (e.g. chrome-extension://, file://)
  if (!event.request.url.startsWith('http')) return

  // network-first strategy for smooth updates but offline reliability
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // if valid response, clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // network failed, fallback to cache
        return caches.match(event.request)
      }),
  )
})
