import DatosBancarios from "../models/DatosBancarios.js";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

// Aseguramos que la clave tenga 32 bytes, igual que en GuardarDatosBancarios.js
const ENCRYPTION_KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);

function decrypt(text) {
    try {
        if (!text) return '';
        
        const textParts = text.split(':');
        if (textParts.length !== 2) {
            console.error('Formato inválido en los datos encriptados');
            return text;
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Error al desencriptar:', error);
        return text; // Retornamos el texto original en caso de error
    }
}

export const obtenerDatosBancarios = async (req, res) => {
    try {
        const datos = await DatosBancarios.find({ userId: req.userId });
        
        
        const datosDesencriptados = datos.map(dato => {
            try {
                return {
                    ...dato.toObject(),
                    banco: decrypt(dato.banco),
                    usuario: decrypt(dato.usuario),
                    email: decrypt(dato.email),
                    clave: decrypt(dato.clave),
                    numeroIBAN: decrypt(dato.numeroIBAN),
                    numeroTarjeta: decrypt(dato.numeroTarjeta),
                    claveCajero: decrypt(dato.claveCajero),
                    codigoPin: decrypt(dato.codigoPin),
                }
            } catch (error) {
                console.error('Error al desencriptar dato:', error);
                return dato.toObject(); // Retornamos el dato original en caso de error
            }
        });

        res.status(200).json(datosDesencriptados);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            message: "Error al obtener los datos bancarios",
            error: error.message 
        });
    }
};


