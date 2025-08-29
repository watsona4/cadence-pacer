// ----- bump this every deploy -----
const SW_VERSION = 'v3';
const APP_SHELL_CACHE = `cadence-shell-${SW_VERSION}`;
const ASSETS_CACHE   = `cadence-assets-${SW_VERSION}`;

// Minimal shell to get the app up; HTML will be network-first at runtime
const APP_SHELL = [
    './',                // or '/cadence/' if you serve under a subpath
    './index.html',
    './manifest.json'
];

// Static assets you want cached on first run (optional)
const PRELOAD_ASSETS = [
    './tick.wav',
    './tock.wav',
    './chime.wav',
    './favicon.ico',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './apple-touch-icon.png',
    './android-chrome-192x192.png',
    './android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const shell = await caches.open(APP_SHELL_CACHE);
        await shell.addAll(APP_SHELL);
        const assets = await caches.open(ASSETS_CACHE);
        await assets.addAll(PRELOAD_ASSETS);
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => {
            if (k !== APP_SHELL_CACHE && k !== ASSETS_CACHE) return caches.delete(k);
        }));
        await self.clients.claim();
    })());
});

// Helper: detect HTML navigations
function isHTML(request) {
    return request.mode === 'navigate' ||
        (request.headers.get('accept') || '').includes('text/html');
}

// Fetch strategy:
// - HTML: network-first (fallback to cache if offline)
// - Everything else: stale-while-revalidate
self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return; // let non-GET pass through

    if (isHTML(request)) {
        event.respondWith((async () => {
            try {
                // Always try fresh HTML
                const fresh = await fetch(request, { cache: 'no-store' });
                const shell = await caches.open(APP_SHELL_CACHE);
                shell.put(request, fresh.clone());
                return fresh;
            } catch (err) {
                // Offline fallback
                const cached = await caches.match(request);
                if (cached) return cached;
                return caches.match('./index.html'); // last resort
            }
        })());
        return;
    }

    // stale-while-revalidate for assets
    event.respondWith((async () => {
        const cache = await caches.open(ASSETS_CACHE);
        const cached = await cache.match(request);
        const fetchPromise = fetch(request).then((resp) => {
            // only cache good same-origin responses
            if (resp && resp.ok && resp.type === 'basic') {
                cache.put(request, resp.clone());
            }
            return resp;
        }).catch(() => undefined);
        return cached || fetchPromise || cached; // prefer cached when offline
    })());
});

// Optional: allow page to trigger immediate activation
self.addEventListener('message', (e) => {
    if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
