import express from "express";
import { getCombinedData } from "../controllers/combinedDataController.js";

const router = express.Router();

router.get("/", getCombinedData);

export default router;
