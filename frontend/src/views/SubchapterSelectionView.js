import React from 'react';

const SubchapterSelectionView = ({ selectedDbSubchapter, setSelectedDbSubchapter, dbSubchapters, onContinue, theme = 'teen' }) => {

  // Theme-based styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#FF6B9D',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          cardBg: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(255, 230, 109, 0.1))',
          headerGradient: 'linear-gradient(135deg, #4ECDC4, #44B89D, #FFE66D)',
          borderRadius: '25px',
          selectBg: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          fontSize: '1.1rem',
          buttonGradient: 'linear-gradient(135deg, #4ECDC4, #44B89D)',
        };
      case 'teen':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4fd1c5',
          cardBg: 'linear-gradient(135deg, rgba(79, 209, 197, 0.1), rgba(102, 126, 234, 0.1))',
          headerGradient: 'linear-gradient(135deg, #4fd1c5, #667eea)',
          borderRadius: '20px',
          selectBg: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          fontSize: '1rem',
          buttonGradient: 'linear-gradient(135deg, #4fd1c5, #38B2AC)',
        };
      case 'mature':
      default:
        return {
          primary: '#38B2AC',
          secondary: '#4A5568',
          accent: '#68D391',
          cardBg: 'rgba(45, 55, 72, 0.8)',
          headerGradient: 'linear-gradient(135deg, #68D391, #38B2AC)',
          borderRadius: '12px',
          selectBg: 'rgba(45, 55, 72, 0.9)',
          textColor: '#E2E8F0',
          fontSize: '1rem',
          buttonGradient: 'linear-gradient(135deg, #68D391, #48BB78)',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        animation: 'slideUp 0.6s ease-out'
      }}>
        <div style={{
          fontSize: theme === 'kids' ? '4rem' : '3rem',
          marginBottom: '15px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          📚
        </div>
        <h2 style={{
          background: themeStyles.headerGradient,
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 3s linear infinite',
          fontSize: theme === 'kids' ? '2.2rem' : '1.8rem',
          fontWeight: '700',
          margin: 0,
          marginBottom: '10px'
        }}>
          Select Your Topic
        </h2>
        <p style={{
          color: theme === 'mature' ? '#A0AEC0' : '#666',
          fontSize: theme === 'kids' ? '1.1rem' : '1rem',
          margin: 0
        }}>
          Pick a specific topic to dive deeper! 🎯
        </p>
      </div>

      {/* Selection Card */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        padding: theme === 'kids' ? '40px' : '30px',
        background: themeStyles.cardBg,
        borderRadius: themeStyles.borderRadius,
        boxShadow: theme === 'mature'
          ? '0 10px 40px rgba(0,0,0,0.3)'
          : '0 15px 50px rgba(79, 209, 197, 0.15)',
        border: `1px solid ${themeStyles.primary}30`,
        animation: 'slideUp 0.6s ease-out 0.1s both',
        backdropFilter: 'blur(10px)'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '15px',
          fontWeight: '600',
          color: themeStyles.primary,
          fontSize: themeStyles.fontSize
        }}>
          📖 Available Topics
        </label>

        {/* Topic Cards or Select */}
        {dbSubchapters.length <= 6 ? (
          // Card-based selection for fewer options
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '25px'
          }}>
            {dbSubchapters.map((sc, index) => (
              <div
                key={sc.id}
                onClick={() => setSelectedDbSubchapter(sc.id)}
                style={{
                  padding: theme === 'kids' ? '20px' : '16px',
                  background: String(selectedDbSubchapter) === String(sc.id)
                    ? themeStyles.buttonGradient
                    : theme === 'mature' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  borderRadius: theme === 'kids' ? '18px' : '12px',
                  border: String(selectedDbSubchapter) === String(sc.id)
                    ? 'none'
                    : `2px solid ${themeStyles.primary}30`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: String(selectedDbSubchapter) === String(sc.id)
                    ? `0 8px 25px ${themeStyles.primary}40`
                    : '0 2px 10px rgba(0,0,0,0.05)',
                  transform: String(selectedDbSubchapter) === String(sc.id)
                    ? 'scale(1.02)'
                    : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (String(selectedDbSubchapter) !== String(sc.id)) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${themeStyles.primary}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (String(selectedDbSubchapter) !== String(sc.id)) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    filter: String(selectedDbSubchapter) === String(sc.id) ? 'none' : 'grayscale(0.3)'
                  }}>
                    {index === 0 ? '🎯' : index === 1 ? '💡' : '📝'}
                  </span>
                  <span style={{
                    fontWeight: '600',
                    color: String(selectedDbSubchapter) === String(sc.id)
                      ? 'white'
                      : theme === 'mature' ? '#E2E8F0' : '#333',
                    fontSize: theme === 'kids' ? '1rem' : '0.95rem'
                  }}>
                    {sc.title}
                  </span>
                </div>
                {sc.description && (
                  <p style={{
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    color: String(selectedDbSubchapter) === String(sc.id)
                      ? 'rgba(255,255,255,0.85)'
                      : theme === 'mature' ? '#A0AEC0' : '#666',
                    margin: '8px 0 0 0'
                  }}>
                    {sc.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Dropdown for many options
          <div style={{
            position: 'relative',
            marginBottom: '25px'
          }}>
            <select
              value={selectedDbSubchapter || ""}
              onChange={(e) => setSelectedDbSubchapter(e.target.value)}
              style={{
                width: '100%',
                padding: theme === 'kids' ? '18px 50px 18px 20px' : '15px 45px 15px 18px',
                borderRadius: themeStyles.borderRadius,
                border: `2px solid ${themeStyles.primary}40`,
                fontSize: themeStyles.fontSize,
                fontWeight: '500',
                background: themeStyles.selectBg,
                color: themeStyles.textColor,
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${themeStyles.primary}15`
              }}
              onFocus={(e) => {
                e.target.style.borderColor = themeStyles.primary;
                e.target.style.boxShadow = `0 0 0 3px ${themeStyles.primary}30`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${themeStyles.primary}40`;
                e.target.style.boxShadow = `0 4px 15px ${themeStyles.primary}15`;
              }}
            >
              <option value="">🎯 Choose a Topic...</option>
              {dbSubchapters.map((sc, index) => (
                <option key={sc.id} value={sc.id} style={{
                  padding: '12px',
                  background: theme === 'mature' ? '#2D3748' : '#fff',
                  color: theme === 'mature' ? '#E2E8F0' : '#333'
                }}>
                  {index + 1}. {sc.title}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: themeStyles.primary,
              fontSize: '1.2rem'
            }}>
              ▼
            </div>
          </div>
        )}

        {/* Selected Preview */}
        {selectedDbSubchapter && (
          <div style={{
            padding: '20px',
            background: theme === 'mature' ? 'rgba(104, 211, 145, 0.1)' : `${themeStyles.primary}10`,
            borderRadius: theme === 'kids' ? '15px' : '10px',
            marginBottom: '25px',
            border: `1px solid ${themeStyles.primary}30`,
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '1.5rem', animation: 'bounce 1s ease-in-out infinite' }}>🎉</span>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: themeStyles.primary,
                  marginBottom: '4px'
                }}>
                  Ready to Learn!
                </div>
                <div style={{
                  color: theme === 'mature' ? '#E2E8F0' : '#555',
                  fontSize: '0.95rem'
                }}>
                  {dbSubchapters.find(sc => String(sc.id) === String(selectedDbSubchapter))?.title || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          disabled={!selectedDbSubchapter}
          onClick={onContinue}
          style={{
            width: '100%',
            padding: theme === 'kids' ? '18px 30px' : '15px 25px',
            background: selectedDbSubchapter ? themeStyles.buttonGradient : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: themeStyles.borderRadius,
            fontSize: theme === 'kids' ? '1.2rem' : '1.1rem',
            fontWeight: '700',
            cursor: selectedDbSubchapter ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: selectedDbSubchapter
              ? `0 8px 25px ${themeStyles.primary}40`
              : 'none',
            opacity: selectedDbSubchapter ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            if (selectedDbSubchapter) {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = `0 12px 35px ${themeStyles.primary}50`;
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = selectedDbSubchapter
              ? `0 8px 25px ${themeStyles.primary}40`
              : 'none';
          }}
        >
          🚀 Start Learning!
        </button>
      </div>

      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '40px',
        animation: 'slideUp 0.6s ease-out 0.2s both'
      }}>
        <div style={{
          width: '40px',
          height: '6px',
          borderRadius: '3px',
          background: themeStyles.primary
        }} />
        <div style={{
          width: '40px',
          height: '6px',
          borderRadius: '3px',
          background: themeStyles.primary
        }} />
        <div style={{
          width: '40px',
          height: '6px',
          borderRadius: '3px',
          background: `${themeStyles.primary}40`
        }} />
      </div>
    </div>
  );
};

export default SubchapterSelectionView;
