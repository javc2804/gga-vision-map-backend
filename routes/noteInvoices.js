import express from "express";
import {
  createNoteInvoice,
  getNoteInvoices,
  getNoteInvoicePDF,
  getTransactions,
} from "../controllers/noteInvoicesController.js";

const router = express.Router();

router.post("/", createNoteInvoice);
router.get("/", getNoteInvoices);
router.get("/transactions", getTransactions);
router.post("/download-invoice", getNoteInvoicePDF);

export default router;
