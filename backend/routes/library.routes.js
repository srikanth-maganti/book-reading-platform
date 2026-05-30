import express from "express";
import {
    getLibrary, addToLibrary, updateProgress,
    updateProgressByBookId, removeFromLibrary, checkInLibrary
} from "../controllers/library.controllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getLibrary);
router.post("/", addToLibrary);
router.get("/check/:bookId", checkInLibrary);
router.put("/progress/:id", updateProgress);
router.put("/progress/book/:bookId", updateProgressByBookId);
router.delete("/:id", removeFromLibrary);

export default router;
