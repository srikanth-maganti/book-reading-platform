import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import api, { booksAPI } from '../utils/api.js';
import BookCard from '../components/BookCard.jsx';
import GenreFilter from '../components/GenreFilter.jsx';

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [activeGenre, setActiveGenre] = useState(searchParams.get('topic') || 'all');
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const fetchBooks = useCallback(async (params = {}, append = false) => {
        try {
            if (!append) setLoading(true);
            else setLoadingMore(true);

            const queryParams = {
                ...params
            };

            const res = await booksAPI.search(queryParams);
            const data = res.data;
            setBooks(prev => append ? [...prev, ...(data.results || [])] : (data.results || []));
            setNextPageUrl(data.next);
            setTotalCount(data.count || 0);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load + URL param changes
    useEffect(() => {
        const search = searchParams.get('search');
        const topic = searchParams.get('topic');

        if (search) setSearchQuery(search);
        if (topic) setActiveGenre(topic);

        const params = {};
        if (search) params.search = search;
        if (topic && topic !== 'all') params.topic = topic;

        fetchBooks(params);
    }, [searchParams, fetchBooks]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (activeGenre !== 'all') params.topic = activeGenre;
        setSearchParams(params);
    };

    const handleGenreChange = (genre) => {
        setActiveGenre(genre);
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (genre !== 'all') params.topic = genre;
        setSearchParams(params);
    };

    const loadMore = async () => {
        if (!nextPageUrl || loadingMore) return;
        try {
            setLoadingMore(true);
            const response = await api.get(nextPageUrl);
            const data = response.data;
            setBooks(prev => [...prev, ...(data.results || [])]);
            setNextPageUrl(data.next);
        } catch (err) {
            console.error('Failed to load more:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            {/* Header */}
            <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Browse Books
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Explore {totalCount.toLocaleString()} free books from Project Gutenberg
                </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1.25rem'
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)'
                    }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, author..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <button type="submit" className="btn-primary">
                    Search
                </button>
            </form>

            {/* Genre Filter */}
            <div style={{ marginBottom: '2rem' }}>
                <GenreFilter activeGenre={activeGenre} onGenreChange={handleGenreChange} />
            </div>

            {/* Results */}
            {loading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {[...Array(12)].map((_, i) => (
                        <div key={i}>
                            <div className="skeleton" style={{ paddingTop: '140%', marginBottom: '0.5rem' }} />
                            <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '0.25rem' }} />
                            <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                        </div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--color-text-muted)'
                }}>
                    <Search size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No books found</p>
                    <p style={{ fontSize: '0.85rem' }}>Try a different search term or genre</p>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {books.map((book, i) => (
                            <div key={`${book.id}-${i}`} className="animate-fade-in" style={{ animationDelay: `${(i % 20) * 0.03}s`, opacity: 0 }}>
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    {nextPageUrl && (
                        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                            <button
                                onClick={loadMore}
                                className="btn-secondary"
                                disabled={loadingMore}
                                style={{ padding: '0.75rem 2rem' }}
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Books'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
