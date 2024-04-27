// models/User.js
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize("postgres://javier:123456@localhost:5432/test"); // Actualiza con tus propios detalles de conexión

class User extends Model {}

User.init(
  {
    // Define los campos del modelo aquí
    email: {
      // Cambiado de 'username' a 'email'
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Asegura que el valor ingresado es un correo electrónico válido
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pasamos la conexión a la base de datos
    modelName: "User", // Nombramos nuestro modelo
  }
);

module.exports = { User, sequelize };
