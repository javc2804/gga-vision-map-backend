import Transaction from "../models/transaction.js";

const createTransaction = async (req, res) => {
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

const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await Transaction.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
