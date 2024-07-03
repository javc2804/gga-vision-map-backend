import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define("transactions", {
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
    allowNull: true,
  },
  proveedor: {
    type: Sequelize.STRING,
    allowNull: true,
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
  descripcion: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  repuesto: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  descripcionRepuesto: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cantidad: {
    type: Sequelize.INTEGER,
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
    allowNull: true,
  },
  tasaBcv: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  fechaTasa: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  montoTotalBs: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  montoTotalUsd: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  deudaUnitarioUsd: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  deudaTotalUsd: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  numeroOrdenPago: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ndeAlmacen: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fechaEntrega: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  fechaOcOs: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  ocOs: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  observacion: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  user_rel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Transaction;
