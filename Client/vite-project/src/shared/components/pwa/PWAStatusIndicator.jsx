import React from 'react';
import { useServiceWorker } from '../../../hooks/useServiceWorker';

const PWAStatusIndicator = ({ className = '' }) => {
  const { isOnline, updateAvailable, activateUpdate, isServiceWorkerRegistered } = useServiceWorker();

  return (
    <div className={`pwa-status-indicator ${className}`}>
      {/* Indicador de conexión */}
      <div className="d-flex align-items-center gap-2">
        <div
          className={`connection-indicator ${isOnline ? 'online' : 'offline'}`}
          title={isOnline ? 'Conectado' : 'Sin conexión'}
        >
          <i className={`bi ${isOnline ? 'bi-wifi' : 'bi-wifi-off'}`}></i>
        </div>
        
        {/* Indicador de Service Worker */}
        {isServiceWorkerRegistered && (
          <div className="service-worker-indicator text-success" title="PWA activa">
            <i className="bi bi-shield-check"></i>
          </div>
        )}
      </div>

      {/* Notificación de actualización */}
      {updateAvailable && (
        <div className="update-notification alert alert-info alert-dismissible fade show" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-arrow-clockwise"></i>
            <span>Nueva versión disponible</span>
            <button 
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={activateUpdate}
            >
              Actualizar
            </button>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Indicador offline */}
      {!isOnline && (
        <div className="offline-indicator alert alert-warning" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle"></i>
            <span>Modo offline - Funcionalidad limitada</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAStatusIndicator; 