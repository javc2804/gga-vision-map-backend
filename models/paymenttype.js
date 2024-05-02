import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class PaymentType extends Model {}

PaymentType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    types: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    tableName: "paymenttypes", // Asegúrate de que este es el nombre exacto de tu tabla en la base de datos
    modelName: "PaymentType",
    timestamps: false, // Añade esta línea
  }
);

export default PaymentType;
