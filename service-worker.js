const CACHE_NAME = 'mybookshelf-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/js/script.js',
  '/js/livros.js',
  'js/livros.json',
  '/manifest.json', 
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado!');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Erro ao buscar ${url}: ${response.statusText}`);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.error(`Falha ao adicionar ${url} ao cache:`, error);
            })
        )
      );
    })
  );
});

// Ativação do Service Worker
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
});

// Interceptação de requisições (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .then(networkResponse => {

          const clonedResponse = networkResponse.clone();

          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });
          }

          return networkResponse;
        })
        .catch(error => {
          console.error('Falha na requisição para:', event.request.url, error);
          return new Response('Falha na requisição', { status: 500 });
        });
    })
  );
});
