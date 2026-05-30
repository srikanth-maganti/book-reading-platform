import express from "express";
import { getNotesByBook, getAllNotes, createNote, updateNote, deleteNote } from "../controllers/notes.controllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllNotes);
router.get("/book/:bookId", getNotesByBook);
router.post("/", createNote);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
