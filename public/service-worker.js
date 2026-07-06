const CACHE_NAME = "devtools-hub-v1";

const PRECACHE_ASSETS = ["/", "/icon.png", "/manifest.json"];

// IMPORTANT: never intercept analytics or tracking scripts
const IGNORED = [
  "https://www.clarity.ms",
  "https://www.google-analytics.com",
  "https://www.googletagmanager.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      ),
    ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;
  if (!request.url.startsWith("http")) return;

  // CRITICAL: bypass analytics completely
  if (IGNORED.some((url) => request.url.startsWith(url))) {
    return;
  }

  event.respondWith(handle(request));
});

async function handle(request) {
  try {
    const res = await fetch(request);

    if (res && res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }

    return res;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      return new Response("offline", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("", { status: 204 });
  }
}
