import { Router } from "express";
import { check } from "express-validator";
import { addToCart } from "./cart.controller.js";
import { noExisteProduct, noExisteUsername} from "../helpers/db-validators-cart.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/addToCart",
    [
        validarJWT,
        check("username").custom(noExisteUsername),
        check("productName", "El nombre del producto es obligatorio").not().isEmpty(),
        check("productName").custom(noExisteProduct),
        check("quantity", "La cantidad del producto debe ser un número").isInt(),
        validarCampos,
    ],
    addToCart
);

export default router;