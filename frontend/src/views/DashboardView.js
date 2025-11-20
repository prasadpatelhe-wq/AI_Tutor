import React from 'react';

const DashboardView = ({ gameState, generateLearningRoadmap, loading, learningPlan }) => {
  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>🌟 Welcome to Your Learning Dashboard! 🌟</h3>
      
      <div className="kid-card">
        <h4 style={{ color: '#667eea', marginBottom: '20px' }}>📊 Your Daily Progress</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{gameState.videos_watched}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Videos Watched</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(86, 171, 47, 0.1)', borderRadius: '15px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#56ab2f' }}>{gameState.quizzes_completed}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Quizzes Completed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(247, 151, 30, 0.1)', borderRadius: '15px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f7971e' }}>{gameState.streak_days}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Day Streak</div>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button 
          className="success-button" 
          onClick={generateLearningRoadmap}
          disabled={loading.roadmap}
        >
          {loading.roadmap ? '🔄 Generating Plan...' : '🎯 Create My Learning Plan!'}
        </button>
      </div>
      
      {learningPlan !== 'Click to generate your plan!' && (
        <div className="kid-card">
          <h4 style={{ color: '#667eea', marginBottom: '15px' }}>📋 Your Learning Plan</h4>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>{learningPlan}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardView;

