import UserBook from "../models/userBook.js";

// Get user's library
export const getLibrary = async (req, res) => {
    try {
        const { source, sort } = req.query;
        const filter = { userId: req.user.userId };

        if (source) filter.source = source;

        let sortOption = { lastReadAt: -1 };
        if (sort === 'added') sortOption = { addedAt: -1 };
        if (sort === 'title') sortOption = { bookTitle: 1 };
        if (sort === 'progress') sortOption = { progress: -1 };

        const books = await UserBook.find(filter).sort(sortOption);
        res.json({ success: true, books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch library" });
    }
};

// Add book to library
export const addToLibrary = async (req, res) => {
    try {
        const { bookId, bookTitle, bookAuthor, bookCover, subjects, source } = req.body;

        if (!bookId || !bookTitle || !source) {
            return res.status(400).json({
                success: false,
                message: "bookId, bookTitle, and source are required"
            });
        }

        // Check if already in library
        const existing = await UserBook.findOne({
            userId: req.user.userId,
            bookId: bookId
        });

        if (existing) {
            return res.json({ success: true, book: existing, message: "Book already in library" });
        }

        let book;
        try {
            book = await UserBook.create({
                userId: req.user.userId,
                bookId,
                bookTitle,
                bookAuthor: bookAuthor || 'Unknown',
                bookCover: bookCover || '',
                subjects: subjects || [],
                source
            });
        } catch (createErr) {
            if (createErr.code === 11000) {
                // Race condition: book was inserted by another request between our check and create
                const existingBook = await UserBook.findOne({ userId: req.user.userId, bookId: bookId });
                return res.json({ success: true, book: existingBook, message: "Book already in library" });
            }
            throw createErr;
        }

        res.status(201).json({ success: true, book });
    } catch (err) {
        console.error("Add to library error:", err.message);
        res.status(500).json({ success: false, message: "Failed to add to library" });
    }
};

// Update reading progress
export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress, currentPosition } = req.body;

        const updateData = { lastReadAt: new Date() };
        if (progress !== undefined) updateData.progress = progress;
        if (currentPosition !== undefined) updateData.currentPosition = currentPosition;

        const book = await UserBook.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            updateData,
            { new: true }
        );

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found in library" });
        }

        res.json({ success: true, book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update progress" });
    }
};

// Update progress by bookId (used from reader)
export const updateProgressByBookId = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { progress, currentPosition } = req.body;

        const updateData = { lastReadAt: new Date() };
        if (progress !== undefined) updateData.progress = progress;
        if (currentPosition !== undefined) updateData.currentPosition = currentPosition;

        const book = await UserBook.findOneAndUpdate(
            { bookId: bookId, userId: req.user.userId },
            updateData,
            { new: true }
        );

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found in library" });
        }

        res.json({ success: true, book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update progress" });
    }
};

// Remove from library
export const removeFromLibrary = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await UserBook.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found in library" });
        }

        res.json({ success: true, message: "Book removed from library" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to remove from library" });
    }
};

// Check if a book is in library
export const checkInLibrary = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await UserBook.findOne({
            userId: req.user.userId,
            bookId: bookId
        });

        res.json({ success: true, inLibrary: !!book, book: book || null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to check library" });
    }
};
