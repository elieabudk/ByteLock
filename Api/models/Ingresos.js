import mongoose from "mongoose";

const ingresosSchema = new mongoose.Schema({
    monto: { type: Number, required: true },
    descripcion: { type: String, required: true },
    fecha: { type: Date, required: true },
    userId: { type: String, required: true },
});

const Ingresos = mongoose.model("Ingresos", ingresosSchema);

export default Ingresos;