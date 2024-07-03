import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Inventory extends Model {}

Inventory.init(
  {
    proveedor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entrada: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    salida: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    factura: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true, // Asumiendo que la descripción puede ser opcional
    },
    user_rel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Inventory",
    tableName: "Inventories",
  }
);

export default Inventory;
