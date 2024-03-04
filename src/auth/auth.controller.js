import bcryptjs from 'bcryptjs';
import Usuario from '../user/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js'; 

export const login = async (req, res) => {
    const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Incorrect credentials, mail does not exist in the database",
      });
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "The user does not exist in the database",
      });
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Password is incorrect",
      });
    }

    const token = await generarJWT( usuario.id);

    res.status(200).json({
      msg: 'Successful login, welcome',
      usuario,
      token
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error, contact admin",
    });
  }
}