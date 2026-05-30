import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Library, ArrowLeft, Download, User, Tag, Loader2, Check } from 'lucide-react';
import { booksAPI, gutendexAPI, libraryAPI } from '../utils/api.js';
import { AuthContext } from '../utils/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inLibrary, setInLibrary] = useState(false);
    const [libraryEntry, setLibraryEntry] = useState(null);
    const [addingToLibrary, setAddingToLibrary] = useState(false);
    const [relatedBooks, setRelatedBooks] = useState([]);

    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);
                const res = await booksAPI.getById(id);
                const data = res.data;
                setBook(data);

                // Check if in library
                if (isAuthenticated) {
                    try {
                        const res = await libraryAPI.check(id);
                        setInLibrary(res.data.inLibrary);
                        setLibraryEntry(res.data.book);
                    } catch (e) { /* not in library */ }
                }

                // Fetch related books by topic
                if (data.subjects?.length > 0) {
                    const topic = data.subjects[0].split(' -- ')[0];
                    try {
                        const related = await booksAPI.search({ topic });
                        setRelatedBooks((related.data.results || []).filter(b => String(b.id) !== String(data.id)).slice(0, 6));
                    } catch (e) { /* ignore */ }
                }
            } catch (err) {
                console.error('Failed to load book:', err);
            } finally {
                setLoading(false);
            }
        };
        loadBook();
    }, [id, isAuthenticated]);

    const handleAddToLibrary = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            setAddingToLibrary(true);
            await libraryAPI.add({
                bookId: String(book.id),
                bookTitle: book.title,
                bookAuthor: book.authors?.map(a => a.name).join(', ') || 'Unknown',
                bookCover: gutendexAPI.getCoverUrl(book),
                subjects: book.subjects?.slice(0, 5) || [],
                source: 'gutendex'
            });
            setInLibrary(true);
        } catch (err) {
            console.error(err);
        } finally {
            setAddingToLibrary(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div className="skeleton" style={{ width: '280px', height: '400px' }} />
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className="skeleton" style={{ height: '32px', width: '60%', marginBottom: '1rem' }} />
                        <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '1.5rem' }} />
                        <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }} />
                        <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.5rem' }} />
                        <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>Book not found</p>
                <Link to="/browse" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Browse</Link>
            </div>
        );
    }

    const coverUrl = gutendexAPI.getCoverUrl(book);
    const authors = book.authors?.map(a => a.name).join(', ') || 'Unknown';
    const genre = gutendexAPI.getGenre(book.subjects);

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="btn-ghost"
                style={{ marginBottom: '1.5rem' }}
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Book Header */}
            <div className="animate-fade-in" style={{
                display: 'flex',
                gap: '2.5rem',
                marginBottom: '3rem',
                flexWrap: 'wrap'
            }}>
                {/* Cover */}
                <div style={{
                    width: '280px',
                    flexShrink: 0,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-elevated)'
                }}>
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={book.title}
                            style={{ width: '100%', display: 'block' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            paddingTop: '140%',
                            background: 'linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <span className="font-display" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                textAlign: 'center',
                                padding: '1rem',
                                color: 'var(--color-text-secondary)'
                            }}>
                                {book.title}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>
                        {genre}
                    </span>

                    <h1 className="font-display" style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        marginBottom: '0.75rem'
                    }}>
                        {book.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <User size={16} color="var(--color-text-muted)" />
                        <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>{authors}</span>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.15rem' }}>Downloads</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{book.download_count?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.15rem' }}>Languages</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{book.languages?.join(', ').toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Subjects */}
                    {book.subjects?.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                                <Tag size={14} color="var(--color-text-muted)" />
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Subjects</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {book.subjects.slice(0, 8).map(subject => (
                                    <span key={subject} className="badge" style={{ fontSize: '0.7rem' }}>
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress */}
                    {libraryEntry && libraryEntry.progress > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="progress-bar" style={{ marginBottom: '0.35rem' }}>
                                <div className="progress-bar-fill" style={{ width: `${libraryEntry.progress}%` }} />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-accent-primary)' }}>
                                {Math.round(libraryEntry.progress)}% complete
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            to={`/read/${book.id}`}
                            className="btn-primary"
                            style={{ padding: '0.85rem 2rem' }}
                        >
                            <BookOpen size={18} />
                            {libraryEntry?.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                        </Link>

                        {!inLibrary && (
                            <button
                                onClick={handleAddToLibrary}
                                className="btn-secondary"
                                disabled={addingToLibrary}
                            >
                                {addingToLibrary ? (
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <Library size={16} />
                                )}
                                Add to Library
                            </button>
                        )}

                        {inLibrary && (
                            <span className="btn-secondary" style={{ color: 'var(--color-accent-emerald)', borderColor: 'var(--color-accent-emerald)' }}>
                                <Check size={16} />
                                In Library
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
                <section style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                        Similar Books
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {relatedBooks.map(b => (
                            <BookCard key={b.id} book={b} />
                        ))}
                    </div>
                </section>
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
