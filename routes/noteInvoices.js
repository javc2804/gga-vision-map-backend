import express from "express";
import {
  createNoteInvoice,
  getNoteInvoices,
  getNoteInvoicePDF,
} from "../controllers/noteInvoicesController.js";

const router = express.Router();

router.post("/", createNoteInvoice);
router.get("/", getNoteInvoices);
router.post("/download-invoice", getNoteInvoicePDF);

export default router;
