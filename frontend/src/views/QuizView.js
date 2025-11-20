import React from 'react';

const QuizView = ({
  userSubject,
  startQuizSession,
  loading,
  quizContainerVisible,
  currentQuestion,
  answerOptions,
  quizAnswers,
  currentQuestionIndex,
  handleQuizAnswer,
  quizProgress,
  quizQuestions,
  submitQuizFinal,
  quizResults
}) => {
  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>🧠 Test Your Knowledge</h3>
      
      <div className="kid-card" style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#667eea', marginBottom: '20px' }}>Ready to challenge yourself?</h4>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
          Test what you've learned with our interactive quiz for {userSubject}! 🎯
        </p>
        <div className="button-group">
          <button 
            className="big-button" 
            onClick={startQuizSession}
            disabled={loading.quiz}
          >
            {loading.quiz ? '🔄 Creating Quiz...' : `🚀 Start ${userSubject} Quiz!`}
          </button>
        </div>
      </div>
      
      {quizContainerVisible && (
        <div className="kid-card">
          <h4 style={{ color: '#667eea', marginBottom: '20px' }}>{currentQuestion}</h4>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            {Array.isArray(answerOptions) && answerOptions.length > 0 ? (
              answerOptions.map((opt, i) => {
                const optionText = typeof opt === 'string' ? opt.trim() : opt;
                if (optionText === undefined || optionText === null || optionText === '') {
                  return null;
                }
                
                return (
                  <button
                    key={i}
                    className="quiz-card"
                    onClick={() => handleQuizAnswer(i)}
                    style={{
                      backgroundColor: quizAnswers[currentQuestionIndex] === i ? 'rgba(102, 126, 234, 0.2)' : undefined
                    }}
                  >
                    <span style={{ fontWeight: '600', color: '#667eea', marginRight: '10px' }}>{String.fromCharCode(65 + i)}.</span>
                    {optionText}
                  </button>
                );
              })
            ) : (
              <p style={{ color: '#999'}}>Loading options...</p>
            )}
          </div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#667eea' }}>{quizProgress}</p>
          </div>
          {currentQuestionIndex >= quizQuestions.length - 1 && quizAnswers[currentQuestionIndex] !== -1 && (
            <div className="button-group">
              <button className="success-button" onClick={submitQuizFinal}>
                📝 Submit Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {quizResults && (
        <div className="kid-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }}>
          <h4 style={{ color: '#667eea', marginBottom: '15px' }}>🎉 Quiz Results!</h4>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>{quizResults}</p>
        </div>
      )}
    </div>
  );
};

export default QuizView;

