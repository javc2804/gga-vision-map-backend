const Sequelize = require("sequelize");
const db = require("../config/database");

const Transaction = db.define("transaction", {
  registroNumero: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idUT: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  facturaNotaEntregaNumero: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  registroProveedor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  repuestos: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  formaPago: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cantidad: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  precioUnitarioBolivares: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  tasaBCV: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  precioUnitarioDivisas: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  montoTotalPagoBolivares: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  montoTotalDivisasDeuda: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  precioUnitarioDivisasS: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  montoTotalPagoDivisas: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  fechaEntrega: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  fechaPago: {
    type: Sequelize.DATE,
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
    type: Sequelize.DATE,
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

db.sync()
  .then(() => console.log("Table created"))
  .catch((error) => console.log("Error: ", error));

module.exports = Transaction;
