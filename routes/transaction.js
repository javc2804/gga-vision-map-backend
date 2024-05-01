import express from "express";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;