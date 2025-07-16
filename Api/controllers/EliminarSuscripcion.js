import Suscripciones from "../models/Suscripciones.js";

export const EliminarSuscripcion = async (req, res) => {

    try {
        const { _id } = req.body;
        const suscripcion = await Suscripciones.findByIdAndDelete(_id);
        res.status(200).json(suscripcion);
    } catch (error) {
        res.status(500).json({ message: "error al eliminar la suscripcion" });
    }
}