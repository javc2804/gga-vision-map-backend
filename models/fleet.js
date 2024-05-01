import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Fleet = sequelize.define(
  "Fleet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ut: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    attention: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Fleet;
