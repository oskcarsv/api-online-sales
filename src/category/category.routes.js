import { Router } from "express";
import { check } from "express-validator";
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from "./category.controller.js";
import { existenteCategory, existeCategoryById, noExisteCategory } from "../helpers/db-validators-category.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";


const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeCategoryById),
    validarCampos,
  ],
  getCategoryById
);
