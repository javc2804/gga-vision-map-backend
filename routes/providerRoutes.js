import express from "express";
import {
  createProvider,
  getProviders,
  exportProvidersToExcel,
  editProvider,
} from "../controllers/providersController.js";

const router = express.Router();

router.post("/", createProvider);
router.get("/list", getProviders);
router.get("/export", exportProvidersToExcel);
router.post("/edit", editProvider);

export default router;
