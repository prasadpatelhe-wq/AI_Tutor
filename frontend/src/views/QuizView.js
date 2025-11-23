import React, { useState, useEffect } from 'react';

const QuizView = ({
  userSubject,
  startQuizSession,
  loading,
  quizContainerVisible,
  // Props from App.js that we might override or use initially
  quizQuestions: initialQuestions,
  quizAnswers: initialAnswers,
  currentQuestionIndex: initialIndex,
  handleQuizAnswer: appHandleQuizAnswer,
  quizProgress: appQuizProgress,
  submitQuizFinal: appSubmitQuizFinal,
  handleNextQuestion: appHandleNextQuestion,
  quizResults: appQuizResults,
  // New props
  userSubjectId,
  selectedDbChapter,
  calculateQuizScore,
  addCoins,
  setGameState
}) => {
  // Local state for progressive quiz
  const [allQuizData, setAllQuizData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('basic'); // 'basic', 'medium', 'hard'
  const [localQuestions, setLocalQuestions] = useState([]);
  const [localAnswers, setLocalAnswers] = useState([]);
  const [localIndex, setLocalIndex] = useState(0);
  const [localResults, setLocalResults] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Effect to sync with App.js if it provides initial questions (optional, but good for safety)
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0 && !isQuizActive) {
      // If App.js started it, we might want to sync, but we want to control the flow.
      // We'll rely on our own start handler.
    }
  }, [initialQuestions, isQuizActive]);

  const handleStartQuiz = async () => {
    const data = await startQuizSession(); // This calls api.generateQuiz which returns full object
    if (data) {
      console.log("Quiz Data Received:", data);
      setAllQuizData(data);
      startLevel('basic', data);
    }
  };

  const startLevel = (level, data = allQuizData) => {
    const levelData = data[level];
    // levelData is an array of quiz objects. We take the first one.
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
  };

  const handleLocalAnswer = (answerIndex) => {
    const newAnswers = [...localAnswers];
    newAnswers[localIndex] = answerIndex;
    setLocalAnswers(newAnswers);
  };

  const handleLocalNext = () => {
    if (localIndex < localQuestions.length - 1) {
      setLocalIndex(localIndex + 1);
    }
  };

  const submitLevel = async () => {
    // Calculate score
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
    if (currentLevel === 'basic') startLevel('medium');
    else if (currentLevel === 'medium') startLevel('hard');
  };

  // Derived state for UI
  const currentQ = localQuestions[localIndex];
  const currentQuestionText = currentQ ? `Question ${localIndex + 1}: ${currentQ.question_text || currentQ.question}` : '';
  const currentOptions = currentQ ? (currentQ.options || []) : [];
  const progressText = `Progress: ${localIndex + 1}/${localQuestions.length}`;

  // Determine if we show the "Start" card or the "Quiz" card or "Results"
  const showStart = !isQuizActive && !localResults;
  const showQuiz = isQuizActive;
  const showResults = !isQuizActive && localResults;

  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>🧠 Test Your Knowledge</h3>

      {showStart && (
        <div className="kid-card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#667eea', marginBottom: '20px' }}>Ready to challenge yourself?</h4>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            Test what you've learned with our interactive quiz for {userSubject}! 🎯
          </p>
          <div className="button-group">
            <button
              className="big-button"
              onClick={handleStartQuiz}
              disabled={loading.quiz}
            >
              {loading.quiz ? '🔄 Creating Quiz...' : `🚀 Start ${userSubject} Quiz!`}
            </button>
          </div>
        </div>
      )}

      {showQuiz && (
        <div className="kid-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#667eea', textTransform: 'uppercase' }}>{currentLevel} LEVEL</span>
            <span style={{ fontSize: '14px', color: '#999' }}>{progressText}</span>
          </div>

          <h4 style={{ color: '#2d3748', marginBottom: '20px' }}>{currentQuestionText}</h4>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            {currentOptions.map((opt, i) => {
              const optionText = typeof opt === 'string' ? opt.trim() : opt;
              if (!optionText) return null;

              const isAnswered = localAnswers[localIndex] !== -1;
              const correctIndex = currentQ?.correct_option_index ?? currentQ?.correct;

              let backgroundColor = undefined;
              let color = '#667eea';

              if (isAnswered) {
                if (i === correctIndex) {
                  backgroundColor = '#d4edda'; // Green for correct
                  color = '#155724';
                } else if (localAnswers[localIndex] === i) {
                  backgroundColor = '#ffcccc'; // Red for wrong selection
                  color = '#721c24';
                }
              } else if (localAnswers[localIndex] === i) {
                backgroundColor = 'rgba(102, 126, 234, 0.2)';
              }

              return (
                <button
                  key={i}
                  className="quiz-card"
                  onClick={() => !isAnswered && handleLocalAnswer(i)}
                  disabled={isAnswered}
                  style={{
                    backgroundColor,
                    color,
                    cursor: isAnswered ? 'default' : 'pointer',
                    border: isAnswered
                      ? (i === correctIndex
                        ? '2px solid #28a745'
                        : (localAnswers[localIndex] === i ? '2px solid #dc3545' : '1px solid #e2e8f0'))
                      : '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ fontWeight: '600', marginRight: '10px' }}>{String.fromCharCode(65 + i)}.</span>
                  {optionText}
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {localAnswers[localIndex] !== -1 && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e2e8f0',
              borderRadius: '10px',
              textAlign: 'left'
            }}>
              <p style={{ fontWeight: 'bold', color: '#2d3748', marginBottom: '5px' }}>
                {localAnswers[localIndex] === (currentQ?.correct_option_index ?? currentQ?.correct) ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p style={{ color: '#4a5568' }}>
                <strong>Correct Answer:</strong> {currentOptions[(currentQ?.correct_option_index ?? currentQ?.correct)]}
              </p>
              {currentQ?.explanation && (
                <p style={{ marginTop: '10px', color: '#4a5568', fontStyle: 'italic' }}>
                  💡 {currentQ.explanation}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {localAnswers[localIndex] !== -1 && (
            <div className="button-group">
              {localIndex < localQuestions.length - 1 ? (
                <button className="big-button" onClick={handleLocalNext}>
                  Next Question ➡️
                </button>
              ) : (
                <button className="success-button" onClick={submitLevel}>
                  📝 Finish {currentLevel} Level
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showResults && (
        <div className="kid-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }}>
          <h4 style={{ color: '#667eea', marginBottom: '15px' }}>🎉 {currentLevel.toUpperCase()} Level Complete!</h4>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>
              Score: {localResults.score}
            </p>
            <p style={{ fontSize: '16px', color: '#FFD700', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
              (🪙 +{localResults.coins} Coins)
            </p>
          </div>

          <p style={{ fontSize: '18px', fontWeight: '600', color: '#667eea', marginBottom: '20px' }}>{localResults.message}</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
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

            <button className="warning-button" onClick={() => {
              setAllQuizData(null);
              setLocalResults(null);
            }}>
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
