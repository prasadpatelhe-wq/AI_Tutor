import React, { useState, useEffect } from 'react';
import soundManager from '../SoundManager';

const QuizView = ({
  userSubject,
  startQuizSession,
  loading,
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Clean NotebookLM-inspired theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#58CC02',
          secondary: '#1CB0F6',
          accent: '#FF9600',
          error: '#FF4B4B',
          cardBg: '#ffffff',
          cardBorder: '#e5e5e5',
          textPrimary: '#3c3c3c',
          textSecondary: '#777777',
          borderRadius: '16px',
          optionBg: '#f7f7f7',
          correctBg: '#d7ffb8',
          wrongBg: '#ffdfe0',
          levelColors: { basic: '#58CC02', medium: '#FF9600', hard: '#FF4B4B' },
        };
      case 'teen':
        return {
          primary: '#1CB0F6',
          secondary: '#8549BA',
          accent: '#FF9600',
          error: '#FF4B4B',
          cardBg: 'rgba(255, 255, 255, 0.06)',
          cardBorder: 'rgba(255, 255, 255, 0.12)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '16px',
          optionBg: 'rgba(255, 255, 255, 0.05)',
          correctBg: 'rgba(88, 204, 2, 0.2)',
          wrongBg: 'rgba(255, 75, 75, 0.2)',
          levelColors: { basic: '#58CC02', medium: '#FF9600', hard: '#FF4B4B' },
        };
      case 'mature':
      default:
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          error: '#FF4B4B',
          cardBg: 'rgba(255, 255, 255, 0.04)',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          optionBg: 'rgba(255, 255, 255, 0.03)',
          correctBg: 'rgba(88, 204, 2, 0.15)',
          wrongBg: 'rgba(255, 75, 75, 0.15)',
          levelColors: { basic: '#58CC02', medium: '#FF9600', hard: '#FF4B4B' },
        };
    }
  };

  const themeStyles = getThemeStyles();
  const isLightTheme = theme === 'kids';

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
    setSelectedAnswer(null);
    setShowFeedback(false);
    soundManager.playLevelUpSound();
  };

  const handleSelectAnswer = (answerIndex) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const newAnswers = [...localAnswers];
    newAnswers[localIndex] = answerIndex;
    setLocalAnswers(newAnswers);

    // Check if correct
    const currentQ = localQuestions[localIndex];
    const correctIndex = currentQ?.correct_option_index ?? currentQ?.correct;
    const isCorrect = answerIndex === correctIndex;

    setShowFeedback(true);

    if (isCorrect) {
      soundManager.playCorrectSound();
    } else {
      soundManager.playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    if (localIndex < localQuestions.length - 1) {
      soundManager.playClickSound();
      setLocalIndex(localIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const submitLevel = async () => {
    soundManager.playAchievementSound();

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
  };

  const goToNextLevel = () => {
    soundManager.playLevelUpSound();
    if (currentLevel === 'basic') startLevel('medium');
    else if (currentLevel === 'medium') startLevel('hard');
  };

  const resetQuiz = () => {
    soundManager.playClickSound();
    setAllQuizData(null);
    setLocalResults(null);
    setIsQuizActive(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const currentQ = localQuestions[localIndex];
  const currentQuestionText = currentQ ? (currentQ.question_text || currentQ.question) : '';
  const currentOptions = currentQ ? (currentQ.options || []) : [];
  const progressPercent = localQuestions.length > 0 ? ((localIndex + 1) / localQuestions.length) * 100 : 0;
  const correctIndex = currentQ ? (currentQ.correct_option_index ?? currentQ.correct) : -1;

  const showStart = !isQuizActive && !localResults;
  const showQuiz = isQuizActive;
  const showResults = !isQuizActive && localResults;

  // Level Badge Component
  const LevelBadge = ({ level, size = 'normal' }) => (
    <span style={{
      background: themeStyles.levelColors[level],
      color: 'white',
      padding: size === 'small' ? '4px 10px' : '6px 14px',
      borderRadius: '20px',
      fontSize: size === 'small' ? '12px' : '13px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      {level === 'basic' ? '🌱' : level === 'medium' ? '🔥' : '💎'} {level}
    </span>
  );

  return (
    <div className="content-section">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .quiz-option {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .quiz-option:hover:not(.answered) {
          transform: translateX(4px);
          border-color: ${themeStyles.primary};
        }
        
        .quiz-option.correct {
          animation: scaleIn 0.3s ease;
        }
        
        .quiz-option.wrong {
          animation: shake 0.3s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{
          color: themeStyles.textPrimary,
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          🧠 Quiz Time
        </h2>
        <p style={{
          color: themeStyles.textSecondary,
          fontSize: '15px',
          margin: 0
        }}>
          Test your knowledge on {userSubject}
        </p>
      </div>

      {/* Start Screen */}
      {showStart && (
        <div style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: themeStyles.borderRadius,
          padding: '48px 32px',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎯</div>

          <h3 style={{
            color: themeStyles.textPrimary,
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Ready to test yourself?
          </h3>

          <p style={{
            color: themeStyles.textSecondary,
            fontSize: '15px',
            marginBottom: '32px',
            maxWidth: '360px',
            margin: '0 auto 32px'
          }}>
            Complete three levels of questions and earn coins for each correct answer!
          </p>

          {/* Level Preview */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <LevelBadge level="basic" />
            <span style={{ color: themeStyles.textSecondary }}>→</span>
            <LevelBadge level="medium" />
            <span style={{ color: themeStyles.textSecondary }}>→</span>
            <LevelBadge level="hard" />
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={loading.quiz}
            style={{
              padding: '16px 48px',
              borderRadius: '14px',
              border: 'none',
              background: loading.quiz
                ? (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)')
                : themeStyles.primary,
              color: loading.quiz ? themeStyles.textSecondary : 'white',
              fontSize: '17px',
              fontWeight: '700',
              cursor: loading.quiz ? 'not-allowed' : 'pointer',
              boxShadow: loading.quiz ? 'none' : `0 4px 0 0 #1890d0`,
              transition: 'all 0.2s ease'
            }}
          >
            {loading.quiz ? '🔄 Loading...' : '🚀 Start Quiz'}
          </button>
        </div>
      )}

      {/* Active Quiz */}
      {showQuiz && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {/* Quiz Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <LevelBadge level={currentLevel} />
            <span style={{
              color: themeStyles.textSecondary,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Question {localIndex + 1} of {localQuestions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '8px',
            background: isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            marginBottom: '32px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: themeStyles.levelColors[currentLevel],
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Question Card */}
          <div style={{
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: themeStyles.borderRadius,
            padding: '32px 24px',
            marginBottom: '24px'
          }}>
            <h4 style={{
              color: themeStyles.textPrimary,
              fontSize: '18px',
              fontWeight: '600',
              lineHeight: '1.6',
              margin: 0
            }}>
              {currentQuestionText}
            </h4>
          </div>

          {/* Answer Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {currentOptions.map((opt, i) => {
              const optionText = typeof opt === 'string' ? opt.trim() : opt;
              if (!optionText) return null;

              const isSelected = selectedAnswer === i;
              const isCorrect = i === correctIndex;
              const showCorrect = showFeedback && isCorrect;
              const showWrong = showFeedback && isSelected && !isCorrect;

              let bgColor = themeStyles.optionBg;
              let borderColor = themeStyles.cardBorder;
              let textColor = themeStyles.textPrimary;

              if (showCorrect) {
                bgColor = themeStyles.correctBg;
                borderColor = '#58CC02';
                textColor = isLightTheme ? '#2d5016' : '#a3e635';
              } else if (showWrong) {
                bgColor = themeStyles.wrongBg;
                borderColor = '#FF4B4B';
                textColor = isLightTheme ? '#7f1d1d' : '#fca5a5';
              } else if (isSelected && !showFeedback) {
                borderColor = themeStyles.primary;
                bgColor = isLightTheme ? '#e0f2fe' : 'rgba(28, 176, 246, 0.15)';
              }

              return (
                <button
                  key={i}
                  className={`quiz-option ${showFeedback ? 'answered' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={showFeedback}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: `2px solid ${borderColor}`,
                    background: bgColor,
                    color: textColor,
                    fontSize: '15px',
                    fontWeight: '500',
                    textAlign: 'left',
                    cursor: showFeedback ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: showCorrect
                      ? '#58CC02'
                      : showWrong
                        ? '#FF4B4B'
                        : isSelected
                          ? themeStyles.primary
                          : (isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)'),
                    color: (showCorrect || showWrong || isSelected) ? 'white' : themeStyles.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  {optionText}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          {showFeedback && (
            <div style={{
              background: selectedAnswer === correctIndex
                ? themeStyles.correctBg
                : themeStyles.wrongBg,
              border: `1px solid ${selectedAnswer === correctIndex ? '#58CC02' : '#FF4B4B'}50`,
              borderRadius: themeStyles.borderRadius,
              padding: '20px',
              marginBottom: '24px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <p style={{
                fontWeight: '700',
                color: selectedAnswer === correctIndex ? '#58CC02' : '#FF4B4B',
                marginBottom: currentQ?.explanation ? '12px' : 0,
                fontSize: '15px'
              }}>
                {selectedAnswer === correctIndex ? '✅ Correct!' : '❌ Not quite right'}
              </p>
              {selectedAnswer !== correctIndex && (
                <p style={{
                  color: themeStyles.textSecondary,
                  fontSize: '14px',
                  marginBottom: currentQ?.explanation ? '12px' : 0
                }}>
                  The correct answer was: <strong>{currentOptions[correctIndex]}</strong>
                </p>
              )}
              {currentQ?.explanation && (
                <p style={{
                  color: themeStyles.textSecondary,
                  fontSize: '14px',
                  fontStyle: 'italic',
                  margin: 0
                }}>
                  💡 {currentQ.explanation}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          {showFeedback && (
            <div style={{ textAlign: 'center' }}>
              {localIndex < localQuestions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '14px 36px',
                    borderRadius: '12px',
                    border: 'none',
                    background: themeStyles.primary,
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 3px 0 0 #1890d0'
                  }}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={submitLevel}
                  style={{
                    padding: '14px 36px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#58CC02',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 3px 0 0 #46a302'
                  }}
                >
                  Finish {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level 🎉
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Screen */}
      {showResults && (
        <div style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: themeStyles.borderRadius,
          padding: '48px 32px',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>

          <h3 style={{
            color: themeStyles.textPrimary,
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level Complete!
          </h3>

          {/* Score Cards */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '32px',
            marginTop: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
              padding: '24px 36px',
              borderRadius: '16px',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>
                {localResults.score}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                Score
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #FFC800, #FF9600)',
              padding: '24px 36px',
              borderRadius: '16px',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#5c4813' }}>
                +{localResults.coins}
              </div>
              <div style={{ fontSize: '13px', color: '#7c6520', fontWeight: '600' }}>
                Coins 🪙
              </div>
            </div>
          </div>

          <p style={{
            color: themeStyles.primary,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '32px'
          }}>
            {localResults.message}
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {currentLevel === 'basic' && allQuizData?.medium && (
              <button
                onClick={goToNextLevel}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: themeStyles.levelColors.medium,
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 0 #cc7a00'
                }}
              >
                🔥 Try Medium Level
              </button>
            )}
            {currentLevel === 'medium' && allQuizData?.hard && (
              <button
                onClick={goToNextLevel}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: themeStyles.levelColors.hard,
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 0 #cc3c3c'
                }}
              >
                💎 Try Hard Level
              </button>
            )}
            <button
              onClick={resetQuiz}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: `2px solid ${themeStyles.cardBorder}`,
                background: 'transparent',
                color: themeStyles.textPrimary,
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer'
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
