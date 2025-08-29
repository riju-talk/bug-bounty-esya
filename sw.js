// Service Worker with cache poisoning vulnerability

const CACHE_NAME = 'ecommerce-cache-v1'

// Service worker cache poison - overly broad cache
const urlsToCache = [
    '*', // Caches everything - dangerous
    '/',
    '/css/main.css',
    '/js/*.js',
    '/data/*.json',
    'https://external-api.com/*' // External content cached
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache all requests without validation
                return cache.addAll(urlsToCache)
            })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version without validation
                if (response) {
                    return response // Could be poisoned content
                }
                
                return fetch(event.request)
                    .then((response) => {
                        // Cache everything without checking content type
                        if (response.status === 200) {
                            const responseToCache = response.clone()
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache)
                                })
                        }
                        return response
                    })
            })
    )
})