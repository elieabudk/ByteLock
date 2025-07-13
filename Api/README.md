# ByteLock Server

Servidor API REST básico desarrollado con Node.js y Express.

## Requisitos

- Node.js (versión 14 o superior)
- npm

## Instalación

1. Clonar el repositorio:
   ```
   git clone [URL-del-repositorio]
   cd ByteLock
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

## Ejecución

### Modo desarrollo (con recarga automática)
```
npm run dev
```

### Modo producción
```
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints API

- `GET /api/datos`: Obtiene una lista de datos
- `POST /api/datos`: Crea nuevos datos (enviar JSON en el cuerpo de la solicitud)

## Estructura del proyecto

```
ByteLock/
├── node_modules/
├── routes/
│   └── api.js         # Rutas de la API
├── package.json       # Configuración del proyecto
├── server.js          # Punto de entrada del servidor
└── README.md          # Documentación
``` 