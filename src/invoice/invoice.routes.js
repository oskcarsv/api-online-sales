import { Router } from "express";
import { check } from "express-validator";
import { createInvoice } from "./invoice.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/createInvoice',
    [
        validarJWT,
        
        check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createInvoice
);

export default router;