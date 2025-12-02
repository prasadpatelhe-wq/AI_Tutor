import React, { useState } from 'react';
import { loginStudent } from '../api';
import './LoginView.css';

const LoginView = ({ onLoginSuccess, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await loginStudent({ email, password });
        setLoading(false);

        if (result.success) {
            onLoginSuccess(result.data.student);
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
            className="login-page"
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

            <div className="login-shell">
                <section className="login-hero glass-panel">
                    <p className="eyebrow">AI Tutor</p>
                    <h1>Learn boldly with immersive lessons and instant feedback.</h1>
                    <p className="lede">
                        Sign in to unlock your streaks, rewards, and a tutor that adapts to every move you make.
                    </p>
                    <div className="hero-bubble">Stay focused • Earn rewards</div>
                    <div className="pill-row">
                        <span className="pill">Adaptive pathing</span>
                        <span className="pill">Live quizzes</span>
                        <span className="pill">Focus alerts</span>
                    </div>
                    <div className="stat-card">
                        <div>
                            <p className="eyebrow subtle">Daily momentum</p>
                            <strong>Keep your streak alive today</strong>
                        </div>
                        <div className="stat-meter">
                            <span className="meter-fill" />
                        </div>
                    </div>
                </section>

                <section className="login-card glass-panel">
                    <div className="card-top">
                        <div>
                            <p className="eyebrow subtle">Welcome back</p>
                            <h2>Sign in to continue</h2>
                        </div>
                        <div className="status-chip">
                            <span className="pulse-dot" />
                            Session ready
                        </div>
                    </div>

                    {error && <div className="alert">{error}</div>}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label className="input-label" htmlFor="email">
                            Email
                            <input
                                id="email"
                                className="input-control"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="********"
                            />
                        </label>

                        <button className="cta-btn" type="submit" disabled={loading}>
                            {loading ? 'Signing you in...' : 'Login'}
                        </button>
                    </form>

                    <div className="helper-row">
                        Don't have an account?{' '}
                        <button className="link-btn" type="button" onClick={onNavigateToRegister}>
                            Register here
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginView;
