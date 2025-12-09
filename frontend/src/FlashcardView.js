import React, { useEffect, useState } from "react";
import axios from "axios";
import soundManager from "./SoundManager";

const API_BASE_URL = "http://localhost:8000";

const FlashcardView = ({ chapterId, studentId, theme = 'teen' }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState("");
  const [flippedCard, setFlippedCard] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});
  const [slideDirection, setSlideDirection] = useState(null);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // NotebookLM-inspired clean theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#58CC02',
          secondary: '#1CB0F6',
          accent: '#FF9600',
          cardBg: '#ffffff',
          cardBorder: '#e5e5e5',
          textPrimary: '#3c3c3c',
          textSecondary: '#777777',
          borderRadius: '20px',
          buttonBg: '#58CC02',
          buttonShadow: '#46a302',
        };
      case 'teen':
        return {
          primary: '#1CB0F6',
          secondary: '#8549BA',
          accent: '#FF9600',
          cardBg: 'rgba(255, 255, 255, 0.06)',
          cardBorder: 'rgba(255, 255, 255, 0.12)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '16px',
          buttonBg: '#1CB0F6',
          buttonShadow: '#1890d0',
        };
      case 'mature':
      default:
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          cardBg: 'rgba(255, 255, 255, 0.04)',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          buttonBg: '#1CB0F6',
          buttonShadow: '#1890d0',
        };
    }
  };

  const themeStyles = getThemeStyles();
  const isLightTheme = theme === 'kids';

  const handleNextCard = () => {
    if (isAnimating || currentIndex >= flashcards.length - 1) return;
    setSlideDirection('left');
    setIsAnimating(true);
    soundManager.playClickSound();

    setTimeout(() => {
      setFlippedCard(false);
      setCurrentIndex(prev => prev + 1);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 250);
  };

  const handlePrevCard = () => {
    if (isAnimating || currentIndex <= 0) return;
    setSlideDirection('right');
    setIsAnimating(true);
    soundManager.playClickSound();

    setTimeout(() => {
      setFlippedCard(false);
      setCurrentIndex(prev => prev - 1);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 250);
  };

  const handleFlip = () => {
    if (isAnimating) return;
    soundManager.playFlipSound();
    setFlippedCard(!flippedCard);
  };

  const handleMastered = (e, cardId) => {
    e.stopPropagation();
    soundManager.playAchievementSound();
    setMasteredCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
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
        setFlippedCard(false);
        setMasteredCards({});
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [chapterId, studentId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevCard();
      if (e.key === 'ArrowRight') handleNextCard();
      if (e.key === ' ') { e.preventDefault(); handleFlip(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating, flippedCard]);

  if (loading) {
    return (
      <div className="content-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
        <p style={{ color: themeStyles.textSecondary }}>Loading flashcards...</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progressPercent = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  const masteredCount = Object.values(masteredCards).filter(Boolean).length;
  const isMastered = currentCard && masteredCards[currentCard.id];

  return (
    <div className="content-section">
      {/* NotebookLM-inspired clean animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideOutLeft {
          to { transform: translateX(-30px); opacity: 0; }
        }
        
        @keyframes slideOutRight {
          to { transform: translateX(30px); opacity: 0; }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .flashcard-container {
          perspective: 1000px;
        }
        
        .flashcard-inner {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        
        .flashcard-inner.flipped {
          transform: rotateY(180deg);
        }
        
        .flashcard-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .flashcard-back {
          transform: rotateY(180deg);
        }
        
        .nav-button {
          transition: all 0.2s ease;
        }
        
        .nav-button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        .nav-button:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          color: themeStyles.textPrimary,
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          🃏 Flashcards
        </h2>
        {chapterTitle && (
          <p style={{
            color: themeStyles.textSecondary,
            fontSize: '15px',
            textAlign: 'center',
            margin: 0
          }}>
            {chapterTitle}
          </p>
        )}
      </div>

      {flashcards.length === 0 ? (
        <div style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: themeStyles.borderRadius,
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ color: themeStyles.textSecondary, margin: 0 }}>
            No flashcards available for this chapter.
          </p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                height: '8px',
                background: isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <span style={{
              color: themeStyles.textSecondary,
              fontSize: '14px',
              fontWeight: '600',
              minWidth: '60px'
            }}>
              {currentIndex + 1} / {flashcards.length}
            </span>
          </div>

          {/* Stats Row */}
          {masteredCount > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #58CC02, #46a302)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                ⭐ {masteredCount} Mastered
              </span>
            </div>
          )}

          {/* Card Container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Prev Button */}
            <button
              className="nav-button"
              onClick={handlePrevCard}
              disabled={currentIndex === 0 || isAnimating}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                background: currentIndex === 0
                  ? (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)')
                  : themeStyles.buttonBg,
                color: currentIndex === 0 ? themeStyles.textSecondary : 'white',
                fontSize: '18px',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                boxShadow: currentIndex === 0
                  ? 'none'
                  : `0 3px 0 0 ${themeStyles.buttonShadow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ←
            </button>

            {/* Flashcard */}
            <div
              className="flashcard-container"
              onClick={handleFlip}
              style={{
                width: '100%',
                maxWidth: '420px',
                height: '280px',
                cursor: 'pointer',
                animation: slideDirection === 'left'
                  ? 'slideOutLeft 0.25s ease forwards'
                  : slideDirection === 'right'
                    ? 'slideOutRight 0.25s ease forwards'
                    : 'slideIn 0.25s ease'
              }}
            >
              <div
                className={`flashcard-inner ${flippedCard ? 'flipped' : ''}`}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
              >
                {/* Front */}
                <div
                  className="flashcard-face"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: themeStyles.cardBg,
                    border: `2px solid ${isMastered ? '#58CC02' : themeStyles.cardBorder}`,
                    borderRadius: themeStyles.borderRadius,
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  {/* Top label */}
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    left: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: themeStyles.primary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Question
                  </span>

                  {/* Mastered badge */}
                  {isMastered && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '16px',
                      fontSize: '20px'
                    }}>⭐</span>
                  )}

                  <p style={{
                    color: themeStyles.textPrimary,
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {currentCard?.front_text || currentCard?.question}
                  </p>

                  <span style={{
                    position: 'absolute',
                    bottom: '16px',
                    color: themeStyles.textSecondary,
                    fontSize: '12px'
                  }}>
                    Tap to flip
                  </span>
                </div>

                {/* Back */}
                <div
                  className="flashcard-face flashcard-back"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: isLightTheme
                      ? 'linear-gradient(135deg, #e8f5e9, #f1f8e9)'
                      : 'linear-gradient(135deg, rgba(88, 204, 2, 0.15), rgba(28, 176, 246, 0.1))',
                    border: `2px solid ${isMastered ? '#58CC02' : themeStyles.cardBorder}`,
                    borderRadius: themeStyles.borderRadius,
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  {/* Top label */}
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    left: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#58CC02',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Answer
                  </span>

                  <p style={{
                    color: themeStyles.textPrimary,
                    fontSize: '17px',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {currentCard?.back_text || currentCard?.answer}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              className="nav-button"
              onClick={handleNextCard}
              disabled={currentIndex === flashcards.length - 1 || isAnimating}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                background: currentIndex === flashcards.length - 1
                  ? (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)')
                  : themeStyles.buttonBg,
                color: currentIndex === flashcards.length - 1 ? themeStyles.textSecondary : 'white',
                fontSize: '18px',
                cursor: currentIndex === flashcards.length - 1 ? 'not-allowed' : 'pointer',
                boxShadow: currentIndex === flashcards.length - 1
                  ? 'none'
                  : `0 3px 0 0 ${themeStyles.buttonShadow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              →
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={(e) => handleMastered(e, currentCard?.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: isMastered
                  ? (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)')
                  : '#58CC02',
                color: isMastered ? themeStyles.textSecondary : 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: isMastered ? 'none' : '0 3px 0 0 #46a302',
                transition: 'all 0.2s ease'
              }}
            >
              {isMastered ? '✓ Mastered' : '⭐ Mark as Mastered'}
            </button>

            <button
              onClick={handleFlip}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: `2px solid ${themeStyles.cardBorder}`,
                background: 'transparent',
                color: themeStyles.textPrimary,
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔄 Flip Card
            </button>
          </div>

          {/* Keyboard hints */}
          <p style={{
            textAlign: 'center',
            color: themeStyles.textSecondary,
            fontSize: '13px',
            marginTop: '24px'
          }}>
            Use ← → keys to navigate, Space to flip
          </p>
        </>
      )}
    </div>
  );
};

export default FlashcardView;
