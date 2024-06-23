import express from "express";
import outInternal from "../controllers/outInternal.js";

const { register, list } = outInternal;

const router = express.Router();

router.post("/", register);
router.get("/list", list);

export default router;
