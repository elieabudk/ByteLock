import Egresos from "../models/Egresos.js";

export const guardarEgresos = async (req, res) => {

    try {
        const datosEgresos = req.body;

    const datosEnviar = {
        ...datosEgresos,
        userId: req.userId
    };

    const egresos = new Egresos(datosEnviar);
    await egresos.save();
    res.status(201).json(egresos);
    } catch (error) {
        res.status(500).json({ message: "Error al guardar los egresos" });
    }
};
