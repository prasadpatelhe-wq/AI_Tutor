/**
 * LoginView - Stunning Redesign
 * A mesmerizing login experience with theme-aware design
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { loginStudent } from '../api';
import { colors, fonts, radius, shadows, animations, spacing } from '../design/tokens';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

// Animated Particle Field Background
const ParticleField = ({ theme = 'teen' }) => {
  const canvasRef = useRef(null);
  const c = colors[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: theme === 'teen'
            ? [c.primary, c.secondary, c.accent1][Math.floor(Math.random() * 3)]
            : theme === 'kids'
              ? [c.primary, c.accent1, c.accent2][Math.floor(Math.random() * 3)]
              : [c.primary, c.secondary][Math.floor(Math.random() * 2)],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += dx * force * 0.03;
            p.y += dy * force * 0.03;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.15 * (1 - dist / 120);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme, c]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    />
  );
};

// Glowing Orbs Background
const GlowingOrbs = ({ theme = 'teen' }) => {
  const c = colors[theme];

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Primary orb */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.primary}40 0%, transparent 70%)`,
          top: '-200px',
          left: '-200px',
          filter: 'blur(60px)',
          animation: 'orbFloat 20s ease-in-out infinite',
        }}
      />
      {/* Secondary orb */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.secondary}40 0%, transparent 70%)`,
          bottom: '-150px',
          right: '-150px',
          filter: 'blur(60px)',
          animation: 'orbFloat 15s ease-in-out infinite reverse',
        }}
      />
      {/* Accent orb */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.accent1}30 0%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          animation: 'orbPulse 8s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

// Animated Logo
const AnimatedLogo = ({ theme = 'teen' }) => {
  const c = colors[theme];
  const f = fonts[theme];

  return (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h1
        style={{
          fontFamily: f.display,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          background: theme === 'teen'
            ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 50%, ${c.accent1} 100%)`
            : theme === 'kids'
              ? `linear-gradient(135deg, ${c.primary} 0%, ${c.accent1} 50%, ${c.accent2} 100%)`
              : `linear-gradient(135deg, ${c.primary} 0%, ${c.primaryLight} 100%)`,
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease-in-out infinite',
          letterSpacing: theme === 'teen' ? '2px' : '0',
          textShadow: 'none',
          margin: 0,
        }}
      >
        {theme === 'kids' ? '🎓 ' : ''}AI TUTOR
      </h1>
      <p
        style={{
          fontFamily: f.body,
          fontSize: '1.1rem',
          color: c.textMuted,
          marginTop: '8px',
          letterSpacing: '0.5px',
        }}
      >
        {theme === 'teen'
          ? 'Level Up Your Learning'
          : theme === 'kids'
            ? 'Learning is Fun!'
            : 'Excellence in Education'}
      </p>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

// Animated Mascot
const Mascot = ({ theme = 'teen' }) => {
  const c = colors[theme];
  const [message, setMessage] = useState(0);

  const messages = theme === 'teen'
    ? ['Ready to level up? ⚡', 'Welcome back, player! 🎮', 'Let\'s crush some goals! 🔥', 'Knowledge is power! 💎']
    : theme === 'kids'
      ? ['Hi friend! 👋', 'Let\'s learn together! 🌈', 'You\'re awesome! ⭐', 'Ready for fun? 🎉']
      : ['Welcome back.', 'Ready to learn?', 'Knowledge awaits.', 'Let\'s begin.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage((m) => (m + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const mascotEmoji = theme === 'teen' ? '🤖' : theme === 'kids' ? '🦊' : '📚';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Mascot */}
      <div
        style={{
          position: 'relative',
          fontSize: theme === 'kids' ? '100px' : '80px',
          animation: 'mascotBounce 3s ease-in-out infinite',
          filter: `drop-shadow(0 20px 40px ${c.primary}40)`,
        }}
      >
        {mascotEmoji}

        {/* Glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-30px',
            borderRadius: '50%',
            border: `2px solid ${c.primary}30`,
            animation: 'ringPulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Speech bubble */}
      <div
        style={{
          background: theme === 'teen'
            ? 'rgba(255,255,255,0.05)'
            : theme === 'kids'
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          padding: '16px 24px',
          borderRadius: theme === 'kids' ? '24px' : '16px',
          border: `1px solid ${c.primary}30`,
          position: 'relative',
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        <span
          key={message}
          style={{
            fontFamily: fonts[theme].body,
            fontSize: theme === 'kids' ? '1.1rem' : '1rem',
            fontWeight: 500,
            color: c.text,
            animation: 'textFade 3s ease-in-out infinite',
          }}
        >
          {messages[message]}
        </span>

        {/* Speech bubble arrow */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: `10px solid ${theme === 'kids' ? 'rgba(255,255,255,0.9)' : c.primary + '30'}`,
          }}
        />
      </div>

      <style>{`
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes textFade {
          0%, 20%, 80%, 100% { opacity: 1; }
          10%, 90% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// Main LoginView Component
const LoginView = ({ onLoginSuccess, onNavigateToRegister, theme = 'teen' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);

  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const sp = spacing[theme];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginStudent({ email, password });
    setLoading(false);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => onLoginSuccess(result.data.student), 1000);
    } else {
      setError(result.message);
      // Shake animation
      if (formRef.current) {
        formRef.current.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          if (formRef.current) formRef.current.style.animation = '';
        }, 500);
      }
    }
  };

  const styles = useMemo(() => ({
    page: {
      minHeight: '100vh',
      display: 'flex',
      background: c.bgGradient,
      fontFamily: f.body,
      overflow: 'hidden',
      position: 'relative',
    },
    leftPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      zIndex: 1,
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      zIndex: 1,
    },
    formContainer: {
      width: '100%',
      maxWidth: '440px',
      animation: showSuccess ? 'successPulse 1s ease-out forwards' : 'slideUp 0.8s ease-out',
    },
    card: {
      background: theme === 'teen'
        ? 'rgba(20, 20, 35, 0.8)'
        : theme === 'kids'
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(24, 24, 27, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: r.xl,
      padding: theme === 'kids' ? '48px 40px' : '40px 36px',
      border: `1px solid ${theme === 'teen' ? c.primary + '30' : 'rgba(255,255,255,0.2)'}`,
      boxShadow: sh.lg,
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      fontFamily: f.display,
      fontSize: theme === 'kids' ? '2rem' : '1.75rem',
      fontWeight: 700,
      color: c.text,
      textAlign: 'center',
      marginBottom: '8px',
    },
    subtitle: {
      fontFamily: f.body,
      fontSize: '1rem',
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: '32px',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontFamily: f.body,
      fontSize: '0.9rem',
      fontWeight: 600,
      color: c.text,
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      paddingLeft: '48px',
      background: theme === 'teen'
        ? 'rgba(255,255,255,0.05)'
        : theme === 'kids'
          ? 'rgba(255,255,255,0.8)'
          : 'rgba(255,255,255,0.05)',
      border: `2px solid ${focusedField ? c.primary : 'rgba(255,255,255,0.1)'}`,
      borderRadius: r.md,
      color: c.text,
      fontSize: '1rem',
      fontFamily: f.body,
      outline: 'none',
      transition: 'all 0.3s ease',
      boxShadow: focusedField ? `0 0 0 3px ${c.primary}20` : 'none',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1.25rem',
      pointerEvents: 'none',
    },
    error: {
      background: `${c.error}15`,
      border: `1px solid ${c.error}30`,
      color: c.error,
      padding: '12px 16px',
      borderRadius: r.md,
      marginBottom: '20px',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '28px 0',
      color: c.textMuted,
      fontSize: '0.85rem',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${c.textMuted}30, transparent)`,
    },
    registerLink: {
      textAlign: 'center',
      color: c.textMuted,
      fontSize: '0.95rem',
    },
    link: {
      color: c.primary,
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
  }), [theme, c, f, r, sh, sp, focusedField, showSuccess]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Quicksand:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); box-shadow: 0 0 60px ${c.success}50; }
          100% { transform: scale(0.95); opacity: 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: shimmer 4s infinite;
        }

        .link-hover:hover {
          color: ${c.primaryLight};
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        @media (max-width: 900px) {
          .login-page-container {
            flex-direction: column !important;
          }
          .left-panel {
            display: none !important;
          }
          .right-panel {
            padding: 20px !important;
          }
        }
      `}</style>

      <div className="login-page-container" style={styles.page}>
        {/* Background */}
        <div style={{ position: 'fixed', inset: 0, background: c.bgGradient, zIndex: -1 }} />
        <ParticleField theme={theme} />
        <GlowingOrbs theme={theme} />

        {/* Left Panel - Branding */}
        <div className="left-panel" style={styles.leftPanel}>
          <AnimatedLogo theme={theme} />
          <Mascot theme={theme} />
        </div>

        {/* Right Panel - Form */}
        <div className="right-panel" style={styles.rightPanel}>
          <div ref={formRef} style={styles.formContainer}>
            <div className="login-card" style={styles.card}>
              {/* Header */}
              <h2 style={styles.title}>
                {theme === 'kids' ? 'Welcome Back! 👋' : theme === 'teen' ? 'Login' : 'Sign In'}
              </h2>
              <p style={styles.subtitle}>
                {theme === 'kids'
                  ? 'Enter your details to start learning!'
                  : 'Continue your learning journey'}
              </p>

              {/* Error */}
              {error && (
                <div style={styles.error}>
                  <span>{theme === 'kids' ? '😢' : '⚠️'}</span>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {theme === 'kids' ? '📧 Email' : 'Email Address'}
                  </label>
                  <div style={styles.inputWrapper}>
                    <span style={{
                      ...styles.inputIcon,
                      color: focusedField === 'email' ? c.primary : c.textMuted,
                    }}>
                      {theme === 'kids' ? '✉️' : '📧'}
                    </span>
                    <input
                      type="email"
                      placeholder={theme === 'kids' ? 'your.email@example.com' : 'Enter your email'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={{
                        ...styles.input,
                        borderColor: focusedField === 'email' ? c.primary : (theme === 'teen' ? 'rgba(255,255,255,0.15)' : c.primaryLight),
                        boxShadow: focusedField === 'email' ? `0 0 0 3px ${c.primary}20` : 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {theme === 'kids' ? '🔐 Password' : 'Password'}
                  </label>
                  <div style={styles.inputWrapper}>
                    <span style={{
                      ...styles.inputIcon,
                      color: focusedField === 'password' ? c.primary : c.textMuted,
                    }}>
                      {theme === 'kids' ? '🔒' : '🔐'}
                    </span>
                    <input
                      type="password"
                      placeholder={theme === 'kids' ? 'Your secret password' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={{
                        ...styles.input,
                        borderColor: focusedField === 'password' ? c.primary : (theme === 'teen' ? 'rgba(255,255,255,0.15)' : c.primaryLight),
                        boxShadow: focusedField === 'password' ? `0 0 0 3px ${c.primary}20` : 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  theme={theme}
                  fullWidth
                  loading={loading}
                  glow
                  style={{ marginTop: '8px' }}
                >
                  {loading
                    ? 'Signing In...'
                    : theme === 'kids'
                      ? "🚀 Let's Go!"
                      : theme === 'teen'
                        ? '⚡ LOGIN'
                        : 'Sign In →'}
                </Button>
              </form>

              {/* Divider */}
              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <span style={{ padding: '0 16px' }}>
                  {theme === 'kids' ? 'New here?' : 'New to AI Tutor?'}
                </span>
                <div style={styles.dividerLine} />
              </div>

              {/* Register Link */}
              <p style={styles.registerLink}>
                {theme === 'kids' ? 'Join the fun! ' : 'Start your journey today. '}
                <span
                  className="link-hover"
                  onClick={onNavigateToRegister}
                  style={styles.link}
                >
                  {theme === 'kids' ? 'Create Account ✨' : theme === 'teen' ? 'Create Account' : 'Register →'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginView;
