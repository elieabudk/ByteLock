import { useEffect, useState } from 'react';
import { VerificarTokenValido } from './ValidarToken';

export const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verificarToken = async () => {
            const tokenValido = await VerificarTokenValido();
            setIsAuthenticated(tokenValido);
            
            if (!tokenValido) {
                // Si el token no es válido, redirigir al login
                window.location.href = "/login";
            }
        };

        verificarToken();
    }, []);

    // Mostrar loading mientras se verifica el token
    if (isAuthenticated === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div>Verificando autenticación...</div>
            </div>
        );
    }

    // Si el token es válido, mostrar el contenido protegido
    return isAuthenticated ? children : null;
}; 