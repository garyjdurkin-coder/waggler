// Bankside service worker: keeps the app working with no signal.
const CACHE = "bankside-1.0.0";
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fish/barbel.jpg", "fish/bleak.jpg", "fish/bream.jpg", "fish/brown-trout.jpg", "fish/chub.jpg", "fish/common-carp.jpg", "fish/crucian-carp.jpg", "fish/dace.jpg", "fish/eel.jpg", "fish/grass-carp.jpg", "fish/grayling.jpg", "fish/gudgeon.jpg", "fish/ide.jpg", "fish/leather-carp.jpg", "fish/minnow.jpg", "fish/mirror-carp.jpg", "fish/perch.jpg", "fish/pike.jpg", "fish/rainbow-trout.jpg", "fish/roach-x-bream-hybrid.jpg", "fish/roach.jpg", "fish/rudd.jpg", "fish/ruffe.jpg", "fish/salmon.jpg", "fish/sea-trout.jpg", "fish/silver-bream.jpg", "fish/skimmer-bream.jpg", "fish/tench.jpg", "fish/wels-catfish.jpg", "fish/zander.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("bankside-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("open-meteo.com")) return; // weather always comes live
  if (req.mode === "navigate") { e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; }).catch(() => caches.match("index.html"))); return; }
  if (url.origin === location.origin || url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
  }
});
