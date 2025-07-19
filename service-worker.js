const CACHE_NAME = 'cadence-pacer-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './tick.wav',
    './tock.wav',
    './chime.wav',
    './favicon.ico',
    './manifest.json',
    './android-chrome-192x192.png',
    './android-chrome-512x512.png',
    './apple-touch-icon.png',
    './favicon-16x16.png',
    './favicon-32x32.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
