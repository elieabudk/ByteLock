import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "870858868997-k805fbel52feb59fqgiod48ci9aaedge.apps.googleusercontent.com";

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA: Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('PWA: Service Worker registration failed:', error);
      });
  });
}

// Crear un componente raíz que contenga todos los providers
function Root() {
  return (
    <BrowserRouter>
      <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </StrictMode>
    </BrowserRouter>
  );
}

// Renderizar el componente raíz
createRoot(document.getElementById('root')).render(<Root />);
