import express from "express";
import {
  getSpareParts,
  exportSparePartsToExcel,
} from "../controllers/spareParts.js";

const router = express.Router();

router.get("/list", getSpareParts);
router.get("/export", exportSparePartsToExcel);

export default router;
