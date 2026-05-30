import { Link } from 'react-router-dom';
import { gutendexAPI } from '../utils/api.js';

export default function BookCard({ book, progress, style }) {
    const coverUrl = gutendexAPI.getCoverUrl(book);
    const authors = book.authors?.map(a => a.name).join(', ') || 'Unknown';
    const genre = gutendexAPI.getGenre(book.subjects);
    const bookId = book.id;

    return (
        <Link
            to={`/book/${bookId}`}
            className="glass-card"
            style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
                ...style
            }}
        >
            {/* Cover Image */}
            <div style={{
                position: 'relative',
                paddingTop: '140%',
                background: 'linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary))',
                overflow: 'hidden'
            }}>
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={book.title}
                        loading="lazy"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1a1a2e, #2a2a3e)',
                        padding: '1rem'
                    }}>
                        <span className="font-display" style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.3
                        }}>
                            {book.title}
                        </span>
                    </div>
                )}

                {/* Genre Badge */}
                <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem'
                }}>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                        {genre}
                    </span>
                </div>
            </div>

            {/* Book Info */}
            <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {book.title}
                </h3>
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {authors}
                </p>

                {/* Download count */}
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'auto' }}>
                    {book.download_count?.toLocaleString() || 0} reads
                </p>

                {/* Progress Bar */}
                {progress !== undefined && progress > 0 && (
                    <div style={{ marginTop: '0.25rem' }}>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--color-accent-primary)', marginTop: '0.2rem' }}>
                            {Math.round(progress)}% complete
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}