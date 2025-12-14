/**
 * RegisterView - Stunning Redesign
 * Beautiful multi-step registration with theme-aware design
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { registerStudent } from '../api';
import { fetchGrades, fetchBoards, fetchLanguages } from '../meta';
import { colors, fonts, radius, shadows, animations, spacing } from '../design/tokens';
import Button from '../components/ui/Button';

// Geometric Background Pattern
const GeometricBackground = ({ theme = 'teen' }) => {
  const c = colors[theme];

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Gradient mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: c.bgGradient,
        }}
      />

      {/* Floating shapes */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderRadius: i % 2 === 0 ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '50%',
            background: `linear-gradient(135deg, ${c.primary}15 0%, ${c.secondary}15 100%)`,
            left: `${(i * 20) % 80}%`,
            top: `${(i * 15) % 70}%`,
            animation: `shapeFloat ${15 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * -2}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Grid overlay for teen theme */}
      {theme === 'teen' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${c.primary}08 1px, transparent 1px),
              linear-gradient(90deg, ${c.primary}08 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}

      <style>{`
        @keyframes shapeFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(-20px, 20px) rotate(180deg); }
          75% { transform: translate(20px, 10px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
};

// Progress Steps Indicator
const ProgressSteps = ({ currentStep, theme = 'teen' }) => {
  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];

  const steps = [
    { icon: theme === 'kids' ? '👤' : '◎', label: 'Account' },
    { icon: theme === 'kids' ? '🔐' : '◈', label: 'Security' },
    { icon: theme === 'kids' ? '🎓' : '◉', label: 'Profile' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '40px',
    }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: theme === 'kids' ? '56px' : '48px',
                height: theme === 'kids' ? '56px' : '48px',
                borderRadius: theme === 'kids' ? r.lg : r.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: theme === 'kids' ? '1.5rem' : '1.25rem',
                fontFamily: f.display,
                fontWeight: 700,
                background: i <= currentStep
                  ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`
                  : 'rgba(255,255,255,0.1)',
                color: i <= currentStep ? c.textOnPrimary : c.textMuted,
                border: i === currentStep
                  ? `2px solid ${c.accent1}`
                  : '2px solid transparent',
                boxShadow: i <= currentStep
                  ? theme === 'teen'
                    ? `0 0 20px ${c.primary}50`
                    : `0 8px 25px ${c.primary}40`
                  : 'none',
                transition: 'all 0.4s ease',
                transform: i === currentStep ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {step.icon}
            </div>
            <span
              style={{
                fontFamily: f.body,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: i <= currentStep ? c.text : c.textMuted,
                textTransform: theme === 'teen' ? 'uppercase' : 'none',
                letterSpacing: theme === 'teen' ? '0.5px' : '0',
              }}
            >
              {step.label}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div
              style={{
                width: '60px',
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: r.full,
                overflow: 'hidden',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  width: i < currentStep ? '100%' : '0%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
                  borderRadius: r.full,
                  transition: 'width 0.5s ease',
                  boxShadow: theme === 'teen' ? `0 0 10px ${c.primary}` : 'none',
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Feature Cards on left side
const FeatureShowcase = ({ theme = 'teen' }) => {
  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];

  const features = [
    {
      icon: theme === 'kids' ? '🎯' : '⚡',
      title: theme === 'kids' ? 'Fun Quizzes' : 'Smart Quizzes',
      desc: theme === 'kids' ? 'Play and learn!' : 'AI-powered assessments',
    },
    {
      icon: theme === 'kids' ? '🎬' : '📡',
      title: theme === 'kids' ? 'Cool Videos' : 'Video Learning',
      desc: theme === 'kids' ? 'Watch and discover' : 'Curated content',
    },
    {
      icon: theme === 'kids' ? '🤖' : '🤖',
      title: theme === 'kids' ? 'Robot Helper' : 'AI Tutor',
      desc: theme === 'kids' ? 'Ask anything!' : '24/7 assistance',
    },
    {
      icon: theme === 'kids' ? '🏆' : '💎',
      title: theme === 'kids' ? 'Win Prizes' : 'Earn Rewards',
      desc: theme === 'kids' ? 'Collect coins!' : 'Track achievements',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginTop: '40px',
    }}>
      {features.map((feature, i) => (
        <div
          key={i}
          style={{
            background: theme === 'teen'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: r.md,
            padding: '20px',
            border: `1px solid ${theme === 'teen' ? c.primary + '20' : c.primaryLight}`,
            animation: `featureFade 0.6s ease-out ${i * 0.1}s both`,
          }}
        >
          <div style={{ fontSize: theme === 'kids' ? '2rem' : '1.5rem', marginBottom: '8px' }}>
            {feature.icon}
          </div>
          <div style={{
            fontFamily: f.display,
            fontSize: theme === 'kids' ? '1rem' : '0.9rem',
            fontWeight: 600,
            color: c.text,
            marginBottom: '4px',
          }}>
            {feature.title}
          </div>
          <div style={{
            fontFamily: f.body,
            fontSize: '0.8rem',
            color: c.textMuted,
          }}>
            {feature.desc}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes featureFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Celebration Animation
const Celebration = ({ theme = 'teen' }) => {
  const c = colors[theme];
  const emojis = theme === 'kids'
    ? ['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎈', '🦋', '🌈']
    : ['✨', '⚡', '💎', '🔥', '✓', '★'];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {emojis.map((emoji, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            fontSize: theme === 'kids' ? '40px' : '30px',
            left: `${10 + Math.random() * 80}%`,
            animation: `confettiFall ${1 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          {emoji}
        </span>
      ))}

      {/* Success flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle, ${c.success}30 0%, transparent 70%)`,
          animation: 'successFlash 1s ease-out forwards',
        }}
      />

      <style>{`
        @keyframes confettiFall {
          0% { top: -50px; opacity: 1; transform: rotate(0deg) scale(1); }
          100% { top: 100vh; opacity: 0; transform: rotate(720deg) scale(0.5); }
        }
        @keyframes successFlash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Main RegisterView Component
const RegisterView = ({ onRegisterSuccess, onNavigateToLogin, theme = 'teen' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade_id: '',
    board_id: '',
    language_id: '',
    grade_band: '',
    board: '',
    medium: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [boards, setBoards] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const formRef = useRef(null);

  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const sp = spacing[theme];

  // Fetch metadata
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        const [g, b, langs] = await Promise.all([fetchGrades(), fetchBoards(), fetchLanguages()]);

        const gradeData = g.data || [];
        const boardData = b.data || [];
        const langData = langs.data || [];

        setGrades(gradeData);
        setBoards(boardData);
        setLanguages(langData);

        setFormData(prev => ({
          ...prev,
          grade_id: gradeData.length > 0 ? gradeData[0].id : '',
          board_id: boardData.length > 0 ? boardData[0].id : '',
          language_id: langData.length > 0 ? langData[0].id : '',
          grade_band: gradeData.length > 0 ? gradeData[0].name : '',
          board: boardData.length > 0 ? boardData[0].name : '',
          medium: langData.length > 0 ? langData[0].name : ''
        }));
      } catch (err) {
        console.error("Failed to load metadata", err);
        setError("Failed to load options. Please refresh.");
      } finally {
        setMetaLoading(false);
      }
    };
    loadMeta();
  }, []);

  // Update progress step
  useEffect(() => {
    if (formData.name && formData.email) {
      if (formData.password && formData.confirmPassword) {
        if (formData.grade_band && formData.board) {
          setCurrentStep(2);
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

  const handleBoardChange = (e) => {
    const selectedId = e.target.value;
    const selectedBoard = boards.find(b => String(b.id) === String(selectedId));
    setFormData(prev => ({
      ...prev,
      board_id: selectedId,
      board: selectedBoard?.name || ''
    }));
  };

  const handleGradeChange = (e) => {
    const selectedId = e.target.value;
    const selectedGrade = grades.find(g => String(g.id) === String(selectedId));
    setFormData(prev => ({
      ...prev,
      grade_id: selectedId,
      grade_band: selectedGrade?.name || ''
    }));
  };

  const handleLanguageChange = (e) => {
    const selectedId = e.target.value;
    const selectedLang = languages.find(l => String(l.id) === String(selectedId));
    setFormData(prev => ({
      ...prev,
      language_id: selectedId,
      medium: selectedLang?.name || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      if (formRef.current) {
        formRef.current.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          if (formRef.current) formRef.current.style.animation = '';
        }, 500);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await registerStudent(formData);
      if (result.success) {
        setShowCelebration(true);
        setTimeout(() => onRegisterSuccess(), 2000);
      } else {
        setError(result.message);
        if (formRef.current) {
          formRef.current.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            if (formRef.current) formRef.current.style.animation = '';
          }, 500);
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(() => ({
    page: {
      minHeight: '100vh',
      display: 'flex',
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
      flex: 1.1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      zIndex: 1,
      overflowY: 'auto',
    },
    branding: {
      textAlign: 'center',
    },
    logo: {
      fontFamily: f.display,
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
      fontWeight: 800,
      background: `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 50%, ${c.accent1} 100%)`,
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 4s ease-in-out infinite',
      marginBottom: '8px',
    },
    tagline: {
      fontFamily: f.body,
      fontSize: '1rem',
      color: c.textMuted,
    },
    formContainer: {
      width: '100%',
      maxWidth: '480px',
      animation: showCelebration ? 'successScale 1s ease-out forwards' : 'slideIn 0.8s ease-out',
    },
    card: {
      background: theme === 'teen'
        ? 'rgba(20, 20, 35, 0.85)'
        : theme === 'kids'
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(24, 24, 27, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: r.xl,
      padding: theme === 'kids' ? '40px 36px' : '36px 32px',
      border: `1px solid ${theme === 'teen' ? c.primary + '30' : 'rgba(255,255,255,0.2)'}`,
      boxShadow: sh.lg,
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      fontFamily: f.display,
      fontSize: theme === 'kids' ? '1.75rem' : '1.5rem',
      fontWeight: 700,
      color: c.text,
      textAlign: 'center',
      marginBottom: '4px',
    },
    subtitle: {
      fontFamily: f.body,
      fontSize: '0.9rem',
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: '24px',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: f.body,
      fontSize: '0.85rem',
      fontWeight: 600,
      color: c.text,
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      background: theme === 'teen'
        ? 'rgba(255,255,255,0.08)'
        : theme === 'kids'
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(255,255,255,0.05)',
      border: `2px solid ${theme === 'teen' ? 'rgba(255,255,255,0.15)' : c.primaryLight}`,
      borderRadius: r.md,
      color: c.text,
      fontSize: '0.95rem',
      fontFamily: f.body,
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      background: theme === 'teen'
        ? 'rgba(255,255,255,0.08)'
        : theme === 'kids'
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(255,255,255,0.05)',
      border: `2px solid ${theme === 'teen' ? 'rgba(255,255,255,0.15)' : c.primaryLight}`,
      borderRadius: r.md,
      color: c.text,
      fontSize: '0.95rem',
      fontFamily: f.body,
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(c.textMuted)}' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '20px',
      transition: 'all 0.3s ease',
    },
    error: {
      background: `${c.error}15`,
      border: `1px solid ${c.error}30`,
      color: c.error,
      padding: '12px 16px',
      borderRadius: r.md,
      marginBottom: '20px',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '24px',
      color: c.textMuted,
      fontSize: '0.9rem',
    },
    link: {
      color: c.primary,
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
  }), [theme, c, f, r, sh, showCelebration]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Quicksand:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes successScale {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); box-shadow: 0 0 60px ${c.success}50; }
          100% { transform: scale(0.95); opacity: 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .form-input:focus, .form-select:focus {
          border-color: ${c.primary} !important;
          box-shadow: 0 0 0 3px ${c.primary}20;
        }

        .form-select option {
          background: ${theme === 'teen' ? '#1a1a2e' : '#fff'};
          color: ${theme === 'teen' ? '#fff' : '#333'};
          padding: 12px;
        }

        .link-hover:hover {
          color: ${c.primaryLight};
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        @media (max-width: 900px) {
          .register-page-container {
            flex-direction: column !important;
          }
          .left-panel-hide {
            display: none !important;
          }
          .right-panel-full {
            padding: 20px !important;
          }
        }
      `}</style>

      <div className="register-page-container" style={styles.page}>
        {showCelebration && <Celebration theme={theme} />}
        <GeometricBackground theme={theme} />

        {/* Left Panel */}
        <div className="left-panel-hide" style={styles.leftPanel}>
          <div style={styles.branding}>
            <h1 style={styles.logo}>
              {theme === 'kids' ? '🎓 ' : ''}AI TUTOR
            </h1>
            <p style={styles.tagline}>
              {theme === 'teen'
                ? 'Join the Learning Revolution'
                : theme === 'kids'
                  ? 'Start Your Adventure!'
                  : 'Begin Your Journey'}
            </p>
          </div>

          <FeatureShowcase theme={theme} />
        </div>

        {/* Right Panel - Form */}
        <div className="right-panel-full" style={styles.rightPanel}>
          <div ref={formRef} style={styles.formContainer}>
            <div style={styles.card}>
              {/* Progress */}
              <ProgressSteps currentStep={currentStep} theme={theme} />

              {/* Header */}
              <h2 style={styles.title}>
                {theme === 'kids' ? 'Join the Fun! ✨' : theme === 'teen' ? 'Create Account' : 'Register'}
              </h2>
              <p style={styles.subtitle}>
                {theme === 'kids'
                  ? 'Fill in your details to start learning!'
                  : 'Set up your learning profile'}
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
                {/* Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span>{theme === 'kids' ? '👤' : '◎'}</span>
                    {theme === 'kids' ? 'Your Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder={theme === 'kids' ? 'What\'s your name?' : 'Enter your name'}
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      ...styles.input,
                      borderColor: focusedField === 'name' ? c.primary : styles.input.border.split(' ')[2],
                    }}
                  />
                </div>

                {/* Email */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span>{theme === 'kids' ? '📧' : '◎'}</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      ...styles.input,
                      borderColor: focusedField === 'email' ? c.primary : styles.input.border.split(' ')[2],
                    }}
                  />
                </div>

                {/* Password row */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span>{theme === 'kids' ? '🔐' : '◈'}</span>
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span>{theme === 'kids' ? '🔒' : '◈'}</span>
                      Confirm
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                {/* Board & Grade row */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span>{theme === 'kids' ? '🏫' : '◉'}</span>
                      Board
                    </label>
                    <select
                      name="board_id"
                      className="form-select"
                      value={formData.board_id}
                      onChange={handleBoardChange}
                      required
                      style={styles.select}
                    >
                      <option value="" disabled>{metaLoading ? 'Loading...' : 'Select Board'}</option>
                      {boards.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span>{theme === 'kids' ? '🎓' : '◉'}</span>
                      Grade
                    </label>
                    <select
                      name="grade_id"
                      className="form-select"
                      value={formData.grade_id}
                      onChange={handleGradeChange}
                      required
                      style={styles.select}
                    >
                      <option value="" disabled>{metaLoading ? 'Loading...' : 'Select Grade'}</option>
                      {grades.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Language */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span>{theme === 'kids' ? '🗣️' : '◉'}</span>
                    Language
                  </label>
                  <select
                    name="language_id"
                    className="form-select"
                    value={formData.language_id}
                    onChange={handleLanguageChange}
                    required
                    style={styles.select}
                  >
                    <option value="" disabled>{metaLoading ? 'Loading...' : 'Select Language'}</option>
                    {languages.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
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
                    ? 'Creating Account...'
                    : theme === 'kids'
                      ? "🚀 Let's Go!"
                      : theme === 'teen'
                        ? '⚡ CREATE ACCOUNT'
                        : 'Create Account →'}
                </Button>
              </form>

              {/* Login link */}
              <p style={styles.loginLink}>
                Already have an account?{' '}
                <span
                  className="link-hover"
                  onClick={onNavigateToLogin}
                  style={styles.link}
                >
                  {theme === 'kids' ? 'Sign In 🔑' : theme === 'teen' ? 'Sign In' : 'Sign In →'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
