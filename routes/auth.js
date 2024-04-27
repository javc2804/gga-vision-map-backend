const express = require("express");
const authController = require("../controllers/auth"); // Asegúrate de que la ruta al controlador de autenticación es correcta

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
