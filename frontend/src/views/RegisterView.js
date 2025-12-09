import React, { useState, useEffect, useRef } from 'react';
import { registerStudent } from '../api';
import { fetchGrades, fetchBoards, fetchLanguages } from '../meta';

// Animated particles background
const ParticleField = () => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
    }));

    return (
        <div className="particle-field">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        '--size': `${p.size}px`,
                        '--x': `${p.x}%`,
                        '--y': `${p.y}%`,
                        '--duration': `${p.duration}s`,
                        '--delay': `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

// Animated journey path
const JourneyPath = ({ step }) => {
    const steps = [
        { icon: '👤', label: 'You' },
        { icon: '📝', label: 'Details' },
        { icon: '🎓', label: 'Grade' },
        { icon: '🚀', label: 'Start!' },
    ];

    return (
        <div className="journey-path">
            {steps.map((s, i) => (
                <React.Fragment key={i}>
                    <div className={`journey-step ${i <= step ? 'active' : ''} ${i === step ? 'current' : ''}`}>
                        <div className="step-icon">{s.icon}</div>
                        <span className="step-label">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`journey-connector ${i < step ? 'active' : ''}`}>
                            <div className="connector-fill" style={{ width: i < step ? '100%' : '0%' }} />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Grade theme preview
const GradePreview = ({ grade }) => {
    const themes = {
        'kids': {
            colors: ['#FF6B9D', '#4ECDC4', '#FFE66D'],
            emoji: '🎨',
            name: 'Fun Mode',
            desc: 'Colorful & Playful',
        },
        'teen': {
            colors: ['#667eea', '#764ba2', '#4fd1c5'],
            emoji: '🎮',
            name: 'Gamer Mode',
            desc: 'Modern & Cool',
        },
        'mature': {
            colors: ['#4A5568', '#38B2AC', '#2D3748'],
            emoji: '💼',
            name: 'Focus Mode',
            desc: 'Professional & Clean',
        },
    };

    const getThemeType = (gradeName) => {
        if (!gradeName) return 'teen';
        const num = parseInt(gradeName.match(/\d+/)?.[0] || '5');
        if (num <= 4) return 'kids';
        if (num <= 7) return 'teen';
        return 'mature';
    };

    const themeType = getThemeType(grade);
    const theme = themes[themeType];

    return (
        <div className="grade-preview" style={{ '--c1': theme.colors[0], '--c2': theme.colors[1], '--c3': theme.colors[2] }}>
            <div className="preview-card">
                <div className="preview-glow"></div>
                <div className="preview-icon">{theme.emoji}</div>
                <h4 className="preview-name">{theme.name}</h4>
                <p className="preview-desc">{theme.desc}</p>
                <div className="preview-colors">
                    {theme.colors.map((c, i) => (
                        <div key={i} className="color-dot" style={{ background: c }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Animated books stack
const BooksStack = () => (
    <div className="books-stack">
        {['📕', '📗', '📘', '📙', '📓'].map((book, i) => (
            <div
                key={i}
                className="book"
                style={{ '--delay': `${i * 0.2}s`, '--offset': `${i * 5}px` }}
            >
                {book}
            </div>
        ))}
    </div>
);

// Success celebration
const Celebration = () => (
    <div className="celebration">
        {['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎈'].map((emoji, i) => (
            <span
                key={i}
                className="confetti"
                style={{
                    '--x': `${10 + Math.random() * 80}%`,
                    '--delay': `${Math.random() * 0.5}s`,
                    '--duration': `${1 + Math.random() * 1}s`,
                }}
            >
                {emoji}
            </span>
        ))}
    </div>
);

const RegisterView = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        grade_band: '',
        board: '',
        medium: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const [boards, setBoards] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const formRef = useRef(null);

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

    // Update step based on form progress
    useEffect(() => {
        if (formData.name && formData.email) {
            if (formData.password && formData.confirmPassword) {
                if (formData.grade_band && formData.board) {
                    setCurrentStep(3);
                } else {
                    setCurrentStep(2);
                }
            } else {
                setCurrentStep(1);
            }
        } else {
            setCurrentStep(0);
        }
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            formRef.current?.classList.add('shake-animation');
            setTimeout(() => formRef.current?.classList.remove('shake-animation'), 500);
            return;
        }

        setLoading(true);
        const result = await registerStudent(formData);
        setLoading(false);

        if (result.success) {
            setShowCelebration(true);
            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);
        } else {
            setError(result.message);
            formRef.current?.classList.add('shake-animation');
            setTimeout(() => formRef.current?.classList.remove('shake-animation'), 500);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Fredoka+One&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          position: relative;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        /* Animated gradient background */
        .register-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 0%, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(118, 75, 162, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(79, 209, 197, 0.1) 0%, transparent 60%);
          animation: bg-pulse 10s ease-in-out infinite;
        }

        @keyframes bg-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Particle field */
        .particle-field {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          left: var(--x);
          top: var(--y);
          animation: particle-float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translate(-10px, -50px) scale(0.8);
            opacity: 0.5;
          }
          75% {
            transform: translate(15px, -20px) scale(1.1);
            opacity: 0.7;
          }
        }

        /* Left side */
        .register-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        .register-branding {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .register-logo {
          font-family: 'Fredoka One', cursive;
          font-size: 3rem;
          background: linear-gradient(135deg, #667eea, #764ba2, #4fd1c5);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-flow 4s ease-in-out infinite;
          margin-bottom: 10px;
        }

        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .register-tagline {
          font-size: 1.1rem;
          opacity: 0.8;
          font-weight: 300;
        }

        /* Journey path */
        .journey-path {
          display: flex;
          align-items: center;
          margin: 40px 0;
        }

        .journey-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.4s ease;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.4s ease;
        }

        .journey-step.active .step-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: transparent;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .journey-step.current .step-icon {
          animation: pulse-step 1.5s ease-in-out infinite;
          transform: scale(1.1);
        }

        @keyframes pulse-step {
          0%, 100% { box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); }
          50% { box-shadow: 0 15px 45px rgba(102, 126, 234, 0.6); }
        }

        .step-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          margin-top: 8px;
          transition: all 0.3s ease;
        }

        .journey-step.active .step-label {
          color: white;
        }

        .journey-connector {
          width: 60px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 10px;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 25px;
        }

        .connector-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.5s ease;
          border-radius: 2px;
        }

        /* Books stack */
        .books-stack {
          display: flex;
          margin-top: 30px;
        }

        .book {
          font-size: 50px;
          animation: book-float 3s ease-in-out infinite;
          animation-delay: var(--delay);
          transform: translateY(var(--offset));
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
        }

        @keyframes book-float {
          0%, 100% { transform: translateY(var(--offset)); }
          50% { transform: translateY(calc(var(--offset) - 10px)); }
        }

        /* Grade preview */
        .grade-preview {
          margin-top: 30px;
          perspective: 1000px;
        }

        .preview-card {
          background: linear-gradient(135deg, var(--c1), var(--c2));
          padding: 25px;
          border-radius: 20px;
          text-align: center;
          position: relative;
          animation: preview-float 4s ease-in-out infinite;
          transform-style: preserve-3d;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        @keyframes preview-float {
          0%, 100% { transform: rotateY(-5deg) rotateX(5deg); }
          50% { transform: rotateY(5deg) rotateX(-5deg); }
        }

        .preview-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, var(--c1), transparent 70%);
          opacity: 0.5;
          filter: blur(30px);
          z-index: -1;
        }

        .preview-icon {
          font-size: 50px;
          margin-bottom: 10px;
        }

        .preview-name {
          font-family: 'Fredoka One', cursive;
          font-size: 1.5rem;
          color: white;
          margin-bottom: 5px;
        }

        .preview-desc {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .preview-colors {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .color-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        /* Right side - Form */
        .register-right {
          flex: 1.2;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          position: relative;
          z-index: 1;
          overflow-y: auto;
        }

        .register-form-container {
          width: 100%;
          max-width: 500px;
          animation: slide-in 0.8s ease-out;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .register-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 40px 35px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(102, 126, 234, 0.1),
            transparent,
            rgba(118, 75, 162, 0.1),
            transparent
          );
          animation: rotate-gradient 10s linear infinite;
        }

        @keyframes rotate-gradient {
          to { transform: rotate(360deg); }
        }

        .register-card > * {
          position: relative;
          z-index: 1;
        }

        .register-title {
          font-family: 'Fredoka One', cursive;
          font-size: 2rem;
          color: white;
          text-align: center;
          margin-bottom: 8px;
        }

        .register-subtitle {
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .form-label.focused {
          color: #667eea;
        }

        .label-icon {
          font-size: 1.1rem;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus, .form-select:focus {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 24px;
        }

        .form-select option {
          background: #1a1a2e;
          color: white;
          padding: 10px;
        }

        .error-message {
          background: rgba(255, 82, 82, 0.2);
          border: 1px solid rgba(255, 82, 82, 0.3);
          color: #ff6b6b;
          padding: 12px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 0.9rem;
          animation: error-shake 0.5s ease-in-out;
        }

        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .register-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          margin-top: 10px;
        }

        .register-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .register-button:hover::after {
          transform: translateX(100%);
        }

        .register-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }

        .register-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-link {
          text-align: center;
          margin-top: 25px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .login-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-link a:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* Celebration */
        .celebration {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
        }

        .confetti {
          position: absolute;
          font-size: 40px;
          left: var(--x);
          animation: confetti-fall var(--duration) ease-out forwards;
          animation-delay: var(--delay);
        }

        @keyframes confetti-fall {
          0% {
            top: -50px;
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
          100% {
            top: 100vh;
            opacity: 0;
            transform: rotate(720deg) scale(0.5);
          }
        }

        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .register-page {
            flex-direction: column;
          }

          .register-left {
            padding: 30px 20px;
          }

          .register-logo {
            font-size: 2.2rem;
          }

          .journey-path {
            transform: scale(0.8);
          }

          .books-stack {
            display: none;
          }

          .register-right {
            padding: 20px;
          }

          .register-card {
            padding: 30px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div className="register-page">
                <ParticleField />
                {showCelebration && <Celebration />}

                {/* Left side */}
                <div className="register-left">
                    <div className="register-branding">
                        <h1 className="register-logo">🚀 Join AI Tutor</h1>
                        <p className="register-tagline">Begin Your Learning Adventure!</p>
                    </div>

                    <JourneyPath step={currentStep} />

                    {formData.grade_band && <GradePreview grade={formData.grade_band} />}

                    <BooksStack />
                </div>

                {/* Right side - Form */}
                <div className="register-right">
                    <div className="register-form-container">
                        <div className="register-card" ref={formRef}>
                            <h2 className="register-title">Create Account ✨</h2>
                            <p className="register-subtitle">Fill in your details to start learning</p>

                            {error && <div className="error-message">❌ {error}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* Row 1: Name & Email */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className={`form-label ${focusedField === 'name' ? 'focused' : ''}`}>
                                            <span className="label-icon">👤</span> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={`form-label ${focusedField === 'email' ? 'focused' : ''}`}>
                                            <span className="label-icon">📧</span> Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Password & Confirm */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}>
                                            <span className="label-icon">🔐</span> Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-input"
                                            placeholder="Create password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className={`form-label ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
                                            <span className="label-icon">🔒</span> Confirm
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-input"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Board & Grade */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">🏫</span> Board
                                        </label>
                                        <select
                                            name="board"
                                            className="form-select"
                                            value={formData.board}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Board</option>
                                            {boards.map(b => (
                                                <option key={b.id} value={b.name}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">🎓</span> Grade
                                        </label>
                                        <select
                                            name="grade_band"
                                            className="form-select"
                                            value={formData.grade_band}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Grade</option>
                                            {grades.map(g => (
                                                <option key={g.id} value={g.name}>{g.display || g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Row 4: Medium (full width) */}
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        <span className="label-icon">🌐</span> Language Medium
                                    </label>
                                    <select
                                        name="medium"
                                        className="form-select"
                                        value={formData.medium}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Language</option>
                                        {languages.map(l => (
                                            <option key={l.id} value={l.name}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="register-button" disabled={loading}>
                                    <span className="button-content">
                                        {loading ? (
                                            <>
                                                <div className="spinner"></div>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                🎉 Start My Journey!
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            <p className="login-link">
                                Already have an account?{' '}
                                <a onClick={onNavigateToLogin}>Sign In 🔑</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterView;
