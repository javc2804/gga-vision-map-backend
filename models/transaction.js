import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  note_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  delivered_by: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  observation: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  spare_part: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  spare_part_variant: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  ut: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  fleet: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  precioUnitarioDivisas: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  montoTotalPagoBolivares: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  montoTotalDivisasDeuda: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  precioUnitarioDivisasS: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  montoTotalPagoDivisas: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fechaEntrega: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fechaPago: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ordenPagoNumero: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ordenCompraServicio: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ordenCompraServicioFecha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  notaEntregaNumero: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  estatus: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  observacion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Transaction;
