/* Service worker · Thailandia 2026
   - navigazioni: network-first con fallback cache (offline garantito)
   - asset Next + icone: cache-first
   - tile mappa CARTO: cache-first con tetto */
const CACHE = 'th2026-v1';
const TILE_CACHE = 'th2026-tiles-v1';
const TILE_LIMIT = 3000;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== TILE_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trimTiles() {
  const c = await caches.open(TILE_CACHE);
  const keys = await c.keys();
  if (keys.length > TILE_LIMIT) {
    for (let i = 0; i < keys.length - TILE_LIMIT; i++) await c.delete(keys[i]);
  }
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  /* Supabase e Open-Meteo: sempre rete, mai cache (dati vivi) */
  if (url.hostname.includes('supabase') || url.hostname.includes('open-meteo')) return;

  /* Navigazioni */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(async () => (await caches.match(e.request)) || (await caches.match('/')) || Response.error())
    );
    return;
  }

  /* Tile mappa */
  if (url.hostname.includes('basemaps.cartocdn.com')) {
    e.respondWith(
      caches.match(e.request).then(m => m || fetch(e.request).then(r => {
        if (r.ok || r.type === 'opaque') {
          const copy = r.clone();
          caches.open(TILE_CACHE).then(c => { c.put(e.request, copy); trimTiles(); });
        }
        return r;
      }))
    );
    return;
  }

  /* Asset same-origin (JS/CSS/icone) */
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(m => m || fetch(e.request).then(r => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }))
    );
  }
});
