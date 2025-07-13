import express from 'express';
import routes from './routes/routes.js';
import { connectDB } from './config/config.js';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Railway asigna automáticamente el puerto
const PORT = process.env.PORT || 3000;

dotenv.config();

// Middleware para procesar JSON
app.use(morgan('dev'));
app.use(express.json());

// CORS configurado para producción y desarrollo
const corsOptions = {
  origin: [
    "https://web-production-d61d.up.railway.app",
    "http://localhost:5173"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Headers de seguridad para Google OAuth
app.use((req, res, next) => {
  // Configurar headers para Google OAuth
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Headers adicionales de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

connectDB();

// Endpoint de diagnóstico para verificar configuración
app.get('/api/health', (req, res) => {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    MONGO_URI: process.env.MONGO_URI ? '✓ Configurado' : '✗ No configurado',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✓ Configurado' : '✗ No configurado',
    JWT_SECRET: process.env.JWT_SECRET ? '✓ Configurado' : '✗ No configurado',
    mongoStatus: mongoose.connection.readyState === 1 ? '✅ Conectado' : '❌ Desconectado',
    timestamp: new Date().toISOString()
  };
  
  console.log('🔍 Health Check:', envStatus);
  
  res.json({
    status: 'OK',
    environment: envStatus,
    message: 'Servidor funcionando correctamente'
  });
});

// Rutas de la API (IMPORTANTE: van antes de los archivos estáticos)
app.use("/api", routes);

// Servir archivos estáticos del frontend (después de las rutas API)
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos del build de React
  app.use(express.static(path.join(__dirname, '../Client/vite-project/dist')));
  
  // Manejar rutas SPA - todas las rutas no API devuelven index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/vite-project/dist/index.html'));
  });
} else {
  // En desarrollo, ruta de prueba
  app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente! Frontend en http://localhost:5173');
  });
}

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend y API disponibles en el mismo puerto`);
  }
}); 