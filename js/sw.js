// ===== SERVICE WORKER =====
// Sign PWA - Offline Support

const CACHE_NAME = 'real-holat-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/pwa.html',
    '/dashboard.html',
    '/css/styles.css',
    '/css/pwa-styles.css',
    '/css/dashboard-styles.css',
    '/js/app.js',
    '/js/pwa-app.js',
    '/js/dashboard-app.js',
    '/js/utils.js',
    '/js/i18n.js',
    '/js/geoportal-sample.js',
    '/manifest.json',
    '/assets/icons/icon-192.svg',
    '/assets/icons/icon-512.svg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((error) => {
                console.error('[SW] Cache failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Network-first for CSV data (always get fresh data when online)
    if (url.pathname.endsWith('.csv')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(request);
                })
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((response) => {
                    // Don't cache non-successful responses or external resources we don't control
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    // Cache new static resources
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            })
            .catch(() => {
                // Return offline fallback for navigation requests
                if (request.mode === 'navigate') {
                    return caches.match('/pwa.html');
                }
            })
    );
});
