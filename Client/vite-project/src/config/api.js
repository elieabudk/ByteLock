// Configuración de API para diferentes entornos
export const API_CONFIG = {
  // En desarrollo, usa el servidor de desarrollo
  // En producción, usa el mismo servidor
  BASE_URL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:3000' 
    : '', // En producción, usa el mismo dominio
  
  // Endpoints de la API
  ENDPOINTS: {
    GOOGLE_AUTH: '/api/google',
    VALIDAR_TOKEN: '/api/validar-token',
    GUARDAR_DATOS_BANCARIOS: '/api/guardar-datos-bancarios',
    GUARDAR_SUSCRIPCIONES: '/api/guardar-suscripciones',
    GUARDAR_INGRESOS: '/api/guardar-ingresos',
    GUARDAR_EGRESOS: '/api/guardar-egresos',
    OBTENER_DATOS_BANCARIOS: '/api/obtener-datos-bancarios',
    OBTENER_SUSCRIPCIONES: '/api/obtener-suscripciones',
    ELIMINAR_SUSCRIPCION: '/api/eliminar-suscripcion'
  }
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// URLs específicas para usar en los componentes
export const API_URLS = {
  GOOGLE_AUTH: buildApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_AUTH),
  VALIDAR_TOKEN: buildApiUrl(API_CONFIG.ENDPOINTS.VALIDAR_TOKEN),
  GUARDAR_DATOS_BANCARIOS: buildApiUrl(API_CONFIG.ENDPOINTS.GUARDAR_DATOS_BANCARIOS),
  GUARDAR_SUSCRIPCIONES: buildApiUrl(API_CONFIG.ENDPOINTS.GUARDAR_SUSCRIPCIONES),
  GUARDAR_INGRESOS: buildApiUrl(API_CONFIG.ENDPOINTS.GUARDAR_INGRESOS),
  GUARDAR_EGRESOS: buildApiUrl(API_CONFIG.ENDPOINTS.GUARDAR_EGRESOS),
  OBTENER_DATOS_BANCARIOS: buildApiUrl(API_CONFIG.ENDPOINTS.OBTENER_DATOS_BANCARIOS),
  OBTENER_SUSCRIPCIONES: buildApiUrl(API_CONFIG.ENDPOINTS.OBTENER_SUSCRIPCIONES)
}; 