import Transaction from "../models/transaction.js";
import NoteInvoice from "../models/note_invoices.js";
const createTransaction = async (req, res) => {
  const fields = [
    "createdAt",
    "delivered_by",
    "estatus",
    "fechaEntrega",
    "fechaPago",
    "fleet",
    "montoTotalDivisasDeuda",
    "montoTotalPagoBolivares",
    "montoTotalPagoDivisas",
    "notaEntregaNumero",
    "note_number",
    "observacion",
    "observation",
    "ordenCompraServicio",
    "ordenCompraServicioFecha",
    "ordenPagoNumero",
    "precioUnitarioDivisas",
    "precioUnitarioDivisasS",
    "provider",
    "quantity",
    "spare_part",
    "spare_part_variant",
    "status",
    "updatedAt",
    "ut",
  ];

  if (
    Array.isArray(req.body) &&
    req.body.every((transaction) =>
      fields.every((field) => field in transaction)
    )
  ) {
    try {
      const transactionsData = req.body.map((transaction) => ({
        ...transaction,
        fechaEntrega: new Date(transaction.fechaEntrega).toISOString(),
        fechaPago: new Date(transaction.fechaPago).toISOString(),
        ordenCompraServicioFecha: new Date(
          transaction.ordenCompraServicioFecha
        ).toISOString(),
      }));

      const transactions = await Transaction.bulkCreate(transactionsData);

      const noteNumbers = transactions.map(
        (transaction) => transaction.note_number
      );
      await NoteInvoice.update(
        { status: true },
        { where: { note_number: noteNumbers } }
      );
      res.status(201).json(transactions);
    } catch (err) {
      console.log(err);

      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({
      error: "Todos los campos son requeridos en cada objeto del array",
    });
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
