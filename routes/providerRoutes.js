import express from "express";
import { getProviders } from "../controllers/providersController.js";

const router = express.Router();

router.get("/list", getProviders);

export default router;
