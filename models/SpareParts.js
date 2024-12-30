import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class SparePart extends Model {}

SparePart.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partType: {
      // Asegúrate de que el atributo partType esté definido
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SparePart",
  }
);

export default SparePart;
