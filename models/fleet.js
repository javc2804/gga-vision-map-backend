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
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    attention: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    brand: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    model: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

// Sync the model with the database

export default Fleet;
