import React, { useState, useEffect } from 'react';
import { registerStudent } from '../api';
import { fetchGrades, fetchBoards, fetchLanguages } from '../meta';

const Register = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        grade_band: '',
        board: '',
        medium: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const [boards, setBoards] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const loadMeta = async () => {
            try {
                const [g, b, langs] = await Promise.all([fetchGrades(), fetchBoards(), fetchLanguages()]);
                setGrades(g.data);
                setBoards(b.data);
                setLanguages(langs.data);
                if (g.data.length > 0) setFormData(prev => ({ ...prev, grade_band: g.data[0].name }));
                if (b.data.length > 0) setFormData(prev => ({ ...prev, board: b.data[0].name }));
                if (langs.data.length > 0) setFormData(prev => ({ ...prev, medium: langs.data[0].name }));
            } catch (err) {
                console.error("Failed to load metadata", err);
            }
        };
        loadMeta();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const result = await registerStudent(formData);
            if (result.success) {
                onRegisterSuccess();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid transparent',
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        marginBottom: '1rem'
    };

    const focusStyle = (e) => e.target.style.border = '2px solid var(--lavender-light)';
    const blurStyle = (e) => e.target.style.border = '2px solid transparent';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '40px 20px'
        }}>
            <div className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    textAlign: 'center',
                    marginBottom: '10px',
                    fontSize: '2rem'
                }}>Join the Fun! 🚀</h2>
                <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '2rem' }}>Create your profile to start learning.</p>

                {error && (
                    <div style={{
                        background: 'rgba(255, 107, 107, 0.2)',
                        border: '1px solid var(--accent-pink)',
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '1rem',
                        color: '#ffdede',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={{ fontWeight: 'bold' }}>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} placeholder="Your Name" />

                    <label style={{ fontWeight: 'bold' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} placeholder="student@example.com" />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} placeholder="••••••" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Confirm</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} placeholder="••••••" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Board</label>
                            <select name="board" value={formData.board} onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                                {boards.map(b => <option key={b.id} value={b.name} style={{ color: 'black' }}>{b.name}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Grade</label>
                            <select name="grade_band" value={formData.grade_band} onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                                {grades.map(g => <option key={g.id} value={g.name} style={{ color: 'black' }}>{g.display || g.name}</option>)}
                            </select>
                        </div>
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
                            marginTop: '10px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
                        onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
                    >
                        {loading ? 'Creating Profile...' : 'Start Adventure! 🌟'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', opacity: 0.9 }}>
                    Already have an account?{' '}
                    <span
                        onClick={onNavigateToLogin}
                        style={{
                            color: 'var(--accent-gold)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Login here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
