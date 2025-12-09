import React, { useEffect, useState } from "react";
import axios from "axios";
import soundManager from "./SoundManager";

const API_BASE_URL = "http://localhost:8000";

const FlashcardView = ({ chapterId, studentId, theme = 'teen' }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [masteredCards, setMasteredCards] = useState({});
  const CARD_ANIMATION_DURATION = 350;
  const minSwipeDistance = 50;

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
          cardFront: 'linear-gradient(135deg, #fff 0%, #fff5f7 100%)',
          cardBack: 'linear-gradient(135deg, #d4f5f3 0%, #e8fff9 100%)',
          textColor: '#333',
          borderRadius: '25px',
          shadowColor: 'rgba(255, 107, 157, 0.3)',
          glowColor: 'rgba(255, 107, 157, 0.5)',
        };
      case 'teen':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4fd1c5',
          cardFront: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          cardBack: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          textColor: '#fff',
          borderRadius: '20px',
          shadowColor: 'rgba(102, 126, 234, 0.4)',
          glowColor: 'rgba(102, 126, 234, 0.6)',
        };
      case 'mature':
      default:
        return {
          primary: '#38B2AC',
          secondary: '#4A5568',
          accent: '#48BB78',
          cardFront: 'rgba(255, 255, 255, 0.05)',
          cardBack: 'rgba(56, 178, 172, 0.1)',
          textColor: '#E2E8F0',
          borderRadius: '12px',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          glowColor: 'rgba(56, 178, 172, 0.4)',
        };
    }
  };

  const themeStyles = getThemeStyles();

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextCard();
    } else if (isRightSwipe) {
      handlePrevCard();
    }
  };

  const handleNextCard = () => {
    if (isAnimating || currentIndex >= flashcards.length - 1) return;
    setTransitionDirection("next");
    setIsAnimating(true);
    soundManager.playClickSound();

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setTransitionDirection("");
      setIsAnimating(false);
    }, CARD_ANIMATION_DURATION);
  };

  const handlePrevCard = () => {
    if (isAnimating || currentIndex <= 0) return;
    setTransitionDirection("prev");
    setIsAnimating(true);
    soundManager.playClickSound();

    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1);
      setTransitionDirection("");
      setIsAnimating(false);
    }, CARD_ANIMATION_DURATION);
  };

  const handleFlip = (cardId) => {
    if (isAnimating) return;
    soundManager.playFlipSound();
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleMastered = (cardId) => {
    soundManager.playAchievementSound();
    setMasteredCards((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  useEffect(() => {
    if (!chapterId) return;

    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/flashcards/chapter/${studentId}/${chapterId}`
        );

        const data = response.data;
        const incomingCards = Array.isArray(data) ? data : (data?.flashcards || []);
        setFlashcards(incomingCards);
        setChapterTitle(data?.chapter_title || "");
        setCurrentIndex(0);
        setFlippedCards({});
        setMasteredCards({});
        setTransitionDirection("");
        setIsAnimating(false);

      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [chapterId, studentId]);

  if (loading) {
    return (
      <div className="content-section" style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '3rem',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          🃏
        </div>
        <p style={{ color: themeStyles.textColor, marginTop: '20px' }}>
          Loading flashcards...
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }
        `}</style>
      </div>
    );
  }

  const progressPercent = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  const masteredCount = Object.keys(masteredCards).length;

  return (
    <div className="content-section" style={{ position: 'relative' }}>
      {/* Keyframe animations */}
      <style>{`
        @keyframes flipIn {
          0% { transform: rotateY(-90deg); opacity: 0; }
          100% { transform: rotateY(0); opacity: 1; }
        }
        
        @keyframes swipeLeft {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-120%) rotate(-15deg); opacity: 0; }
        }
        
        @keyframes swipeRight {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(120%) rotate(15deg); opacity: 0; }
        }
        
        @keyframes cardIn {
          0% { transform: translateX(60px) scale(0.95); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${themeStyles.glowColor}; }
          50% { box-shadow: 0 0 40px ${themeStyles.glowColor}; }
        }
        
        @keyframes masteredPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <h3 style={{
        textAlign: "center",
        marginBottom: "25px",
        background: theme !== 'mature'
          ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`
          : 'none',
        WebkitBackgroundClip: theme !== 'mature' ? 'text' : 'unset',
        WebkitTextFillColor: theme !== 'mature' ? 'transparent' : themeStyles.textColor,
        backgroundClip: theme !== 'mature' ? 'text' : 'unset',
        fontSize: theme === 'kids' ? '1.8rem' : '1.5rem'
      }}>
        🃏 Flashcards: {chapterTitle || `Chapter ${chapterId}`}
      </h3>

      {flashcards.length === 0 ? (
        <div className="kid-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
          <p style={{ color: themeStyles.textColor }}>
            No flashcards found for this chapter.
          </p>
        </div>
      ) : (
        <>
          {/* Progress Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px 20px',
            background: theme === 'mature' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
            borderRadius: themeStyles.borderRadius,
            backdropFilter: 'blur(10px)'
          }}>
            <div>
              <span style={{
                color: themeStyles.textColor,
                fontSize: theme === 'kids' ? '1.1rem' : '1rem',
                fontWeight: '600'
              }}>
                Card {currentIndex + 1} of {flashcards.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {masteredCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #48BB78, #68D391)',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  ⭐ {masteredCount} Mastered
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: theme === 'kids' ? '10px' : '6px',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '20px',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
              borderRadius: '20px',
              transition: 'width 0.5s ease-out',
              position: 'relative'
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

          {/* Flashcard Wrapper */}
          <div
            style={{
              position: 'relative',
              minHeight: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevCard}
              disabled={currentIndex === 0 || isAnimating}
              style={{
                position: 'absolute',
                left: theme === 'kids' ? '-20px' : '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: currentIndex === 0
                  ? 'rgba(128,128,128,0.2)'
                  : `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
                border: 'none',
                color: 'white',
                width: theme === 'kids' ? '55px' : '45px',
                height: theme === 'kids' ? '55px' : '45px',
                borderRadius: '50%',
                fontSize: theme === 'kids' ? '1.5rem' : '1.2rem',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentIndex === 0 ? 0.4 : 1,
                zIndex: 10,
                boxShadow: currentIndex === 0 ? 'none' : `0 4px 20px ${themeStyles.shadowColor}`,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ❮
            </button>

            <button
              onClick={handleNextCard}
              disabled={currentIndex === flashcards.length - 1 || isAnimating}
              style={{
                position: 'absolute',
                right: theme === 'kids' ? '-20px' : '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: currentIndex === flashcards.length - 1
                  ? 'rgba(128,128,128,0.2)'
                  : `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
                border: 'none',
                color: 'white',
                width: theme === 'kids' ? '55px' : '45px',
                height: theme === 'kids' ? '55px' : '45px',
                borderRadius: '50%',
                fontSize: theme === 'kids' ? '1.5rem' : '1.2rem',
                cursor: currentIndex === flashcards.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentIndex === flashcards.length - 1 ? 0.4 : 1,
                zIndex: 10,
                boxShadow: currentIndex === flashcards.length - 1 ? 'none' : `0 4px 20px ${themeStyles.shadowColor}`,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ❯
            </button>

            {/* Card Stack */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              height: '340px',
              perspective: '1500px'
            }}>
              {flashcards.map((card, index) => {
                if (Math.abs(index - currentIndex) > 2) return null;

                const isTop = index === currentIndex;
                const isBehind = index === currentIndex + 1;
                const isFarBehind = index === currentIndex + 2;
                const isFlipped = !!flippedCards[card.id];
                const isMastered = !!masteredCards[card.id];

                let cardStyle = {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transition: `all ${CARD_ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  cursor: isTop ? 'pointer' : 'default',
                  pointerEvents: isTop ? 'auto' : 'none',
                };

                if (isTop) {
                  cardStyle.zIndex = 3;
                  cardStyle.transform = 'translateY(0) scale(1)';
                  if (transitionDirection === 'next') {
                    cardStyle.animation = `swipeLeft ${CARD_ANIMATION_DURATION}ms ease-out forwards`;
                  } else if (transitionDirection === 'prev') {
                    cardStyle.animation = `cardIn ${CARD_ANIMATION_DURATION}ms ease-out`;
                  }
                } else if (isBehind) {
                  cardStyle.zIndex = 2;
                  cardStyle.transform = 'translateY(15px) scale(0.95)';
                  cardStyle.opacity = 0.7;
                } else if (isFarBehind) {
                  cardStyle.zIndex = 1;
                  cardStyle.transform = 'translateY(30px) scale(0.9)';
                  cardStyle.opacity = 0.4;
                } else {
                  cardStyle.opacity = 0;
                  cardStyle.transform = 'translateY(50px) scale(0.85)';
                }

                return (
                  <div
                    key={card.id}
                    style={cardStyle}
                    onClick={() => isTop && handleFlip(card.id)}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
                    }}>
                      {/* Front of Card */}
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: themeStyles.cardFront,
                        borderRadius: themeStyles.borderRadius,
                        padding: '30px',
                        boxShadow: `0 15px 50px ${themeStyles.shadowColor}`,
                        border: `2px solid ${isMastered ? '#48BB78' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        backdropFilter: 'blur(20px)',
                        animation: isMastered ? 'glow 2s ease-in-out infinite' : 'none'
                      }}>
                        {/* Top accent bar */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '5px',
                          background: `linear-gradient(90deg, ${themeStyles.primary}, ${themeStyles.secondary}, ${themeStyles.accent})`,
                          borderRadius: `${themeStyles.borderRadius} ${themeStyles.borderRadius} 0 0`
                        }} />

                        {isMastered && (
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            fontSize: '1.5rem',
                            animation: 'masteredPop 0.5s ease-out'
                          }}>
                            ⭐
                          </div>
                        )}

                        <div style={{
                          fontSize: theme === 'kids' ? '2rem' : '1.5rem',
                          marginBottom: '15px',
                          animation: 'float 3s ease-in-out infinite'
                        }}>
                          ❓
                        </div>

                        <h4 style={{
                          color: theme === 'mature' ? themeStyles.textColor : themeStyles.primary,
                          fontSize: theme === 'kids' ? '1.3rem' : '1.15rem',
                          lineHeight: '1.6',
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {card.question}
                        </h4>

                        <p style={{
                          marginTop: '20px',
                          fontSize: '0.9rem',
                          color: theme === 'mature' ? '#A0AEC0' : '#888',
                          fontStyle: 'italic'
                        }}>
                          👆 Tap to reveal answer
                        </p>
                      </div>

                      {/* Back of Card */}
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: themeStyles.cardBack,
                        borderRadius: themeStyles.borderRadius,
                        padding: '30px',
                        boxShadow: `0 15px 50px ${themeStyles.shadowColor}`,
                        border: `2px solid ${themeStyles.primary}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        backdropFilter: 'blur(20px)'
                      }}>
                        {/* Top accent bar */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '5px',
                          background: `linear-gradient(90deg, ${themeStyles.accent}, ${themeStyles.primary})`,
                          borderRadius: `${themeStyles.borderRadius} ${themeStyles.borderRadius} 0 0`
                        }} />

                        <div style={{
                          fontSize: theme === 'kids' ? '1.8rem' : '1.4rem',
                          marginBottom: '15px'
                        }}>
                          💡
                        </div>

                        <h4 style={{
                          color: themeStyles.primary,
                          marginBottom: '15px',
                          fontSize: '0.95rem',
                          fontWeight: '600'
                        }}>
                          Answer:
                        </h4>

                        <p style={{
                          fontSize: theme === 'kids' ? '1.15rem' : '1.05rem',
                          color: theme === 'mature' ? themeStyles.textColor : '#333',
                          lineHeight: '1.7',
                          margin: 0
                        }}>
                          {card.explanation}
                        </p>

                        {/* Mastered button */}
                        {!isMastered && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMastered(card.id);
                            }}
                            style={{
                              marginTop: '20px',
                              padding: '10px 25px',
                              background: 'linear-gradient(135deg, #48BB78, #68D391)',
                              border: 'none',
                              borderRadius: '20px',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
                            }}
                          >
                            ⭐ Mark as Mastered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom info */}
          <div style={{
            textAlign: 'center',
            marginTop: '25px',
            padding: '15px',
            background: theme === 'mature' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
            borderRadius: themeStyles.borderRadius,
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{
              color: themeStyles.textColor,
              margin: 0,
              fontSize: '0.9rem'
            }}>
              {theme === 'kids' ? '👆 Tap card to flip · 👈👉 Swipe to navigate' : 'Tap to flip · Swipe or use arrows to navigate'}
            </p>
          </div>

          {/* Dot indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            flexWrap: 'wrap'
          }}>
            {flashcards.map((card, i) => (
              <div
                key={i}
                onClick={() => {
                  if (!isAnimating && i !== currentIndex) {
                    setCurrentIndex(i);
                    soundManager.playClickSound();
                  }
                }}
                style={{
                  width: i === currentIndex ? '24px' : '10px',
                  height: '10px',
                  borderRadius: '10px',
                  background: masteredCards[card.id]
                    ? 'linear-gradient(135deg, #48BB78, #68D391)'
                    : i === currentIndex
                      ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`
                      : 'rgba(128,128,128,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: i === currentIndex ? `0 2px 10px ${themeStyles.shadowColor}` : 'none'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardView;
