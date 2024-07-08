import express from "express";
import {
  getSpareParts,
  exportSparePartsToExcel,
  createSpareParts,
} from "../controllers/spareParts.js";

const router = express.Router();

router.post("/", createSpareParts);
router.get("/list", getSpareParts);
router.get("/export", exportSparePartsToExcel);

export default router;
