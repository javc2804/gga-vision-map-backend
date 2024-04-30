const Transaction = require("../models/transaction");

exports.createTransaction = async (req, res) => {
  const fields = [
    "registroNumero",
    "idUT",
    "facturaNotaEntregaNumero",
    "registroProveedor",
    "repuestos",
    "formaPago",
    "descripcion",
    "cantidad",
    "precioUnitarioBolivares",
    "tasaBCV",
    "precioUnitarioDivisas",
    "montoTotalPagoBolivares",
    "montoTotalDivisasDeuda",
    "precioUnitarioDivisasS",
    "montoTotalPagoDivisas",
    "fechaEntrega",
    "fechaPago",
    "ordenPagoNumero",
    "ordenCompraServicio",
    "ordenCompraServicioFecha",
    "notaEntregaNumero",
    "estatus",
    "observacion",
  ];

  if (fields.every((field) => req.body[field])) {
    try {
      const transaction = await Transaction.create(req.body);
      res.status(201).json(transaction);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: "Todos los campos son requeridos" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await transaction.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
