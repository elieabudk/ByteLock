import Suscripciones from "../models/Suscripciones.js";
import crypto from "crypto";
// Aseguramos que la clave tenga 32 bytes
const ENCRYPTION_KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
const IV_LENGTH = 16;

function encrypt(text) {
    if (!text) return '';
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


export const guardarSuscripciones = async (req, res) => {
    const datosSuscripciones = req.body;
    
    const datosEnviar = {
        ...datosSuscripciones,
        userId: req.userId
    };

    const datosEncriptados = {
        pagina: encrypt(datosEnviar.pagina),
        usuario: encrypt(datosEnviar.usuario),
        email: encrypt(datosEnviar.email),
        clave: encrypt(datosEnviar.clave),
        fecha: datosEnviar.fecha,
        userId: datosEnviar.userId
    };

    try {
        const suscripciones = new Suscripciones(datosEncriptados);
        console.log("datosEncriptados: ", datosEncriptados);
        await suscripciones.save();
        console.log("suscripciones guardadas");

        res.status(201).json({ message: "Suscripciones guardadas correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al guardar las suscripciones" });
    }
};
