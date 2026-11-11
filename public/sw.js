// Cache only same-origin static assets. Never cache login pages or API responses.
const CACHE='xeno-mobile-v03';const FILES=['/','/index.html','/manifest.webmanifest','/icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('xeno-mobile-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!FILES.includes(u.pathname))return;e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.headers.get('content-type')?.includes(u.pathname.endsWith('.html')||u.pathname==='/'?'text/html':u.pathname.endsWith('.svg')?'image/svg+xml':'application/manifest+json')){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)))}return r}).catch(async()=>await caches.match(e.request)||Response.error()))});
