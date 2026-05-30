import { ArrowLeft, Minus, Plus, Sun, Moon, BookOpen, StickyNote, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const THEMES = [
    { key: 'dark', label: 'Dark', icon: Moon, bg: '#0a0a0f', text: '#f5f5f5' },
    { key: 'light', label: 'Light', icon: Sun, bg: '#faf8f5', text: '#1a1a2e' },
    { key: 'sepia', label: 'Sepia', icon: BookOpen, bg: '#f4ecd8', text: '#5c4b37' },
];

export default function ReaderToolbar({
    bookTitle,
    fontSize, onFontSizeChange,
    theme, onThemeChange,
    notesCount, onToggleNotes,
    progress
}) {
    const navigate = useNavigate();

    return (
        <div className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderBottom: '1px solid var(--color-border-subtle)'
        }}>
            {/* Left: Back + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <button
                    onClick={() => navigate(-1)}
                    className="btn-ghost"
                    style={{ padding: '0.4rem', flexShrink: 0 }}
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 style={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {bookTitle}
                </h1>
            </div>

            {/* Center: Reading Progress */}
            {progress !== undefined && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0
                }}>
                    <div className="progress-bar" style={{ width: '100px' }}>
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {Math.round(progress)}%
                    </span>
                </div>
            )}

            {/* Right: Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {/* Font Size */}
                <button
                    onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
                    className="btn-ghost"
                    style={{ padding: '0.3rem' }}
                    title="Decrease font size"
                >
                    <Minus size={14} />
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: '28px', textAlign: 'center' }}>
                    {fontSize}
                </span>
                <button
                    onClick={() => onFontSizeChange(Math.min(32, fontSize + 2))}
                    className="btn-ghost"
                    style={{ padding: '0.3rem' }}
                    title="Increase font size"
                >
                    <Plus size={14} />
                </button>

                {/* Separator */}
                <div style={{ width: '1px', height: '20px', background: 'var(--color-border-subtle)', margin: '0 0.25rem' }} />

                {/* Theme Toggle */}
                {THEMES.map(t => (
                    <button
                        key={t.key}
                        onClick={() => onThemeChange(t.key)}
                        className="btn-ghost"
                        style={{
                            padding: '0.3rem',
                            color: theme === t.key ? 'var(--color-accent-primary)' : undefined
                        }}
                        title={`${t.label} mode`}
                    >
                        <t.icon size={15} />
                    </button>
                ))}

                {/* Separator */}
                <div style={{ width: '1px', height: '20px', background: 'var(--color-border-subtle)', margin: '0 0.25rem' }} />

                {/* Notes Toggle */}
                <button
                    onClick={onToggleNotes}
                    className="btn-ghost"
                    style={{ padding: '0.3rem', position: 'relative' }}
                    title="Toggle notes"
                >
                    <StickyNote size={16} />
                    {notesCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: 'var(--color-accent-primary)',
                            color: '#0a0a0f',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {notesCount > 9 ? '9+' : notesCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

export { THEMES };
