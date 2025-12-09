import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../SoundManager';

const QuizView = ({
  userSubject,
  startQuizSession,
  loading,
  quizContainerVisible,
  quizQuestions: initialQuestions,
  quizAnswers: initialAnswers,
  currentQuestionIndex: initialIndex,
  handleQuizAnswer: appHandleQuizAnswer,
  quizProgress: appQuizProgress,
  submitQuizFinal: appSubmitQuizFinal,
  handleNextQuestion: appHandleNextQuestion,
  quizResults: appQuizResults,
  userSubjectId,
  selectedDbChapter,
  calculateQuizScore,
  addCoins,
  setGameState,
  theme = 'teen'
}) => {
  // Local state for progressive quiz
  const [allQuizData, setAllQuizData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('basic');
  const [localQuestions, setLocalQuestions] = useState([]);
  const [localAnswers, setLocalAnswers] = useState([]);
  const [localIndex, setLocalIndex] = useState(0);
  const [localResults, setLocalResults] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionAnim, setQuestionAnim] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState(null); // { index, isCorrect }

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
          cardBg: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          levelColors: { basic: '#7ED321', medium: '#F7971E', hard: '#FF5252' },
          borderRadius: '25px',
          confettiEmojis: ['🎉', '⭐', '🌟', '✨', '🎈', '🏆'],
        };
      case 'teen':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4fd1c5',
          cardBg: 'rgba(255, 255, 255, 0.1)',
          textColor: '#fff',
          levelColors: { basic: '#48bb78', medium: '#ed8936', hard: '#f56565' },
          borderRadius: '15px',
          confettiEmojis: ['🔥', '⚡', '💫', '✨'],
        };
      case 'mature':
      default:
        return {
          primary: '#38B2AC',
          secondary: '#4A5568',
          accent: '#48BB78',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          textColor: '#E2E8F0',
          levelColors: { basic: '#48BB78', medium: '#ECC94B', hard: '#F56565' },
          borderRadius: '8px',
          confettiEmojis: [],
        };
    }
  };

  const themeStyles = getThemeStyles();

  const handleStartQuiz = async () => {
    soundManager.playClickSound();
    const data = await startQuizSession();
    if (data) {
      setAllQuizData(data);
      startLevel('basic', data);
    }
  };

  const startLevel = (level, data = allQuizData) => {
    const levelData = data[level];
    const quizObject = levelData && levelData.length > 0 ? levelData[0] : null;
    const questions = quizObject ? quizObject.questions : [];

    if (!questions || questions.length === 0) {
      console.warn(`No questions for level ${level}`);
      return;
    }

    setLocalQuestions(questions);
    setLocalAnswers(new Array(questions.length).fill(-1));
    setLocalIndex(0);
    setCurrentLevel(level);
    setLocalResults(null);
    setIsQuizActive(true);
    setQuestionAnim('slideIn');

    soundManager.playLevelUpSound();
  };

  const handleLocalAnswer = (answerIndex) => {
    const newAnswers = [...localAnswers];
    newAnswers[localIndex] = answerIndex;
    setLocalAnswers(newAnswers);

    // Check if correct
    const currentQ = localQuestions[localIndex];
    const correctIndex = currentQ?.correct_option_index ?? currentQ?.correct;
    const isCorrect = answerIndex === correctIndex;

    setAnswerFeedback({ index: answerIndex, isCorrect });

    if (isCorrect) {
      soundManager.playCorrectSound();
    } else {
      soundManager.playWrongSound();
    }
  };

  const handleLocalNext = () => {
    if (localIndex < localQuestions.length - 1) {
      setQuestionAnim('slideOut');
      soundManager.playClickSound();

      setTimeout(() => {
        setLocalIndex(localIndex + 1);
        setAnswerFeedback(null);
        setQuestionAnim('slideIn');
      }, 300);
    }
  };

  const submitLevel = async () => {
    soundManager.playAchievementSound();
    setShowConfetti(true);

    const result = await calculateQuizScore(
      localAnswers,
      localQuestions,
      addCoins,
      setGameState,
      currentLevel,
      selectedDbChapter,
      userSubjectId
    );

    setLocalResults(result);
    setIsQuizActive(false);

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const goToNextLevel = () => {
    soundManager.playLevelUpSound();
    if (currentLevel === 'basic') startLevel('medium');
    else if (currentLevel === 'medium') startLevel('hard');
  };

  const currentQ = localQuestions[localIndex];
  const currentQuestionText = currentQ ? `Question ${localIndex + 1}: ${currentQ.question_text || currentQ.question}` : '';
  const currentOptions = currentQ ? (currentQ.options || []) : [];
  const progressPercent = localQuestions.length > 0 ? ((localIndex + 1) / localQuestions.length) * 100 : 0;

  const showStart = !isQuizActive && !localResults;
  const showQuiz = isQuizActive;
  const showResults = !isQuizActive && localResults;

  // Confetti renderer
  const renderConfetti = () => {
    if (!showConfetti || themeStyles.confettiEmojis.length === 0) return null;

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
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${Math.random() * 25 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: '-60px',
              animation: `confettiFall ${Math.random() * 2 + 2}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
              opacity: 0.9
            }}
          >
            {themeStyles.confettiEmojis[Math.floor(Math.random() * themeStyles.confettiEmojis.length)]}
          </span>
        ))}
      </div>
    );
  };

  // Level badge component
  const LevelBadge = ({ level }) => (
    <span style={{
      background: `linear-gradient(135deg, ${themeStyles.levelColors[level]}, ${themeStyles.levelColors[level]}cc)`,
      color: 'white',
      padding: theme === 'kids' ? '8px 20px' : '6px 16px',
      borderRadius: theme === 'kids' ? '20px' : '12px',
      fontSize: theme === 'kids' ? '0.95rem' : '0.85rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: `0 4px 15px ${themeStyles.levelColors[level]}50`,
      animation: 'pulse 2s ease-in-out infinite'
    }}>
      {level === 'basic' ? '🌱' : level === 'medium' ? '🔥' : '💎'} {level}
    </span>
  );

  return (
    <div className="content-section" style={{ position: 'relative' }}>
      {/* Confetti */}
      {renderConfetti()}

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50px);
          }
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
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes correctPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scoreCount {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

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
        fontSize: theme === 'kids' ? '2rem' : '1.5rem'
      }}>
        🧠 Test Your Knowledge
      </h3>

      {/* Start Screen */}
      {showStart && (
        <div
          className="kid-card"
          style={{
            textAlign: 'center',
            animation: 'slideIn 0.5s ease-out',
            background: themeStyles.cardBg,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{
            fontSize: theme === 'kids' ? '4rem' : '3rem',
            marginBottom: '20px',
            animation: 'floatEmoji 2s ease-in-out infinite'
          }}>
            🎯
          </div>
          <h4 style={{
            color: themeStyles.primary,
            marginBottom: '20px',
            fontSize: theme === 'kids' ? '1.5rem' : '1.2rem'
          }}>
            Ready to challenge yourself?
          </h4>
          <p style={{
            fontSize: '16px',
            color: theme === 'mature' ? '#A0AEC0' : '#666',
            marginBottom: '30px'
          }}>
            Test what you've learned with our interactive quiz for <strong>{userSubject}</strong>!
          </p>

          {/* Level preview */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <LevelBadge level="basic" />
            <span style={{ color: theme === 'mature' ? '#A0AEC0' : '#999', alignSelf: 'center' }}>→</span>
            <LevelBadge level="medium" />
            <span style={{ color: theme === 'mature' ? '#A0AEC0' : '#999', alignSelf: 'center' }}>→</span>
            <LevelBadge level="hard" />
          </div>

          <div className="button-group">
            <button
              className="big-button"
              onClick={handleStartQuiz}
              disabled={loading.quiz}
              style={{
                animation: !loading.quiz ? 'pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              {loading.quiz ? '🔄 Creating Quiz...' : `🚀 Start ${userSubject} Quiz!`}
            </button>
          </div>
        </div>
      )}

      {/* Active Quiz */}
      {showQuiz && (
        <div
          className="kid-card"
          style={{
            animation: `${questionAnim} 0.3s ease-out`,
            background: themeStyles.cardBg,
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Quiz Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <LevelBadge level={currentLevel} />
            <span style={{
              fontSize: '14px',
              color: theme === 'mature' ? '#A0AEC0' : '#666',
              fontWeight: '600'
            }}>
              {localIndex + 1} / {localQuestions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: theme === 'kids' ? '12px' : '8px',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '20px',
            marginBottom: '25px',
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

          {/* Question */}
          <h4 style={{
            color: themeStyles.textColor,
            marginBottom: '25px',
            fontSize: theme === 'kids' ? '1.3rem' : '1.1rem',
            lineHeight: '1.6'
          }}>
            {currentQuestionText}
          </h4>

          {/* Options */}
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            {currentOptions.map((opt, i) => {
              const optionText = typeof opt === 'string' ? opt.trim() : opt;
              if (!optionText) return null;

              const isAnswered = localAnswers[localIndex] !== -1;
              const correctIndex = currentQ?.correct_option_index ?? currentQ?.correct;
              const isSelected = localAnswers[localIndex] === i;
              const isCorrect = i === correctIndex;

              let backgroundColor = theme === 'mature' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
              let borderColor = 'transparent';
              let textColor = theme === 'mature' ? themeStyles.textColor : '#333';
              let animStyle = '';

              if (isAnswered) {
                if (isCorrect) {
                  backgroundColor = theme === 'mature' ? 'rgba(72, 187, 120, 0.2)' : '#d4edda';
                  borderColor = '#28a745';
                  textColor = theme === 'mature' ? '#68D391' : '#155724';
                  animStyle = 'correctPop 0.3s ease-out';
                } else if (isSelected) {
                  backgroundColor = theme === 'mature' ? 'rgba(245, 101, 101, 0.2)' : '#ffcccc';
                  borderColor = '#dc3545';
                  textColor = theme === 'mature' ? '#FC8181' : '#721c24';
                  animStyle = 'shake 0.3s ease-out';
                }
              } else if (isSelected) {
                backgroundColor = `${themeStyles.primary}30`;
                borderColor = themeStyles.primary;
              }

              return (
                <button
                  key={i}
                  onClick={() => !isAnswered && handleLocalAnswer(i)}
                  disabled={isAnswered}
                  style={{
                    background: backgroundColor,
                    color: textColor,
                    padding: theme === 'kids' ? '20px 25px' : '16px 20px',
                    borderRadius: themeStyles.borderRadius,
                    border: `2px solid ${borderColor}`,
                    textAlign: 'left',
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: theme === 'kids' ? '1.05rem' : '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    animation: animStyle,
                    transform: !isAnswered ? 'scale(1)' : 'scale(1)',
                    boxShadow: isSelected && !isAnswered
                      ? `0 4px 20px ${themeStyles.primary}40`
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAnswered) {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = `0 4px 20px ${themeStyles.primary}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAnswered) {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = isSelected ? `0 4px 20px ${themeStyles.primary}40` : 'none';
                    }
                  }}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isAnswered && isCorrect
                      ? '#28a745'
                      : isAnswered && isSelected
                        ? '#dc3545'
                        : isSelected
                          ? themeStyles.primary
                          : 'rgba(0,0,0,0.1)',
                    color: isSelected || isAnswered ? 'white' : 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}>
                    {isAnswered && isCorrect ? '✓' : isAnswered && isSelected ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  {optionText}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {localAnswers[localIndex] !== -1 && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: theme === 'mature' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
              borderRadius: themeStyles.borderRadius,
              animation: 'slideIn 0.3s ease-out',
              borderLeft: `4px solid ${localAnswers[localIndex] === (currentQ?.correct_option_index ?? currentQ?.correct) ? '#28a745' : '#dc3545'}`
            }}>
              <p style={{
                fontWeight: 'bold',
                color: localAnswers[localIndex] === (currentQ?.correct_option_index ?? currentQ?.correct) ? '#28a745' : '#dc3545',
                marginBottom: '10px',
                fontSize: '1.1rem'
              }}>
                {localAnswers[localIndex] === (currentQ?.correct_option_index ?? currentQ?.correct)
                  ? '✅ Correct! Great job!'
                  : '❌ Not quite right'}
              </p>
              <p style={{ color: theme === 'mature' ? '#A0AEC0' : '#4a5568', marginBottom: '5px' }}>
                <strong>Correct Answer:</strong> {currentOptions[(currentQ?.correct_option_index ?? currentQ?.correct)]}
              </p>
              {currentQ?.explanation && (
                <p style={{
                  marginTop: '10px',
                  color: theme === 'mature' ? '#A0AEC0' : '#4a5568',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  💡 {currentQ.explanation}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          {localAnswers[localIndex] !== -1 && (
            <div className="button-group" style={{ marginTop: '25px' }}>
              {localIndex < localQuestions.length - 1 ? (
                <button className="big-button" onClick={handleLocalNext}>
                  Next Question ➡️
                </button>
              ) : (
                <button
                  className="success-button"
                  onClick={submitLevel}
                  style={{ animation: 'pulse 1s ease-in-out infinite' }}
                >
                  📝 Finish {currentLevel} Level
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Screen */}
      {showResults && (
        <div
          className="kid-card"
          style={{
            textAlign: 'center',
            animation: 'slideIn 0.5s ease-out',
            background: theme === 'mature'
              ? 'rgba(255,255,255,0.05)'
              : `linear-gradient(135deg, ${themeStyles.primary}15, ${themeStyles.secondary}15)`,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{
            fontSize: '4rem',
            marginBottom: '15px',
            animation: 'floatEmoji 2s ease-in-out infinite'
          }}>
            🎉
          </div>

          <h4 style={{
            color: themeStyles.primary,
            marginBottom: '25px',
            fontSize: theme === 'kids' ? '1.8rem' : '1.5rem'
          }}>
            {currentLevel.toUpperCase()} Level Complete!
          </h4>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '25px',
            flexWrap: 'wrap'
          }}>
            {/* Score */}
            <div style={{
              background: `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
              padding: '25px 40px',
              borderRadius: theme === 'kids' ? '25px' : '15px',
              animation: 'scoreCount 0.5s ease-out'
            }}>
              <div style={{
                fontSize: theme === 'kids' ? '2.5rem' : '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {localResults.score}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                Score
              </div>
            </div>

            {/* Coins */}
            <div style={{
              background: 'linear-gradient(135deg, #f7971e, #ffd200)',
              padding: '25px 40px',
              borderRadius: theme === 'kids' ? '25px' : '15px',
              animation: 'scoreCount 0.5s ease-out 0.2s both'
            }}>
              <div style={{
                fontSize: theme === 'kids' ? '2.5rem' : '2rem',
                fontWeight: 'bold',
                color: '#8B4513'
              }}>
                +{localResults.coins}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#8B4513' }}>
                🪙 Coins
              </div>
            </div>
          </div>

          <p style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: themeStyles.primary,
            marginBottom: '25px'
          }}>
            {localResults.message}
          </p>

          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {currentLevel === 'basic' && allQuizData?.medium && (
              <button className="big-button" onClick={goToNextLevel}>
                🚀 Go to Medium Level
              </button>
            )}
            {currentLevel === 'medium' && allQuizData?.hard && (
              <button className="big-button" onClick={goToNextLevel}>
                🔥 Go to Hard Level
              </button>
            )}
            <button
              className="warning-button"
              onClick={() => {
                setAllQuizData(null);
                setLocalResults(null);
                soundManager.playClickSound();
              }}
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
