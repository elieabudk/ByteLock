import DatosBancarios from "../models/DatosBancarios.js";

export const EliminarDatosBancarios = async (req, res) => {
    try {
        const { _id } = req.body;
        const datosBancarios = await DatosBancarios.findByIdAndDelete(_id);
        res.status(200).json(datosBancarios);
    } catch (error) {
        res.status(500).json({ message: "error al eliminar los datos bancarios" });
    }
}