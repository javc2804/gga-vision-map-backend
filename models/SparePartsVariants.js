import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import SparePart from "./SpareParts.js";

class SparePartVariant extends Model {}

SparePartVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    variant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sparepartid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "SparePartVariant",
  }
);

// Definir la relación
SparePart.hasMany(SparePartVariant, {
  foreignKey: "sparepartid",
  as: "variants",
});
SparePartVariant.belongsTo(SparePart, {
  foreignKey: "sparepartid",
  as: "sparePart",
});

export default SparePartVariant;
