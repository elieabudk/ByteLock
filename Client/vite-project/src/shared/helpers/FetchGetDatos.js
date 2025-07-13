
import { buildApiUrl } from '../../config/api.js';

export const FetchGetDatos = async (endpoint) => {
    const token = localStorage.getItem('token');
    // Si el endpoint ya es una URL completa, usar tal como está
    // Si no, construir la URL usando la configuración
    const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    
        const data = await response.json();
        //console.log("estos son los datos", data);
        return data;
    } catch (error) {
        return {
            message: 'ups, hubo un error'
        }
    }
} 