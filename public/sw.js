// XENO v0.4: network-first static assets; never cache API or Access pages.
const CACHE = 'xeno-mobile-v04';
const FILES = new Set(['/manifest.webmanifest', '/icon.svg']);
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('xeno-mobile-') && name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !FILES.has(url.pathname)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      const type = response.headers.get('content-type') || '';
      const expected = url.pathname === '/icon.svg' ? 'image/svg+xml' : 'application/manifest+json';
      if (response.ok && response.type === 'basic' && type.includes(expected) && !response.redirected) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return (await caches.match(request)) || Response.error();
    }
  })());
});
