import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  compromiso: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  facNDE: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  proveedor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ut: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  eje: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  subeje: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  marcaModelo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  repuesto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descripcionRepuesto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cantidad: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  formaPago: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  precioUnitarioBs: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  precioUnitarioUsd: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  tasaBcv: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  montoTotalBs: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  montoTotalUsd: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  numeroOrdenPago: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fechaOcOs: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  ocOs: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  observacion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_rel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Transaction;
