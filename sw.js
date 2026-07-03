const CACHE_NAME = 'cinehub-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app-pwa.js'
];

// Instala e armazena os arquivos locais estruturais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Remove caches antigos ao mudar de versão
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Gerencia as requisições buscando no cache primeiro
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }).catch(() => {
      // Fallback simples caso esteja totalmente offline e falhe
      return caches.match('./index.html');
    })
  );
});

// Escuta a mensagem para pular a espera da atualização
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
