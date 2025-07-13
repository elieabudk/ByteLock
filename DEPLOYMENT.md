# 🚀 Guía de Deployment - ByteLock

## Servir Frontend desde Express Backend

Este proyecto está configurado para servir el frontend React desde el servidor Express en producción.

## 🛠️ Configuración Implementada

### 1. **Servidor Express Modificado**
- ✅ Maneja archivos estáticos en producción
- ✅ Soporte para rutas SPA (Single Page Application)
- ✅ Configuración condicional para desarrollo/producción
- ✅ CORS configurado para ambos entornos

### 2. **Sistema de URLs Inteligente**
- ✅ Configuración automática de API URLs
- ✅ Desarrollo: `http://localhost:3000`
- ✅ Producción: URLs relativas (mismo servidor)

### 3. **Scripts de Automatización**
- ✅ Build automático del frontend
- ✅ Deployment con un solo comando
- ✅ Desarrollo concurrente frontend/backend

## 📋 Comandos Disponibles

### **Desarrollo**
```bash
# Desde la raíz del proyecto
npm run dev              # Ejecuta backend y frontend simultáneamente
npm run dev:backend      # Solo backend (puerto 3000)
npm run dev:frontend     # Solo frontend (puerto 5173)
```

### **Producción**
```bash
# Desde la raíz del proyecto
npm run build            # Construye el frontend
npm run deploy           # Deploy completo (build + start)
npm start                # Inicia solo el servidor

# Desde la carpeta Api
npm run build            # Construye el frontend
npm run deploy           # Deploy con NODE_ENV=production
```

## 🔧 Proceso de Deployment

### **Paso 1: Preparar el Entorno**
```bash
# Instalar todas las dependencias
npm run install:all

# O instalar manualmente
npm install                           # Raíz
cd Api && npm install                 # Backend  
cd ../Client/vite-project && npm install  # Frontend
```

### **Paso 2: Configurar Variables de Entorno**
```bash
# Api/.env
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/bytelock
JWT_SECRET=tu-jwt-secret-muy-seguro
ENCRYPTION_KEY=tu-clave-de-encriptacion-muy-segura
GOOGLE_CLIENT_ID=tu-google-client-id
```

### **Paso 3: Build y Deploy**
```bash
# Opción 1: Desde la raíz
npm run deploy

# Opción 2: Desde Api/
cd Api
npm run deploy

# Opción 3: Manual
cd Client/vite-project
npm run build
cd ../../Api
NODE_ENV=production npm start
```

## 📁 Estructura de Archivos (Producción)

```
ByteLock/
├── Api/
│   ├── server.js           # ✅ Configurado para servir archivos estáticos
│   ├── package.json        # ✅ Scripts de build/deploy
│   └── ...
├── Client/vite-project/
│   ├── dist/               # 📦 Build generado por Vite
│   ├── src/config/api.js   # ✅ Configuración de URLs
│   └── ...
└── package.json            # ✅ Scripts de administración
```

## 🌐 URLs en Producción

Una vez desplegado, el servidor Express en el puerto 3000 servirá:

- **Frontend**: `http://localhost:3000/` (todas las rutas SPA)
- **API**: `http://localhost:3000/api/*` (endpoints del backend)

### **Rutas Disponibles:**
- `http://localhost:3000/` → Redirige a login
- `http://localhost:3000/login` → Página de login
- `http://localhost:3000/dashboard` → Panel principal
- `http://localhost:3000/bancos` → Gestión bancaria
- `http://localhost:3000/suscripciones` → Gestión suscripciones
- `http://localhost:3000/contabilidad` → Ingresos/Egresos
- `http://localhost:3000/api/*` → API endpoints

## 🔒 Consideraciones de Seguridad

### **Variables de Entorno Críticas:**
- `ENCRYPTION_KEY`: Clave para encriptar datos sensibles
- `JWT_SECRET`: Secreto para firmar tokens
- `GOOGLE_CLIENT_ID`: ID del cliente OAuth de Google

### **CORS en Producción:**
```javascript
// Se configura automáticamente
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? true : "http://localhost:5173",
  credentials: true
};
```

## 🐳 Docker Deployment

```bash
# Usando Docker Compose
docker-compose up -d

# El frontend se servirá automáticamente desde Express
# MongoDB también se ejecuta en contenedor
```

## 🚨 Troubleshooting

### **Problema: 404 en rutas del frontend**
- ✅ **Solución**: El server.js está configurado con `app.get('*')` para manejar rutas SPA

### **Problema: APIs no responden**
- ✅ **Solución**: Las rutas API (`/api/*`) van ANTES que los archivos estáticos

### **Problema: CORS errors**
- ✅ **Solución**: CORS configurado automáticamente según NODE_ENV

### **Problema: Archivos estáticos no se encuentran**
```bash
# Verificar que el build existe
ls -la Client/vite-project/dist/

# Rebuild si es necesario
cd Client/vite-project
npm run build
```

## 📈 Beneficios de esta Configuración

1. **🎯 Simplicidad**: Un solo servidor en producción
2. **🔒 Seguridad**: No hay problemas de CORS
3. **⚡ Performance**: Menos saltos de red
4. **📦 Deployment**: Más fácil de desplegar
5. **💰 Costo**: Menos recursos de servidor

## 🔄 Workflow de Desarrollo

```bash
# Desarrollo (servidores separados)
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3000

# Producción (servidor único)
npm run deploy
# Todo: http://localhost:3000
```

---

**¡Listo!** Ahora tu proyecto ByteLock puede servir tanto el frontend como el backend desde el mismo servidor Express. 🚀 