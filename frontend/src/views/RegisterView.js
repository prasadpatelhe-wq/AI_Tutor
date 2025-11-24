import React, { useState, useEffect } from 'react';
import { registerStudent } from '../api';
import { fetchGrades, fetchBoards } from '../meta';

const RegisterView = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        grade_band: '',
        board: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const loadMeta = async () => {
            try {
                const [g, b] = await Promise.all([fetchGrades(), fetchBoards()]);
                setGrades(g.data);
                setBoards(b.data);
                // Set defaults if available
                if (g.data.length > 0) setFormData(prev => ({ ...prev, grade_band: g.data[0].name }));
                if (b.data.length > 0) setFormData(prev => ({ ...prev, board: b.data[0].name }));
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

        const result = await registerStudent(formData);
        setLoading(false);

        if (result.success) {
            onRegisterSuccess();
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Join AI Tutor</h2>
                {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '5px',
                                border: 'none',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '5px',
                                border: 'none',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '5px',
                                border: 'none',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Board</label>
                        <select
                            name="board"
                            value={formData.board}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '5px',
                                border: 'none',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="" disabled>Select Board</option>
                            {boards.map(b => (
                                <option key={b.id} value={b.name} style={{ color: 'black' }}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Grade</label>
                        <select
                            name="grade_band"
                            value={formData.grade_band}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '5px',
                                border: 'none',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="" disabled>Select Grade</option>
                            {grades.map(g => (
                                <option key={g.id} value={g.name} style={{ color: 'black' }}>{g.display || g.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '5px',
                            border: 'none',
                            background: '#4fd1c5',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.3s'
                        }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <span
                        onClick={onNavigateToLogin}
                        style={{ color: '#4fd1c5', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Login here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
