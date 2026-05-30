import { Router } from 'express';
import { searchBooks, getBookById, getTrendingBooks, proxyBookContent } from '../controllers/books.controllers.js';

const router = Router();

// Routes are public, no auth required for browsing books
router.get('/content', proxyBookContent);
router.get('/', searchBooks);
router.get('/trending', getTrendingBooks);
router.get('/:id', getBookById);

export default router;
