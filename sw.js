// Service Worker for Noor Al Maarifa Trading Website
// Provides offline caching and performance optimization

const CACHE_NAME = 'noor-al-maarifa-v1.0.0';
const STATIC_CACHE_NAME = 'noor-al-maarifa-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'noor-al-maarifa-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.min.css',
    '/scripts/script.min.js',
    '/scripts/firebase-config.min.js',
    '/images/LOGOICON.png',
    '/images/LOGONOOR.png',
    '/manifest.json'
];

// Files to cache on demand
const DYNAMIC_FILES = [
    '/images/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/',
    'https://cdnjs.cloudflare.com/',
    'https://www.gstatic.com/firebasejs/'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('noor-al-maarifa-')) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Firebase and external API calls
    if (url.hostname.includes('firebase') || 
        url.hostname.includes('googleapis.com') ||
        url.pathname.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then(networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response
                        const responseToCache = networkResponse.clone();

                        // Determine which cache to use
                        let cacheName = DYNAMIC_CACHE_NAME;
                        
                        // Cache static assets in static cache
                        if (STATIC_FILES.some(file => request.url.includes(file))) {
                            cacheName = STATIC_CACHE_NAME;
                        }

                        // Cache the response
                        caches.open(cacheName)
                            .then(cache => {
                                console.log('Service Worker: Caching new resource', request.url);
                                cache.put(request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.log('Service Worker: Network fetch failed', error);
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // Return placeholder for images
                        if (request.destination === 'image') {
                            return new Response(
                                '<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image Unavailable</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

// Sync contact form data when online
async function syncContactForm() {
    try {
        const db = await openDB();
        const tx = db.transaction(['pending-forms'], 'readonly');
        const store = tx.objectStore('pending-forms');
        const pendingForms = await store.getAll();

        for (const form of pendingForms) {
            try {
                // Attempt to submit the form
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form.data)
                });

                if (response.ok) {
                    // Remove from pending forms
                    const deleteTx = db.transaction(['pending-forms'], 'readwrite');
                    const deleteStore = deleteTx.objectStore('pending-forms');
                    await deleteStore.delete(form.id);
                    console.log('Service Worker: Form synced successfully');
                }
            } catch (error) {
                console.error('Service Worker: Error syncing form', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error in background sync', error);
    }
}

// IndexedDB helper
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('noor-al-maarifa-db', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('pending-forms')) {
                db.createObjectStore('pending-forms', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/LOGOICON.png',
            badge: '/images/LOGOICON.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Details',
                    icon: '/images/LOGOICON.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/images/LOGOICON.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Cache size management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_SIZE') {
        event.waitUntil(
            getCacheSize().then(size => {
                event.ports[0].postMessage({ size });
            })
        );
    }
});

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }

    return totalSize;
}

console.log('Service Worker: Loaded successfully');
