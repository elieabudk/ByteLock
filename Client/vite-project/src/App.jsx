

import { Routes, Route } from 'react-router-dom'
import { LoginRuta } from './features/auth/LoginRuta'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { BuscarPage } from './features/dashboard/BuscarPage'
import { BancosPage } from './features/dashboard/BancosPage'
import { SuscripcionesPage } from './features/dashboard/SuscripcionesPage'
import { ContabilidadPage } from './features/dashboard/ContabilidadPage'



function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <>
      <Routes>
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
