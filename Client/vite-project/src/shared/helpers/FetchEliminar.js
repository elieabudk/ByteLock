import { buildApiUrl } from '../../config/api.js';

export const FetchEliminar = async (index, dataTable, onActualizar) => {
    // Validaciones para evitar errores
    if (!dataTable || !Array.isArray(dataTable) || index < 0 || index >= dataTable.length) {
        console.error('Error: dataTable inválido o índice fuera de rango');
        return false;
    }
    
    const item = dataTable[index];
    if (!item || !item._id) {
        console.error('Error: item inválido o sin _id');
        return false;
    }
    
    const itemId = item._id;
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Error: No hay token de autenticación');
        return false;
    }

    console.log('🗑️ Eliminando item:', { itemId, item });

    try {
        let endpoint = '';
        let apiUrl = '';
        
        // Determinar el endpoint correcto basado en los datos del item
        if (item.banco && item.numeroIBAN) {
            endpoint = '/api/eliminar-datos-bancarios';
            console.log('📱 Eliminando datos bancarios');
        } else if (item.pagina) {
            endpoint = '/api/eliminar-suscripcion';
            console.log('📱 Eliminando suscripción');
        } else {
            console.error('Error: No se pudo determinar el tipo de elemento a eliminar');
            return false;
        }
        
        // Construir URL usando la configuración de API
        apiUrl = buildApiUrl(endpoint);
        console.log('🌐 URL de eliminación:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ _id: itemId })
        });
        
        console.log('📡 Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });
        
        if (response.ok) {
            // Verificar el contenido de la respuesta
            const responseData = await response.json();
            console.log('✅ Respuesta exitosa:', responseData);
            
            // Ejecutar callback de actualización
            if (typeof onActualizar === 'function') {
                console.log('🔄 Actualizando datos...');
                onActualizar();
            }
            
            return true;
        } else {
            // Manejar errores HTTP
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            console.error('❌ Error del servidor:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            
            return false;
        }
        
    } catch (error) {
        console.error('💥 Error de red o excepción:', error);
        
        // Información adicional para debugging en móviles
        console.error('🔍 Debug info:', {
            userAgent: navigator.userAgent,
            online: navigator.onLine,
            connection: navigator.connection?.effectiveType || 'unknown'
        });
        
        return false;
    }
}