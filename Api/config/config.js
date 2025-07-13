import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    console.log("🔍 MongoDB Debug - URI presente:", MONGO_URI ? "✓ Configurado" : "✗ No configurado");
    
    if (!MONGO_URI) {
      throw new Error("MONGO_URI no está configurado en las variables de entorno");
    }

    // Configuración optimizada para producción
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(MONGO_URI, options);
    console.log("✅ MongoDB connected successfully");
    
    // Configurar eventos de conexión
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", {
      message: error.message,
      stack: error.stack
    });
    
  
  }
};