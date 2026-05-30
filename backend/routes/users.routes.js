import express from "express";
import { registerUser, loginUser, getProfile, updatePreferences } from "../controllers/users.controllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/preferences", authMiddleware, updatePreferences);

export default router;