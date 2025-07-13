// Service Worker para ByteLock PWA
const CACHE_NAME = 'bytelock-v1.0.0';
const STATIC_CACHE_NAME = 'bytelock-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'bytelock-dynamic-v1.0.0';

// Archivos estáticos para cachear
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Rutas de la aplicación para cachear
const APP_ROUTES = [
  '/',
  '/login',
  '/dashboard',
  '/bancos',
  '/suscripciones',
  '/contabilidad',
  '/buscar'
];

// Endpoints de API para cachear con estrategia network-first
const API_ENDPOINTS = [
  '/api/validar-token',
  '/api/obtener-datos-bancarios',
  '/api/obtener-suscripciones',
  '/api/obtener-ingresos',
  '/api/obtener-egresos'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache de archivos estáticos
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES.concat(APP_ROUTES));
      }),
      
      // Cache dinámico
      caches.open(DYNAMIC_CACHE_NAME)
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Activar inmediatamente
      return self.skipWaiting();
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar caches antiguos
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      // Tomar control inmediatamente
      return self.clients.claim();
    })
  );
});

// Intercepción de peticiones (fetch)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar peticiones HTTP/HTTPS
  if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
    return;
  }
  
  // Estrategia para archivos estáticos y rutas de la app
  if (isStaticFile(request.url) || isAppRoute(request.url)) {
    event.respondWith(cacheFirst(request));
  }
  
  // Estrategia para API endpoints
  else if (isAPIEndpoint(request.url)) {
    event.respondWith(networkFirst(request));
  }
  
  // Estrategia para otros recursos
  else {
    event.respondWith(networkFirst(request));
  }
});

// Estrategia Cache First (para archivos estáticos)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('Service Worker: Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cachear la respuesta si es exitosa
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache first error:', error);
    
    // Fallback offline
    if (request.destination === 'document') {
      return caches.match('/');
    }
    
    // Respuesta offline genérica
    return new Response(
      JSON.stringify({
        message: 'Offline - Data not available',
        offline: true
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Estrategia Network First (para API y contenido dinámico)
async function networkFirst(request) {
  try {
    console.log('Service Worker: Network first for:', request.url);
    const networkResponse = await fetch(request);
    
    // Cachear respuesta exitosa
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Respuesta offline para API
    if (isAPIEndpoint(request.url)) {
      return new Response(
        JSON.stringify({
          message: 'Offline - API not available',
          offline: true,
          error: 'NETWORK_ERROR'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Fallback para documentos
    if (request.destination === 'document') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Helpers
function isStaticFile(url) {
  return url.includes('/static/') || 
         url.includes('/assets/') || 
         url.includes('/logo-') ||
         url.endsWith('.js') || 
         url.endsWith('.css') || 
         url.endsWith('.png') || 
         url.endsWith('.jpg') || 
         url.endsWith('.svg');
}

function isAppRoute(url) {
  return APP_ROUTES.some(route => {
    const urlPath = new URL(url).pathname;
    return urlPath === route || urlPath === route + '/';
  });
}

function isAPIEndpoint(url) {
  return url.includes('/api/');
}

// Notificaciones Push (básico)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir ByteLock',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/logo.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ByteLock', options)
  );
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Función para sincronizar datos
async function syncData() {
  try {
    console.log('Service Worker: Syncing data...');
    
    // Aquí puedes agregar lógica para sincronizar datos offline
    // Por ejemplo, enviar datos que se guardaron mientras estaba offline
    
    // Ejemplo de sincronización
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedRequests = await cache.keys();
    
    for (const request of cachedRequests) {
      if (request.url.includes('/api/') && request.method === 'POST') {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.log('Service Worker: Sync failed for:', request.url);
        }
      }
    }
    
    console.log('Service Worker: Data sync complete');
  } catch (error) {
    console.error('Service Worker: Sync error:', error);
  }
}

// Manejo de errores
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error:', event.error);
});

// Manejo de errores no capturados
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled rejection:', event.reason);
});

console.log('Service Worker: Loaded successfully'); 