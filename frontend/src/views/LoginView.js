import React, { useState, useEffect, useRef } from 'react';
import { loginStudent } from '../api';

// Animated floating icons for the background
const FloatingIcons = () => {
    const icons = ['📚', '🎓', '💡', '🧠', '✨', '🚀', '⭐', '📖', '🎯', '💫', '🔬', '🎨', '📐', '🌟'];

    return (
        <div className="floating-icons-container">
            {icons.map((icon, index) => (
                <span
                    key={index}
                    className="floating-icon"
                    style={{
                        '--delay': `${index * 0.5}s`,
                        '--duration': `${15 + Math.random() * 10}s`,
                        '--x-start': `${Math.random() * 100}%`,
                        '--x-end': `${Math.random() * 100}%`,
                        '--size': `${20 + Math.random() * 30}px`,
                    }}
                >
                    {icon}
                </span>
            ))}
        </div>
    );
};

// Animated brain neural network
const NeuralNetwork = () => {
    const nodes = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
    }));

    return (
        <svg className="neural-network" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Connection lines */}
            {nodes.map((node, i) =>
                nodes.slice(i + 1, i + 4).map((target, j) => (
                    <line
                        key={`${i}-${j}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        className="neural-line"
                        style={{ '--delay': `${(i + j) * 0.2}s` }}
                    />
                ))
            )}
            {/* Nodes */}
            {nodes.map((node, i) => (
                <circle
                    key={node.id}
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="1"
                    className="neural-node"
                    style={{ '--delay': `${i * 0.1}s` }}
                />
            ))}
        </svg>
    );
};

// Typing effect component
const TypingText = ({ texts, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[currentIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentText.length) {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, texts]);

    return (
        <span className={className}>
            {displayText}
            <span className="typing-cursor">|</span>
        </span>
    );
};

// Animated mascot
const AnimatedMascot = () => (
    <div className="mascot-container">
        <div className="mascot">
            <div className="mascot-body">🤖</div>
            <div className="mascot-glow"></div>
        </div>
        <div className="mascot-speech">
            <TypingText
                texts={[
                    "Welcome back, learner! 🎓",
                    "Ready to explore? 🚀",
                    "Let's learn together! 📚",
                    "Knowledge awaits! ✨"
                ]}
                className="speech-text"
            />
        </div>
    </div>
);

const LoginView = ({ onLoginSuccess, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await loginStudent({ email, password });
        setLoading(false);

        if (result.success) {
            // Success animation
            formRef.current?.classList.add('success-animation');
            setTimeout(() => onLoginSuccess(result.data.student), 800);
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

        .login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        }

        /* Animated gradient orbs */
        .login-page::before,
        .login-page::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: float-orb 15s ease-in-out infinite;
        }

        .login-page::before {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
          top: -200px;
          left: -200px;
        }

        .login-page::after {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%);
          bottom: -150px;
          right: -150px;
          animation-delay: -7s;
        }

        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        /* Left side - Illustration */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        .login-branding {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }

        .login-logo {
          font-family: 'Fredoka One', cursive;
          font-size: 3.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 5s ease-in-out infinite;
          margin-bottom: 10px;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .login-tagline {
          font-size: 1.2rem;
          opacity: 0.8;
          font-weight: 300;
        }

        /* Neural network background */
        .neural-network {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          z-index: 0;
        }

        .neural-line {
          stroke: rgba(102, 126, 234, 0.3);
          stroke-width: 0.2;
          animation: pulse-line 3s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .neural-node {
          fill: rgba(102, 126, 234, 0.8);
          animation: pulse-node 2s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes pulse-line {
          0%, 100% { opacity: 0.2; stroke-width: 0.2; }
          50% { opacity: 0.6; stroke-width: 0.4; }
        }

        @keyframes pulse-node {
          0%, 100% { r: 1; opacity: 0.5; }
          50% { r: 1.5; opacity: 1; }
        }

        /* Floating icons */
        .floating-icons-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .floating-icon {
          position: absolute;
          font-size: var(--size);
          animation: float-icon var(--duration) linear infinite;
          animation-delay: var(--delay);
          opacity: 0.6;
          left: var(--x-start);
        }

        @keyframes float-icon {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Mascot */
        .mascot-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
          z-index: 2;
        }

        .mascot {
          position: relative;
          animation: mascot-float 3s ease-in-out infinite;
        }

        .mascot-body {
          font-size: 100px;
          filter: drop-shadow(0 10px 30px rgba(102, 126, 234, 0.5));
        }

        .mascot-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes mascot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .mascot-speech {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 15px 25px;
          border-radius: 20px;
          margin-top: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .mascot-speech::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border: 10px solid transparent;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .speech-text {
          color: white;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .typing-cursor {
          animation: blink 1s infinite;
          color: #667eea;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Right side - Form */
        .login-right {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        .login-form-container {
          width: 100%;
          max-width: 450px;
          animation: slide-up 0.8s ease-out;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 50px 40px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .login-title {
          font-family: 'Fredoka One', cursive;
          font-size: 2.5rem;
          color: white;
          text-align: center;
          margin-bottom: 10px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 35px;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 25px;
          position: relative;
        }

        .form-label {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-label.focused {
          color: #667eea;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 18px 20px 18px 55px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          color: white;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
        }

        .form-input:focus + .input-glow {
          opacity: 1;
        }

        .input-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 17px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
          filter: blur(10px);
        }

        .error-message {
          background: rgba(255, 82, 82, 0.2);
          border: 1px solid rgba(255, 82, 82, 0.3);
          color: #ff6b6b;
          padding: 12px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 0.9rem;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .login-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 15px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }

        .login-button:hover::before {
          left: 100%;
        }

        .login-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }

        .login-button:active {
          transform: translateY(-1px);
        }

        .login-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .login-button .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
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

        .divider {
          display: flex;
          align-items: center;
          margin: 30px 0;
          color: rgba(255, 255, 255, 0.4);
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
        }

        .divider span {
          padding: 0 15px;
          font-size: 0.85rem;
        }

        .register-link {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
        }

        .register-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .register-link a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .register-link a:hover::after {
          width: 100%;
        }

        .register-link a:hover {
          color: #764ba2;
        }

        /* Success animation */
        .success-animation {
          animation: success-pulse 0.8s ease-out forwards;
        }

        @keyframes success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); box-shadow: 0 0 50px rgba(72, 187, 120, 0.5); }
          100% { transform: scale(0.95); opacity: 0; }
        }

        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .login-page {
            flex-direction: column;
          }

          .login-left {
            padding: 30px;
            min-height: auto;
          }

          .login-logo {
            font-size: 2.5rem;
          }

          .mascot-body {
            font-size: 70px;
          }

          .login-right {
            padding: 20px;
          }

          .login-card {
            padding: 35px 25px;
          }
        }
      `}</style>

            <div className="login-page">
                {/* Background elements */}
                <NeuralNetwork />
                <FloatingIcons />

                {/* Left side - Branding */}
                <div className="login-left">
                    <div className="login-branding">
                        <h1 className="login-logo">🎓 AI Tutor</h1>
                        <p className="login-tagline">Your Personal Learning Companion</p>
                    </div>
                    <AnimatedMascot />
                </div>

                {/* Right side - Form */}
                <div className="login-right">
                    <div className="login-form-container">
                        <div className="login-card" ref={formRef}>
                            <h2 className="login-title">Welcome Back! 👋</h2>
                            <p className="login-subtitle">Sign in to continue your learning journey</p>

                            {error && <div className="error-message">❌ {error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className={`form-label ${focusedField === 'email' ? 'focused' : ''}`}>
                                        Email Address
                                    </label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">📧</span>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />
                                        <div className="input-glow"></div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}>
                                        Password
                                    </label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">🔐</span>
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />
                                        <div className="input-glow"></div>
                                    </div>
                                </div>

                                <button type="submit" className="login-button" disabled={loading}>
                                    <span className="button-content">
                                        {loading ? (
                                            <>
                                                <div className="spinner"></div>
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                🚀 Let's Learn!
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            <div className="divider">
                                <span>New to AI Tutor?</span>
                            </div>

                            <p className="register-link">
                                Start your journey today!{' '}
                                <a onClick={onNavigateToRegister}>Create Account ✨</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginView;
