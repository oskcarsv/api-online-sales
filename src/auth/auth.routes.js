import { Router } from "express";
import { check } from "express-validator";
import { login } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    '/login',
    [
        check('correoUsuario', 'Invalid email or username').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        validarCampos,
    ],
    login
);

export default router;