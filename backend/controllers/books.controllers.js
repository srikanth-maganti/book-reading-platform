import Book from '../models/book.js';

// Search and filter books
export const searchBooks = async (req, res, next) => {
    try {
        const { search, topic, page = 1, limit = 32 } = req.query;
        
        let query = {};
        
        // Full text search
        if (search) {
            query.$text = { $search: search };
        }
        
        // Topic filter
        if (topic && topic !== 'all') {
            // Case-insensitive regex match against subjects or bookshelves
            query.$or = [
                { subjects: { $regex: topic, $options: 'i' } },
                { bookshelves: { $regex: topic, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const books = await Book.find(query)
            .sort(search ? { score: { $meta: "textScore" } } : { download_count: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalCount = await Book.countDocuments(query);
        const hasNext = (skip + books.length) < totalCount;
        
        // Map to Gutendex format so frontend doesn't break
        const formattedBooks = books.map(book => ({
            id: book.gutendexId,
            title: book.title,
            authors: book.authors,
            subjects: book.subjects,
            bookshelves: book.bookshelves,
            languages: book.languages,
            formats: Object.fromEntries(book.formats),
            download_count: book.download_count
        }));

        res.json({
            count: totalCount,
            next: hasNext ? `/api/books?page=${parseInt(page) + 1}&limit=${limit}&search=${search || ''}&topic=${topic || ''}` : null,
            previous: parseInt(page) > 1 ? `/api/books?page=${parseInt(page) - 1}&limit=${limit}&search=${search || ''}&topic=${topic || ''}` : null,
            results: formattedBooks
        });
    } catch (err) {
        next(err);
    }
};

// Get single book by ID
export const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findOne({ gutendexId: req.params.id });
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found in local database' });
        }
        
        // Format to Gutendex style
        const formattedBook = {
            id: book.gutendexId,
            title: book.title,
            authors: book.authors,
            subjects: book.subjects,
            bookshelves: book.bookshelves,
            languages: book.languages,
            formats: Object.fromEntries(book.formats),
            download_count: book.download_count
        };
        
        res.json(formattedBook);
    } catch (err) {
        next(err);
    }
};

import axios from 'axios';

// Get trending/popular books
export const getTrendingBooks = async (req, res, next) => {
    try {
        const books = await Book.find({})
            .sort({ download_count: -1 })
            .limit(10);
            
        const formattedBooks = books.map(book => ({
            id: book.gutendexId,
            title: book.title,
            authors: book.authors,
            subjects: book.subjects,
            formats: Object.fromEntries(book.formats),
            download_count: book.download_count
        }));
        
        res.json({
            count: books.length,
            results: formattedBooks
        });
    } catch (err) {
        next(err);
    }
};

// Proxy content from Gutenberg to avoid CORS
export const proxyBookContent = async (req, res, next) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: 'URL is required' });
        
        const response = await axios.get(url, { responseType: 'stream' });
        
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }
        
        response.data.pipe(res);
    } catch (err) {
        console.error('Proxy error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to proxy content' });
    }
};
