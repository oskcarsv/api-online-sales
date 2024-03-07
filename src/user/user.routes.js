import { Router } from "express";
import { check } from "express-validator";
import { getUsers, createUser, getUserById, updateClient, deleteUser} from "./user.controller.js";
import { existenteEmail, existenteUsername, esRoleValido, existeUsuarioById} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.get(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  getUserById
);

router.post(
  "/createAccountClient",
  [
    check("nombre", "The name is required").not().isEmpty(),
    check("username", "The password is required").not().isEmpty(),
    check("password", "The password must be greater than 6 characters").isLength({ min: 6,}),
    check("correo", "This is not a valid email").isEmail(),
    check("username").custom(existenteUsername),
    check("correo").custom(existenteEmail),
        validarCampos,
  ],
  createUser
);

router.put(
  "/editProfileClient",
  [
    validarJWT,
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    check("username").custom(existenteUsername),
    check("correo").custom(existenteEmail),
    validarCampos,
  ],
  updateClient
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "USER_ROLE"),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  deleteUser
);

export default router;
