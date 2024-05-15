import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const Fleet = sequelize.define(
  "Fleet",
  {
    ut: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    attention: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    eje: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    subeje: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    marcaModelo: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Fleet;
