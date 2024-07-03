import Fleet from "../models/fleet.js";
import Transaction from "../models/transaction.js";

import Sequelize from "sequelize";

import NoteInvoice from "../models/note_invoices.js";
// Importa pdfmake
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import Inventory from "../models/inventory.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const createNoteInvoice = async (req, res) => {
  try {
    const dataWithoutIds = req.body.data.map(({ id, ...rest }) => {
      // Convertir quantity a entero
      rest.quantity = parseInt(rest.quantity, 10);
      return rest;
    });

    for (const item of dataWithoutIds) {
      const inventoryItem = await Inventory.findOne({
        where: { descripcion: item.spare_part_variant },
      });
      if (inventoryItem) {
        await inventoryItem.update({
          cantidad: inventoryItem.cantidad - item.quantity, // Usar item.quantity aquí
          salida: (inventoryItem.salida || 0) + item.quantity, // Y también aquí
        });
      } else {
        console.log(
          `Ítem no encontrado en el inventario: ${item.spare_part_variant}` // Ajustar el mensaje de error para reflejar el cambio a spare_part_variant
        );
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
    const specificDate = new Date("2024-06-30T23:59:59");

    const transactions = await Transaction.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.gt]: specificDate, // Buscar transacciones después de esta fecha
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
  try {
    // Datos aleatorios para la primera tabla
    const table1 = [
      ["Key 1", "Value 1"],
      ["Key 2", "Value 2"],
      ["Key 3", "Value 3"],
    ];

    // Datos aleatorios para la segunda tabla
    const table2 = [
      ["UT1", "Status1", "Attention1", "Eje1", "Subeje1", "MarcaModelo1"],
      ["UT2", "Status2", "Attention2", "Eje2", "Subeje2", "MarcaModelo2"],
      ["UT3", "Status3", "Attention3", "Eje3", "Subeje3", "MarcaModelo3"],
    ];

    // Define el documento
    const docDefinition = {
      content: [
        {
          text: "Primera tabla",
          style: "header",
        },
        {
          table: {
            body: [["Key", "Value"], ...table1],
          },
        },
        {
          text: "Segunda tabla",
          style: "header",
        },
        {
          table: {
            body: [
              ["UT", "Status", "Attention", "Eje", "Subeje", "MarcaModelo"],
              ...table2,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        table: {
          // Estilos de la tabla
        },
      },
    };

    // Genera el PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    console.log("PDF document created");

    // Convierte el PDF a un Buffer para poder obtener su tamaño
    const pdfBuffer = await new Promise((resolve, reject) => {
      const chunks = [];

      pdfDoc
        .getStream()
        .on("data", (chunk) => {
          console.log("Data chunk received");
          chunks.push(chunk);
        })
        .on("end", () => {
          console.log("Stream ended");
          resolve(Buffer.concat(chunks));
        })
        .on("error", (error) => {
          console.log("Stream error:", error);
          reject(error);
        });
    });

    console.log("PDF converted to buffer");

    // Establece las cabeceras de la respuesta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);

    // Envía el PDF como respuesta
    res.end(pdfBuffer);
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    res.status(500).json({ error: error.message });
  }
};
