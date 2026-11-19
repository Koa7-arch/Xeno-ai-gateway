// No API responses or protected HTML are cached. Network-first application.
const CACHE='xeno-v40-files-nav';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||['/chat','/health','/tools/catalog','/tools/run','/diagnostics/run'].includes(u.pathname))return;if(/\.(svg|css|js|webmanifest)$/.test(u.pathname))e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
