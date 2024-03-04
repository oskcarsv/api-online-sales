// Importar modelos necesarios
import Role from '../role/role.model.js';
import User from '../user/user.model.js';


export const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`The role ${role} does not exist in the database`);
    }
}

export const existenteUsername = async (username = '') => {
    const existeUsername = await User.findOne({ username });

    if (existeUsername) {
        throw new Error(`The username ${username} has already been registered`);
    }
}


export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });

    if (existeEmail) {
        throw new Error(`The email ${email} has already been registered`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`ID: ${id} Doesn't exist`);
    }
}