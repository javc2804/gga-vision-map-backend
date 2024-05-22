import express from "express";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getFilteredTransactions,
  createTransactionCompromise,
  getTransactionCompromise,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/", createTransaction);
router.post("/new-compromise", createTransactionCompromise);
router.post("/filter", getFilteredTransactions);
router.get("/:id", getTransaction);
router.post("/compromise", getTransactionCompromise);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
