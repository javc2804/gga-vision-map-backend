import express from "express";
import { downloadExcel } from "../controllers/dowloadTemplate.js"; // ajusta la ruta según sea necesario

const router = express.Router();

router.get("/", downloadExcel);

export default router;
