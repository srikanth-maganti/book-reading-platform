import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { booksAPI, gutendexAPI, notesAPI, libraryAPI } from '../utils/api.js';
import { AuthContext } from '../utils/AuthContext.jsx';
import ReaderToolbar, { THEMES } from '../components/ReaderToolbar.jsx';
import NotesSidebar from '../components/NotesSidebar.jsx';

export default function Reader() {
    const { id } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const contentRef = useRef(null);

    const [bookData, setBookData] = useState(null);
    const [content, setContent] = useState('');
    const [isHtml, setIsHtml] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reader settings
    const [fontSize, setFontSize] = useState(18);
    const [theme, setTheme] = useState('dark');
    const [progress, setProgress] = useState(0);

    // Notes
    const [notes, setNotes] = useState([]);
    const [notesOpen, setNotesOpen] = useState(false);

    // Determine theme colors
    const themeObj = THEMES.find(t => t.key === theme) || THEMES[0];

    // Load book content
    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                setError(null);



                // Fetch book data from local DB
                const res = await booksAPI.getById(id);
                const book = res.data;
                setBookData(book);

                // Fetch content
                const result = await gutendexAPI.getBookContent(book);
                if (result) {
                    setContent(result.content);
                    setIsHtml(result.isHtml);
                } else {
                    setError('No readable format available for this book.');
                }

                // Load notes
                if (isAuthenticated) {
                    try {
                        const notesRes = await notesAPI.getByBook(String(id));
                        setNotes(notesRes.data.notes || []);
                    } catch (e) { /* ignore */ }

                    // Check library for saved progress
                    try {
                        const libRes = await libraryAPI.check(String(id));
                        if (libRes.data.book) {
                            setProgress(libRes.data.book.progress || 0);
                        }
                    } catch (e) { /* ignore */ }
                }
            } catch (err) {
                console.error('Failed to load book:', err);
                setError('Failed to load book content. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, [id, isAuthenticated]);

    // Track scroll progress
    const handleScroll = useCallback(() => {
        if (!contentRef.current) return;
        const el = contentRef.current;
        const scrollPercent = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
    }, []);

    // Save progress periodically
    useEffect(() => {
        if (!isAuthenticated || !bookData) return;

        const saveInterval = setInterval(async () => {
            try {
                await libraryAPI.updateProgressByBookId(String(id), {
                    progress: Math.round(progress),
                    currentPosition: String(Math.round(progress))
                });
            } catch (e) { /* ignore */ }
        }, 30000); // Save every 30 seconds

        return () => clearInterval(saveInterval);
    }, [isAuthenticated, bookData, progress, id]);

    // Auto-add to library when reading starts
    useEffect(() => {
        if (!isAuthenticated || !bookData) return;

        const addToLib = async () => {
            try {
                await libraryAPI.add({
                    bookId: String(bookData.id),
                    bookTitle: bookData.title,
                    bookAuthor: bookData.authors?.map(a => a.name).join(', ') || 'Unknown',
                    bookCover: gutendexAPI.getCoverUrl(bookData),
                    subjects: bookData.subjects?.slice(0, 5) || [],
                    source: 'gutendex'
                });
            } catch (e) { /* already in library */ }
        };
        addToLib();
    }, [isAuthenticated, bookData]);

    // Notes handlers
    const handleCreateNote = async ({ content: noteContent, color }) => {
        if (!isAuthenticated) return;
        try {
            const res = await notesAPI.create({
                bookId: String(id),
                bookTitle: bookData?.title || 'Unknown',
                content: noteContent,
                color,
                chapter: `${Math.round(progress)}%`
            });
            setNotes(prev => [res.data.note, ...prev]);
        } catch (err) {
            console.error('Failed to create note:', err);
        }
    };

    const handleUpdateNote = async (noteId, data) => {
        try {
            const res = await notesAPI.update(noteId, data);
            setNotes(prev => prev.map(n => n._id === noteId ? res.data.note : n));
        } catch (err) {
            console.error('Failed to update note:', err);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await notesAPI.delete(noteId);
            setNotes(prev => prev.filter(n => n._id !== noteId));
        } catch (err) {
            console.error('Failed to delete note:', err);
        }
    };

    // Clean HTML content
    const cleanContent = (html) => {
        let cleaned = html;

        // Extract body content if present, otherwise strip head
        const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            cleaned = bodyMatch[1];
        } else {
            cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
        }

        // Strip any embedded styles or scripts that might override our theme
        cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

        // Remove Gutenberg header/footer boilerplate
        const startMarkers = ['*** START OF THE PROJECT GUTENBERG', '*** START OF THIS PROJECT GUTENBERG'];
        const endMarkers = ['*** END OF THE PROJECT GUTENBERG', '*** END OF THIS PROJECT GUTENBERG', 'End of the Project Gutenberg', 'End of Project Gutenberg'];

        for (const marker of startMarkers) {
            const idx = cleaned.indexOf(marker);
            if (idx !== -1) {
                const afterMarker = cleaned.indexOf('\n', idx);
                if (afterMarker !== -1) cleaned = cleaned.substring(afterMarker + 1);
            }
        }

        for (const marker of endMarkers) {
            const idx = cleaned.indexOf(marker);
            if (idx !== -1) cleaned = cleaned.substring(0, idx);
        }

        return cleaned.trim();
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: themeObj.bg
            }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent-primary)' }} />
                    <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading book...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: themeObj.bg,
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem'
            }}>
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>{error}</p>
                <button onClick={() => window.history.back()} className="btn-primary">Go Back</button>
            </div>
        );
    }



    // Book Reader (HTML/Text)
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: themeObj.bg,
            color: themeObj.text,
            transition: 'all 0.3s ease'
        }}>
            <ReaderToolbar
                bookTitle={bookData?.title || 'Book'}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                theme={theme}
                onThemeChange={setTheme}
                notesCount={notes.length}
                onToggleNotes={() => setNotesOpen(!notesOpen)}
                progress={progress}
            />

            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                {/* Reading Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '2rem',
                        transition: 'all 0.3s ease',
                        width: notesOpen ? 'calc(100% - 380px)' : '100%'
                    }}
                >
                    <div style={{
                        maxWidth: '720px',
                        margin: '0 auto',
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.8,
                        fontFamily: theme === 'sepia' ? "'Playfair Display', Georgia, serif" : "'Inter', sans-serif",
                        letterSpacing: '0.01em',
                        wordSpacing: '0.05em'
                    }}>
                        {/* Book Title Header */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '3rem',
                            paddingBottom: '2rem',
                            borderBottom: `1px solid ${themeObj.text}20`
                        }}>
                            <h1 style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '2rem',
                                fontWeight: 700,
                                marginBottom: '0.5rem',
                                lineHeight: 1.2
                            }}>
                                {bookData?.title}
                            </h1>
                            <p style={{ fontSize: '1rem', opacity: 0.6 }}>
                                {bookData?.authors?.map(a => a.name).join(', ')}
                            </p>
                        </div>

                        {/* Book Content */}
                        {isHtml ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: cleanContent(content) }}
                                style={{ lineHeight: 1.8 }}
                            />
                        ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {cleanContent(content)}
                            </div>
                        )}

                        {/* End marker */}
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem 0',
                            opacity: 0.4
                        }}>
                            <p style={{ fontSize: '0.9rem' }}>— End —</p>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                Source: Project Gutenberg
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes Sidebar */}
                <NotesSidebar
                    notes={notes}
                    onCreateNote={handleCreateNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    isOpen={notesOpen}
                    onClose={() => setNotesOpen(false)}
                    bookTitle={bookData?.title}
                />
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                /* Style Gutenberg HTML content */
                div[dangerouslysetinnerhtml] img,
                .reader-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1rem 0;
                }
                div[dangerouslysetinnerhtml] a,
                .reader-content a {
                    color: var(--color-accent-primary);
                    text-decoration: underline;
                }
                div[dangerouslysetinnerhtml] pre,
                .reader-content pre {
                    overflow-x: auto;
                    padding: 1rem;
                    border-radius: 8px;
                    background: ${themeObj.text}08;
                }
            `}</style>
        </div>
    );
}
