import mongoose from "mongoose";

const UserBookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bookId: {
        type: String, // Gutendex book ID or 'upload-<mongoId>'
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        default: 'Unknown'
    },
    bookCover: {
        type: String, // Cover image URL
        default: ''
    },
    subjects: [{
        type: String // Genre/subject tags
    }],
    source: {
        type: String,
        enum: ['gutendex', 'upload'],
        required: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    currentPosition: {
        type: String, // Scroll position, chapter, or page number
        default: '0'
    },
    lastReadAt: {
        type: Date,
        default: null
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// A user can only have one entry per book
UserBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const UserBook = mongoose.model("UserBook", UserBookSchema);
export default UserBook;
