import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "The name is required"],
  },
  username: {
    type: String,
    required: [true, "The username is required"],
    unique: true,
  },
  correo: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "CLIENT_ROLE"],
    default: "CLIENT_ROLE",
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

export default mongoose.model("User", UserSchema);
