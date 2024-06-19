import express from "express";
import users from "../controllers/users.js";

const { register, resetPassword, listUsers } = users;

const router = express.Router();

router.post("/register", register);
router.get("/list", listUsers);
router.post("/change-password", resetPassword);

export default router;
