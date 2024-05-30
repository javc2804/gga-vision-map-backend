import express from "express";
import { upload, uploadExcel } from "../controllers/upload.js";
// import { upload, uploadExcel } from "../controllers/upload-matriz.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadExcel);
// router.post("/matriz", upload.single("file"), uploadExcel);

export default router;
