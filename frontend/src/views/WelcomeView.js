import React from 'react';

const WelcomeView = ({ switchToSelection, parentPin, setParentPin, handleParentLogin, loading, parentStatus }) => {
  const statusColor = parentStatus?.includes("✅") ? "#4CD964" : "#FF6B6B";

  return (
    <div className="glass-landing">
      <div className="glass-bg-orb orb-a" />
      <div className="glass-bg-orb orb-b" />
      <div className="glass-bg-orb orb-c" />

      <div className="glass-hero">
        <div className="glass-hero-copy">
          <p className="glass-pill">After-school adventure</p>
          <h1 className="glass-hero-title">Agentic AI Tutor</h1>
          <p className="glass-hero-sub">Personalized roadmaps, chat, quizzes, and flashcards—built around your grade & subject.</p>
        </div>
        <div className="glass-hero-cta">
          <p className="glass-hero-footnote">Ready in seconds. No setup required.</p>
          <button className="glass-btn primary glass-cta" onClick={switchToSelection}>
            🎮 Start as Guest
          </button>
        </div>
      </div>

      <div className="glass-strip">
        <div className="glass-card-hero">
          <h3>Why you’ll love it</h3>
          <ul>
            <li>🎯 Grade-aware learning plans and quizzes</li>
            <li>💬 AI tutor chat for quick concept help</li>
            <li>🃏 Flashcards & spaced repetition to retain</li>
          </ul>
        </div>

        <div className="glass-card-auth">
          <div className="glass-card-header">
            <span role="img" aria-label="parent">👨‍👩‍👧‍👦</span>
            <h3>Parent Login</h3>
          </div>
          <input
            className="glass-input"
            type="password"
            placeholder="Enter PIN (default: 1234)"
            value={parentPin}
            onChange={(e) => setParentPin(e.target.value)}
          />
          <button
            className="glass-btn solid"
            onClick={handleParentLogin}
            disabled={loading.parent}
          >
            {loading.parent ? "🔄 Verifying..." : "🔓 Parent Login"}
          </button>
          {parentStatus && (
            <p className="glass-status" style={{ color: statusColor }}>
              {parentStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
