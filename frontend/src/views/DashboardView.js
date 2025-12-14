import React, { useEffect, useState, useRef } from 'react';
import soundManager from '../SoundManager';

const DashboardView = ({ gameState, generateLearningRoadmap, loading, learningPlan, theme = 'teen' }) => {
  const [animatedCoins, setAnimatedCoins] = useState(0);
  const [animatedQuizzes, setAnimatedQuizzes] = useState(0);
  const [animatedVideos, setAnimatedVideos] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const prevCoinsRef = useRef(gameState.total_coins_earned);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Initialize sound manager with theme
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Smooth number animation with easing
  useEffect(() => {
    const animateValue = (start, end, setter, duration = 1200) => {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setter(Math.floor(start + (end - start) * easeOut));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    animateValue(0, gameState.videos_watched, setAnimatedVideos);
    animateValue(0, gameState.quizzes_completed, setAnimatedQuizzes);
    animateValue(0, gameState.total_coins_earned, setAnimatedCoins);
    animateValue(0, gameState.total_score || 0, setAnimatedScore);
  }, [gameState.videos_watched, gameState.quizzes_completed, gameState.total_coins_earned, gameState.total_score]);

  // Play coin sound when coins increase
  useEffect(() => {
    if (gameState.total_coins_earned > prevCoinsRef.current) {
      soundManager.playCoinSound();
    }
    prevCoinsRef.current = gameState.total_coins_earned;
  }, [gameState.total_coins_earned]);

  // Premium NotebookLM/Duolingo-inspired theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#58CC02',
          secondary: '#1CB0F6',
          accent: '#FF9600',
          warning: '#FF4B4B',
          background: '#f7f7f7',
          cardBg: '#ffffff',
          cardBgHover: '#fafafa',
          borderColor: '#e5e5e5',
          textPrimary: '#3c3c3c',
          textSecondary: '#777777',
          streakColor: '#FF9600',
          coinsColor: '#FFC800',
          borderRadius: '20px',
          shadowLight: 'rgba(0, 0, 0, 0.06)',
          shadowMedium: 'rgba(0, 0, 0, 0.1)',
        };
      case 'teen':
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          warning: '#FF4B4B',
          background: '#131F24',
          cardBg: 'rgba(255, 255, 255, 0.06)',
          cardBgHover: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.6)',
          streakColor: '#FF9600',
          coinsColor: '#FFC800',
          borderRadius: '16px',
          shadowLight: 'rgba(0, 0, 0, 0.2)',
          shadowMedium: 'rgba(0, 0, 0, 0.3)',
        };
      case 'mature':
      default:
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          warning: '#FF4B4B',
          background: '#1a1a1a',
          cardBg: 'rgba(255, 255, 255, 0.04)',
          cardBgHover: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.5)',
          streakColor: '#FF9600',
          coinsColor: '#FFC800',
          borderRadius: '12px',
          shadowLight: 'rgba(0, 0, 0, 0.2)',
          shadowMedium: 'rgba(0, 0, 0, 0.3)',
        };
    }
  };

  const themeStyles = getThemeStyles();
  const isLightTheme = theme === 'kids';

  // Daily progress calculation
  const dailyGoal = 5;
  const dailyProgress = Math.min(
    ((gameState.videos_watched + gameState.quizzes_completed) / dailyGoal) * 100,
    100
  );
  const dailyCompleted = dailyProgress === 100;

  // Premium Stat Card Component
  const StatCard = ({ icon, value, label, color, index }) => {
    const isHovered = hoveredCard === `stat-${index}`;

    return (
      <div
        onMouseEnter={() => setHoveredCard(`stat-${index}`)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          background: isLightTheme
            ? '#ffffff'
            : `linear-gradient(135deg, ${color}15, ${color}08)`,
          border: `1px solid ${isHovered ? color : themeStyles.borderColor}`,
          borderRadius: themeStyles.borderRadius,
          padding: '28px 24px',
          textAlign: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'default',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered
            ? `0 12px 32px ${themeStyles.shadowMedium}, 0 0 0 1px ${color}30`
            : `0 4px 16px ${themeStyles.shadowLight}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient overlay on hover */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${color}10, transparent)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '36px',
          marginBottom: '12px',
          position: 'relative',
          zIndex: 1,
        }}>
          {icon}
        </div>

        <div style={{
          fontSize: '32px',
          fontWeight: '800',
          color: color,
          marginBottom: '6px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
          zIndex: 1,
        }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        <div style={{
          fontSize: '13px',
          color: themeStyles.textSecondary,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          position: 'relative',
          zIndex: 1,
        }}>
          {label}
        </div>
      </div>
    );
  };

  // Premium Achievement Badge
  const Badge = ({ icon, label, unlocked, index }) => {
    const isHovered = hoveredCard === `badge-${index}`;

    return (
      <div
        onMouseEnter={() => setHoveredCard(`badge-${index}`)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          opacity: unlocked ? 1 : 0.4,
          filter: unlocked ? 'none' : 'grayscale(100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered && unlocked ? 'scale(1.1)' : 'scale(1)',
          cursor: unlocked ? 'pointer' : 'default',
        }}
        title={label}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: unlocked
            ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`
            : isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          boxShadow: unlocked
            ? `0 8px 24px ${themeStyles.primary}40, inset 0 1px 0 rgba(255,255,255,0.2)`
            : 'none',
          border: unlocked ? '3px solid rgba(255,255,255,0.3)' : 'none',
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: unlocked ? themeStyles.textPrimary : themeStyles.textSecondary,
          textAlign: 'center',
          maxWidth: '80px',
          lineHeight: '1.3',
        }}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="content-section" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${themeStyles.primary}30; }
          50% { box-shadow: 0 0 40px ${themeStyles.primary}50; }
        }

        .dashboard-section {
          animation: fadeInUp 0.5s ease-out both;
        }

        .dashboard-section:nth-child(1) { animation-delay: 0s; }
        .dashboard-section:nth-child(2) { animation-delay: 0.1s; }
        .dashboard-section:nth-child(3) { animation-delay: 0.2s; }
        .dashboard-section:nth-child(4) { animation-delay: 0.3s; }
        .dashboard-section:nth-child(5) { animation-delay: 0.4s; }

        .progress-fill {
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
          background-size: 200% 100%;
        }
      `}</style>

      {/* Welcome Header with Streak */}
      <div className="dashboard-section" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{
            color: themeStyles.textPrimary,
            fontSize: theme === 'kids' ? '2rem' : '1.75rem',
            fontWeight: '800',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            {theme === 'kids' ? '🎉 ' : ''}Welcome back!
          </h2>
          <p style={{
            color: themeStyles.textSecondary,
            fontSize: '16px',
            margin: 0,
            fontWeight: '500',
          }}>
            Keep up the great work on your learning journey
          </p>
        </div>

        {gameState.streak_days > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: `linear-gradient(135deg, ${themeStyles.streakColor}20, ${themeStyles.streakColor}10)`,
            border: `2px solid ${themeStyles.streakColor}40`,
            padding: '12px 20px',
            borderRadius: '30px',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <span style={{
              fontWeight: '800',
              color: themeStyles.streakColor,
              fontSize: '16px',
            }}>
              {gameState.streak_days} Day Streak!
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="dashboard-section" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard
          icon="🏆"
          value={animatedScore}
          label="Total Score"
          color={themeStyles.primary}
          index={0}
        />
        <StatCard
          icon="📺"
          value={animatedVideos}
          label="Videos"
          color="#8549BA"
          index={1}
        />
        <StatCard
          icon="🎯"
          value={animatedQuizzes}
          label="Quizzes"
          color={themeStyles.secondary}
          index={2}
        />
        <StatCard
          icon="🪙"
          value={animatedCoins}
          label="Coins"
          color={themeStyles.coinsColor}
          index={3}
        />
      </div>

      {/* Daily Goal Progress Card */}
      <div className="dashboard-section" style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.borderColor}`,
        borderRadius: themeStyles.borderRadius,
        padding: '28px',
        marginBottom: '28px',
        boxShadow: `0 4px 20px ${themeStyles.shadowLight}`,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: themeStyles.textPrimary,
            fontSize: '18px',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🎯 Daily Goal
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {dailyCompleted && (
              <span style={{
                background: themeStyles.secondary,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
              }}>
                COMPLETE ✓
              </span>
            )}
            <span style={{
              color: dailyCompleted ? themeStyles.secondary : themeStyles.textPrimary,
              fontWeight: '800',
              fontSize: '18px'
            }}>
              {gameState.videos_watched + gameState.quizzes_completed}/{dailyGoal}
            </span>
          </div>
        </div>

        {/* Premium Progress Bar */}
        <div style={{
          height: '14px',
          background: isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
          borderRadius: '7px',
          overflow: 'hidden',
          marginBottom: '16px',
          position: 'relative',
        }}>
          <div
            className="progress-fill"
            style={{
              height: '100%',
              width: `${dailyProgress}%`,
              background: dailyCompleted
                ? `linear-gradient(90deg, ${themeStyles.secondary}, #45d97a)`
                : `linear-gradient(90deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
              borderRadius: '7px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        <p style={{
          color: themeStyles.textSecondary,
          fontSize: '14px',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {dailyCompleted
            ? '🎉 Amazing! You\'ve completed your daily goal!'
            : `Complete ${dailyGoal - (gameState.videos_watched + gameState.quizzes_completed)} more activities to earn bonus coins! 🪙`
          }
        </p>
      </div>

      {/* Learning Plan Generator */}
      <div className="dashboard-section" style={{ marginBottom: '28px' }}>
        <button
          onClick={() => {
            soundManager.playClickSound();
            generateLearningRoadmap();
          }}
          disabled={loading.roadmap}
          style={{
            width: '100%',
            padding: '20px 36px',
            borderRadius: themeStyles.borderRadius,
            border: 'none',
            fontSize: '18px',
            fontWeight: '700',
            cursor: loading.roadmap ? 'not-allowed' : 'pointer',
            background: loading.roadmap
              ? (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)')
              : `linear-gradient(135deg, ${themeStyles.primary}, #1890d0)`,
            color: loading.roadmap ? themeStyles.textSecondary : 'white',
            boxShadow: loading.roadmap
              ? 'none'
              : `0 4px 0 0 #1478b0, 0 8px 24px rgba(28, 176, 246, 0.35)`,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            if (!loading.roadmap) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 0 0 #1478b0, 0 12px 32px rgba(28, 176, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            if (!loading.roadmap) {
              e.currentTarget.style.boxShadow = '0 4px 0 0 #1478b0, 0 8px 24px rgba(28, 176, 246, 0.35)';
            }
          }}
          onMouseDown={(e) => {
            if (!loading.roadmap) {
              e.currentTarget.style.transform = 'translateY(2px)';
              e.currentTarget.style.boxShadow = '0 2px 0 0 #1478b0, 0 4px 16px rgba(28, 176, 246, 0.3)';
            }
          }}
          onMouseUp={(e) => {
            if (!loading.roadmap) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 0 0 #1478b0, 0 12px 32px rgba(28, 176, 246, 0.4)';
            }
          }}
        >
          {loading.roadmap ? (
            <>
              <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>🔄</span>
              Generating your plan...
            </>
          ) : (
            <>
              📋 Create My Learning Plan
            </>
          )}
        </button>
      </div>

      {/* Learning Plan Display */}
      {learningPlan !== 'Click to generate your plan!' && (
        <div className="dashboard-section" style={{
          background: isLightTheme
            ? 'linear-gradient(135deg, #e8f5e9, #f1f8e9)'
            : `linear-gradient(135deg, ${themeStyles.secondary}15, ${themeStyles.secondary}08)`,
          border: `1px solid ${themeStyles.secondary}30`,
          borderRadius: themeStyles.borderRadius,
          padding: '28px',
          marginBottom: '28px',
        }}>
          <h3 style={{
            color: themeStyles.secondary,
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📋 Your Learning Plan
          </h3>
          <p style={{
            color: themeStyles.textPrimary,
            fontSize: '15px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            margin: 0,
            fontWeight: '500',
          }}>
            {learningPlan}
          </p>
        </div>
      )}

      {/* Achievements Section */}
      <div className="dashboard-section" style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.borderColor}`,
        borderRadius: themeStyles.borderRadius,
        padding: '28px',
        boxShadow: `0 4px 20px ${themeStyles.shadowLight}`,
      }}>
        <h3 style={{
          color: themeStyles.textPrimary,
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🏆 Achievements
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          <Badge
            icon="⭐"
            label="First Steps"
            unlocked={gameState.quizzes_completed >= 1}
            index={0}
          />
          <Badge
            icon="🎯"
            label="Quiz Master"
            unlocked={gameState.quizzes_completed >= 5}
            index={1}
          />
          <Badge
            icon="📺"
            label="Video Fan"
            unlocked={gameState.videos_watched >= 3}
            index={2}
          />
          <Badge
            icon="🔥"
            label="On Fire"
            unlocked={gameState.streak_days >= 3}
            index={3}
          />
          <Badge
            icon="💰"
            label="Coin Collector"
            unlocked={gameState.total_coins_earned >= 500}
            index={4}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
