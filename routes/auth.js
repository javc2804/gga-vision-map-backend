import express from "express";
import auth from "../controllers/auth.js";

const { register, login, forgotPassword, resetPassword } = auth;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", resetPassword);

export default router;
