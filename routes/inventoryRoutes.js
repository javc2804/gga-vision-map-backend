import express from "express";
import inventary from "../controllers/inventory.js";

const { getInventory, getInventoryByDescription, updateInventoryQuantity } =
  inventary;

const router = express.Router();

router.get("/list", getInventory);
router.post("/description", getInventoryByDescription);
router.post("/add", updateInventoryQuantity);

export default router;
