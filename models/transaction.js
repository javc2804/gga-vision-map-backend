import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
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
    allowNull: false,
  },
  eje: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  subeje: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  marcaModelo: {
    type: Sequelize.STRING,
    allowNull: false,
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
    allowNull: false,
  },

  formaPago: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  precioUnitarioBs: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  precioUnitarioUsd: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  tasaBcv: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  montoTotalBs: {
    type: Sequelize.FLOAT,
    allowNull: false,
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
