import { Router } from "express";
import { check } from "express-validator";
import { createProduct, getProducts, getProductByName, updateProduct, getSoldOutProducts} from "./product.controller.js";
import { existenteProduct, noExisteProduct, existeProductById} from "../helpers/db-validators-product.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getProducts);

router.get(
    "/getProductByName",
    [
        check("name", "The name is required").not().isEmpty(),
        check("name").custom(noExisteProduct),
        validarCampos,
    ],
    getProductByName
);

router.get(
    "/getSoldOutProducts",
    getSoldOutProducts
)

router.post(
    "/createProduct",
    [
        validarJWT,
        check("name", "The name is required").not().isEmpty(),
        check("name").custom(existenteProduct),
        check("price", "The price is required").not().isEmpty(),
        check("stock", "The stock is required").not().isEmpty(),
        validarCampos,
    ],
    createProduct
);

router.put(
    "/editProduct",
    [
        validarJWT,
        check("oldName").custom(noExisteProduct),
        check("newName").custom(existenteProduct),
        validarCampos,
    ],
    updateProduct
);

export default router;
