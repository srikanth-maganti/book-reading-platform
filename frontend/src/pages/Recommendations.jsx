import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Loader2, TrendingUp, Cpu } from 'lucide-react';
import { recommendationsAPI, booksAPI } from '../utils/api.js';
import { AuthContext } from '../utils/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';

export default function Recommendations() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchRecommendations();
    }, [isAuthenticated, navigate]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const res = await recommendationsAPI.get();
            setRecommendations(res.data.recommendations || []);
            setMeta(res.data.meta || null);
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
            // Fallback: fetch directly from local trending
            try {
                const trending = await booksAPI.getTrending();
                setRecommendations([{
                    category: 'Popular Books',
                    reason: 'Most downloaded books',
                    books: trending.data.results?.slice(0, 8) || []
                }]);
            } catch (e) { /* ignore */ }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            {/* Header */}
            <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    ✨ For You
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Personalized book recommendations based on your reading history
                </p>
            </div>

            {/* ML Coming Soon Banner */}
            {meta?.engine === 'dummy' && (
                <div className="glass-card animate-fade-in" style={{
                    padding: '1.25rem 1.5rem',
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, #6366f110, #f59e0b10)',
                    border: '1px solid var(--color-border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: '#6366f120',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Cpu size={22} color="var(--color-accent-cool)" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                            ML-Powered Recommendations Coming Soon
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            We're building a personalized recommendation engine that learns from your reading habits. 
                            For now, enjoy our curated picks!
                        </p>
                    </div>
                </div>
            )}

            {/* Recommendation Sections */}
            {loading ? (
                <div>
                    {[...Array(3)].map((_, sectionIdx) => (
                        <div key={sectionIdx} style={{ marginBottom: '2.5rem' }}>
                            <div className="skeleton" style={{ height: '24px', width: '200px', marginBottom: '0.5rem' }} />
                            <div className="skeleton" style={{ height: '16px', width: '300px', marginBottom: '1.25rem' }} />
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '1.25rem'
                            }}>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i}>
                                        <div className="skeleton" style={{ paddingTop: '140%', marginBottom: '0.5rem' }} />
                                        <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : recommendations.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--color-text-muted)'
                }}>
                    <Sparkles size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No recommendations yet</p>
                    <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        Start reading books to get personalized recommendations
                    </p>
                    <Link to="/browse" className="btn-primary">Browse Books</Link>
                </div>
            ) : (
                <div>
                    {recommendations.map((section, sectionIdx) => (
                        <section
                            key={sectionIdx}
                            className="animate-fade-in"
                            style={{
                                marginBottom: '3rem',
                                animationDelay: `${sectionIdx * 0.1}s`,
                                opacity: 0
                            }}
                        >
                            <div style={{ marginBottom: '1.25rem' }}>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    {section.category === 'Trending Now' && <TrendingUp size={20} color="var(--color-accent-primary)" />}
                                    {section.category === 'Trending Now' ? '' : '📚'} {section.category}
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    {section.reason}
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '1.25rem'
                            }}>
                                {section.books?.map((book, bookIdx) => (
                                    <div
                                        key={book.id}
                                        className="animate-fade-in"
                                        style={{
                                            animationDelay: `${(sectionIdx * 0.1) + (bookIdx * 0.03)}s`,
                                            opacity: 0
                                        }}
                                    >
                                        <BookCard book={book} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
