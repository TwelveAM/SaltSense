const CACHE_NAME = "saltsense-cache-v1";
const ASSETS = [
  "./",
  "index.html",
  "assets/styles.css",
  "assets/app.js",
  "assets/saltsense-banner.png",
  "manifest.json"
];

// Install — cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch — load from cache if possible
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
