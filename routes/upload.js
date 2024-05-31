import express from "express";
import { upload, uploadExcel } from "../controllers/upload.js";
import {
  uploadMatriz,
  uploadExcelMatriz,
} from "../controllers/upload-matriz.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadExcel);
router.post("/matriz", uploadMatriz.single("file"), uploadExcelMatriz);

export default router;
