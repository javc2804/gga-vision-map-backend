const Sequelize = require("sequelize");
const db = require("../config/database");

const Item = db.define("item", {
  registroNumero: {
    type: Sequelize.INTEGER,
  },
  idUT: {
    type: Sequelize.STRING,
  },
  facturaNotaEntregaNumero: {
    type: Sequelize.STRING,
  },
  registroProveedor: {
    type: Sequelize.STRING,
  },
  repuestos: {
    type: Sequelize.STRING,
  },
  formaPago: {
    type: Sequelize.STRING,
  },
  descripcion: {
    type: Sequelize.STRING,
  },
  cantidad: {
    type: Sequelize.INTEGER,
  },
  precioUnitarioBolivares: {
    type: Sequelize.FLOAT,
  },
  tasaBCV: {
    type: Sequelize.FLOAT,
  },
  precioUnitarioDivisas: {
    type: Sequelize.FLOAT,
  },
  montoTotalPagoBolivares: {
    type: Sequelize.FLOAT,
  },
  montoTotalDivisasDeuda: {
    type: Sequelize.FLOAT,
  },
  precioUnitarioDivisasS: {
    type: Sequelize.FLOAT,
  },
  montoTotalPagoDivisas: {
    type: Sequelize.FLOAT,
  },
  fechaEntrega: {
    type: Sequelize.DATE,
  },
  fechaPago: {
    type: Sequelize.DATE,
  },
  ordenPagoNumero: {
    type: Sequelize.STRING,
  },
  ordenCompraServicio: {
    type: Sequelize.STRING,
  },
  ordenCompraServicioFecha: {
    type: Sequelize.DATE,
  },
  notaEntregaNumero: {
    type: Sequelize.STRING,
  },
  estatus: {
    type: Sequelize.STRING,
  },
  observacion: {
    type: Sequelize.STRING,
  },
});

db.sync()
  .then(() => console.log("Table created"))
  .catch((error) => console.log("Error: ", error));

module.exports = Item;
