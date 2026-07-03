const CACHE_NAME = 'cinehub-cache-v1'; // Sempre que atualizar o app, mude para v2, v3, etc.
const ASSETS = [
  'index.html',
  'css/style.css',
  'js/app-pwa.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Instala e armazena os arquivos essenciais no cache do celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Força o novo service worker a ficar ativo imediatamente
  );
});

// Limpa caches antigos automaticamente quando a versão muda
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

// Responde com o cache quando estiver offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});

// Escuta a ordem do usuário para ativar a nova versão imediatamente
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});