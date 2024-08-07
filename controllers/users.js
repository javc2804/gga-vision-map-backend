import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const register = async (req, res) => {
  const { name, lastName, role, email, password } = req.body;

  if (!name || !lastName || !role || !email || !password) {
    return res.status(400).json({ msg: "Faltan campos requeridos" });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    const status = false;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      lastName,
      role,
      email,
      password: hashedPassword,
      status,
    });

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ msg: "Faltan campos requeridos" });
  }

  try {
    let user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;

    await user.save();

    res.json({ msg: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error del servidor");
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { deleted: false } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};
const deleteUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Falta el correo electrónico" });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    user.deleted = true;

    await user.save();

    res.json({ msg: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error del servidor");
  }
};

const toggleUserStatus = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Falta el correo electrónico" });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    user.status = !user.status;

    await user.save();

    res.json({ msg: "Estado del usuario actualizado con éxito" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error del servidor");
  }
};

const editUser = async (req, res) => {
  const { name, lastName, role, email, password } = req.body;

  if (!name || !lastName || !role || !email || !password) {
    return res.status(400).json({ msg: "Faltan campos requeridos" });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.name = name;
    user.lastName = lastName;
    user.role = role;

    await user.save();

    res.json({ msg: "Usuario actualizado con éxito" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error del servidor");
  }
};

export default {
  register,
  editUser,
  resetPassword,
  listUsers,
  deleteUser,
  toggleUserStatus,
};
