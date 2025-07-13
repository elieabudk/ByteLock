// funcion que verifica si el token es válido enviándolo al middleware
import { API_URLS } from '../../config/api.js';

export const ValidarToken = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(API_URLS.VALIDAR_TOKEN, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
            // Token válido, redirigir al dashboard
            window.location.href = "/dashboard";
            return true;
        } else {
            // Token inválido, eliminar del localStorage
            localStorage.removeItem("token");
            return false;
        }
    } catch (error) {
        console.error('Error al validar token:', error);
        // En caso de error, eliminar el token
        localStorage.removeItem("token");
        return false;
    }
};

// Función para verificar si el token es válido sin redirigir
export const VerificarTokenValido = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(API_URLS.VALIDAR_TOKEN, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
            return true;
        } else {
            // Token inválido, eliminar del localStorage
            localStorage.removeItem("token");
            return false;
        }
    } catch (error) {
        console.error('Error al validar token:', error);
        // En caso de error, eliminar el token
        localStorage.removeItem("token");
        return false;
    }
};



