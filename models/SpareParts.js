import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class SparePart extends Model {}

SparePart.init(
  {
    // Define los atributos del modelo aquí, por ejemplo:
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Añade más atributos según sea necesario
  },
  {
    sequelize, // Instancia de conexión
    modelName: "SparePart", // Nombre del modelo
  }
);

export default SparePart;
