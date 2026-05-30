import { useState } from 'react';
import { X, Plus, Edit3, Trash2, StickyNote } from 'lucide-react';

const NOTE_COLORS = [
    { key: 'yellow', color: '#fbbf24', bg: '#fbbf2420' },
    { key: 'green', color: '#10b981', bg: '#10b98120' },
    { key: 'blue', color: '#6366f1', bg: '#6366f120' },
    { key: 'pink', color: '#ec4899', bg: '#ec489920' },
    { key: 'orange', color: '#f97316', bg: '#f9731620' },
];

export default function NotesSidebar({ notes, onCreateNote, onUpdateNote, onDeleteNote, isOpen, onClose, bookTitle }) {
    const [newNote, setNewNote] = useState('');
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const handleCreate = () => {
        if (!newNote.trim()) return;
        onCreateNote({ content: newNote, color: selectedColor });
        setNewNote('');
    };

    const handleUpdate = (noteId) => {
        if (!editContent.trim()) return;
        onUpdateNote(noteId, { content: editContent });
        setEditingId(null);
        setEditContent('');
    };

    const getColorObj = (key) => NOTE_COLORS.find(c => c.key === key) || NOTE_COLORS[0];

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '380px',
            maxWidth: '100vw',
            height: '100vh',
            background: 'var(--color-bg-secondary)',
            borderLeft: '1px solid var(--color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
            animation: 'slideInRight 0.3s ease-out'
        }}>
            {/* Header */}
            <div style={{
                padding: '1.25rem',
                borderBottom: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StickyNote size={18} color="var(--color-accent-primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notes</h3>
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        background: 'var(--color-bg-glass)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)'
                    }}>
                        {notes.length}
                    </span>
                </div>
                <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}>
                    <X size={18} />
                </button>
            </div>

            {/* New Note Form */}
            <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--color-border-subtle)'
            }}>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a new note..."
                    className="input-field"
                    style={{
                        minHeight: '80px',
                        resize: 'vertical',
                        fontSize: '0.85rem',
                        marginBottom: '0.75rem'
                    }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {NOTE_COLORS.map(c => (
                            <button
                                key={c.key}
                                onClick={() => setSelectedColor(c.key)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: 'var(--radius-full)',
                                    background: c.color,
                                    border: selectedColor === c.key ? '2px solid white' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleCreate}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        disabled={!newNote.trim()}
                    >
                        <Plus size={14} /> Add Note
                    </button>
                </div>
            </div>

            {/* Notes List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 1.25rem'
            }}>
                {notes.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        <StickyNote size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                        <p style={{ fontSize: '0.9rem' }}>No notes yet</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Start writing your thoughts!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notes.map(note => {
                            const colorObj = getColorObj(note.color);
                            return (
                                <div
                                    key={note._id}
                                    style={{
                                        background: colorObj.bg,
                                        borderLeft: `3px solid ${colorObj.color}`,
                                        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                                        padding: '0.75rem'
                                    }}
                                >
                                    {note.selectedText && (
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-muted)',
                                            fontStyle: 'italic',
                                            marginBottom: '0.5rem',
                                            borderBottom: `1px solid ${colorObj.color}30`,
                                            paddingBottom: '0.5rem'
                                        }}>
                                            "{note.selectedText}"
                                        </p>
                                    )}

                                    {editingId === note._id ? (
                                        <div>
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="input-field"
                                                style={{ fontSize: '0.85rem', minHeight: '60px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleUpdate(note._id)}
                                                    className="btn-primary"
                                                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="btn-ghost"
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                                                {note.content}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: '0.5rem'
                                            }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button
                                                        onClick={() => { setEditingId(note._id); setEditContent(note.content); }}
                                                        className="btn-ghost"
                                                        style={{ padding: '0.2rem' }}
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteNote(note._id)}
                                                        className="btn-ghost"
                                                        style={{ padding: '0.2rem', color: 'var(--color-accent-warm)' }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
