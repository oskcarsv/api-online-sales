import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';


export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        users,
    });
}

export const createUser = async (req, res) => {
    const { nombre, username, correo, password, role } = req.body;
    const user = new User({ nombre, username, correo, password, role});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user,
    });
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    res.status(200).json({
        user,
    });
}

export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, rest);

    const user = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'User successfully updated',
        user,
    });
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { estado: false });

    const authenticatedUser = req.user;

    res.status(200).json({ msg: 'Deactivated user', user, authenticatedUser });
}