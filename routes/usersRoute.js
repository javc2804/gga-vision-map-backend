import express from "express";
import users from "../controllers/users.js";

const { register, resetPassword, listUsers, deleteUser, toggleUserStatus } =
  users;

const router = express.Router();

router.post("/register", register);
router.get("/list", listUsers);
router.post("/change-password", resetPassword);
router.post("/delete", deleteUser);
router.post("/toggle-status", toggleUserStatus);

export default router;
