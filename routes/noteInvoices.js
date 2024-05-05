import express from "express";
import {
  createNoteInvoice,
  getNoteInvoices,
} from "../controllers/noteInvoicesController.js";

const router = express.Router();

router.post("/", createNoteInvoice);
router.get("/", getNoteInvoices);

export default router;
