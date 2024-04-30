const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { emailOlvidePassword } = require("../helpers/email.js");
const generarId = require("../helpers/generarId.js");

exports.register = async (req, res) => {
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
    user = new User({ name, lastName, role, email, password, status });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

exports.login = async (req, res) => {
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
          menu = {
            name: "Gastos",
            subMenu: ["Registro", "Listado"],
            name: "Almacen",
            subMenu: ["Notas de entrega", "Inventario"],
            name: "Usuarios",
            subMenu: ["Registrar usuario", "Listado de usuarios"],
          };
        } else if (user.role === "store") {
          menu = {
            name: "Almacen",
            subMenu: ["Notas de entrega", "Inventario"],
          };
        }

        res.json({
          user: {
            id: user.id,
            token,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
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

exports.forgotPassword = async (req, res) => {
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
      name: user.nombre,
      token: user.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    res.status(500).json({ msg: "Ha ocurrido un error", error: error.message });
  }
};
