import mongoose from "mongoose";

const egresosSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    monto: { type: Number, required: true },
    fecha: { type: Date, required: true },
    userId: { type: String, required: true },
});

const Egresos = mongoose.model("Egresos", egresosSchema);

export default Egresos;
