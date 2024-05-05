import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

class SparePartVariant extends Model {}

SparePartVariant.init(
  {
    variant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    sparepartid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: false, // Añade esta línea
    sequelize,
    tableName: "SparePartVariants", // Asegúrate de que este es el nombre exacto de tu tabla en la base de datos
    modelName: "SparePartVariant",
  }
);

export default SparePartVariant;
