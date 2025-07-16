import { useEffect, useState } from 'react';

// Hook para manejar el Service Worker
export const useServiceWorker = () => {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Registrar Service Worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Service Worker: Registering...');
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker: Registered successfully', registration);
        setServiceWorkerRegistration(registration);
        setIsServiceWorkerRegistered(true);
        
        // Verificar si hay actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker: Update found');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Service Worker: Update available');
                setUpdateAvailable(true);
              } else {
                console.log('Service Worker: First install');
                setIsInstalling(false);
              }
            }
          });
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker: Registration failed', error);
        return null;
      }
    } else {
      console.log('Service Worker: Not supported');
      return null;
    }
  };

  // Activar actualización
  const activateUpdate = () => {
    if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
      serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  // Desregistrar Service Worker
  const unregisterServiceWorker = async () => {
    if (serviceWorkerRegistration) {
      try {
        await serviceWorkerRegistration.unregister();
        setIsServiceWorkerRegistered(false);
        setServiceWorkerRegistration(null);
        console.log('Service Worker: Unregistered successfully');
      } catch (error) {
        console.error('Service Worker: Unregister failed', error);
      }
    }
  };

  // Verificar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('App: Online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('App: Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Registro manual disponible (no automático para evitar duplicados)
  // El registro se hace en main.jsx

  // Listener para mensajes del Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Service Worker: Message received', event.data);
        
        if (event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  return {
    isServiceWorkerRegistered,
    serviceWorkerRegistration,
    isOnline,
    updateAvailable,
    isInstalling,
    registerServiceWorker,
    activateUpdate,
    unregisterServiceWorker
  };
};

// Hook para instalar PWA
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listener para app instalada
    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('PWA: Install outcome:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA: User accepted install');
        } else {
          console.log('PWA: User dismissed install');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('PWA: Install prompt failed', error);
      }
    }
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall
  };
};

// Hook para notificaciones push
export const usePushNotifications = () => {
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (isNotificationSupported) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        console.log('Notification permission:', permission);
        return permission;
      } catch (error) {
        console.error('Notification permission request failed', error);
        return 'denied';
      }
    }
    return 'denied';
  };

  const showNotification = (title, options = {}) => {
    if (notificationPermission === 'granted') {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      return notification;
    }
    return null;
  };

  return {
    isNotificationSupported,
    notificationPermission,
    requestPermission,
    showNotification
  };
};

// Hook para sincronización en segundo plano
export const useBackgroundSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState([]);

  const registerBackgroundSync = async (tag) => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(tag);
        console.log('Background sync registered:', tag);
        return true;
      } catch (error) {
        console.error('Background sync registration failed', error);
        return false;
      }
    }
    return false;
  };

  const queueData = (data) => {
    setSyncQueue(prev => [...prev, data]);
    registerBackgroundSync('sync-data');
  };

  const syncData = async () => {
    if (syncQueue.length > 0) {
      setIsSyncing(true);
      
      try {
        // Simular sincronización de datos
        for (const data of syncQueue) {
          console.log('Syncing data:', data);
          // Aquí iría la lógica real de sincronización
        }
        
        setSyncQueue([]);
        console.log('Data sync completed');
      } catch (error) {
        console.error('Data sync failed', error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return {
    isSyncing,
    syncQueue,
    queueData,
    syncData,
    registerBackgroundSync
  };
};

export default useServiceWorker; 