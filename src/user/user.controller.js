import { response, request } from "express";
import bcryptjs from "bcryptjs";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
  const { limite, desde } = req.query;
  const query = { estado: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

export const createUser = async (req, res) => {
  const { nombre, username, correo, password, role } = req.body;
  const user = new User({ nombre, username, correo, password, role });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.status(200).json({
    user,
  });
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  res.status(200).json({
    user,
  });
};

export const updateClient = async (req, res = response) => {
  const { username, oldPassword, google, role, newPassword, ...rest } =
    req.body;

  if (!oldPassword) {
    return res.status(400).json({
      msg: "oldPassword is required to make changes",
    });
  }

  const user = await User.findOne({ username });

  if (!bcryptjs.compareSync(oldPassword, user.password)) {
    return res.status(400).json({
      msg: "Old Password is incorrect, please try again",
    });
  }

  if (newPassword) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(newPassword, salt);
  }

  if (req.body.newUsername) {
    rest.username = req.body.newUsername;
  }

  await User.findOneAndUpdate({ username }, rest);

  const userUpdated = await User.findOne({
    username: rest.username || username,
  });

  res.status(200).json({
    msg: "User successfully updated",
    userUpdated,
  });
};

export const updateClientAdmin = async (req, res = response) => {
  const { username, oldPassword, google, newPassword, ...rest } = req.body;

  if (!oldPassword) {
    return res.status(400).json({
      msg: "oldPassword is required to make changes",
    });
  }

  const user = await User.findOne({ username });

  if (!bcryptjs.compareSync(oldPassword, user.password)) {
    return res.status(400).json({
      msg: "Old Password is incorrect, please try again",
    });
  }

  if (newPassword) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(newPassword, salt);
  }

  if (req.body.newUsername) {
    rest.username = req.body.newUsername;
  }

  await User.findOneAndUpdate({ username }, rest);

  const userUpdated = await User.findOne({
    username: rest.username || username,
  });

  res.status(200).json({
    msg: "User successfully updated",
    userUpdated,
  });
};

export const deleteClient = async (req, res) => {
  const { username, password, confirmation } = req.body;

  if (confirmation !== "YES") {
    return res.status(400).json({
      msg: "Confirmation must be YES to proceed",
    });
  }

  const user = await User.findOne({ username });

  if (!bcryptjs.compareSync(password, user.password)) {
    return res.status(400).json({
      msg: "Incorrect password, please try again",
    });
  }

  await User.findOneAndUpdate({ username }, { estado: false });

  res.status(200).json({
    msg: "User successfully deleted",
  });
};
