import express from "express";
import { getRecommendations } from "../controllers/recommendations.controllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Recommendations can work for both authenticated and unauthenticated users
// But personalized recommendations require auth
router.get("/", authMiddleware, getRecommendations);

export default router;
