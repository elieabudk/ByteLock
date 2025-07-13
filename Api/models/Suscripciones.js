import mongoose from "mongoose";

const suscripcionesSchema = new mongoose.Schema({
    pagina: { type: String, required: true },
    usuario: { type: String, required: true },
    email: { type: String, required: true },
    clave: { type: String, required: true },
    fecha: { type: Date, required: true },
    userId: { type: String, required: true }
}, { 
    timestamps: true 
});

const Suscripciones = mongoose.model("Suscripciones", suscripcionesSchema);

export default Suscripciones;