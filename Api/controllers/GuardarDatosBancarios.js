import DatosBancarios from "../models/DatosBancarios.js";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

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

export const guardarDatosBancarios = async (req, res) => {
    try {
        const datosCliente = req.body;
        
        const DatosEnviar = {
            ...datosCliente,
            userId: req.userId
        };

        const datosEncriptados = {
            banco: encrypt(DatosEnviar.banco),
            usuario: encrypt(DatosEnviar.usuario),
            email: encrypt(DatosEnviar.email),
            clave: encrypt(DatosEnviar.clave),
            numeroIBAN: encrypt(DatosEnviar.numeroIBAN),
            numeroTarjeta: encrypt(DatosEnviar.numeroTarjeta),
            claveCajero: encrypt(DatosEnviar.claveCajero),
            codigoPin: encrypt(DatosEnviar.codigoPin),
            fecha: DatosEnviar.fecha,
            userId: DatosEnviar.userId
        };

        const datosBancarios = new DatosBancarios(datosEncriptados);
        await datosBancarios.save();
        res.status(201).json({ message: "Datos bancarios guardados correctamente" });
    } catch (error) {
        console.error('Error al guardar datos:', error);
        res.status(500).json({ 
            message: "Error al guardar los datos bancarios",
            error: error.message 
        });
    }
};


