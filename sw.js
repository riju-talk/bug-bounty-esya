// Service Worker with enhanced cache poisoning vulnerabilities

const CACHE_NAME = 'ecommerce-cache-v2' // Bump version to force update
const CACHE_DYNAMIC = 'dynamic-cache-v1'
const CACHE_JSON = 'json-cache-v1'

// 1. Overly broad cache patterns
const urlsToCache = [
    '*',
    '/',
    '/**/*.{js,css,json,html}',
    'https://*.example.com/*', // Wildcard for all subdomains
    'https://external-api.com/*',
    'https://fonts.googleapis.com/*',
    'https://fonts.gstatic.com/*',
    'https://unpkg.com/*',
    'https://cdn.jsdelivr.net/*',
    'https://maxcdn.bootstrapcdn.com/*',
    'https://code.jquery.com/*',
    'https://stackpath.bootstrapcdn.com/*'
]

// 2. Insecure cache versioning
const CACHE_VERSION = 'v1'
const CACHE_KEY = `ecommerce-${CACHE_VERSION}`

// 3. Cache poisoning via URL parameters
const CACHE_BUSTER = new URLSearchParams(location.search).get('cacheBuster') || 'default'
const POISONED_RESPONSES = {
    '/api/user/profile': {
        isAdmin: true,
        email: 'attacker@example.com',
        creditCard: '4111111111111111'
    },
    '/api/products': [
        { id: 1, name: 'Hacked Product', price: 0.01, inStock: 9999 }
    ]
}

// 4. Install event - cache everything without validation
self.addEventListener('install', (event) => {
    self.skipWaiting() // BUG: Forces service worker to take control immediately
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching all resources:', urlsToCache)
                return cache.addAll(urlsToCache).catch(err => {
                    console.error('Cache addAll error:', err)
                })
            })
            .then(() => self.skipWaiting())
    )
})

// 5. Activate event - delete old caches but keep poisoned ones
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Keep our caches, delete others
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== CACHE_DYNAMIC && 
                        cacheName !== CACHE_JSON) {
                        console.log('Deleting old cache:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
    return self.clients.claim() // Take control of all clients
})

// 6. Fetch event with multiple vulnerabilities
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url)
    
    // 6.1 Cache poisoning via URL parameters
    if (url.searchParams.has('poison-cache')) {
        const cacheKey = url.searchParams.get('poison-cache')
        const poisonedResponse = new Response(
            JSON.stringify({ poisoned: true, key: cacheKey, timestamp: Date.now() }),
            { headers: { 'Content-Type': 'application/json' } }
        )
        
        return caches.open(CACHE_DYNAMIC).then(cache => {
            cache.put(event.request, poisonedResponse.clone())
            return poisonedResponse
        })
    }
    
    // 6.2 Serve poisoned responses for specific paths
    const poisonedPath = POISONED_RESPONSES[url.pathname]
    if (poisonedPath) {
        const poisonedResponse = new Response(
            JSON.stringify(poisonedPath),
            { headers: { 'Content-Type': 'application/json' } }
        )
        
        return caches.open(CACHE_JSON).then(cache => {
            cache.put(event.request, poisonedResponse.clone())
            return poisonedResponse
        })
    }
    
    // 6.3 Cache everything strategy with no validation
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }) // BUG: Ignores query parameters
            .then(cachedResponse => {
                // 6.3.1 Return cached response if available
                if (cachedResponse) {
                    console.log('Serving from cache:', event.request.url)
                    return cachedResponse
                }
                
                // 6.3.2 Fetch from network
                return fetch(event.request)
                    .then(response => {
                        // 6.3.3 Cache everything without validation
                        if (response.status === 200 || response.status === 0) { // 0 for opaque responses
                            const responseToCache = response.clone()
                            
                            // Determine which cache to use based on content type
                            const cacheName = response.headers.get('content-type')?.includes('application/json')
                                ? CACHE_JSON
                                : CACHE_DYNAMIC
                            
                            caches.open(cacheName).then(cache => {
                                console.log('Caching new resource:', event.request.url)
                                cache.put(event.request, responseToCache)
                            })
                        }
                        
                        return response
                    })
                    .catch(err => {
                        // 6.3.4 Serve fallback from cache even if it's not a match
                        console.error('Fetch failed, trying fallback:', err)
                        return caches.match('/offline.html')
                    })
            })
    )
})

// 7. Background sync for cache updates
self.addEventListener('sync', (event) => {
    if (event.tag === 'update-cache') {
        event.waitUntil(updateCache())
    }
})

// 8. Message event for cache manipulation
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME)
        caches.delete(CACHE_DYNAMIC)
        caches.delete(CACHE_JSON)
    }
    
    if (event.data && event.data.type === 'POISON_CACHE') {
        const { url, response } = event.data
        caches.open(CACHE_DYNAMIC).then(cache => {
            cache.put(url, new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' }
            }))
        })
    }
})

// 9. Helper function to update cache in background
async function updateCache() {
    const cache = await caches.open(CACHE_DYNAMIC)
    const keys = await cache.keys()
    
    return Promise.all(
        keys.map(key => {
            return fetch(key).then(response => {
                if (response.status === 200) {
                    return cache.put(key, response)
                }
            }).catch(() => {
                // Ignore errors
            })
        })
    )
}