import Note from "../models/note.js";

// Get all notes for a specific book by the authenticated user
export const getNotesByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const notes = await Note.find({
            userId: req.user.userId,
            bookId: bookId
        }).sort({ createdAt: -1 });

        res.json({ success: true, notes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch notes" });
    }
};

// Get all notes for the authenticated user (across all books)
export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            userId: req.user.userId
        }).sort({ createdAt: -1 });

        res.json({ success: true, notes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch notes" });
    }
};

// Create a new note
export const createNote = async (req, res) => {
    try {
        const { bookId, bookTitle, content, selectedText, chapter, page, color } = req.body;

        if (!bookId || !bookTitle || !content) {
            return res.status(400).json({
                success: false,
                message: "bookId, bookTitle, and content are required"
            });
        }

        const note = await Note.create({
            userId: req.user.userId,
            bookId,
            bookTitle,
            content,
            selectedText: selectedText || '',
            chapter: chapter || '',
            page: page || null,
            color: color || 'yellow'
        });

        res.status(201).json({ success: true, note });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create note" });
    }
};

// Update a note
export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { content, color } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.user.userId },
            { content, color },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.json({ success: true, note });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update note" });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findOneAndDelete({
            _id: noteId,
            userId: req.user.userId
        });

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.json({ success: true, message: "Note deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete note" });
    }
};
