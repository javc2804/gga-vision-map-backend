import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { emailOlvidePassword } from "../helpers/email.js";
import generarId from "../helpers/generarId.js";

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

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Faltan campos requeridos" });
  }

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "La Contraseña es incorrecta" });
    }

    if (!user.status) {
      return res.status(403).json({ msg: "Usuario desactivado" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;

        let menu;
        if (user.role === "admin") {
          menu = [
            {
              name: "Gastos",
              icon: "Money",
              subMenu: [
                { name: "Lista NDE", icon: "ListAlt", route: "/" },
                { name: "Registro", icon: "AddBox", route: "/register-out/" },
                { name: "Listado", icon: "List", route: "/list-purchases" },
              ],
            },
            {
              name: "Almacen",
              icon: "Store",
              subMenu: [
                { name: "Notas de entrega", icon: "Note" },
                { name: "Inventario", icon: "Inventory" },
              ],
            },
            {
              name: "Usuarios",
              icon: "People",
              subMenu: [
                { name: "Registrar usuario", icon: "PersonAdd" },
                { name: "Listado de usuarios", icon: "PeopleOutline" },
              ],
            },
          ];
        } else if (user.role === "store") {
          menu = [
            {
              name: "Almacen",
              icon: "Store",
              subMenu: [
                { name: "Notas de entrega", icon: "Note" },
                { name: "Inventario", icon: "Inventory" },
              ],
            },
          ];
        }

        res.json({
          user: {
            id: user.id,
            token,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            role: user.role,
            menu,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generarId();
    await user.save();

    emailOlvidePassword({
      email: user.email,
      name: user.name,
      token: user.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    res.status(500).json({ msg: "Ha ocurrido un error", error: error.message });
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

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
};
