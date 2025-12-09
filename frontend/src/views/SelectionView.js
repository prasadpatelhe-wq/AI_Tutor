import React from 'react';

const SelectionView = ({
  userGrade,
  setUserGrade,
  userBoard,
  setUserBoard,
  userLanguage,
  setUserLanguage,
  userSubjectId,
  handleSubjectChange,
  subjects,
  grades,
  boards,
  languages,
  setupLearning,
  selectionStatus,
  theme = 'teen'
}) => {
  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#FF6B9D',
          cardBg: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '25px',
          labelColor: '#FF6B9D',
        };
      case 'teen':
        return {
          primary: '#667eea',
          cardBg: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          labelColor: '#667eea',
        };
      case 'mature':
      default:
        return {
          primary: '#38B2AC',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          labelColor: '#38B2AC',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="content-section">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <h2 style={{
        textAlign: 'center',
        marginBottom: '40px',
        background: theme !== 'mature'
          ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.primary}aa)`
          : 'none',
        WebkitBackgroundClip: theme !== 'mature' ? 'text' : 'unset',
        WebkitTextFillColor: theme !== 'mature' ? 'transparent' : 'inherit',
        backgroundClip: theme !== 'mature' ? 'text' : 'unset',
        animation: 'slideUp 0.5s ease-out'
      }}>
        📚 Let's Set Up Your Learning Adventure! 📚
      </h2>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Grade Selection */}
        <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            color: themeStyles.labelColor,
            fontSize: theme === 'kids' ? '1.1rem' : '1rem'
          }}>
            📊 Select Your Grade
          </label>
          <select
            value={userGrade || ''}
            onChange={(e) => setUserGrade(e.target.value)}
            style={{
              width: '100%',
              padding: theme === 'kids' ? '15px 18px' : '12px 15px',
              borderRadius: themeStyles.borderRadius,
              border: `2px solid ${themeStyles.primary}40`,
              fontSize: theme === 'kids' ? '1.1rem' : '1rem',
              background: theme === 'mature' ? 'rgba(255,255,255,0.1)' : 'white',
              color: theme === 'mature' ? '#E2E8F0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="">🎓 Choose your grade level...</option>
            {grades.map(g => (
              <option key={g.id} value={g.name}>{g.display || g.name}</option>
            ))}
          </select>
        </div>

        {/* Board Selection */}
        <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            color: themeStyles.labelColor,
            fontSize: theme === 'kids' ? '1.1rem' : '1rem'
          }}>
            🏫 Select Your Board
          </label>
          <select
            value={userBoard || ''}
            onChange={(e) => setUserBoard(e.target.value)}
            style={{
              width: '100%',
              padding: theme === 'kids' ? '15px 18px' : '12px 15px',
              borderRadius: themeStyles.borderRadius,
              border: `2px solid ${themeStyles.primary}40`,
              fontSize: theme === 'kids' ? '1.1rem' : '1rem',
              background: theme === 'mature' ? 'rgba(255,255,255,0.1)' : 'white',
              color: theme === 'mature' ? '#E2E8F0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="">🏛️ Choose your education board...</option>
            {boards.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Language Selection */}
        <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            color: themeStyles.labelColor,
            fontSize: theme === 'kids' ? '1.1rem' : '1rem'
          }}>
            🌍 Select Language Medium
          </label>
          <select
            value={userLanguage || ''}
            onChange={(e) => setUserLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: theme === 'kids' ? '15px 18px' : '12px 15px',
              borderRadius: themeStyles.borderRadius,
              border: `2px solid ${themeStyles.primary}40`,
              fontSize: theme === 'kids' ? '1.1rem' : '1rem',
              background: theme === 'mature' ? 'rgba(255,255,255,0.1)' : 'white',
              color: theme === 'mature' ? '#E2E8F0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="">🗣️ Choose your preferred language...</option>
            {languages.map(l => (
              <option key={l.id} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div className="kid-card" style={{ animation: 'slideUp 0.5s ease-out 0.4s both' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            color: themeStyles.labelColor,
            fontSize: theme === 'kids' ? '1.1rem' : '1rem'
          }}>
            🔬 Select Your Subject
          </label>
          <select
            value={userSubjectId || ''}
            onChange={handleSubjectChange}
            style={{
              width: '100%',
              padding: theme === 'kids' ? '15px 18px' : '12px 15px',
              borderRadius: themeStyles.borderRadius,
              border: `2px solid ${themeStyles.primary}40`,
              fontSize: theme === 'kids' ? '1.1rem' : '1rem',
              background: theme === 'mature' ? 'rgba(255,255,255,0.1)' : 'white',
              color: theme === 'mature' ? '#E2E8F0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="">📖 Choose a subject to explore...</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Summary Card */}
        {(userGrade || userBoard || userLanguage || userSubjectId) && (
          <div
            className="kid-card"
            style={{
              animation: 'slideUp 0.3s ease-out',
              background: theme === 'mature'
                ? 'rgba(56, 178, 172, 0.1)'
                : `linear-gradient(135deg, ${themeStyles.primary}15, ${themeStyles.primary}05)`,
              border: `1px solid ${themeStyles.primary}30`
            }}
          >
            <h4 style={{
              color: themeStyles.primary,
              marginBottom: '15px',
              fontSize: theme === 'kids' ? '1.1rem' : '1rem'
            }}>
              ✨ Your Learning Profile
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              fontSize: theme === 'kids' ? '0.95rem' : '0.9rem'
            }}>
              <div>📊 Grade: <strong>{userGrade || 'Not selected'}</strong></div>
              <div>🏫 Board: <strong>{userBoard || 'Not selected'}</strong></div>
              <div>🌍 Language: <strong>{userLanguage || 'Not selected'}</strong></div>
              <div>📖 Subject: <strong>{subjects.find(s => String(s.id) === String(userSubjectId))?.name || 'Not selected'}</strong></div>
            </div>
          </div>
        )}

        <div className="button-group" style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}>
          <button
            className="big-button"
            onClick={setupLearning}
            disabled={!userGrade || !userBoard || !userSubjectId}
            style={{
              opacity: (!userGrade || !userBoard || !userSubjectId) ? 0.6 : 1,
              cursor: (!userGrade || !userBoard || !userSubjectId) ? 'not-allowed' : 'pointer'
            }}
          >
            🌟 Begin My Learning Journey!
          </button>
        </div>

        {selectionStatus && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: theme === 'kids' ? '1.1rem' : '1rem',
            fontWeight: '600',
            color: selectionStatus.includes('❌') ? '#fc8181' : 'white',
            padding: '15px',
            background: selectionStatus.includes('❌') ? 'rgba(245, 101, 101, 0.2)' : 'rgba(72, 187, 120, 0.2)',
            borderRadius: themeStyles.borderRadius,
            animation: 'slideUp 0.3s ease-out'
          }}>
            {selectionStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionView;
