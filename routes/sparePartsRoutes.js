import express from "express";
import {
  getSpareParts,
  // exportProvidersToExcel,
} from "../controllers/spareParts.js";

const router = express.Router();

router.get("/list", getSpareParts);
// router.get("/export", exportProvidersToExcel);

export default router;
