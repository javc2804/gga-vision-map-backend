import { Op } from "sequelize";
import XLSX from "xlsx";
import xl from "excel4node";

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
          "Número de Registro": transaction.id ?? "",
          UT: transaction.ut ?? "",
          "Marca y Modelo": transaction.marcaModelo ?? "",
          Eje: transaction.eje ?? "",
          "Sub-eje": transaction.subeje ?? "",
          "Registro Proveedor": transaction.proveedor ?? "",
          "Descripción repuesto": transaction.descripcionRepuesto ?? "",
          Repuesto: transaction.repuesto ?? "",
          Cantidad: transaction.cantidad ?? "",
          "Precio unitario (Bs)": transaction.precioUnitarioBs ?? "",
          "Monto total (Bs)": transaction.montoTotalBs ?? "",
          "Precio unitario (USD)": transaction.precioUnitarioUsd ?? "",
          "Monto total (USD)": transaction.montoTotalUsd ?? "",
          "Deuda Unitaria (USD)": transaction.deudaUnitariaUsd ?? "",
          "Deuda Total (USD)": transaction.deudaTotalUsd ?? "",
          "Tasa BCV": transaction.tasaBcv ?? "",
          "Fecha de la tasa": transaction.fechaTasa ?? "",
          "OC/OS": transaction.ocOs ?? "",
          "N° de factura/NDE": transaction.facNDE ?? "",
          "Fecha OC/OS": transaction.fechaOcOs ?? "",
          "Forma de pago": transaction.formaPago ?? "",
          "N° de orden de pago": transaction.numeroOrdenPago ?? "",
          "N° de Nota de Entrega": transaction.ndeAlmacen ?? "",
          Compromiso: transaction.compromiso ?? "",
          Observación: transaction.observacion ?? "",
        };
      })
      .filter(Boolean);

    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();

    // Add Worksheets to the workbook
    const ws = wb.addWorksheet("Sheet 1");

    // Create a reusable style
    const headerStyle = wb.createStyle({
      font: {
        color: "black",
        size: 12,
      },
      fill: {
        type: "pattern", // the only one implemented so far.
        patternType: "solid", // most common.
        fgColor: "008000", // You can find color definitions at https://www.w3schools.com/colors/colors_names.asp
      },
    });

    // Set column widths
    ws.column(1).setWidth(20);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(20);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(20);
    ws.column(11).setWidth(20);
    ws.column(12).setWidth(20);
    ws.column(13).setWidth(20);
    ws.column(14).setWidth(20);
    ws.column(15).setWidth(20);
    ws.column(16).setWidth(20);
    ws.column(17).setWidth(20);
    // ... repeat for all columns
    // ... repeat for all columns

    // Set header styles
    ws.cell(1, 1).string("Número de Registro").style(headerStyle);
    ws.cell(1, 2).string("UT").style(headerStyle);
    ws.cell(1, 3).string("Marca/Modelo").style(headerStyle);
    ws.cell(1, 4).string("Eje").style(headerStyle);
    ws.cell(1, 5).string("Sub-eje").style(headerStyle);
    ws.cell(1, 6).string("Proveedor").style(headerStyle);
    ws.cell(1, 7).string("Repuesto").style(headerStyle);
    ws.cell(1, 8).string("Descripción repuesto").style(headerStyle);
    ws.cell(1, 9).string("OC/OS").style(headerStyle);
    ws.cell(1, 10).string("N° de factura/ND").style(headerStyle);
    ws.cell(1, 11).string("Fecha OC/OS").style(headerStyle);
    ws.cell(1, 12).string("Precio unitario (USD)").style(headerStyle);
    ws.cell(1, 13).string("Cantidad").style(headerStyle);
    ws.cell(1, 14).string("Monto total (USD)").style(headerStyle);
    ws.cell(1, 15).string("Forma de pago").style(headerStyle);
    ws.cell(1, 16).string("N° de orden de pago").style(headerStyle);
    ws.cell(1, 17).string("Observación").style(headerStyle);
    // ... repeat for all headers

    // Write data to cells
    transactionsData.forEach((transaction, index) => {
      ws.cell(index + 2, 1).number(transaction["Número de Registro"]);
      ws.cell(index + 2, 2).string(String(transaction["UT"]));
      ws.cell(index + 2, 3).string(String(transaction["Marca y Modelo"]));
      ws.cell(index + 2, 4).string(String(transaction["Eje"]));
      ws.cell(index + 2, 5).string(String(transaction["Sub-eje"]));
      ws.cell(index + 2, 6).string(String(transaction["Registro Proveedor"]));
      ws.cell(index + 2, 7).string(String(transaction["Repuesto"]));
      ws.cell(index + 2, 8).string(String(transaction["Descripción repuesto"]));
      ws.cell(index + 2, 9).string(String(transaction["OC/OS"]));
      ws.cell(index + 2, 10).string(String(transaction["N° de factura/NDE"]));
      ws.cell(index + 2, 11).string(String(transaction["Fecha OC/OS"]));
      // If `transaction["Precio unitario (USD)"]` is null, write 0 (or any default value) to the cell
      if (transaction["Precio unitario (USD)"] === "") {
        ws.cell(index + 2, 12).number(0);
      } else {
        ws.cell(index + 2, 12).number(transaction["Precio unitario (USD)"]);
      }
      // If `transaction["Cantidad"]` is null, write 0 (or any default value) to the cell
      if (transaction["Cantidad"] === "") {
        ws.cell(index + 2, 13).number(0);
      } else {
        ws.cell(index + 2, 13).number(transaction["Cantidad"]);
      }
      // If `transaction["Monto total (USD)"]` is null, write 0 (or any default value) to the cell
      if (transaction["Monto total (USD)"] === "") {
        ws.cell(index + 2, 14).number(0);
      } else {
        ws.cell(index + 2, 14).number(transaction["Monto total (USD)"]);
      }
      ws.cell(index + 2, 15).string(String(transaction["Forma de pago"]));
      ws.cell(index + 2, 16).string(transaction["N° de orden de pago"]);
      ws.cell(index + 2, 17).string(String(transaction["Observación"]));
    });

    // Write the workbook to a file
    const fileName = "reporte.xls";
    wb.write(fileName, (err) => {
      if (err) {
        res.status(500).send({ ok: false, message: err.message });
      } else {
        // Send the file to the client
        res.download(fileName, (err) => {
          if (err) {
            res.status(500).send({ ok: false, message: err.message });
          } else {
            fs.unlinkSync(fileName); // delete the file after sending it to the client
          }
        });
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
