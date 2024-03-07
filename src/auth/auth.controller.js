import bcryptjs from 'bcryptjs';
import Usuario from '../user/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
  const { correoUsuario, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      $or: [{ correo: correoUsuario }, { username: correoUsuario }],
    });

    if (!usuario) {
      return res.status(400).json({
        msg: "Incorrect credentials, email or username doesn't exist",
      });
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "The user is not active",
      });
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Incorrect password",
      });
    }

    const token = await generarJWT(usuario.id);

    res.status(200).json({
      msg: 'Successful login, welcome ' + usuario.nombre,
      usuario,
      token
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error, contact the administrator",
    });
  }
}