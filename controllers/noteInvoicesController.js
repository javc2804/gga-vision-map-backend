// Importa el modelo
import Fleet from "../models/fleet.js";

import Sequelize from "sequelize";

import NoteInvoice from "../models/note_invoices.js";

export const createNoteInvoice = async (req, res) => {
  try {
    const noteInvoice = await NoteInvoice.create(req.body);
    res.status(201).json(noteInvoice);
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
