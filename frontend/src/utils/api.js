import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';
const GUTENDEX_URL = 'https://gutendex.com/books/';

// Axios instance for backend API
const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

// Add auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ========================================
// Auth API
// ========================================

export const authAPI = {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    googleAuth: (token) => api.post('/auth/google', { token }),
    getProfile: () => api.get('/users/profile'),
    updatePreferences: (data) => api.put('/users/preferences', data),
};

// ========================================
// Notes API
// ========================================

export const notesAPI = {
    getByBook: (bookId) => api.get(`/notes/book/${bookId}`),
    getAll: () => api.get('/notes'),
    create: (data) => api.post('/notes', data),
    update: (noteId, data) => api.put(`/notes/${noteId}`, data),
    delete: (noteId) => api.delete(`/notes/${noteId}`),
};

// ========================================
// Library API
// ========================================

export const libraryAPI = {
    getAll: (params) => api.get('/library', { params }),
    add: (data) => api.post('/library', data),
    check: (bookId) => api.get(`/library/check/${bookId}`),
    updateProgress: (id, data) => api.put(`/library/progress/${id}`, data),
    updateProgressByBookId: (bookId, data) => api.put(`/library/progress/book/${bookId}`, data),
    remove: (id) => api.delete(`/library/${id}`),
};

// ========================================
// ========================================
// Recommendations API
// ========================================

export const recommendationsAPI = {
    get: () => api.get('/recommendations'),
};

// ========================================
// Books API (Local DB)
// ========================================

export const booksAPI = {
    search: (params) => api.get('/books', { params }),
    getTrending: () => api.get('/books/trending'),
    getById: (id) => api.get(`/books/${id}`)
};

// ========================================
// Gutendex Content API (for reading)
// ========================================

export const gutendexAPI = {
    // Get book content (HTML or plain text)
    getBookContent: async (book) => {
        // Prioritize HTML format, then plain text
        const formats = book.formats || {};
        const htmlUrl = formats['text/html; charset=utf-8'] ||
                        formats['text/html'] ||
                        formats['text/html; charset=us-ascii'] ||
                        formats['text/html; charset=iso-8859-1'];
        const textUrl = formats['text/plain; charset=utf-8'] ||
                        formats['text/plain'] ||
                        formats['text/plain; charset=us-ascii'];

        const contentUrl = htmlUrl || textUrl;
        if (!contentUrl) return null;

        try {
            const response = await api.get('/books/content', { params: { url: contentUrl } });
            return {
                content: response.data,
                isHtml: !!htmlUrl,
                url: contentUrl
            };
        } catch (err) {
            console.error('Failed to fetch book content:', err);
            return null;
        }
    },

    // Get cover image URL
    getCoverUrl: (book) => {
        const formats = book.formats || {};
        return formats['image/jpeg'] || '';
    },

    // Map Gutendex subjects to our genres
    getGenre: (subjects) => {
        const subjectStr = (subjects || []).join(' ').toLowerCase();
        if (subjectStr.includes('fiction')) return 'Fiction';
        if (subjectStr.includes('science')) return 'Science';
        if (subjectStr.includes('history')) return 'History';
        if (subjectStr.includes('adventure')) return 'Adventure';
        if (subjectStr.includes('romance') || subjectStr.includes('love')) return 'Romance';
        if (subjectStr.includes('philosophy')) return 'Philosophy';
        if (subjectStr.includes('poetry')) return 'Poetry';
        if (subjectStr.includes('drama') || subjectStr.includes('play')) return 'Drama';
        if (subjectStr.includes('mystery') || subjectStr.includes('detective')) return 'Mystery';
        if (subjectStr.includes('horror') || subjectStr.includes('gothic')) return 'Horror';
        if (subjectStr.includes('children')) return 'Children';
        if (subjectStr.includes('biography')) return 'Biography';
        return 'Literature';
    }
};

export default api;
