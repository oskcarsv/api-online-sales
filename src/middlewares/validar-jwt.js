import jwt from 'jsonwebtoken';
import Usuario from '../user/user.model.js';

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "There is no token in the request",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (!usuario.username) {
            return res.status(401).json({
                msg: "Username doesn't exist in the database"
            });
        }

        if (!usuario) {
            return res.status(401).json({
                msg: "User doesn't exist in the database"
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Invalid token - user with status: false'
            });
        }

        if (usuario.role == 'CLIENT_ROLE') {
            if (req.body && req.body.username) {
                if (usuario.username !== req.body.username) {
                    return res.status(401).json({
                        msg: 'Access denied, only the owner of the account or admins can make changes to the profile'
                    });
                }
            }
        }
        
        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Invalid token",
        });
    }
}