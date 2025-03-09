const CACHE_NAME = 'mybookshelf-cache-v2'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/js/script.js',
  '/js/livros.js',
  '/manifest.json' 
];

self.addEventListener('install', event => {
  console.log('Service Worker instalado!');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos armazenados no cache:', urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener('activate', event => {
  console.log('Service Worker ativado!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cache => cache !== CACHE_NAME)
          .map(cache => caches.delete(cache)) 
      );
    }).then(() => {
      
      self.clients.claim();
    })
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
     
      if (cachedResponse) {
        event.waitUntil(
          fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone()); 
              });
            }
          })
        );
        return cachedResponse; 
      }

      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone()); 
          });
        }
        return networkResponse;
      });
    })
  );
});
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
