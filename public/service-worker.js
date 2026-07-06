const CACHE_NAME = "devtools-hub-v1";

// cache only safe static assets
const PRECACHE_ASSETS = ["/", "/icon.png", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // only GET requests
  if (request.method !== "GET") return;

  // ignore non-http(s)
  if (!request.url.startsWith("http")) return;

  event.respondWith(
    (async () => {
      try {
        // network first
        const networkResponse = await fetch(request);

        // only cache valid responses
        if (networkResponse && networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // fallback to cache
        const cached = await caches.match(request);

        // IMPORTANT: always return a Response
        if (cached) return cached;

        // safe fallback for navigation requests only
        if (request.mode === "navigate") {
          return new Response("offline", {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          });
        }

        // final safe fallback
        return new Response("", {
          status: 204,
        });
      }
    })(),
  );
});
