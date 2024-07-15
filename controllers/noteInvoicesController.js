import Fleet from "../models/fleet.js";
import Transaction from "../models/transaction.js";

import Sequelize from "sequelize";

import NoteInvoice from "../models/note_invoices.js";
// Importa pdfmake
// import pdfMake from "pdfmake/build/pdfmake.js";
// import pdfFonts from "pdfmake/build/vfs_fonts.js";
import Inventory from "../models/inventory.js";
import HistoryInventory from "../models/HistoryInventory.js";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNoteInvoice = async (req, res) => {
  try {
    const commonId = req.body.data[0]?.id;

    const dataWithoutIds = req.body.data.map(({ id_items, id, ...rest }) => {
      rest.quantity = parseInt(rest.quantity, 10);
      rest.note_number = commonId;
      return { ...rest };
    });

    const historyInventories = await HistoryInventory.bulkCreate(
      dataWithoutIds
    );

    for (const item of dataWithoutIds) {
      if (!item.spare_part_variant) {
        console.log(
          `Ítem omitido debido a falta de 'spare_part_variant': ${JSON.stringify(
            item
          )}`
        );
        continue; // Salta este ítem si 'spare_part_variant' es undefined
      }

      const inventoryItem = await Inventory.findOne({
        where: { descripcion: item.spare_part_variant },
      });

      if (inventoryItem) {
        await inventoryItem.update({
          cantidad: inventoryItem.cantidad - item.quantity,
          salida: (inventoryItem.salida || 0) + item.quantity,
        });
      } else {
        console.log(
          `Ítem no encontrado en el inventario: ${item.spare_part_variant}`
        );
      }
    }

    if (commonId) {
      const transaction = await Transaction.findOne({
        where: { id: commonId },
      });

      if (transaction) {
        await transaction.update({ status: true });
      } else {
        console.log(`Transacción no encontrada con el id: ${commonId}`);
      }
    }

    const noteInvoices = await NoteInvoice.bulkCreate(dataWithoutIds);
    res.status(201).json(noteInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const specificDate = new Date("2024-07-03T23:59:59");

    const transactions = await Transaction.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.gt]: specificDate, // Buscar transacciones después de esta fecha
        },
        ut: {
          [Sequelize.Op.or]: [
            { [Sequelize.Op.is]: null }, // 'ut' es null
            { [Sequelize.Op.eq]: "" }, // 'ut' es una cadena vacía
          ],
        },
      },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNoteInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: noteInvoices } = await NoteInvoice.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: Fleet,
          as: "fleet",
        },
      ],
      order: [["createdAt", "DESC"]], // Ordena los resultados por 'createdAt' en orden descendente
    });

    const grouped = noteInvoices.reduce((result, current) => {
      result[current.note_number] = result[current.note_number] || {
        note_number: current.note_number,
        status: current.status,
        createdAt: current.createdAt,
        updatedAt: current.updatedAt,
        invoices: [],
      };
      result[current.note_number].invoices.push({
        ...current.dataValues,
        fleet: current.fleet,
        user_rel: "",
        cantidad: "",
        descripcion: "",
        descripcionRepuesto: "",
        eje: "",
        facNDE: "",
        fechaOcOs: "",
        formaPago: "",
        marcaModelo: "",
        montoTotalBs: "",
        montoTotalUsd: "",
        numeroOrdenPago: "",
        observacion: "",
        ocOs: "",
        precioUnitarioBs: "",
        precioUnitarioUsd: "",
        proveedor: "",
        repuesto: "",
        subeje: "",
        tasaBcv: "",
        ut: "",
      });
      return result;
    }, {});

    const groupedArray = Object.values(grouped);

    res.status(200).json({
      total: count,
      pages: Math.ceil(count / limit),
      noteInvoices: groupedArray,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNoteInvoicePDF = async (req, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  const imagePath = path.join(__dirname, "..", "public", "logo.png");
  const signaturePath = path.join(__dirname, "..", "public", "firma.jpg");

  // Añadir imagen del logo
  doc.image(imagePath, 30, 50, { width: 100 });
  // Añadir título
  doc.fontSize(12).text("Asignaciones:", 30, 150);

  // Encabezados de la tabla
  const headers = ["Ut", "Modelo", "Eje", "Sub-eje", "Descripción", "Cantidad"];
  const startY = 170;
  let currentY = startY;

  // Dibujar encabezados
  headers.forEach((header, index) => {
    doc.text(header, 30 + index * 100, currentY, {
      width: 90,
      align: "center",
    });
  });

  currentY += 20; // Espacio para la siguiente fila

  // Dibujar filas de la tabla
  req.body.invoices.forEach((invoice) => {
    headers.forEach((_, colIndex) => {
      let text = "";
      switch (colIndex) {
        case 0:
          text = invoice.fleet.ut;
          break;
        case 1:
          text = invoice.fleet.marcaModelo;
          break;
        case 2:
          text = invoice.fleet.eje;
          break;
        case 3:
          text = invoice.fleet.subeje;
          break;
        case 4:
          text = invoice.descripcion;
          break;
        case 5:
          text = invoice.quantity.toString();
          break;
        case 6:
          text = invoice.observation;
          break;
      }
      doc.text(text, 30 + colIndex * 100, currentY, {
        width: 90,
        align: "center",
      }); // Asegurar que el texto se añade horizontalmente
    });
    currentY += 20; // Espacio para la siguiente fila
  });

  // Dibujar líneas de la tabla
  doc
    .moveTo(30, startY)
    .lineTo(30 + 100 * headers.length, startY)
    .stroke();
  doc
    .moveTo(30, startY + 20)
    .lineTo(30 + 100 * headers.length, startY + 20)
    .stroke();

  for (let i = 0; i <= headers.length; i++) {
    doc
      .moveTo(30 + i * 100, startY)
      .lineTo(30 + i * 100, currentY)
      .stroke();
  }

  req.body.invoices.forEach((_, index) => {
    doc
      .moveTo(30, startY + 20 * (index + 1))
      .lineTo(30 + 100 * headers.length, startY + 20 * (index + 1))
      .stroke();
    doc
      .moveTo(30, startY + 20 * (index + 2))
      .lineTo(30 + 100 * headers.length, startY + 20 * (index + 2))
      .stroke();
  });

  // Añadir firma
  const signatureWidth = 100;
  const pageWidth = 612;
  const startX = (pageWidth - signatureWidth) / 2;
  doc.image(signaturePath, startX, currentY + 20, { width: signatureWidth });

  // Finalizar documento
  doc.end();
};
