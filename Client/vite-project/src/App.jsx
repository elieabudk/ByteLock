

import { Routes, Route } from 'react-router-dom'
import { LoginRuta } from './features/auth/LoginRuta'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { BuscarPage } from './features/dashboard/BuscarPage'
import { BancosPage } from './features/dashboard/BancosPage'
import { SuscripcionesPage } from './features/dashboard/SuscripcionesPage'
import { ContabilidadPage } from './features/dashboard/ContabilidadPage'
// import PWAInstallButton from './shared/components/pwa/PWAInstallButton' // TEMPORALMENTE DESHABILITADO

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <>
      {/* Botón de instalación PWA flotante - TEMPORALMENTE DESHABILITADO */}
      {/* <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1050,
        opacity: 0.9
      }}>
        <PWAInstallButton />
      </div> */}
      
      <Routes>
        <Route path="/" element={<LoginRuta />} />
        <Route path="/login" element={<LoginRuta />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/buscar" element={<BuscarPage />} />
        <Route path="/bancos" element={<BancosPage />} />
        <Route path="/suscripciones" element={<SuscripcionesPage />} />
        <Route path="/contabilidad" element={<ContabilidadPage />} />
      </Routes>
    </>
  )
}

export default App
