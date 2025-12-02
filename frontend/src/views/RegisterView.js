import React, { useState, useEffect } from 'react';
import { registerStudent } from '../api';
import { fetchGrades, fetchBoards } from '../meta';
import './LoginView.css';
import './RegisterView.css';

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
    const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const loadMeta = async () => {
            try {
                const [g, b] = await Promise.all([fetchGrades(), fetchBoards()]);
                setGrades(g.data);
                setBoards(b.data);
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

    const handleParallax = (event) => {
        const { innerWidth, innerHeight } = window;
        const x = ((event.clientX - innerWidth / 2) / innerWidth) * 30;
        const y = ((event.clientY - innerHeight / 2) / innerHeight) * 30;
        setParallaxOffset({ x, y });
    };

    return (
        <div
            className="login-page register-page"
            onMouseMove={handleParallax}
            style={{
                '--parallax-x': `${parallaxOffset.x}px`,
                '--parallax-y': `${parallaxOffset.y}px`,
            }}
        >
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="orb orb-three" />
            <div className="grid-glow" />
            <div className="gradient-veil" />

            <div className="register-shell">
                <section className="register-hero glass-panel">
                    <p className="eyebrow">Create your AI Tutor passport</p>
                    <h1>Shape your learning path from day one.</h1>
                    <p className="lede">
                        Tell us who you are and what you study. We will adapt lessons, rewards, and streaks to your grade, board, and pace.
                    </p>
                    <div className="progress-track">
                        <div className="track-step">
                            <span className="step-dot filled" />
                            <div>
                                <p className="eyebrow subtle">Step 1</p>
                                <strong>Profile basics</strong>
                                <p className="muted">Name, email, secure password</p>
                            </div>
                        </div>
                        <div className="track-step">
                            <span className={`step-dot ${formData.board ? 'filled' : ''}`} />
                            <div>
                                <p className="eyebrow subtle">Step 2</p>
                                <strong>Board preference</strong>
                                <p className="muted">CBSE, ICSE, State, and more</p>
                            </div>
                        </div>
                        <div className="track-step">
                            <span className={`step-dot ${formData.grade_band ? 'filled' : ''}`} />
                            <div>
                                <p className="eyebrow subtle">Step 3</p>
                                <strong>Grade band</strong>
                                <p className="muted">We tune videos and quizzes for you</p>
                            </div>
                        </div>
                    </div>
                    <div className="badges-row">
                        <span className="glow-pill">Smart recommendations</span>
                        <span className="glow-pill">Daily streaks</span>
                        <span className="glow-pill">Gamified rewards</span>
                    </div>
                </section>

                <section className="register-card glass-panel">
                    <div className="card-top">
                        <div>
                            <p className="eyebrow subtle">Join the classroom</p>
                            <h2>Set up your account</h2>
                        </div>
                        <div className="status-chip">
                            <span className="pulse-dot" />
                            Profile preview
                        </div>
                    </div>

                    {error && <div className="alert">{error}</div>}

                    <form className="login-form register-form" onSubmit={handleSubmit}>
                        <label className="input-label" htmlFor="name">
                            Full name
                            <input
                                id="name"
                                className="input-control"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Aarya Sharma"
                            />
                        </label>

                        <label className="input-label" htmlFor="email">
                            Email
                            <input
                                id="email"
                                className="input-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                            />
                        </label>

                        <label className="input-label" htmlFor="password">
                            Password
                            <input
                                id="password"
                                className="input-control"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a strong password"
                            />
                        </label>

                        <div className="two-up">
                            <label className="input-label" htmlFor="board">
                                Board
                                <select
                                    id="board"
                                    name="board"
                                    className="input-control select-control"
                                    value={formData.board}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Board</option>
                                    {boards.map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="input-label" htmlFor="grade_band">
                                Grade
                                <select
                                    id="grade_band"
                                    name="grade_band"
                                    className="input-control select-control"
                                    value={formData.grade_band}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Grade</option>
                                    {grades.map(g => (
                                        <option key={g.id} value={g.name}>{g.display || g.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="profile-preview">
                            <div>
                                <p className="eyebrow subtle">Quick preview</p>
                                <strong>{formData.name || 'Your name here'}</strong>
                                <p className="muted">{formData.grade_band || 'Grade'} • {formData.board || 'Board'}</p>
                            </div>
                            <div className="mini-chip">AI ready</div>
                        </div>

                        <button className="cta-btn" type="submit" disabled={loading}>
                            {loading ? 'Creating your profile...' : 'Create account'}
                        </button>
                    </form>

                    <div className="helper-row">
                        Already have an account?{' '}
                        <button className="link-btn" type="button" onClick={onNavigateToLogin}>
                            Login here
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RegisterView;
