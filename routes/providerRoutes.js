import express from "express";
import {
  getProviders,
  exportProvidersToExcel,
} from "../controllers/providersController.js";

const router = express.Router();

router.get("/list", getProviders);
router.get("/export", exportProvidersToExcel);

export default router;
