import express from "express";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getFilteredTransactions,
  createTransactionCompromise,
  getTransactionCompromise,
  createTransactionUpdateCompromise,
  createTransactionAsing,
  getListTransaction,
  getExport,
  editTransaction,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/", createTransaction);
router.post("/asing", createTransactionAsing);
router.post("/get-transaction", getTransaction);
router.post("/new-compromise", createTransactionCompromise);
router.post("/filter", getFilteredTransactions);
// router.get("/:id", getTransaction);
router.post("/compromise", getTransactionCompromise);
router.post("/trans-compromise", createTransactionUpdateCompromise);
router.put("/:id", updateTransaction);
router.post("/edit-purchase", editTransaction);
router.delete("/:id", deleteTransaction);
router.get("/list", getListTransaction);
router.get("/export", getExport);

export default router;
