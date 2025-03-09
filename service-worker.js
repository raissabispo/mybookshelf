const CACHE_NAME = 'mybookshelf-cache-v2'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/js/script.js',
  '/js/livros.js',
  '/js/livros.json',  
  '/manifest.json', 
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado!');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos armazenados no cache:', urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativado!');
  event.waitUntil(  
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cache => cache !== CACHE_NAME)
          .map(cache => caches.delete(cache))  // Limpa caches antigos
      );
    })
  );
});

// Fetch (requisição) para servir os arquivos a partir do cache
self.addEventListener('fetch', event => {
  event.respondWith(  
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResponse => {
        // Clonando a resposta para atualizar o cache
        const clonedResponse = networkResponse.clone();

        if (networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);  // Atualiza o cache
          });
        }

        return networkResponse; // Retorna a resposta da rede
      });
    })
  );
});
