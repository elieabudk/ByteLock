import Suscripciones from "../models/Suscripciones.js";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);

function decrypt(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) {
            return '';
        }
        
        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Error decrypting value:', error);
        return '';
    }
}

export const obtenerSuscripciones = async (req, res) => {
    try {
        const suscripciones = await Suscripciones.find({ userId: req.userId });
        
        
        const suscripcionesDecrypted = suscripciones.map(suscripcion => ({
            ...suscripcion.toObject(),
            pagina: decrypt(suscripcion.pagina),
            usuario: decrypt(suscripcion.usuario),
            email: decrypt(suscripcion.email),
            clave: decrypt(suscripcion.clave),
        
        }));
      
        res.status(200).json(suscripcionesDecrypted);
    } catch (error) {
        console.error('Error al obtener suscripciones:', error);
        res.status(500).json({ 
            message: "Error al obtener las suscripciones",
            error: error.message 
        });
    }
};