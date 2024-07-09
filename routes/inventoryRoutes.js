import express from "express";
import inventary from "../controllers/inventory.js";

const { getInventory, getInventoryByDescription } = inventary;

const router = express.Router();

router.get("/list", getInventory);
router.post("/description", getInventoryByDescription);

export default router;
