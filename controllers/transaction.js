import { Op } from "sequelize";

import Transaction from "../models/transaction.js";
const createTransaction = async (req, res) => {
  const fields = [
    "user_rel",
    "cantidad",
    "descripcion",
    "descripcionRepuesto",
    "eje",
    "facNDE",
    "fechaOcOs",
    "formaPago",
    "marcaModelo",
    "montoTotalBs",
    "montoTotalUsd",
    "numeroOrdenPago",
    "observacion",
    "ocOs",
    "precioUnitarioBs",
    "precioUnitarioUsd",
    "proveedor",
    "repuesto",
    "subeje",
    "tasaBcv",
    "ut",
  ];

  if (
    Array.isArray(req.body) &&
    req.body.every((transaction) =>
      fields.every((field) => field in transaction)
    )
  ) {
    try {
      const transactionsData = req.body.map((transaction) => {
        const { id, ...transactionWithoutId } = transaction;
        return {
          ...transactionWithoutId,
          fechaOcOs: new Date(transaction.fechaOcOs).toISOString(),
        };
      });

      const transactions = await Transaction.bulkCreate(transactionsData);

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
const createTransactionCompromise = async (req, res) => {
  const fields = [
    "user_rel",
    "cantidad",
    "descripcion",
    "descripcionRepuesto",
    "nde",
    "fechaOcOs",
    "formaPago",
    "montoTotalUsd",
    "numeroOrdenPago",
    "observacion",
    "ocOs",
    "precioUnitarioUsd",
    "proveedor",
    "repuesto",
    "compromiso",
  ];

  if (
    Array.isArray(req.body) &&
    req.body.every((transaction) =>
      fields.every((field) => field in transaction)
    )
  ) {
    try {
      const transactionsData = req.body.map((transaction) => {
        const { id, nde, ...transactionWithoutId } = transaction;
        return {
          ...transactionWithoutId,
          facNDE: nde,
          fechaOcOs: new Date(transaction.fechaOcOs).toISOString(),
        };
      });

      const transactions = await Transaction.bulkCreate(transactionsData);

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
const createTransactionUpdateCompromise = async (req, res) => {
  const fields = [
    "user_rel",
    "cantidad",
    "descripcion",
    "descripcionRepuesto",
    "facNDE",
    "fechaOcOs",
    "formaPago",
    "montoTotalUsd",
    "numeroOrdenPago",
    "observacion",
    "ocOs",
    "precioUnitarioUsd",
    "proveedor",
    "repuesto",
    "compromiso",
    "id",
  ];

  if (
    Array.isArray(req.body) &&
    req.body.every((transaction) =>
      fields.every((field) => field in transaction)
    )
  ) {
    try {
      const totalMontoTotalUsd = req.body.reduce(
        (total, transaction) => total + Number(transaction.montoTotalUsd),
        0
      );

      const transactionsData = req.body.map((transaction) => {
        const { id, nde, ...transactionWithoutId } = transaction;
        return {
          ...transactionWithoutId,
          fechaOcOs: new Date(transaction.fechaOcOs).toISOString(),
        };
      });

      const transactions = await Transaction.bulkCreate(transactionsData);

      // Update the transaction with the given id
      const transactionToUpdate = await Transaction.findByPk(req.body[0].id);
      if (transactionToUpdate) {
        await transactionToUpdate.update({
          montoTotalUsd: transactionToUpdate.montoTotalUsd - totalMontoTotalUsd,
        });
      }

      console.log(totalMontoTotalUsd);

      res.status(201).json({ transactions, totalMontoTotalUsd });
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

const getFilteredTransactions = async (req, res) => {
  try {
    const filters = req.body; // asumimos que los filtros vienen en el cuerpo de la solicitud
    console.log(filters);

    // construir las condiciones de la consulta
    const conditions = Object.keys(filters).map((key) => {
      return { [key]: filters[key] };
    });

    const transactions = await Transaction.findAll({
      where: {
        [Op.and]: conditions, // usa Op.or para una condición OR
      },
    });

    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
const getTransactionCompromise = async (req, res) => {
  const { id } = req.body;

  try {
    const transaction = await Transaction.findByPk(id, {
      attributes: {
        exclude: [
          "eje",
          "subeje",
          "precioUnitarioBs",
          "tasaBcv",
          "ut",
          "montoTotalBs",
          "marcaModelo",
        ],
      },
    });
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
  getFilteredTransactions,
  createTransactionCompromise,
  getTransactionCompromise,
  createTransactionUpdateCompromise,
};
