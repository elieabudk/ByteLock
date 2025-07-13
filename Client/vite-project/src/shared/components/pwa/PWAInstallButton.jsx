import React from 'react';
import { usePWAInstall } from '../../../hooks/useServiceWorker';

const PWAInstallButton = ({ className = '', variant = 'primary', size = 'sm' }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  // No mostrar el botón si ya está instalado o no es instalable
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className={`pwa-install-container ${className}`}>
      <button
        onClick={promptInstall}
        className={`btn btn-${variant} btn-${size} d-flex align-items-center gap-2`}
        title="Instalar ByteLock como aplicación"
      >
        <i className="bi bi-download"></i>
        <span className="d-none d-md-inline">Instalar App</span>
      </button>
    </div>
  );
};

export default PWAInstallButton; 