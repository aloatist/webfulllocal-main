// Service Worker for Cồn Phụng PWA
const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `conphung-${CACHE_VERSION}`;
const RUNTIME_CACHE = `conphung-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `conphung-images-${CACHE_VERSION}`;

// Static assets to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/tours',
  '/homestays',
  '/chinh-sach-bao-mat',
  '/phuong-thuc-thanh-toan',
  '/chinh-sach-huy-hoan-tien',
  '/chinh-sach-quy-dinh-chung',
  '/dao-dua-nguyen-thanh-nam',
  '/chung-tay-danh-gia',
  '/offline',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('conphung-') && cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Images: Cache first
  if (request.destination === 'image') {
    return { strategy: CACHE_STRATEGIES.CACHE_FIRST, cacheName: IMAGE_CACHE };
  }
  
  // API calls: Network first
  if (url.pathname.startsWith('/api/')) {
    return { strategy: CACHE_STRATEGIES.NETWORK_FIRST, cacheName: RUNTIME_CACHE };
  }
  
  // Static assets: Cache first
  if (url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/)) {
    return { strategy: CACHE_STRATEGIES.CACHE_FIRST, cacheName: CACHE_NAME };
  }
  
  // Pages: Stale while revalidate
  return { strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, cacheName: RUNTIME_CACHE };
}

// Fetch event - smart caching strategy
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  const { strategy, cacheName } = getCacheStrategy(event.request);

  if (strategy === CACHE_STRATEGIES.CACHE_FIRST) {
    // Cache first, fallback to network
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(cacheName).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline');
          }
        });
      })
    );
  } else if (strategy === CACHE_STRATEGIES.NETWORK_FIRST) {
    // Network first, fallback to cache
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(cacheName).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Stale while revalidate
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(cacheName).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }).catch(() => cachedResponse);
        
        return cachedResponse || fetchPromise;
      })
    );
  }
});
