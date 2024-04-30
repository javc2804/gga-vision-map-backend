const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/items");

router.post("/", itemsController.createItem);
router.get("/:id", itemsController.getItem);
router.put("/:id", itemsController.updateItem);
router.delete("/:id", itemsController.deleteItem);

module.exports = router;
