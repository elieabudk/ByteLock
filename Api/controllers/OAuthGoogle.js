// authController.js
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // tu modelo de mongoose o similar

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  console.log("🔍 OAuth Debug - Token recibido:", token ? "✓ Presente" : "✗ No presente");
  console.log("🔍 OAuth Debug - Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "✓ Configurado" : "✗ No configurado");
  console.log("🔍 OAuth Debug - JWT Secret:", process.env.JWT_SECRET ? "✓ Configurado" : "✗ No configurado");

  if (!token) {
    console.error("❌ OAuth Error: Token no proporcionado");
    return res.status(400).json({ message: "Token no proporcionado" });
  }

  try {
    // Verifica el token con Google
    console.log("🔍 Verificando token con Google...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;
    console.log("✅ Token verificado exitosamente para:", email);

    // Guarda o actualiza en tu base de datos
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      console.log("🆕 Creando nuevo usuario:", email);
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture,
      });
    } else {
      console.log("👤 Usuario existente encontrado:", email);
    }

    // Crea tu propio JWT para mayor seguridad
    const yourToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("✅ JWT creado exitosamente para usuario:", user._id);
    res.json({ token: yourToken });
  } catch (error) {
    console.error("❌ Error detallado al verificar el token:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(401).json({ 
      message: "Token inválido",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
