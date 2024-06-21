import { Op } from "sequelize";
import XLSX from "xlsx";
import xl from "excel4node";

import Transaction from "../models/transaction.js";
import fs from "fs";
import NoteInvoice from "../models/note_invoices.js";
import { format } from "date-fns";

const createTransaction = async (req, res) => {
  const fields = [
    "facNDE",
    "proveedor",
    "cantidad",
    "montoTotalBs",
    "montoTotalUsd",
    "numeroOrdenPago",
    "precioUnitarioBs",
    "precioUnitarioUsd",
    "tasaBcv",
    "repuesto",
    "descripcionRepuesto",
    "fechaOcOs",
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
          formaPago: "contado", // Convert 'formaPago' to lowercase
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
    "deudaTotalUsd",
    "numeroOrdenPago",
    "observacion",
    "ocOs",
    "deudaUnitarioUsd",
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
        const { id, nde, ...transactionWithoutId } = transaction; // Remove 'id' from each transaction
        return {
          ...transactionWithoutId,
          facNDE: nde,
          fechaOcOs: new Date(transaction.fechaOcOs).toISOString(),
          formaPago: "credito",
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
    // "deudaTotalUsd",
    "numeroOrdenPago",
    "observacion",
    "ocOs",
    // "deudaUnitarioUsd",
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
      const totalDeudaTotalUsd = req.body.reduce(
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
          status: true,
          formaPago: "contado",
        };
      });

      const transactions = await Transaction.bulkCreate(transactionsData);

      // Update the transaction with the given id
      const transactionToUpdate = await Transaction.findByPk(req.body[0].id);
      if (transactionToUpdate) {
        await transactionToUpdate.update({
          deudaTotalUsd: transactionToUpdate.deudaTotalUsd - totalDeudaTotalUsd,
          cantidad: transactionToUpdate.cantidad - totalCantidad,
        });
      }

      // console.log(totalMontoTotalUsd, totalCantidad);

      res.status(201).json({ transactions, totalDeudaTotalUsd, totalCantidad });
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
const editTransaction = async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const transaction = await Transaction.update(data, {
      where: { id },
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

    const where = {
      ...cleanedFilters,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      ...(deudaTotalUsd && { deudaTotalUsd }),
      status: true,
    };

    const transactions = await Transaction.findAndCountAll({
      where,
      offset: Number(offset), // Use the offset from the query parameters
      limit: Number(limit),
      order: [["createdAt", "DESC"]],
    });

    // Crea los objetos para las sumas de cada categoría
    const rubrosCantidad = { total: 0 };
    const rubrosBs = { total: 0 };
    const rubrosUsd = { total: 0 };
    const rubrosDeuda = { total: 0 };

    // Define las categorías
    const categories = [
      "cauchos",
      "repuestos",
      "servicios",
      "preventivos",
      "lubricantes",
      "baterias",
    ];

    // Crea una copia de 'where' sin el filtro 'repuesto'
    const whereForTotals = { ...where };
    delete whereForTotals.repuesto;

    for (let category of categories) {
      const sumCantidad =
        (await Transaction.sum("cantidad", {
          where: { ...whereForTotals, repuesto: category },
        })) || 0;
      const sumBs =
        (await Transaction.sum("montoTotalBs", {
          where: { ...whereForTotals, repuesto: category },
        })) || 0;
      const sumUsd =
        (await Transaction.sum("montoTotalUsd", {
          where: { ...whereForTotals, repuesto: category },
        })) || 0;
      const sumDeuda =
        (await Transaction.sum("deudaTotalUsd", {
          where: { ...whereForTotals, repuesto: category },
        })) || 0;

      rubrosCantidad[
        `total${category.charAt(0).toUpperCase() + category.slice(1)}`
      ] = sumCantidad;
      rubrosBs[`total${category.charAt(0).toUpperCase() + category.slice(1)}`] =
        Number(sumBs.toFixed(2));
      rubrosUsd[
        `total${category.charAt(0).toUpperCase() + category.slice(1)}`
      ] = Number(sumUsd.toFixed(2));
      rubrosDeuda[
        `total${category.charAt(0).toUpperCase() + category.slice(1)}`
      ] = Number(sumDeuda.toFixed(2));

      rubrosCantidad.total += sumCantidad;
      rubrosBs.total += sumBs;
      rubrosUsd.total += sumUsd;
      rubrosDeuda.total += sumDeuda;
    }

    // Agrega los objetos a transactions
    transactions.rubrosCantidad = rubrosCantidad;
    transactions.rubrosBs = rubrosBs;
    transactions.rubrosUsd = rubrosUsd;
    transactions.rubrosDeuda = rubrosDeuda;

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
      status: true,
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
          "Deuda Unitaria (USD)": transaction.deudaUnitarioUsd ?? "",
          "Deuda Total (USD)": transaction.deudaTotalUsd ?? "",
          "Tasa BCV": transaction.tasaBcv ?? "",
          "Fecha de la tasa": transaction.fechaTasa
            ? format(new Date(transaction.fechaTasa), "dd/MM/yyyy")
            : "",
          "OC/OS": transaction.ocOs ?? "",
          "N° de factura/NDE": transaction.facNDE ?? "",
          "Fecha OC/OS": transaction.fechaOcOs
            ? format(new Date(transaction.fechaOcOs), "dd/MM/yyyy")
            : "",
          "Forma de pago": transaction.formaPago ?? "",
          "N° de orden de pago": transaction.numeroOrdenPago ?? "",
          "N° de Nota de Entrega": transaction.ndeAlmacen ?? "",
          Compromiso: transaction.compromiso ?? "",
          Observación: transaction.observacion ?? "",
          Usuario: transaction.user_rel ?? "",
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
    ws.column(18).setWidth(20);
    ws.column(19).setWidth(20);
    ws.column(20).setWidth(20);
    ws.column(21).setWidth(20);
    ws.column(22).setWidth(20);
    ws.column(23).setWidth(20);
    ws.column(24).setWidth(20);
    ws.column(25).setWidth(20);
    ws.column(26).setWidth(20);
    // ... repeat for all columns
    // ... repeat for all columns

    // Set header styles
    ws.cell(1, 1).string("Número de Registro").style(headerStyle);
    ws.cell(1, 2).string("UT").style(headerStyle);
    ws.cell(1, 3).string("Marca/Modelo").style(headerStyle);
    ws.cell(1, 4).string("Eje").style(headerStyle);
    ws.cell(1, 5).string("Sub-eje").style(headerStyle);
    ws.cell(1, 6).string("Registro Proveedor").style(headerStyle);
    ws.cell(1, 7).string("Descripción repuesto").style(headerStyle);
    ws.cell(1, 8).string("Repuesto").style(headerStyle);
    ws.cell(1, 9).string("Cantidad").style(headerStyle);
    ws.cell(1, 10).string("Precio unitario (Bs)").style(headerStyle);
    ws.cell(1, 11).string("Monto total (Bs)").style(headerStyle);
    ws.cell(1, 12).string("Precio unitario (USD)").style(headerStyle);
    ws.cell(1, 13).string("Monto total (USD)").style(headerStyle);
    ws.cell(1, 14).string("Deuda Unitario (USD)").style(headerStyle);
    ws.cell(1, 15).string("Deuda total (USD)").style(headerStyle);
    ws.cell(1, 16).string("Tasa BCV").style(headerStyle);
    ws.cell(1, 17).string("Fecha de la Tasa").style(headerStyle);
    ws.cell(1, 18).string("OC/OS").style(headerStyle);
    ws.cell(1, 19).string("N° de factura/ND").style(headerStyle);
    ws.cell(1, 20).string("Fecha OC/OS").style(headerStyle);
    ws.cell(1, 21).string("Forma de pago").style(headerStyle);
    ws.cell(1, 22).string("N° de orden de pago").style(headerStyle);
    ws.cell(1, 23).string("N° de Nota de Entrega").style(headerStyle);
    ws.cell(1, 24).string("Compromiso").style(headerStyle);
    ws.cell(1, 25).string("Observación").style(headerStyle);
    ws.cell(1, 26).string("Usuario").style(headerStyle);
    // ... repeat for all headers

    // Write data to cells
    // Write data to cells
    transactionsData.forEach((transaction, index) => {
      ws.cell(index + 2, 1).string(String(transaction["Número de Registro"]));
      ws.cell(index + 2, 2).string(String(transaction["UT"]));
      ws.cell(index + 2, 3).string(String(transaction["Marca y Modelo"]));
      ws.cell(index + 2, 4).string(String(transaction["Eje"]));
      ws.cell(index + 2, 5).string(String(transaction["Sub-eje"]));
      ws.cell(index + 2, 6).string(String(transaction["Registro Proveedor"]));
      ws.cell(index + 2, 7).string(String(transaction["Descripción repuesto"]));
      ws.cell(index + 2, 8).string(String(transaction["Repuesto"]));
      ws.cell(index + 2, 9).number(Number(transaction["Cantidad"]));
      ws.cell(index + 2, 10).number(
        Number(transaction["Precio unitario (Bs)"])
      );
      ws.cell(index + 2, 11).number(Number(transaction["Monto total (Bs)"]));
      ws.cell(index + 2, 12).number(
        Number(transaction["Precio unitario (USD)"])
      );
      ws.cell(index + 2, 13).number(Number(transaction["Monto total (USD)"]));
      ws.cell(index + 2, 14).number(
        Number(transaction["Deuda Unitaria (USD)"])
      );
      ws.cell(index + 2, 15).number(Number(transaction["Deuda Total (USD)"]));
      ws.cell(index + 2, 16).number(Number(transaction["Tasa BCV"]));
      ws.cell(index + 2, 17).string(String(transaction["Fecha de la tasa"]));
      ws.cell(index + 2, 18).string(String(transaction["OC/OS"]));
      ws.cell(index + 2, 19).string(String(transaction["N° de factura/NDE"]));
      ws.cell(index + 2, 20).string(String(transaction["Fecha OC/OS"]));
      ws.cell(index + 2, 21).string(String(transaction["Forma de pago"]));
      ws.cell(index + 2, 22).string(String(transaction["N° de orden de pago"]));
      ws.cell(index + 2, 23).string(
        String(transaction["N° de Nota de Entrega"])
      );
      ws.cell(index + 2, 24).string(String(transaction["Compromiso"]));
      ws.cell(index + 2, 25).string(String(transaction["Observación"]));
      ws.cell(index + 2, 26).string(String(transaction["Usuario"]));
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

const deletePurchase = async (req, res) => {
  try {
    const ids = req.body; // Asume que 'ids' es un array de IDs

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "ids must be an array" });
    }

    // Recorre el array de IDs y actualiza cada transacción
    for (const id of ids) {
      await Transaction.update({ status: false }, { where: { id: id } });
    }

    res.status(200).json({ message: "Transactions updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
  editTransaction,
  deletePurchase,
};
