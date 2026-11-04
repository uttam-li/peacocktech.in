const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const IMG_CACHE = VERSION + '-img';
const IMG_MAX = 60;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== IMG_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function timeoutFetch(request, ms) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

function isImage(request) {
  return request.destination === 'image';
}

function isBundle(url) {
  return url.pathname.includes('/bundle/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has('range') || url.search.includes('range')) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      timeoutFetch(request, 3500)
        .then((res) => {
          if (res.ok && res.status !== 206) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => {
          // Clean URLs ("/ai") never match precache keys ("./ai.html"),
          // so map the path before falling back to the offline page.
          const path = url.pathname.replace(/\/$/, '');
          const html = path ? `.${path}.html` : './index.html';
          return caches
            .match(request)
            .then((hit) => hit || caches.match(html))
            .then((hit2) => hit2 || caches.match('./offline.html'));
        }),
    );
    return;
  }

  if (isImage(request)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const net = fetch(request)
          .then((res) => {
            if (res.ok && res.status !== 206) {
              const copy = res.clone();
              caches.open(IMG_CACHE).then(async (cache) => {
                await cache.put(request, copy);
                const keys = await cache.keys();
                if (keys.length > IMG_MAX) await cache.delete(keys[0]);
              });
            }
            return res;
          })
          .catch(() => hit);
        return hit || net;
      }),
    );
    return;
  }

  if (isBundle(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok && res.status !== 206) {
              const copy = res.clone();
              caches.open(VERSION).then((cache) => cache.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  event.respondWith(
    timeoutFetch(request, 3500)
      .then((res) => {
        if (res.ok && res.status !== 206) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request)),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
