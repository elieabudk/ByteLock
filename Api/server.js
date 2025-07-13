import express from 'express';
import routes from './routes/routes.js';
import { connectDB } from './config/config.js';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

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
  credentials: true
};
app.use(cors(corsOptions));

connectDB();

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