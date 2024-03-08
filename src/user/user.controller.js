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
    const user = new User({ nombre, username, correo, password, role });

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

export const updateClient = async (req, res = response) => {
    const { oldUsername, oldPassword, google, newPassword, ...rest } = req.body;

    if (!oldPassword) {
        return res.status(400).json({
            msg: 'oldPassword is required to make changes'
        });
    }

    const user = await User.findOne({ username: oldUsername });

    if (!bcryptjs.compareSync(oldPassword, user.password)) {
        return res.status(400).json({
            msg: 'Old Password is incorrect, please try again'
        });
    }

    if (newPassword) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(newPassword, salt);
    }

    if (req.body.newUsername) {
        rest.username = req.body.newUsername;
    }

    await User.findOneAndUpdate({ username: oldUsername }, rest);

    const userUpdated = await User.findOne({ username: rest.username || oldUsername });

    res.status(200).json({
        msg: 'User successfully updated',
        userUpdated,
    });
}

export const deleteClient = async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { estado: false });

    const authenticatedUser = req.user;

    res.status(200).json({ msg: 'Deactivated user', user, authenticatedUser });
}
