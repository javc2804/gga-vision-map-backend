// Importa el modelo
import Fleet from "../models/fleet.js";

import Sequelize from "sequelize";

import NoteInvoice from "../models/note_invoices.js";

// Controlador para crear una nota de factura
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
    const noteInvoices = await NoteInvoice.findAll({
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
      });
      return result;
    }, {});

    const groupedArray = Object.values(grouped);
    res.status(200).json(groupedArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
