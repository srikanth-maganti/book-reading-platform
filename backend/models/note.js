import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bookId: {
        type: String, // Gutendex book ID
        required: true,
        index: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    selectedText: {
        type: String, // The text the user highlighted
        default: ''
    },
    chapter: {
        type: String, // Chapter name or page number
        default: ''
    },
    page: {
        type: Number, // Page number (for PDFs)
        default: null
    },
    color: {
        type: String,
        enum: ['yellow', 'green', 'blue', 'pink', 'orange'],
        default: 'yellow'
    }
}, { timestamps: true });

// Compound index for efficient queries
NoteSchema.index({ userId: 1, bookId: 1 });

const Note = mongoose.model("Note", NoteSchema);
export default Note;
