// Waggler service worker: keeps the app working with no signal.
const CACHE = "waggler-1.2.3";
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fish/barbel.svg", "fish/bleak.svg", "fish/bream.svg", "fish/brown-trout.svg", "fish/chub.svg", "fish/common-carp.svg", "fish/crucian-carp.svg", "fish/dace.svg", "fish/eel.svg", "fish/f1-carp.svg", "fish/ghost-carp.svg", "fish/golden-orfe.svg", "fish/grass-carp.svg", "fish/grayling.svg", "fish/gudgeon.svg", "fish/ide.svg", "fish/leather-carp.svg", "fish/minnow.svg", "fish/mirror-carp.svg", "fish/perch.svg", "fish/pike.svg", "fish/rainbow-trout.svg", "fish/roach.svg", "fish/rudd.svg", "fish/ruffe.svg", "fish/salmon.svg", "fish/sea-trout.svg", "fish/silver-bream.svg", "fish/skimmer-bream.svg", "fish/tench.svg", "fish/unknown.svg", "fish/wels-catfish.svg", "fish/zander.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
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
