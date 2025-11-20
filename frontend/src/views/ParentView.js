import React from 'react';

const ParentView = ({
  gameState,
  userGrade,
  userBoard,
  userSubject,
  logoutParent
}) => {
  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>👨‍👩‍👧‍👦 Parent Dashboard</h3>
      
      {gameState.parent_authenticated ? (
        <div>
          <div className="kid-card">
            <h4 style={{ color: '#667eea', marginBottom: '20px' }}>📊 Child's Learning Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))', borderRadius: '15px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{gameState.quizzes_completed}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Quizzes Completed</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(86, 171, 47, 0.1), rgba(168, 230, 207, 0.1))', borderRadius: '15px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📺</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#56ab2f' }}>{gameState.videos_watched}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Videos Watched</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(247, 151, 30, 0.1), rgba(255, 210, 0, 0.1))', borderRadius: '15px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔥</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f7971e' }}>{gameState.streak_days}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Day Streak</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1))', borderRadius: '15px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>👁️</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>{gameState.attention_score}%</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Attention Score</div>
              </div>
            </div>
          </div>
          
          <div className="kid-card">
            <h4 style={{ color: '#667eea', marginBottom: '20px' }}>🎓 Current Learning</h4>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ padding: '15px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.1)' }}>
                <strong style={{ color: '#667eea' }}>Grade:</strong> {userGrade || 'Not selected'}
              </div>
              <div style={{ padding: '15px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.1)' }}>
                <strong style={{ color: '#667eea' }}>Board:</strong> {userBoard || 'Not selected'}
              </div>
              <div style={{ padding: '15px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.1)' }}>
                <strong style={{ color: '#667eea' }}>Subject:</strong> {userSubject || 'Not selected'}
              </div>
            </div>
          </div>
          
          <div className="button-group">
            <button className="warning-button" onClick={logoutParent}>
              🚪 Logout Parent
            </button>
          </div>
        </div>
      ) : (
        <div className="kid-card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#667eea', marginBottom: '20px' }}>🔒 Access Restricted</h4>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            Please authenticate as a parent to view the dashboard.
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Go back to the welcome screen to enter your PIN.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentView;

