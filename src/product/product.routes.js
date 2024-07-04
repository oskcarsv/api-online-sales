import { Router } from "express";
import { check } from "express-validator";
import {
  createProduct,
  getProducts,
  getProductByName,
  updateProduct,
  getSoldOutProducts,
  deleteProduct,
  updateProductStatus,
  updateProductCategory,
} from "./product.controller.js";
import {
  existenteProduct,
  noExisteProduct,
} from "../helpers/db-validators-product.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", updateProductStatus, updateProductCategory, getProducts);

router.get(
  "/getProductByName",
  [
    updateProductStatus,
    check("name", "The name is required").not().isEmpty(),
    check("name").custom(noExisteProduct),
    validarCampos,
  ],
  getProductByName,
);

router.get("/getSoldOutProducts", updateProductStatus, getSoldOutProducts);

router.post(
  "/createProduct",
  [
    validarJWT,
    updateProductStatus,
    check("name", "The name is required").not().isEmpty(),
    check("name").custom(existenteProduct),
    check("price", "The price is required").not().isEmpty(),
    check("stock", "The stock is required").not().isEmpty(),
    validarCampos,
  ],
  createProduct,
);

router.put(
  "/editProduct",
  [
    validarJWT,
    updateProductStatus,
    check("oldName").custom(noExisteProduct),
    check("newName").custom(existenteProduct),
    validarCampos,
  ],
  updateProduct,
);

router.delete(
  "/deleteProduct",
  [
    validarJWT,
    updateProductStatus,
    check("name", "The name is required").not().isEmpty(),
    check("name").custom(noExisteProduct),
    check("confirmation", "The confirmationToken is required").not().isEmpty(),
    validarCampos,
  ],
  deleteProduct,
);

export default router;
