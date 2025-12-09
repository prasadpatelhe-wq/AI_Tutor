import React, { useEffect, useState, useRef } from 'react';
import soundManager from '../SoundManager';

const DashboardView = ({ gameState, generateLearningRoadmap, loading, learningPlan, theme = 'teen' }) => {
  const [animatedCoins, setAnimatedCoins] = useState(0);
  const [animatedQuizzes, setAnimatedQuizzes] = useState(0);
  const [animatedVideos, setAnimatedVideos] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevCoinsRef = useRef(gameState.total_coins_earned);

  // Initialize sound manager with theme
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Animate numbers on mount and when values change
  useEffect(() => {
    const animateValue = (start, end, setter, duration = 1000) => {
      const increment = (end - start) / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    animateValue(0, gameState.videos_watched, setAnimatedVideos);
    animateValue(0, gameState.quizzes_completed, setAnimatedQuizzes);
    animateValue(0, gameState.total_coins_earned, setAnimatedCoins);
  }, [gameState.videos_watched, gameState.quizzes_completed, gameState.total_coins_earned]);

  // Play coin sound when coins increase
  useEffect(() => {
    if (gameState.total_coins_earned > prevCoinsRef.current) {
      soundManager.playCoinSound();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    prevCoinsRef.current = gameState.total_coins_earned;
  }, [gameState.total_coins_earned]);

  // Theme-based styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          cardGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)',
          statBg1: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(255, 142, 83, 0.2))',
          statBg2: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(129, 236, 236, 0.2))',
          statBg3: 'linear-gradient(135deg, rgba(255, 230, 109, 0.2), rgba(255, 183, 77, 0.2))',
          textColor: '#ff6b9d',
          accentColor: '#4ecdc4',
          progressColor: '#FF6B9D',
          headerEmoji: '🌈✨',
          particleEmojis: ['⭐', '🌟', '✨', '🎈', '🌸', '🦋'],
        };
      case 'teen':
        return {
          cardGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          statBg1: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))',
          statBg2: 'linear-gradient(135deg, rgba(72, 187, 120, 0.15), rgba(104, 211, 145, 0.15))',
          statBg3: 'linear-gradient(135deg, rgba(237, 137, 54, 0.15), rgba(255, 183, 77, 0.15))',
          textColor: '#667eea',
          accentColor: '#764ba2',
          progressColor: '#667eea',
          headerEmoji: '⚡🎮',
          particleEmojis: ['✨', '💫', '🔥', '⚡'],
        };
      case 'mature':
      default:
        return {
          cardGradient: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
          statBg1: 'rgba(255, 255, 255, 0.05)',
          statBg2: 'rgba(255, 255, 255, 0.05)',
          statBg3: 'rgba(255, 255, 255, 0.05)',
          textColor: '#38B2AC',
          accentColor: '#4A5568',
          progressColor: '#38B2AC',
          headerEmoji: '',
          particleEmojis: [],
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Confetti particles
  const renderConfetti = () => {
    if (!showConfetti || themeStyles.particleEmojis.length === 0) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${Math.random() * 20 + 15}px`,
              left: `${Math.random() * 100}%`,
              top: '-50px',
              animation: `confettiFall ${Math.random() * 2 + 2}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
              opacity: 0.8
            }}
          >
            {themeStyles.particleEmojis[Math.floor(Math.random() * themeStyles.particleEmojis.length)]}
          </span>
        ))}
      </div>
    );
  };

  // Progress ring component
  const ProgressRing = ({ progress, color, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
    );
  };

  // Stat card component
  const StatCard = ({ icon, value, label, background, delay = 0 }) => (
    <div
      style={{
        textAlign: 'center',
        padding: theme === 'kids' ? '25px 20px' : '20px 15px',
        background,
        borderRadius: theme === 'kids' ? '25px' : theme === 'teen' ? '20px' : '12px',
        position: 'relative',
        overflow: 'hidden',
        animation: `slideUp 0.6s ease-out ${delay}s both`,
        transform: 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        border: theme === 'mature' ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: theme === 'kids'
          ? '0 10px 30px rgba(255, 107, 157, 0.2)'
          : theme === 'teen'
            ? '0 8px 25px rgba(102, 126, 234, 0.2)'
            : '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = theme === 'kids'
          ? 'translateY(-8px) scale(1.05)'
          : 'translateY(-4px) scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <div style={{
        fontSize: theme === 'kids' ? '36px' : '28px',
        marginBottom: '10px',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: theme === 'kids' ? '32px' : '28px',
        fontWeight: 'bold',
        color: themeStyles.textColor,
        marginBottom: '5px',
        fontFamily: theme === 'kids' ? "'Fredoka One', cursive" : 'inherit'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: theme === 'kids' ? '14px' : '13px',
        color: theme === 'mature' ? '#A0AEC0' : '#666',
        fontWeight: '500'
      }}>
        {label}
      </div>
    </div>
  );

  // Daily progress calculation
  const dailyGoal = 5;
  const dailyProgress = Math.min(
    ((gameState.videos_watched + gameState.quizzes_completed) / dailyGoal) * 100,
    100
  );

  return (
    <div className="content-section" style={{ position: 'relative' }}>
      {/* Confetti animation */}
      {renderConfetti()}

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes floatBg {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
      `}</style>

      {/* Welcome Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '35px',
        animation: 'slideUp 0.5s ease-out'
      }}>
        <h3 style={{
          background: theme === 'kids'
            ? 'linear-gradient(135deg, #ff6b9d, #4ecdc4, #ffe66d)'
            : theme === 'teen'
              ? 'linear-gradient(135deg, #667eea, #764ba2, #4fd1c5)'
              : 'none',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: theme !== 'mature' ? 'text' : 'unset',
          WebkitTextFillColor: theme !== 'mature' ? 'transparent' : 'inherit',
          backgroundClip: theme !== 'mature' ? 'text' : 'unset',
          animation: theme !== 'mature' ? 'shimmer 3s linear infinite' : 'none',
          fontSize: theme === 'kids' ? '2rem' : '1.6rem',
          fontWeight: '700',
          margin: 0
        }}>
          {themeStyles.headerEmoji} Welcome to Your Learning Dashboard! {themeStyles.headerEmoji}
        </h3>
      </div>

      {/* Main Dashboard Card */}
      <div className="kid-card" style={{
        animation: 'slideUp 0.6s ease-out 0.1s both'
      }}>
        <h4 style={{
          color: themeStyles.textColor,
          marginBottom: '25px',
          fontSize: theme === 'kids' ? '1.3rem' : '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          📊 Your Daily Progress
          {gameState.streak_days > 0 && (
            <span style={{
              background: 'linear-gradient(135deg, #f7971e, #ffd200)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: '#8B4513',
              fontWeight: '600',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              🔥 {gameState.streak_days} Day Streak!
            </span>
          )}
        </h4>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <StatCard
            icon="📺"
            value={animatedVideos}
            label="Videos Watched"
            background={themeStyles.statBg1}
            delay={0}
          />
          <StatCard
            icon="🎯"
            value={animatedQuizzes}
            label="Quizzes Completed"
            background={themeStyles.statBg2}
            delay={0.1}
          />
          <StatCard
            icon="🪙"
            value={animatedCoins}
            label="Total Coins"
            background={themeStyles.statBg3}
            delay={0.2}
          />
        </div>

        {/* Daily Goal Progress Bar */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: theme === 'mature' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
          borderRadius: theme === 'kids' ? '20px' : '12px',
          border: theme === 'mature' ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            alignItems: 'center'
          }}>
            <span style={{
              fontWeight: '600',
              color: themeStyles.textColor,
              fontSize: theme === 'kids' ? '1rem' : '0.95rem'
            }}>
              🎯 Daily Goal
            </span>
            <span style={{
              fontWeight: '700',
              color: dailyProgress === 100 ? '#48BB78' : themeStyles.textColor,
              fontSize: theme === 'kids' ? '1.1rem' : '1rem'
            }}>
              {Math.round(dailyProgress)}%
              {dailyProgress === 100 && ' ✅'}
            </span>
          </div>
          <div style={{
            height: theme === 'kids' ? '16px' : '12px',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${dailyProgress}%`,
              background: `linear-gradient(90deg, ${themeStyles.progressColor}, ${themeStyles.accentColor})`,
              borderRadius: '20px',
              transition: 'width 1s ease-out',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s linear infinite'
              }} />
            </div>
          </div>
          <p style={{
            marginTop: '10px',
            fontSize: '0.85rem',
            color: theme === 'mature' ? '#A0AEC0' : '#666',
            textAlign: 'center'
          }}>
            Complete {dailyGoal} activities today to earn bonus coins!
            ({gameState.videos_watched + gameState.quizzes_completed}/{dailyGoal})
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="button-group" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
        <button
          className="success-button"
          onClick={generateLearningRoadmap}
          disabled={loading.roadmap}
          style={{
            animation: loading.roadmap ? 'none' : 'glow 2s ease-in-out infinite'
          }}
        >
          {loading.roadmap ? '🔄 Generating Plan...' : '🎯 Create My Learning Plan!'}
        </button>
      </div>

      {/* Learning Plan Display */}
      {learningPlan !== 'Click to generate your plan!' && (
        <div className="kid-card" style={{
          animation: 'slideUp 0.6s ease-out',
          marginTop: '20px'
        }}>
          <h4 style={{
            color: themeStyles.textColor,
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Your Learning Plan
          </h4>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: theme === 'mature' ? '#E2E8F0' : '#555',
            whiteSpace: 'pre-wrap'
          }}>
            {learningPlan}
          </p>
        </div>
      )}

      {/* Achievements Preview */}
      <div className="kid-card" style={{
        animation: 'slideUp 0.6s ease-out 0.4s both',
        marginTop: '20px'
      }}>
        <h4 style={{
          color: themeStyles.textColor,
          marginBottom: '20px'
        }}>
          🏆 Recent Achievements
        </h4>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { icon: '⭐', label: 'First Steps', unlocked: gameState.quizzes_completed >= 1 },
            { icon: '🎯', label: 'Quiz Master', unlocked: gameState.quizzes_completed >= 5 },
            { icon: '📺', label: 'Video Fan', unlocked: gameState.videos_watched >= 3 },
            { icon: '🔥', label: 'On Fire', unlocked: gameState.streak_days >= 3 },
            { icon: '💰', label: 'Coin Collector', unlocked: gameState.total_coins_earned >= 500 },
          ].map((badge, i) => (
            <div
              key={i}
              style={{
                width: theme === 'kids' ? '80px' : '70px',
                height: theme === 'kids' ? '80px' : '70px',
                borderRadius: '50%',
                background: badge.unlocked
                  ? themeStyles.cardGradient
                  : 'rgba(128,128,128,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: badge.unlocked ? 1 : 0.4,
                filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                boxShadow: badge.unlocked
                  ? `0 5px 20px ${themeStyles.textColor}40`
                  : 'none'
              }}
              title={badge.label}
            >
              <span style={{ fontSize: theme === 'kids' ? '28px' : '24px' }}>
                {badge.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
