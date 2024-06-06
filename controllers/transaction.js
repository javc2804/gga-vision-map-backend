import { Op } from "sequelize";
import XLSX from "xlsx";
import Transaction from "../models/transaction.js";
import fs from "fs";
import NoteInvoice from "../models/note_invoices.js";
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
          status: true,
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
const createTransactionAsing = async (req, res) => {
  const totalQuantity = req.body.invoices.reduce(
    (total, trans) => total + trans.cantidad,
    0
  );

  const totalMontoUsd = parseFloat(
    req.body.invoices
      .reduce((total, trans) => total + trans.montoTotalUsd, 0)
      .toFixed(2)
  );

  const totalMontoBs = parseFloat(
    req.body.invoices
      .reduce((total, trans) => total + trans.montoTotalBs, 0)
      .toFixed(2)
  );

  try {
    const transaction = await Transaction.findOne({
      where: { id: req.body.idTransaction },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    transaction.cantidad -= totalQuantity;
    transaction.montoTotalUsd -= totalMontoUsd;
    transaction.montoTotalBs -= totalMontoBs;

    try {
      await transaction.save();
    } catch (saveErr) {
      console.log(saveErr);
      return res.status(500).json({ error: saveErr.message });
    }

    const transactionsData = req.body.invoices.map((transaction) => {
      const { idTransaction, id, ...transactionWithoutId } = transaction;
      return {
        ...transactionWithoutId,
        fechaOcOs: new Date(transaction.fechaOcOs).toISOString(),
      };
    });

    const transactions = await Transaction.bulkCreate(transactionsData);

    const noteInvoices = await NoteInvoice.update(
      { status: true },
      { where: { note_number: transaction.facNDE } }
    );

    res.status(201).json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
          status: true,
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

      const totalCantidad = req.body.reduce(
        (total, transaction) => total + Number(transaction.cantidad),
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
          cantidad: transactionToUpdate.cantidad - totalCantidad,
        });
      }

      console.log(totalMontoTotalUsd, totalCantidad);

      res.status(201).json({ transactions, totalMontoTotalUsd, totalCantidad });
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
    const transaction = await Transaction.findOne({
      where: {
        facNDE: req.body.id,
      },
    });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getTransactionCompromise = async (req, res) => {
  const { id } = req.body;

  try {
    const transaction = await Transaction.findByPk(id, {
      // attributes: {
      //   exclude: [
      //     "eje",
      //     "subeje",
      //     "precioUnitarioBs",
      //     "tasaBcv",
      //     "ut",
      //     "montoTotalBs",
      //     "marcaModelo",
      //   ],
      // },
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
const getListTransaction = async (req, res) => {
  try {
    const { startDate, endDate, offset = 0, limit = 5, ...filters } = req.query;

    // Elimina las propiedades vacías de filters
    const cleanedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    let deudaTotalUsd;
    if (cleanedFilters.deudaTotalUsd) {
      const { min, max } = cleanedFilters.deudaTotalUsd;
      deudaTotalUsd = {
        [Op.between]: [min, max],
      };
      delete cleanedFilters.deudaTotalUsd;
    }

    // Aplica los filtros en la consulta a la base de datos
    const where = {
      ...cleanedFilters,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      ...(deudaTotalUsd && { deudaTotalUsd }),
    };

    const transactions = await Transaction.findAndCountAll({
      where,
      offset: Number(offset), // Use the offset from the query parameters
      limit: Number(limit),
      order: [["createdAt", "DESC"]],
    });

    // Calcula las sumas totales, las redondea a dos decimales y las convierte a números
    const totalDeuda = Number(
      (await Transaction.sum("deudaTotalUsd", { where })).toFixed(2)
    );
    const totalCantidad = Number(
      (await Transaction.sum("cantidad", { where })).toFixed(2)
    );
    const totalMontoUsd = Number(
      (await Transaction.sum("montoTotalUsd", { where })).toFixed(2)
    );
    const totalMontoBs = Number(
      (await Transaction.sum("montoTotalBs", { where })).toFixed(2)
    );

    // Agrega las sumas totales a transactions
    transactions.totalDeuda = totalDeuda;
    transactions.totalCantidad = totalCantidad;
    transactions.totalMontoUsd = totalMontoUsd;
    transactions.totalMontoBs = totalMontoBs;

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getExport = async (req, res) => {
  try {
    const { dataFilters } = req.query;
    const { startDate, endDate, filters } = dataFilters;

    const cleanedFilters = filters
      ? Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== "") {
            acc[key] = value;
          }
          return acc;
        }, {})
      : {};

    const where = {
      ...cleanedFilters,
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    const transactions = await Transaction.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    const transactionsData = transactions
      .map((transaction) => {
        if (!transaction) {
          return null;
        }

        return {
          UT: transaction.ut,
          "Marca/Modelo": transaction.marcaModelo,
          Eje: transaction.eje,
          "Sub-eje": transaction.subeje,
          Proveedor: transaction.proveedor,
          Repuesto: transaction.repuesto,
          "Descripción repuesto": transaction.descripcionRepuesto,
          "OC/OS": transaction.ocOs,
          "N° de factura/ND": transaction.facNDE,
          "Fecha OC/OS": transaction.fechaOcOs,
          "Precio unitario (USD)": transaction.precioUnitarioUsd,
          Cantidad: transaction.cantidad,
          "Monto total (USD)": transaction.montoTotalUsd,
          "Forma de pago": transaction.formaPago,
          "N° de orden de pago": transaction.numeroOrdenPago,
          Observación: transaction.observacion,
        };
      })
      .filter(Boolean);

    const worksheet = XLSX.utils.json_to_sheet(transactionsData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a file
    const fileName = "reporte.xls";
    XLSX.writeFile(workbook, fileName);

    // Send the file to the client
    res.download(fileName, (err) => {
      if (err) {
        res.status(500).send({ ok: false, message: err.message });
      } else {
        fs.unlinkSync(fileName); // delete the file after sending it to the client
      }
    });
  } catch (error) {
    res.status(500).send({ ok: false, message: error.message });
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
  createTransactionAsing,
  getListTransaction,
  getExport,
};
