import express from "express";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getFilteredTransactions,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/", createTransaction);
router.post("/filter", getFilteredTransactions);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
