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
    sparepartid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "SpareParts", // nombre de la tabla a la que hace referencia
        key: "id", // campo en la tabla SpareParts que sparepartid hace referencia
      },
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
    sequelize,
    tableName: "SparePartVariants", // Asegúrate de que este es el nombre exacto de tu tabla en la base de datos
    modelName: "SparePartVariant",
  }
);

export default SparePartVariant;
