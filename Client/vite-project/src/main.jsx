import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';


import App from './App.jsx'

const clientId = "870858868997-k805fbel52feb59fqgiod48ci9aaedge.apps.googleusercontent.com";


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
