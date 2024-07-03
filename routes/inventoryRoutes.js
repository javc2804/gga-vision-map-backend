import express from "express";
import inventary from "../controllers/inventory.js";

const { getInventory } = inventary;

const router = express.Router();

router.get("/list", getInventory);

export default router;
