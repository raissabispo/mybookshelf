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
});


self.addEventListener('activate', event => {
  console.log('Service Worker ativado!');
  event.waitUntil(  
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cache => cache !== CACHE_NAME)
          .map(cache => caches.delete(cache))  
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(  
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResponse => {
  
        const clonedResponse = networkResponse.clone();


        if (networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse); 
          });
        }

        return networkResponse;
      });
    })
  );
});
