import express from "express";
import { upload, uploadExcel } from "../controllers/upload.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadExcel);

export default router;
