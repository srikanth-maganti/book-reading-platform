import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, BookOpen, Loader2 } from 'lucide-react';
import { authAPI } from '../utils/api.js';
import { AuthContext } from '../utils/AuthContext.jsx';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await authAPI.register({ name, email, password });
            login(res.data.token, res.data.user);
            navigate('/browse');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError('');
            setLoading(true);
            const res = await authAPI.googleAuth(credentialResponse.credential);
            login(res.data.token, res.data.user);
            navigate('/browse');
        } catch (err) {
            setError('Google signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
        }}>
            <div className="ambient-bg" />

            <div className="glass-card animate-fade-in" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2.5rem'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <BookOpen size={24} color="#0a0a0f" />
                        </div>
                    </Link>
                    <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '1rem' }}>
                        Create your account
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                        Start your reading journey today
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: '#ef444420',
                        border: '1px solid #ef444440',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-accent-warm)'
                    }}>
                        {error}
                    </div>
                )}

                {/* Google Signup */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google signup failed')}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        text="signup_with"
                    />
                </div>

                {/* Divider */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--color-border-subtle)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--color-border-subtle)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }} />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password (min 6 characters)"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--color-text-muted)', padding: 0
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
                    >
                        {loading ? (
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: 500 }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}