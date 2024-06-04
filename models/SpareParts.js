import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class SparePart extends Model {}

SparePart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    user_rel: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users", // Asegúrate de que este es el nombre correcto de tu modelo User
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SparePart",
    tableName: "SpareParts", // Asegúrate de que este es el nombre exacto de tu tabla en la base de datos
  }
);

// SparePart.sync({ alter: true })
//   .then(() => console.log("La tabla SpareParts ha sido sincronizada"))
//   .catch((error) =>
//     console.error("No se pudo sincronizar la tabla SpareParts:", error)
//   );

export default SparePart;
