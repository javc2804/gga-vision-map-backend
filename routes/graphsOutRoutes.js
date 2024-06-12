import express from "express";
import { getDataGraph } from "../controllers/graphsOutController.js";

const router = express.Router();

router.get("/", getDataGraph);

export default router;
