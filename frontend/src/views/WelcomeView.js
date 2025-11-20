import React from 'react';

const WelcomeView = ({ switchToSelection, parentPin, setParentPin, handleParentLogin, loading, parentStatus }) => {
  return (
    <div className="content-section">
      <h1 className="main-title">🚀 Agentic AI Tutor - Your After-School Adventure! 🚀</h1>
      <p style={{ fontSize: '22px', color: 'white', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>
        Welcome to the most fun way to learn! 🌟✨
      </p>
      <div className="button-group">
        <button className="big-button" onClick={switchToSelection}>
          🎮 Start as Guest - Let's Learn!
        </button>
      </div>
      <div className="kid-card" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <h3 style={{ color: '#667eea', marginBottom: '20px' }}>👨‍👩‍👧‍👦 Parent Login</h3>
        <input
          type="password"
          placeholder="Enter PIN (default: 1234)"
          value={parentPin}
          onChange={(e) => setParentPin(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <div className="button-group">
          <button 
            className="parent-lock" 
            onClick={handleParentLogin}
            disabled={loading.parent}
          >
            {loading.parent ? '🔄 Verifying...' : '🔓 Parent Login'}
          </button>
        </div>
        {parentStatus && (
          <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: '600', color: '#667eea' }}>
            {parentStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeView;

