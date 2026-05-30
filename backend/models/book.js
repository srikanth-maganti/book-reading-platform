import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    gutendexId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    authors: [{
        name: String,
        birth_year: Number,
        death_year: Number
    }],
    subjects: [String],
    bookshelves: [String],
    languages: [String],
    copyright: Boolean,
    media_type: String,
    formats: {
        type: Map,
        of: String
    },
    download_count: {
        type: Number,
        default: 0
    },
    summaries: [String]
}, {
    timestamps: true
});

// Create text index for search
bookSchema.index({ title: 'text', 'authors.name': 'text', subjects: 'text' });

const Book = mongoose.model('Book', bookSchema);
export default Book;
