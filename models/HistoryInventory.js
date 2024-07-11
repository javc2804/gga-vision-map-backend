import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class HistoryInventory extends Model {}

HistoryInventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spare_part: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spare_part_variant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delivered_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inventario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marcaModelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    subeje: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ut: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eje: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_rel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "HistoryInventory",
    tableName: "HistoryInventories",
  }
);

export default HistoryInventory;
