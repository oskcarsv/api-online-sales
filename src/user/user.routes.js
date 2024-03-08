import { Router } from "express";
import { check } from "express-validator";
import { getUsers, createUser, getUserById, updateClient, updateClientAdmin,deleteClient} from "./user.controller.js";
import { existenteEmail, existenteUsername, existeUsuarioById, noExisteUsername} from "../helpers/db-validators.js";
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
      check("username", "username is required").not().isEmpty(),
      check("username").custom(noExisteUsername),
      check("newUsername").custom(existenteUsername), 
      check("correo").custom(existenteEmail), 
      validarCampos,
  ],
  updateClient
);

router.put(
  "/editProfileClientAdmin",
  [
      validarJWT,
      check("username", "username is required").not().isEmpty(),
      check("username").custom(noExisteUsername),
      check("newUsername").custom(existenteUsername), 
      check("correo").custom(existenteEmail), 
      validarCampos,
  ],
  updateClientAdmin
);


router.delete(
  "/deleteProfileClient",
  [
    validarJWT,
    check("username", "Username is required").not().isEmpty(),
    check("username").custom(noExisteUsername),
    check("password", "Password is required").not().isEmpty(),
    check("confirmation", "Confirmation is required").not().isEmpty(),
    validarCampos,
  ],
  deleteClient
);

export default router;
