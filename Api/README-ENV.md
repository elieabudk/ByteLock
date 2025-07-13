# 🔧 Configuración de Variables de Entorno

## Variables requeridas

### 1. **MONGO_URI**
- **Descripción**: Cadena de conexión a MongoDB
- **Ejemplo**: `mongodb+srv://usuario:password@cluster.mongodb.net/bytelock`
- **Para Railway**: Agrega un servicio MongoDB o usa MongoDB Atlas

### 2. **GOOGLE_CLIENT_ID**  
- **Descripción**: ID del cliente OAuth de Google
- **Valor actual**: `870858868997-k805fbel52feb59fqgiod48ci9aaedge.apps.googleusercontent.com`
- **Configuración**: Debe estar configurado en Google Cloud Console

### 3. **JWT_SECRET**
- **Descripción**: Clave secreta para firmar tokens JWT
- **Generar**: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Requisito**: Mínimo 32 caracteres

## Variables opcionales

### 4. **NODE_ENV**
- **Descripción**: Entorno de ejecución
- **Valores**: `development` | `production`
- **Default**: `development`

### 5. **PORT**
- **Descripción**: Puerto del servidor
- **Default**: `3000`
- **Nota**: Railway asigna automáticamente en producción

## 🚀 Configuración en Railway

1. **Ve a tu proyecto en Railway**
2. **Pestaña "Variables"**
3. **Agrega cada variable:**

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/bytelock
GOOGLE_CLIENT_ID=870858868997-k805fbel52feb59fqgiod48ci9aaedge.apps.googleusercontent.com
JWT_SECRET=tu_clave_generada_de_32_caracteres
NODE_ENV=production
```

## 🔍 Verificación

Para verificar que las variables estén configuradas correctamente:

```bash
# Localmente
npm run check-env

# En producción
curl https://tu-app.railway.app/api/health
```

## 🛠️ Solución de problemas

### Error: "MongoDB timeout"
- ✅ Verifica que `MONGO_URI` esté configurado
- ✅ Verifica que MongoDB esté accesible
- ✅ Revisa las IPs permitidas en MongoDB Atlas

### Error: "Google OAuth Token inválido"
- ✅ Verifica que `GOOGLE_CLIENT_ID` esté configurado
- ✅ Configura dominios autorizados en Google Cloud Console
- ✅ Verifica que `JWT_SECRET` esté configurado

### Error: "Cross-Origin-Opener-Policy"
- ✅ Verifica que los dominios estén configurados en Google Cloud Console
- ✅ Asegúrate de que CORS esté configurado correctamente 