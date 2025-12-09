import React, { useState } from 'react';
import { loginStudent } from '../api';

const Login = ({ onLoginSuccess, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await loginStudent({ email, password });
            if (result.success) {
                onLoginSuccess(result.data.student);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '10px',
                    fontSize: '2rem'
                }}>Welcome Back! 👋</h2>

                <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Ready to learn something new today?</p>

                {error && (
                    <div style={{
                        background: 'rgba(255, 107, 107, 0.2)',
                        border: '1px solid var(--accent-pink)',
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '1rem',
                        color: '#ffdede'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="student@example.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid transparent',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.border = '2px solid var(--lavender-light)'}
                            onBlur={(e) => e.target.style.border = '2px solid transparent'}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid transparent',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.border = '2px solid var(--lavender-light)'}
                            onBlur={(e) => e.target.style.border = '2px solid transparent'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'white',
                            color: 'var(--lavender-deep)',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
                        onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
                    >
                        {loading ? 'Logging in...' : 'Login 🚀'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.9 }}>
                    New here?{' '}
                    <span
                        onClick={onNavigateToRegister}
                        style={{
                            color: 'var(--accent-gold)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Create a Profile!
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
