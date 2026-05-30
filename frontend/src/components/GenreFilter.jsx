const GENRES = [
    { key: 'all', label: 'All', emoji: '📚' },
    { key: 'fiction', label: 'Fiction', emoji: '📖' },
    { key: 'science', label: 'Science', emoji: '🔬' },
    { key: 'history', label: 'History', emoji: '🏛️' },
    { key: 'adventure', label: 'Adventure', emoji: '⚔️' },
    { key: 'romance', label: 'Romance', emoji: '💕' },
    { key: 'philosophy', label: 'Philosophy', emoji: '🤔' },
    { key: 'poetry', label: 'Poetry', emoji: '✨' },
    { key: 'drama', label: 'Drama', emoji: '🎭' },
    { key: 'mystery', label: 'Mystery', emoji: '🔍' },
    { key: 'horror', label: 'Horror', emoji: '👻' },
    { key: 'children', label: 'Children', emoji: '🧸' },
    { key: 'biography', label: 'Biography', emoji: '📝' },
];

export default function GenreFilter({ activeGenre, onGenreChange }) {
    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.5rem 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            {GENRES.map(genre => (
                <button
                    key={genre.key}
                    onClick={() => onGenreChange(genre.key)}
                    className={activeGenre === genre.key ? 'badge badge-active' : 'badge'}
                    style={{
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        padding: '0.4rem 1rem',
                        fontSize: '0.8rem',
                        border: activeGenre === genre.key
                            ? '1px solid var(--color-border-accent)'
                            : '1px solid var(--color-border-subtle)',
                        background: activeGenre === genre.key
                            ? 'linear-gradient(135deg, #f59e0b20, #d9770620)'
                            : 'var(--color-bg-glass)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {genre.emoji} {genre.label}
                </button>
            ))}

            <style>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}

export { GENRES };
