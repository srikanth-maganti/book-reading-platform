import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../utils/AuthContext.jsx';
import { Search, BookOpen, Library, Sparkles, Upload, Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/browse', label: 'Browse', icon: BookOpen },
        { path: '/library', label: 'My Library', icon: Library, auth: true },
        { path: '/recommendations', label: 'For You', icon: Sparkles, auth: true },

    ];

    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--color-border-subtle)'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <BookOpen size={20} color="#0a0a0f" />
                    </div>
                    <span className="font-display" style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        PageTurn
                    </span>
                </Link>

                {/* Search Bar (desktop) */}
                <form onSubmit={handleSearch} style={{
                    flex: '1',
                    maxWidth: '400px',
                    display: 'flex',
                    position: 'relative'
                }} className="hidden-mobile">
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)'
                    }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search books, authors..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                    />
                </form>

                {/* Nav Links (desktop) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }} className="hidden-mobile">
                    {navLinks.filter(link => !link.auth || isAuthenticated).map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="btn-ghost"
                            style={{
                                color: isActive(link.path) ? 'var(--color-accent-primary)' : undefined,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <link.icon size={16} />
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Auth Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexShrink: 0
                }}>
                    {isAuthenticated ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, var(--color-accent-cool), var(--color-accent-primary))',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase() || <User size={16} />}
                            </button>

                            {profileMenuOpen && (
                                <div className="glass-card" style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.5rem',
                                    minWidth: '180px',
                                    zIndex: 100
                                }}>
                                    <div style={{
                                        padding: '0.5rem 0.75rem',
                                        borderBottom: '1px solid var(--color-border-subtle)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setProfileMenuOpen(false); navigate('/'); }}
                                        className="btn-ghost"
                                        style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-accent-warm)' }}
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to="/login" className="btn-ghost">Sign In</Link>
                            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        className="btn-ghost show-mobile"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ padding: '0.5rem' }}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                }} className="show-mobile-block">
                    <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '0.5rem' }}>
                        <Search size={16} style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search books..."
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </form>
                    {navLinks.filter(link => !link.auth || isAuthenticated).map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="btn-ghost"
                            style={{
                                justifyContent: 'flex-start',
                                color: isActive(link.path) ? 'var(--color-accent-primary)' : undefined
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <link.icon size={16} />
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
                .hidden-mobile { display: flex; }
                .show-mobile { display: none !important; }
                .show-mobile-block { display: none; }
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                    .show-mobile-block { display: flex !important; }
                }
            `}</style>
        </nav>
    );
}
