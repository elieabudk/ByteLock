import Egresos from "../models/Egresos.js";
import dotenv from 'dotenv';
dotenv.config();




export const obtenerEgresos = async (req, res) => {
    try {
        const fechaEnviada = req.body.fecha;
        console.log("fecha enviada: ", fechaEnviada);
        
        // Extraer año y mes de la fecha enviada (formato: YYYY-MM-DD)
        const [year, month] = fechaEnviada.split('-');
        
        // Crear el primer día del mes y el último día del mes
        const primerDiaDelMes = new Date(year, month - 1, 1); // month - 1 porque los meses en JS van de 0-11
        const ultimoDiaDelMes = new Date(year, month, 0); // día 0 del siguiente mes = último día del mes actual
        
        console.log("Buscando egresos del mes:", month, "del año:", year);
        console.log("Rango de fechas:", primerDiaDelMes, "hasta", ultimoDiaDelMes);
        
        // Buscar egresos en el rango de fechas del mes
        const egresos = await Egresos.find({ 
            userId: req.userId, 
            fecha: {
                $gte: primerDiaDelMes,
                $lte: ultimoDiaDelMes
            }
        });
        
        console.log("Egresos encontrados:", egresos.length);
        
        res.status(200).json(egresos);
    } catch (error) {
        console.error('Error al obtener egresos:', error);
        res.status(500).json({ 
            message: "Error al obtener los egresos",
            error: error.message 
        });
    }
};