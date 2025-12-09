import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../SoundManager';

const RewardsView = ({ gameState, PERKS_SHOP, buyPerk, loading, perkResult, theme = 'teen' }) => {
  const [animatedCoins, setAnimatedCoins] = useState(0);
  const [floatingCoins, setFloatingCoins] = useState([]);
  const [purchaseAnimation, setPurchaseAnimation] = useState(null);
  const prevCoinsRef = useRef(gameState.total_coins_earned);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#FF6B9D',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          goldGradient: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
          cardBg: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          borderRadius: '25px',
          coinEmoji: '🪙',
          celebrationEmojis: ['⭐', '🌟', '✨', '🎉', '🎈', '🏆'],
        };
      case 'teen':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4fd1c5',
          goldGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
          cardBg: 'rgba(255, 255, 255, 0.1)',
          textColor: '#fff',
          borderRadius: '15px',
          coinEmoji: '💎',
          celebrationEmojis: ['🔥', '⚡', '💫', '✨'],
        };
      case 'mature':
      default:
        return {
          primary: '#38B2AC',
          secondary: '#4A5568',
          accent: '#48BB78',
          goldGradient: 'linear-gradient(135deg, #38B2AC, #2C7A7B)',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          textColor: '#E2E8F0',
          borderRadius: '8px',
          coinEmoji: '●',
          celebrationEmojis: [],
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Animate coin counter on mount
  useEffect(() => {
    const animateValue = (start, end, setter, duration = 1500) => {
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

    animateValue(0, gameState.total_coins_earned, setAnimatedCoins);
  }, [gameState.total_coins_earned]);

  // Floating coin animation when coins increase
  useEffect(() => {
    if (gameState.total_coins_earned > prevCoinsRef.current) {
      const newCoins = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        left: 30 + Math.random() * 40,
        delay: i * 0.1
      }));
      setFloatingCoins(newCoins);
      soundManager.playCoinSound();

      setTimeout(() => setFloatingCoins([]), 2000);
    }
    prevCoinsRef.current = gameState.total_coins_earned;
  }, [gameState.total_coins_earned]);

  // Handle perk purchase
  const handleBuyPerk = (index) => {
    setPurchaseAnimation(index);
    soundManager.playClickSound();
    buyPerk(index);

    setTimeout(() => {
      setPurchaseAnimation(null);
      if (!perkResult?.includes('enough')) {
        soundManager.playAchievementSound();
      }
    }, 1000);
  };

  const coinBoard = Array.isArray(gameState.coin_board)
    ? [...gameState.coin_board].slice(-5).reverse()
    : [];

  // Stat card component
  const StatCard = ({ icon, value, label, gradient, delay = 0 }) => (
    <div style={{
      textAlign: 'center',
      padding: theme === 'kids' ? '25px 20px' : '20px 15px',
      background: gradient,
      borderRadius: themeStyles.borderRadius,
      animation: `slideUp 0.5s ease-out ${delay}s both`,
      transition: 'all 0.3s ease',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = theme === 'kids' ? 'translateY(-8px) scale(1.03)' : 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <div style={{
        fontSize: theme === 'kids' ? '2.5rem' : '2rem',
        marginBottom: '10px',
        animation: 'float 3s ease-in-out infinite'
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: theme === 'kids' ? '2rem' : '1.6rem',
        fontWeight: 'bold',
        color: theme === 'mature' ? themeStyles.textColor : '#fff',
        marginBottom: '5px',
        textShadow: theme !== 'mature' ? '0 2px 10px rgba(0,0,0,0.2)' : 'none'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.85rem',
        color: theme === 'mature' ? '#A0AEC0' : 'rgba(255,255,255,0.9)',
        fontWeight: '500'
      }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="content-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Keyframe Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes coinFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.7); }
        }
        
        @keyframes purchasePop {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        @keyframes listSlide {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes coinSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      {/* Floating Coins Animation */}
      {floatingCoins.map(coin => (
        <div
          key={coin.id}
          style={{
            position: 'absolute',
            left: `${coin.left}%`,
            top: '20%',
            fontSize: '2rem',
            animation: `coinFloat 1.5s ease-out ${coin.delay}s forwards`,
            pointerEvents: 'none',
            zIndex: 100
          }}
        >
          {themeStyles.coinEmoji}
        </div>
      ))}

      {/* Header */}
      <h3 style={{
        textAlign: 'center',
        marginBottom: '30px',
        background: theme !== 'mature'
          ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`
          : 'none',
        WebkitBackgroundClip: theme !== 'mature' ? 'text' : 'unset',
        WebkitTextFillColor: theme !== 'mature' ? 'transparent' : themeStyles.textColor,
        backgroundClip: theme !== 'mature' ? 'text' : 'unset',
        fontSize: theme === 'kids' ? '2rem' : '1.5rem',
        animation: 'slideUp 0.3s ease-out'
      }}>
        🎁 Your Amazing Rewards
      </h3>

      {/* Main Coin Display */}
      <div className="kid-card" style={{
        animation: 'slideUp 0.4s ease-out',
        position: 'relative',
        overflow: 'visible'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'inline-block',
            padding: theme === 'kids' ? '30px 50px' : '25px 40px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: theme === 'kids' ? '30px' : '20px',
            boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)',
            animation: theme === 'kids' ? 'glow 2s ease-in-out infinite' : 'none',
            position: 'relative'
          }}>
            <div style={{
              fontSize: theme === 'kids' ? '3rem' : '2.5rem',
              animation: 'coinSpin 3s linear infinite'
            }}>
              🪙
            </div>
            <div style={{
              fontSize: theme === 'kids' ? '2.5rem' : '2rem',
              fontWeight: 'bold',
              color: '#8B4513',
              marginTop: '10px',
              fontFamily: theme === 'kids' ? "'Fredoka One', cursive" : 'inherit'
            }}>
              {animatedCoins}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#8B4513',
              fontWeight: '600'
            }}>
              Total Coins Earned
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h4 style={{
          color: themeStyles.primary,
          marginBottom: '20px',
          fontSize: theme === 'kids' ? '1.2rem' : '1rem'
        }}>
          🏆 Your Progress
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <StatCard
            icon="🎯"
            value={gameState.quizzes_completed}
            label="Quizzes Completed"
            gradient={`linear-gradient(135deg, ${themeStyles.primary}dd, ${themeStyles.secondary}dd)`}
            delay={0}
          />
          <StatCard
            icon="📺"
            value={gameState.videos_watched}
            label="Videos Watched"
            gradient="linear-gradient(135deg, #48bb78dd, #68d391dd)"
            delay={0.1}
          />
          <StatCard
            icon="🔥"
            value={gameState.streak_days}
            label="Day Streak"
            gradient="linear-gradient(135deg, #ed8936dd, #f6ad55dd)"
            delay={0.2}
          />
        </div>
      </div>

      {/* Coin Transaction History */}
      <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}>
        <h4 style={{
          color: themeStyles.primary,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🪙 Coin Transaction History
          {coinBoard.length > 0 && (
            <span style={{
              background: `${themeStyles.primary}30`,
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '0.8rem'
            }}>
              Last {coinBoard.length}
            </span>
          )}
        </h4>

        {coinBoard.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coinBoard.map((entry, index) => (
              <div
                key={entry.id || entry.timestamp}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme === 'kids' ? '18px 20px' : '15px 18px',
                  background: theme === 'mature' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                  borderRadius: themeStyles.borderRadius,
                  borderLeft: `4px solid ${themeStyles.primary}`,
                  animation: `listSlide 0.4s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${themeStyles.primary}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: theme === 'mature' ? themeStyles.textColor : themeStyles.primary,
                    fontSize: theme === 'kids' ? '1rem' : '0.95rem'
                  }}>
                    {entry.source}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: theme === 'mature' ? '#A0AEC0' : '#999',
                    marginTop: '4px'
                  }}>
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: theme === 'kids' ? '1.3rem' : '1.1rem',
                    fontWeight: '700',
                    color: '#f7971e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    +{entry.amount} 🪙
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: theme === 'mature' ? '#A0AEC0' : '#666',
                    marginTop: '2px'
                  }}>
                    Total: {entry.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            color: theme === 'mature' ? '#A0AEC0' : '#666'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }}>🪙</div>
            <p style={{ margin: 0 }}>Complete a quiz or video to start earning coins!</p>
          </div>
        )}
      </div>

      {/* Perk Shop */}
      <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
        <h4 style={{
          color: themeStyles.primary,
          marginBottom: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🛍️ Awesome Perk Shop
          <span style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            padding: '5px 15px',
            borderRadius: '15px',
            fontSize: '0.85rem',
            color: '#8B4513',
            fontWeight: '600'
          }}>
            {gameState.coins || 0} coins available
          </span>
        </h4>

        <div style={{ display: 'grid', gap: '20px' }}>
          {PERKS_SHOP.map((perk, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: theme === 'kids' ? '25px' : '20px',
                background: theme === 'mature' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
                borderRadius: themeStyles.borderRadius,
                borderLeft: `6px solid #f7971e`,
                animation: purchaseAnimation === i ? 'purchasePop 0.3s ease-out' : 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(247, 151, 30, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: theme === 'kids' ? '1.2rem' : '1.05rem',
                  fontWeight: '600',
                  color: theme === 'mature' ? themeStyles.textColor : themeStyles.primary,
                  marginBottom: '8px'
                }}>
                  {perk.name}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: theme === 'mature' ? '#A0AEC0' : '#666',
                  marginBottom: '12px',
                  lineHeight: '1.5'
                }}>
                  {perk.description}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 15px',
                  background: 'linear-gradient(135deg, #f7971e20, #ffd20020)',
                  borderRadius: '15px',
                  fontSize: theme === 'kids' ? '1rem' : '0.95rem',
                  fontWeight: '600',
                  color: '#f7971e'
                }}>
                  💰 {perk.cost} coins
                </div>
              </div>
              <button
                onClick={() => handleBuyPerk(i)}
                disabled={loading.perk || gameState.coins < perk.cost}
                style={{
                  background: gameState.coins >= perk.cost
                    ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                    : 'rgba(128,128,128,0.3)',
                  border: 'none',
                  padding: theme === 'kids' ? '15px 30px' : '12px 25px',
                  borderRadius: theme === 'kids' ? '25px' : '15px',
                  color: gameState.coins >= perk.cost ? '#8B4513' : '#999',
                  fontWeight: '700',
                  fontSize: theme === 'kids' ? '1rem' : '0.9rem',
                  cursor: gameState.coins >= perk.cost ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: gameState.coins >= perk.cost ? '0 4px 15px rgba(247, 151, 30, 0.3)' : 'none',
                  marginLeft: '15px'
                }}
              >
                {loading.perk ? '🔄' : '💳 Buy Now'}
              </button>
            </div>
          ))}
        </div>

        {/* Purchase Result */}
        {perkResult && (
          <div style={{
            marginTop: '25px',
            textAlign: 'center',
            padding: '20px',
            background: perkResult.includes('enough')
              ? 'rgba(245, 101, 101, 0.1)'
              : `${themeStyles.primary}20`,
            borderRadius: themeStyles.borderRadius,
            animation: 'slideUp 0.3s ease-out',
            border: `1px solid ${perkResult.includes('enough') ? '#fc8181' : themeStyles.primary}`
          }}>
            <p style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: perkResult.includes('enough') ? '#fc8181' : themeStyles.primary,
              margin: 0
            }}>
              {perkResult}
            </p>
          </div>
        )}
      </div>

      {/* Unlocked Perks */}
      {gameState.unlocked_perks && gameState.unlocked_perks.length > 0 && (
        <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
          <h4 style={{ color: themeStyles.primary, marginBottom: '20px' }}>
            ✨ Your Unlocked Perks
          </h4>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            {gameState.unlocked_perks.map((perk, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 20px',
                  background: themeStyles.goldGradient,
                  borderRadius: theme === 'kids' ? '20px' : '12px',
                  color: theme === 'teen' ? 'white' : '#8B4513',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              >
                {perk}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsView;
