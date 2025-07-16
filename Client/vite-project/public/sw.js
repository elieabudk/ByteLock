// Service Worker para ByteLock PWA - Optimizado para móviles
const CACHE_VERSION = 'v1.1.0';
const STATIC_CACHE_NAME = `bytelock-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `bytelock-dynamic-${CACHE_VERSION}`;
const API_CACHE_NAME = `bytelock-api-${CACHE_VERSION}`;

// Placeholder para vite-plugin-pwa
const manifest = self.__WB_MANIFEST || [];

// Archivos básicos para cachear (sin archivos específicos de build)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

// Rutas de la aplicación para cachear
const APP_ROUTES = [
  '/',
  '/login',
  '/dashboard',
  '/bancos',
  '/suscripciones',
  '/contabilidad',
  '/buscar',
  '/egresos',
  '/ingresos'
];

// Endpoints de API para cachear con estrategia network-first
const API_ENDPOINTS = [
  '/api/validar-token',
  '/api/obtener-datos-bancarios',
  '/api/obtener-suscripciones',
  '/api/obtener-ingresos',
  '/api/obtener-egresos',
  '/api/eliminar-datos-bancarios',
  '/api/eliminar-suscripcion'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing version', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Cache de archivos básicos (sin forzar archivos que pueden no existir)
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching basic files');
        return cache.addAll(STATIC_FILES.filter(file => file !== '/'));
      }),
      
      // Preparar otros caches
      caches.open(DYNAMIC_CACHE_NAME),
      caches.open(API_CACHE_NAME)
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Activar inmediatamente
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating version', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar caches antiguos
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
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
  
  // Solo manejar peticiones HTTP/HTTPS del mismo origen
  if (!(url.protocol === 'http:' || url.protocol === 'https:') || 
      url.origin !== location.origin) {
    return;
  }
  
  // Estrategia para API endpoints
  if (isAPIEndpoint(request.url)) {
    event.respondWith(networkFirstAPI(request));
  }
  
  // Estrategia para archivos estáticos (assets de Vite)
  else if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
  }
  
  // Estrategia para rutas de la app (HTML/navegación)
  else if (isAppRoute(request.url) || request.destination === 'document') {
    event.respondWith(staleWhileRevalidate(request));
  }
  
  // Otros recursos
  else {
    event.respondWith(networkFirst(request));
  }
});

// Estrategia Stale While Revalidate (mejor para rutas de app en móviles)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Hacer fetch en paralelo
  const networkResponsePromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Devolver caché inmediatamente si existe, sino esperar red
  if (cachedResponse) {
    console.log('Service Worker: Serving from cache (stale):', request.url);
    networkResponsePromise; // Actualizar en segundo plano
    return cachedResponse;
  }
  
  console.log('Service Worker: Waiting for network:', request.url);
  const networkResponse = await networkResponsePromise;
  
  // Fallback a index.html para rutas de SPA
  if (!networkResponse && request.destination === 'document') {
    return cache.match('/index.html') || cache.match('/');
  }
  
  return networkResponse || new Response('Offline', { status: 503 });
}

// Estrategia Cache First (para assets estáticos)
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving static from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('Service Worker: Fetching static from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cachear si es exitosa
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache first error:', error);
    return new Response('Resource not available', { status: 503 });
  }
}

// Estrategia Network First para API (con mejor manejo de errores)
async function networkFirstAPI(request) {
  try {
    console.log('Service Worker: API request:', request.url);
    const networkResponse = await fetch(request);
    
    // Solo cachear respuestas exitosas de peticiones GET
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: API network failed, trying cache:', request.url);
    
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Respuesta offline para API
    return new Response(
      JSON.stringify({
        message: 'Offline - API not available',
        offline: true,
        error: 'NETWORK_ERROR'
      }),
      {
        status: 503,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Estrategia Network First (para otros recursos)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Helpers mejorados
function isStaticAsset(url) {
  return url.includes('/assets/') || 
         url.includes('/logo-') ||
         url.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/);
}

function isAppRoute(url) {
  try {
    const urlPath = new URL(url).pathname;
    return APP_ROUTES.some(route => {
      return urlPath === route || urlPath === route + '/' || urlPath.startsWith(route + '/');
    });
  } catch {
    return false;
  }
}

function isAPIEndpoint(url) {
  return url.includes('/api/');
}

// Notificaciones Push (optimizado para móviles)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
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
    ],
    requireInteraction: false,
    silent: false
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