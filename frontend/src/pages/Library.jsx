import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Library as LibraryIcon, BookOpen, Upload, Clock, Trash2, Loader2 } from 'lucide-react';
import { libraryAPI } from '../utils/api.js';
import { AuthContext } from '../utils/AuthContext.jsx';

export default function Library() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchLibrary();
    }, [isAuthenticated, navigate]);

    const fetchLibrary = async () => {
        try {
            setLoading(true);
            const res = await libraryAPI.getAll({ sort: 'lastReadAt' });
            setBooks(res.data.books || []);
        } catch (err) {
            console.error('Failed to fetch library:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await libraryAPI.remove(id);
            setBooks(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            console.error('Failed to remove:', err);
        }
    };

    const filteredBooks = books.filter(b => {
        if (activeTab === 'reading') return b.progress > 0 && b.progress < 100;
        if (activeTab === 'completed') return b.progress >= 100;
        return true;
    });

    const currentlyReading = books.filter(b => b.progress > 0 && b.progress < 100);

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <div className="skeleton" style={{ height: '32px', width: '200px', marginBottom: '2rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            {/* Header */}
            <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    📚 My Library
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
                </p>
            </div>

            {/* Continue Reading Section */}
            {currentlyReading.length > 0 && (
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'text-bottom' }} />
                        Continue Reading
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                        {currentlyReading.slice(0, 3).map(book => (
                            <Link
                                key={book._id}
                                to={`/read/${book.bookId}`}
                                className="glass-card"
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    padding: '1rem',
                                    textDecoration: 'none',
                                    alignItems: 'center'
                                }}
                            >
                                {/* Cover */}
                                <div style={{
                                    width: '60px',
                                    height: '80px',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: 'var(--color-bg-tertiary)'
                                }}>
                                    {book.bookCover ? (
                                        <img src={book.bookCover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <BookOpen size={20} color="var(--color-text-muted)" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: '0.9rem', fontWeight: 600,
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        color: 'var(--color-text-primary)', marginBottom: '0.25rem'
                                    }}>
                                        {book.bookTitle}
                                    </h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                        {book.bookAuthor}
                                    </p>
                                    <div className="progress-bar" style={{ marginBottom: '0.2rem' }}>
                                        <div className="progress-bar-fill" style={{ width: `${book.progress}%` }} />
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-accent-primary)' }}>
                                        {Math.round(book.progress)}% complete
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'All Books' },
                    { key: 'reading', label: 'Reading' },
                    { key: 'completed', label: 'Completed' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={activeTab === tab.key ? 'badge badge-active' : 'badge'}
                        style={{ cursor: 'pointer', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Book List */}
            {filteredBooks.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--color-text-muted)'
                }}>
                    <LibraryIcon size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No books here yet</p>
                    <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        Browse books and add them to your library
                    </p>
                    <Link
                        to="/browse"
                        className="btn-primary"
                    >
                        <BookOpen size={16} /> Browse Books
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {filteredBooks.map((book, i) => (
                        <div
                            key={book._id}
                            className="glass-card animate-fade-in"
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem',
                                animationDelay: `${i * 0.03}s`,
                                opacity: 0
                            }}
                        >
                            {/* Cover */}
                            <Link
                                to={`/book/${book.bookId}`}
                                style={{
                                    width: '60px', height: '80px',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden', flexShrink: 0,
                                    background: 'var(--color-bg-tertiary)', textDecoration: 'none'
                                }}
                            >
                                {book.bookCover ? (
                                    <img src={book.bookCover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <BookOpen size={20} color="var(--color-text-muted)" />
                                    </div>
                                )}
                            </Link>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Link
                                    to={`/book/${book.bookId}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <h3 style={{
                                        fontSize: '0.85rem', fontWeight: 600,
                                        color: 'var(--color-text-primary)', marginBottom: '0.2rem',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}>
                                        {book.bookTitle}
                                    </h3>
                                </Link>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                                    {book.bookAuthor}
                                </p>
                                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.5rem' }}>
                                        📚 Gutenberg
                                </div>

                                {/* Progress + Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1, marginRight: '0.5rem' }}>
                                        {book.progress > 0 && (
                                            <>
                                                <div className="progress-bar">
                                                    <div className="progress-bar-fill" style={{ width: `${book.progress}%` }} />
                                                </div>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--color-accent-primary)', marginTop: '0.15rem' }}>
                                                    {Math.round(book.progress)}%
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRemove(book._id); }}
                                        className="btn-ghost"
                                        style={{ padding: '0.2rem', color: 'var(--color-text-muted)' }}
                                        title="Remove from library"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
