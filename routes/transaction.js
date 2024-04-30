const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transaction");

router.post("/", transactionsController.createTransaction);
router.get("/:id", transactionsController.getTransaction);
router.put("/:id", transactionsController.updateTransaction);
router.delete("/:id", transactionsController.deleteTransaction);

module.exports = router;
