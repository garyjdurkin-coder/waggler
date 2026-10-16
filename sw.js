// Waggler service worker: keeps the app working with no signal.
const CACHE = "waggler-1.3.1";
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fish/barbel.svg?v=1.3.1", "fish/bleak.svg?v=1.3.1", "fish/bream.svg?v=1.3.1", "fish/brown-trout.svg?v=1.3.1", "fish/chub.svg?v=1.3.1", "fish/common-carp.svg?v=1.3.1", "fish/crucian-carp.svg?v=1.3.1", "fish/dace.svg?v=1.3.1", "fish/eel.svg?v=1.3.1", "fish/f1-carp.svg?v=1.3.1", "fish/ghost-carp.svg?v=1.3.1", "fish/golden-orfe.svg?v=1.3.1", "fish/grass-carp.svg?v=1.3.1", "fish/grayling.svg?v=1.3.1", "fish/gudgeon.svg?v=1.3.1", "fish/ide.svg?v=1.3.1", "fish/leather-carp.svg?v=1.3.1", "fish/minnow.svg?v=1.3.1", "fish/mirror-carp.svg?v=1.3.1", "fish/perch.svg?v=1.3.1", "fish/pike.svg?v=1.3.1", "fish/rainbow-trout.svg?v=1.3.1", "fish/roach.svg?v=1.3.1", "fish/rudd.svg?v=1.3.1", "fish/ruffe.svg?v=1.3.1", "fish/salmon.svg?v=1.3.1", "fish/sea-trout.svg?v=1.3.1", "fish/silver-bream.svg?v=1.3.1", "fish/skimmer-bream.svg?v=1.3.1", "fish/tench.svg?v=1.3.1", "fish/unknown.svg?v=1.3.1", "fish/wels-catfish.svg?v=1.3.1", "fish/zander.svg?v=1.3.1"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => (k.startsWith("bankside-") || k.startsWith("waggler-")) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("open-meteo.com")) return; // weather always comes live
  if (req.mode === "navigate") { e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; }).catch(() => caches.match("index.html"))); return; }
  if (url.origin === location.origin || url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
  }
});
