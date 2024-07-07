import express from "express";
import {
  createProvider,
  getProviders,
  exportProvidersToExcel,
} from "../controllers/providersController.js";

const router = express.Router();

router.post("/", createProvider);
router.get("/list", getProviders);
router.get("/export", exportProvidersToExcel);

export default router;
