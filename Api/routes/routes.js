import { Router } from "express";
import { googleAuth } from "../controllers/OAuthGoogle.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validarToken } from "../controllers/ValidarToken.js";
import { guardarDatosBancarios } from "../controllers/GuardarDatosBancarios.js";
import { guardarSuscripciones } from "../controllers/GuardarSuscripciones.js";
import { guardarEgresos } from "../controllers/GuadrarEgresos.js";
import { guardarIngresos } from "../controllers/GuardarIngresos.js";
import { obtenerDatosBancarios } from "../controllers/ObtenerDatosBancarios.js";
import { obtenerSuscripciones } from "../controllers/ObtenerSuscripciones.js";
import { obtenerEgresos } from "../controllers/ObetenerEgresos.js";
import { obtenerIngresos } from "../controllers/ObtenerIngreso.js";

const router = Router();

router.post("/google", googleAuth);
router.get("/validar-token", authMiddleware, validarToken);
router.post("/guardar-datos-bancarios", authMiddleware, guardarDatosBancarios);
router.post("/guardar-suscripciones", authMiddleware, guardarSuscripciones);
router.post("/guardar-egresos", authMiddleware, guardarEgresos);
router.post("/guardar-ingresos", authMiddleware, guardarIngresos);
router.get("/obtener-datos-bancarios", authMiddleware, obtenerDatosBancarios);
router.get("/obtener-suscripciones", authMiddleware, obtenerSuscripciones);
router.post("/obtener-egresos", authMiddleware, obtenerEgresos);
router.post("/obtener-ingresos", authMiddleware, obtenerIngresos);

export default router;
