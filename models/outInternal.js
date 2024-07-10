import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class OutInternal extends Model {}

OutInternal.init(
  {
    proveedorBeneficiario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descripcionGasto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipoGasto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaFactura: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tasaBcv: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fechaTasa: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ordenPagoNumero: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaPago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    relacionMesPago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    montoCompromisoBs: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    montoPagadoBs: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    montoCompromisoUsd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    montoPagadoUsd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    user_rel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "OutInternal",
    tableName: "OutInternals",
  }
);

export default OutInternal;
