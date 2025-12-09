import React, { useEffect, useState, useRef } from 'react';
import soundManager from '../SoundManager';

const DashboardView = ({ gameState, generateLearningRoadmap, loading, learningPlan, theme = 'teen' }) => {
  const [animatedCoins, setAnimatedCoins] = useState(0);
  const [animatedQuizzes, setAnimatedQuizzes] = useState(0);
  const [animatedVideos, setAnimatedVideos] = useState(0);
  const prevCoinsRef = useRef(gameState.total_coins_earned);

  // Initialize sound manager with theme
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Smooth number animation
  useEffect(() => {
    const animateValue = (start, end, setter, duration = 1000) => {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setter(Math.floor(start + (end - start) * easeOut));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    animateValue(0, gameState.videos_watched, setAnimatedVideos);
    animateValue(0, gameState.quizzes_completed, setAnimatedQuizzes);
    animateValue(0, gameState.total_coins_earned, setAnimatedCoins);
  }, [gameState.videos_watched, gameState.quizzes_completed, gameState.total_coins_earned]);

  // Play coin sound when coins increase
  useEffect(() => {
    if (gameState.total_coins_earned > prevCoinsRef.current) {
      soundManager.playCoinSound();
    }
    prevCoinsRef.current = gameState.total_coins_earned;
  }, [gameState.total_coins_earned]);

  // Clean Duolingo-inspired theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#58CC02',
          secondary: '#1CB0F6',
          accent: '#FF9600',
          background: '#f7f7f7',
          cardBg: '#ffffff',
          borderColor: '#e5e5e5',
          textPrimary: '#3c3c3c',
          textSecondary: '#777777',
          streakColor: '#FF9600',
          coinsColor: '#FFC800',
          borderRadius: '16px',
        };
      case 'teen':
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          background: '#131F24',
          cardBg: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.1)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255,255,255,0.6)',
          streakColor: '#FF9600',
          coinsColor: '#FFC800',
          borderRadius: '16px',
        };
      case 'mature':
      default:
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          background: '#1a1a1a',
          cardBg: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.08)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255,255,255,0.5)',
          streakColor: '#FF9600',
          coinsColor: '#FFC800',
          borderRadius: '12px',
        };
    }
  };

  const themeStyles = getThemeStyles();
  const isLightTheme = theme === 'kids';

  // Daily progress
  const dailyGoal = 5;
  const dailyProgress = Math.min(
    ((gameState.videos_watched + gameState.quizzes_completed) / dailyGoal) * 100,
    100
  );

  // Stat Card Component
  const StatCard = ({ icon, value, label, color }) => (
    <div style={{
      background: themeStyles.cardBg,
      border: `1px solid ${themeStyles.borderColor}`,
      borderRadius: themeStyles.borderRadius,
      padding: '24px 20px',
      textAlign: 'center',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontSize: '28px',
        fontWeight: '800',
        color: color,
        marginBottom: '4px'
      }}>
        {value.toLocaleString()}
      </div>
      <div style={{
        fontSize: '13px',
        color: themeStyles.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </div>
    </div>
  );

  // Achievement Badge
  const Badge = ({ icon, label, unlocked }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      opacity: unlocked ? 1 : 0.4,
      filter: unlocked ? 'none' : 'grayscale(100%)',
      transition: 'all 0.3s ease'
    }}
      title={label}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: unlocked
          ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`
          : isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        boxShadow: unlocked ? `0 4px 12px ${themeStyles.primary}40` : 'none'
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: '600',
        color: themeStyles.textSecondary,
        textAlign: 'center',
        maxWidth: '70px'
      }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="content-section">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dashboard-card {
          animation: fadeIn 0.4s ease-out;
          animation-fill-mode: both;
        }
        
        .dashboard-card:nth-child(1) { animation-delay: 0s; }
        .dashboard-card:nth-child(2) { animation-delay: 0.1s; }
        .dashboard-card:nth-child(3) { animation-delay: 0.2s; }
      `}</style>

      {/* Header with Streak */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{
            color: themeStyles.textPrimary,
            fontSize: '1.6rem',
            fontWeight: '700',
            marginBottom: '4px'
          }}>
            👋 Welcome back!
          </h2>
          <p style={{
            color: themeStyles.textSecondary,
            fontSize: '15px',
            margin: 0
          }}>
            Keep up the great work on your learning journey
          </p>
        </div>

        {gameState.streak_days > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, ${themeStyles.streakColor}20, ${themeStyles.streakColor}10)`,
            border: `1px solid ${themeStyles.streakColor}30`,
            padding: '10px 18px',
            borderRadius: '24px'
          }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <span style={{
              fontWeight: '700',
              color: themeStyles.streakColor,
              fontSize: '15px'
            }}>
              {gameState.streak_days} Day Streak!
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="dashboard-card" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard
          icon="📺"
          value={animatedVideos}
          label="Videos"
          color={themeStyles.primary}
        />
        <StatCard
          icon="🎯"
          value={animatedQuizzes}
          label="Quizzes"
          color={themeStyles.secondary}
        />
        <StatCard
          icon="🪙"
          value={animatedCoins}
          label="Coins"
          color={themeStyles.coinsColor}
        />
      </div>

      {/* Daily Goal Progress */}
      <div className="dashboard-card" style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.borderColor}`,
        borderRadius: themeStyles.borderRadius,
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            color: themeStyles.textPrimary,
            fontSize: '16px',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 Daily Goal
          </h3>
          <span style={{
            color: dailyProgress === 100 ? themeStyles.secondary : themeStyles.textSecondary,
            fontWeight: '700',
            fontSize: '15px'
          }}>
            {dailyProgress === 100 && '✅ '}
            {gameState.videos_watched + gameState.quizzes_completed}/{dailyGoal}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '12px',
          background: isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          <div style={{
            height: '100%',
            width: `${dailyProgress}%`,
            background: dailyProgress === 100
              ? themeStyles.secondary
              : `linear-gradient(90deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
            borderRadius: '6px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>

        <p style={{
          color: themeStyles.textSecondary,
          fontSize: '14px',
          margin: 0
        }}>
          Complete {dailyGoal} activities daily to earn bonus coins! 🪙
        </p>
      </div>

      {/* Action Button */}
      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <button
          onClick={() => {
            soundManager.playClickSound();
            generateLearningRoadmap();
          }}
          disabled={loading.roadmap}
          style={{
            width: '100%',
            padding: '18px 32px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '17px',
            fontWeight: '700',
            cursor: loading.roadmap ? 'not-allowed' : 'pointer',
            background: loading.roadmap
              ? (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)')
              : themeStyles.primary,
            color: loading.roadmap ? themeStyles.textSecondary : 'white',
            boxShadow: loading.roadmap
              ? 'none'
              : `0 4px 0 0 #1890d0, 0 8px 16px rgba(28, 176, 246, 0.3)`,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading.roadmap) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          {loading.roadmap ? '🔄 Generating...' : '📋 Create My Learning Plan'}
        </button>
      </div>

      {/* Learning Plan Display */}
      {learningPlan !== 'Click to generate your plan!' && (
        <div className="dashboard-card" style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.borderColor}`,
          borderRadius: themeStyles.borderRadius,
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            color: themeStyles.textPrimary,
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Your Learning Plan
          </h3>
          <p style={{
            color: themeStyles.textSecondary,
            fontSize: '15px',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}>
            {learningPlan}
          </p>
        </div>
      )}

      {/* Achievements */}
      <div className="dashboard-card" style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.borderColor}`,
        borderRadius: themeStyles.borderRadius,
        padding: '24px'
      }}>
        <h3 style={{
          color: themeStyles.textPrimary,
          fontSize: '16px',
          fontWeight: '700',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🏆 Achievements
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <Badge icon="⭐" label="First Steps" unlocked={gameState.quizzes_completed >= 1} />
          <Badge icon="🎯" label="Quiz Master" unlocked={gameState.quizzes_completed >= 5} />
          <Badge icon="📺" label="Video Fan" unlocked={gameState.videos_watched >= 3} />
          <Badge icon="🔥" label="On Fire" unlocked={gameState.streak_days >= 3} />
          <Badge icon="💰" label="Coin Collector" unlocked={gameState.total_coins_earned >= 500} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
