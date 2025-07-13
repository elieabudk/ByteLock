import Ingresos from "../models/Ingresos.js";
import { limpiarDatos } from "../helpers/ControlDatos.js";

export const guardarIngresos = async (req, res) => {

    try {
        const datosIngresos = req.body;
        const datosLimpios = limpiarDatos(datosIngresos);
    const datosEnviar = {
        ...datosLimpios,
        userId: req.userId
    };

    const ingresos = new Ingresos(datosEnviar);
    await ingresos.save();
    res.status(201).json(ingresos);
    } catch (error) {
        res.status(500).json({ message: "Error al guardar los ingresos" });
    }
};