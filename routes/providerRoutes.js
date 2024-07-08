import express from "express";
import {
  createProvider,
  getProviders,
  exportProvidersToExcel,
  editProvider,
  deleteProvider,
} from "../controllers/providersController.js";

const router = express.Router();

router.post("/", createProvider);
router.get("/list", getProviders);
router.get("/export", exportProvidersToExcel);
router.post("/edit", editProvider);
router.post("/delete", deleteProvider);

export default router;
