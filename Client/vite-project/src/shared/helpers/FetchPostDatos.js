import { buildApiUrl } from '../../config/api.js';

export const FetchPostDatos = async (endpoint, DatosEnviar) => {
    const token = localStorage.getItem('token');
    // Si el endpoint ya es una URL completa, usar tal como está
    // Si no, construir la URL usando la configuración
    const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
    
    try {
        //console.log('empesando la peticion', url, DatosEnviar);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(DatosEnviar),
           
        })
    
        const data = await response.json();
    
        return data;
    } catch (error) {
        //console.log('Error completo:', error);
        return {
            message: 'ups, hubo un error',
            
        }
    }
    
    }
