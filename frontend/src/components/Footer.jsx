import { BookOpen, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--color-border-subtle)',
            padding: '3rem 0 2rem',
            marginTop: 'auto',
            background: 'linear-gradient(to top, #0a0a0f, transparent)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <BookOpen size={18} color="#0a0a0f" />
                            </div>
                            <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700 }}>PageTurn</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            Read 33,000+ free classic books from Project Gutenberg. Take notes, and discover your next favorite read.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            Explore
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/browse" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Browse Books</Link>
                            <Link to="/browse?topic=fiction" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Fiction</Link>
                            <Link to="/browse?topic=science" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Science</Link>
                            <Link to="/browse?topic=history" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>History</Link>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            Platform
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/library" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>My Library</Link>
                            <Link to="/recommendations" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Recommendations</Link>
                        </div>
                    </div>

                    {/* Credits */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            Powered By
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="https://www.gutenberg.org/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Project Gutenberg</a>
                            <a href="https://gutendex.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Gutendex API</a>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        © {new Date().getFullYear()} PageTurn. All books sourced from Project Gutenberg (public domain).
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Built with <Heart size={12} color="var(--color-accent-warm)" fill="var(--color-accent-warm)" /> by Srikanth
                    </p>
                </div>
            </div>
        </footer>
    );
}