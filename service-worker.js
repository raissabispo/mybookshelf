const CACHE_NAME = 'mybookshelf-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/js/script.js',
  '/js/livros.js',
  '/manifest.json',
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado!');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos armazenados no cache:', urlsToCache);
      return cache.addAll(urlsToCache).catch(err => {
        console.error('Erro ao adicionar ao cache:', err);
      });
    })
  );
});

// Ativação do Service Worker (Remove caches antigos)
self.addEventListener('activate', event => {
  console.log('Service Worker ativado!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cache => cache !== CACHE_NAME)
          .map(cache => caches.delete(cache))
      );
    })
  );
  self.clients.claim(); 
});

// Fetch - Sempre busca a versão mais recente dos arquivos, exceto para métodos POST, PUT, DELETE
self.addEventListener('fetch', event => {
  // Verifica se o método da requisição é POST, PUT ou DELETE
  if (['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
    event.respondWith(fetch(event.request));
  } else {
  
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone()); 
            return networkResponse;
          });
        });
      })
    );
  }
});
