import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOpen, Sparkles, Upload, StickyNote, ArrowRight, TrendingUp } from 'lucide-react';
import { booksAPI } from '../utils/api.js';
import BookCard from '../components/BookCard.jsx';

export default function Landing() {
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        booksAPI.getTrending()
            .then(res => {
                setTrendingBooks(res.data.results?.slice(0, 8) || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const features = [
        {
            icon: BookOpen,
            title: '70,000+ Free Books',
            description: 'Access a massive library of classic literature from Project Gutenberg — completely free.',
            color: 'var(--color-accent-primary)'
        },
        {
            icon: StickyNote,
            title: 'Interactive Notes',
            description: 'Highlight passages and take notes while reading. All synced to your account.',
            color: 'var(--color-accent-emerald)'
        },
        {
            icon: Upload,
            title: 'Upload Your PDFs',
            description: 'Bring your own books. Upload PDFs and read them in our interactive reader.',
            color: 'var(--color-accent-cool)'
        },
        {
            icon: Sparkles,
            title: 'Smart Recommendations',
            description: 'Get personalized book suggestions based on your reading history and preferences.',
            color: 'var(--color-accent-warm)'
        }
    ];

    const genres = [
        { name: 'Fiction', emoji: '📖', topic: 'fiction' },
        { name: 'Science', emoji: '🔬', topic: 'science' },
        { name: 'History', emoji: '🏛️', topic: 'history' },
        { name: 'Adventure', emoji: '⚔️', topic: 'adventure' },
        { name: 'Romance', emoji: '💕', topic: 'romance' },
        { name: 'Philosophy', emoji: '🤔', topic: 'philosophy' },
        { name: 'Poetry', emoji: '✨', topic: 'poetry' },
        { name: 'Mystery', emoji: '🔍', topic: 'mystery' },
    ];

    return (
        <div>
            <div className="ambient-bg" />

            {/* Hero Section */}
            <section style={{
                padding: '6rem 0 4rem',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div className="container">
                    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 1rem',
                            background: 'var(--color-bg-glass)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '1.5rem'
                        }}>
                            <TrendingUp size={14} color="var(--color-accent-primary)" />
                            70,000+ free books from Project Gutenberg
                        </div>

                        <h1 className="font-display" style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.03em'
                        }}>
                            Your Next Great
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Adventure Awaits
                            </span>
                        </h1>

                        <p style={{
                            fontSize: '1.15rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.7,
                            marginBottom: '2.5rem',
                            maxWidth: '540px',
                            margin: '0 auto 2.5rem'
                        }}>
                            Read classic literature for free, take notes while reading,
                            and build your personal digital library in a beautiful interface.
                        </p>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Link to="/browse" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                                <BookOpen size={18} />
                                Start Reading
                            </Link>
                            <Link to="/signup" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                                Create Free Account
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Genres */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <h2 style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Browse by Genre
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '0.75rem'
                    }}>
                        {genres.map((genre, i) => (
                            <Link
                                key={genre.topic}
                                to={`/browse?topic=${genre.topic}`}
                                className="glass-card animate-fade-in"
                                style={{
                                    padding: '1.25rem 1rem',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    animationDelay: `${i * 0.05}s`,
                                    opacity: 0
                                }}
                            >
                                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{genre.emoji}</div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                    {genre.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="font-display" style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem'
                        }}>
                            Everything You Need to Read
                        </h2>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--color-text-secondary)',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            A complete reading experience with powerful tools built in
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {features.map((feature, i) => (
                            <div
                                key={feature.title}
                                className="glass-card animate-fade-in"
                                style={{
                                    padding: '1.75rem',
                                    animationDelay: `${i * 0.1}s`,
                                    opacity: 0
                                }}
                            >
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: 'var(--radius-md)',
                                    background: `${feature.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <feature.icon size={22} color={feature.color} />
                                </div>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-muted)',
                                    lineHeight: 1.6
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Books */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                📈 Trending Now
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                Most popular books on Project Gutenberg
                            </p>
                        </div>
                        <Link to="/browse" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ paddingTop: '180%', borderRadius: 'var(--radius-lg)' }} />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {trendingBooks.map((book, i) => (
                                <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 0 6rem' }}>
                <div className="container">
                    <div className="glass-card" style={{
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f59e0b08, #6366f108)',
                        border: '1px solid var(--color-border-accent)'
                    }}>
                        <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            Ready to Start Reading?
                        </h2>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '1.5rem',
                            maxWidth: '400px',
                            margin: '0 auto 1.5rem'
                        }}>
                            Join PageTurn and get access to thousands of free books with an interactive reading experience.
                        </p>
                        <Link to="/signup" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                            <Sparkles size={18} />
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
