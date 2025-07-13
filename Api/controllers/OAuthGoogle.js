// authController.js
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // tu modelo de mongoose o similar

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    // Verifica el token con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    // Guarda o actualiza en tu base de datos
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture,
      });
    }

    // Crea tu propio JWT para mayor seguridad
    const yourToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ token: yourToken });
  } catch (error) {
    console.error("Error al verificar el token", error);
    res.status(401).json({ message: "Token inválido" });
  }
};
