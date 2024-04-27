// models/user.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database"); // Importa la instancia de Sequelize de database.js

class User extends Model {}

User.init(
  {
    // Define los campos del modelo aquí
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User; // Exporta el modelo User
