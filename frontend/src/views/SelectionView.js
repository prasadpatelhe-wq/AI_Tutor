import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../SoundManager';

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
  const [activeStep, setActiveStep] = useState(0);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Track completion progress
  useEffect(() => {
    let step = 0;
    if (userGrade) step = 1;
    if (userGrade && userBoard) step = 2;
    if (userGrade && userBoard && userLanguage) step = 3;
    if (userGrade && userBoard && userLanguage && userSubjectId) step = 4;
    setActiveStep(step);
  }, [userGrade, userBoard, userLanguage, userSubjectId]);

  // Clean Duolingo-inspired theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#58CC02',       // Duolingo green
          secondary: '#FF9600',     // Orange
          accent: '#1CB0F6',        // Blue
          background: '#f7f7f7',
          cardBg: '#ffffff',
          borderColor: '#e5e5e5',
          textPrimary: '#3c3c3c',
          textSecondary: '#777777',
          labelColor: '#58CC02',
          successGreen: '#58CC02',
          borderRadius: '16px',
          shadowColor: 'rgba(0,0,0,0.1)',
          stepColors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF'],
        };
      case 'teen':
        return {
          primary: '#1CB0F6',       // Blue
          secondary: '#8549BA',     // Purple
          accent: '#FF4B4B',        // Red
          background: 'linear-gradient(180deg, #131F24 0%, #1a2c35 100%)',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.6)',
          labelColor: '#1CB0F6',
          successGreen: '#58CC02',
          borderRadius: '16px',
          shadowColor: 'rgba(0,0,0,0.3)',
          stepColors: ['#1CB0F6', '#8549BA', '#FF9600', '#58CC02'],
        };
      case 'mature':
      default:
        return {
          primary: '#1CB0F6',
          secondary: '#58CC02',
          accent: '#FF9600',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
          cardBg: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          textPrimary: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.5)',
          labelColor: '#1CB0F6',
          successGreen: '#58CC02',
          borderRadius: '12px',
          shadowColor: 'rgba(0,0,0,0.4)',
          stepColors: ['#1CB0F6', '#58CC02', '#FF9600', '#8549BA'],
        };
    }
  };

  const themeStyles = getThemeStyles();
  const allSelected = userGrade && userBoard && userLanguage && userSubjectId;
  const isLightTheme = theme === 'kids';

  // Handle button click
  const handleBeginJourney = () => {
    if (allSelected) {
      soundManager.playAchievementSound();
      setupLearning();
    }
  };

  return (
    <div className="content-section" style={{ position: 'relative' }}>
      {/* Clean CSS without heavy animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .selection-card {
          animation: fadeIn 0.4s ease-out;
          animation-fill-mode: both;
        }
        
        .selection-card:nth-child(1) { animation-delay: 0.05s; }
        .selection-card:nth-child(2) { animation-delay: 0.1s; }
        .selection-card:nth-child(3) { animation-delay: 0.15s; }
        .selection-card:nth-child(4) { animation-delay: 0.2s; }
        
        .selection-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${themeStyles.shadowColor};
        }
        
        .premium-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${isLightTheme ? '%23777' : '%23fff'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 20px;
          cursor: pointer;
        }
        
        .premium-select:focus {
          border-color: ${themeStyles.primary};
          outline: none;
          box-shadow: 0 0 0 3px ${themeStyles.primary}30;
        }
        
        .premium-button {
          transition: all 0.2s ease;
        }
        
        .premium-button:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        
        .premium-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .check-icon {
          animation: checkPop 0.3s ease-out;
        }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <h2 style={{
          color: themeStyles.textPrimary,
          fontSize: theme === 'kids' ? '1.8rem' : '1.6rem',
          fontWeight: '700',
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          📚 Set Up Your Learning Journey
        </h2>
        <p style={{
          color: themeStyles.textSecondary,
          fontSize: '1rem',
          margin: 0
        }}>
          Complete these steps to personalize your experience
        </p>
      </div>

      {/* Progress Steps - Duolingo style */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '40px'
      }}>
        {['Grade', 'Board', 'Language', 'Subject'].map((label, i) => {
          const isCompleted = activeStep > i;
          const isCurrent = activeStep === i;

          return (
            <React.Fragment key={label}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted
                    ? themeStyles.successGreen
                    : isCurrent
                      ? themeStyles.primary
                      : isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted || isCurrent ? 'white' : themeStyles.textSecondary,
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  border: isCurrent ? `3px solid ${themeStyles.primary}40` : 'none'
                }}>
                  {isCompleted ? (
                    <span className="check-icon" style={{ fontSize: '18px' }}>✓</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: isCompleted || isCurrent ? themeStyles.primary : themeStyles.textSecondary,
                  transition: 'all 0.3s ease'
                }}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  background: activeStep > i
                    ? themeStyles.successGreen
                    : isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
                  marginBottom: '24px',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selection Cards */}
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Grade Selection */}
        <div
          className="selection-card"
          style={{
            background: themeStyles.cardBg,
            border: `2px solid ${userGrade ? themeStyles.successGreen : themeStyles.borderColor}`,
            borderRadius: themeStyles.borderRadius,
            padding: '20px',
            marginBottom: '16px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600',
              color: themeStyles.labelColor,
              fontSize: '15px'
            }}>
              <span style={{ fontSize: '20px' }}>🎓</span>
              Select Your Grade
            </label>
            {userGrade && (
              <span className="check-icon" style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: themeStyles.successGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>✓</span>
            )}
          </div>
          <select
            className="premium-select"
            value={userGrade || ''}
            onChange={(e) => {
              soundManager.playClickSound();
              setUserGrade(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '14px 48px 14px 16px',
              borderRadius: '12px',
              border: `2px solid ${themeStyles.borderColor}`,
              fontSize: '15px',
              fontWeight: '500',
              background: isLightTheme ? 'white' : 'rgba(255,255,255,0.05)',
              color: themeStyles.textPrimary,
              transition: 'all 0.2s ease'
            }}
          >
            <option value="">Choose your grade level...</option>
            {grades.map(g => (
              <option key={g.id} value={g.name}>{g.display || g.name}</option>
            ))}
          </select>
        </div>

        {/* Board Selection */}
        <div
          className="selection-card"
          style={{
            background: themeStyles.cardBg,
            border: `2px solid ${userBoard ? themeStyles.successGreen : themeStyles.borderColor}`,
            borderRadius: themeStyles.borderRadius,
            padding: '20px',
            marginBottom: '16px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600',
              color: themeStyles.labelColor,
              fontSize: '15px'
            }}>
              <span style={{ fontSize: '20px' }}>🏫</span>
              Select Your Board
            </label>
            {userBoard && (
              <span className="check-icon" style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: themeStyles.successGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>✓</span>
            )}
          </div>
          <select
            className="premium-select"
            value={userBoard || ''}
            onChange={(e) => {
              soundManager.playClickSound();
              setUserBoard(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '14px 48px 14px 16px',
              borderRadius: '12px',
              border: `2px solid ${themeStyles.borderColor}`,
              fontSize: '15px',
              fontWeight: '500',
              background: isLightTheme ? 'white' : 'rgba(255,255,255,0.05)',
              color: themeStyles.textPrimary,
              transition: 'all 0.2s ease'
            }}
          >
            <option value="">Choose your education board...</option>
            {boards.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Language Selection */}
        <div
          className="selection-card"
          style={{
            background: themeStyles.cardBg,
            border: `2px solid ${userLanguage ? themeStyles.successGreen : themeStyles.borderColor}`,
            borderRadius: themeStyles.borderRadius,
            padding: '20px',
            marginBottom: '16px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600',
              color: themeStyles.labelColor,
              fontSize: '15px'
            }}>
              <span style={{ fontSize: '20px' }}>🌍</span>
              Select Language Medium
            </label>
            {userLanguage && (
              <span className="check-icon" style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: themeStyles.successGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>✓</span>
            )}
          </div>
          <select
            className="premium-select"
            value={userLanguage || ''}
            onChange={(e) => {
              soundManager.playClickSound();
              setUserLanguage(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '14px 48px 14px 16px',
              borderRadius: '12px',
              border: `2px solid ${themeStyles.borderColor}`,
              fontSize: '15px',
              fontWeight: '500',
              background: isLightTheme ? 'white' : 'rgba(255,255,255,0.05)',
              color: themeStyles.textPrimary,
              transition: 'all 0.2s ease'
            }}
          >
            <option value="">Choose your preferred language...</option>
            {languages.map(l => (
              <option key={l.id} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div
          className="selection-card"
          style={{
            background: themeStyles.cardBg,
            border: `2px solid ${userSubjectId ? themeStyles.successGreen : themeStyles.borderColor}`,
            borderRadius: themeStyles.borderRadius,
            padding: '20px',
            marginBottom: '24px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600',
              color: themeStyles.labelColor,
              fontSize: '15px'
            }}>
              <span style={{ fontSize: '20px' }}>📖</span>
              Select Your Subject
            </label>
            {userSubjectId && (
              <span className="check-icon" style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: themeStyles.successGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>✓</span>
            )}
          </div>
          <select
            className="premium-select"
            value={userSubjectId || ''}
            onChange={(e) => {
              soundManager.playClickSound();
              handleSubjectChange(e);
            }}
            style={{
              width: '100%',
              padding: '14px 48px 14px 16px',
              borderRadius: '12px',
              border: `2px solid ${themeStyles.borderColor}`,
              fontSize: '15px',
              fontWeight: '500',
              background: isLightTheme ? 'white' : 'rgba(255,255,255,0.05)',
              color: themeStyles.textPrimary,
              transition: 'all 0.2s ease'
            }}
          >
            <option value="">Choose a subject to explore...</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Summary Card - Only show when at least one selection made */}
        {activeStep > 0 && (
          <div style={{
            background: isLightTheme
              ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)'
              : 'linear-gradient(135deg, rgba(28, 176, 246, 0.1) 0%, rgba(88, 204, 2, 0.1) 100%)',
            border: `1px solid ${themeStyles.primary}30`,
            borderRadius: themeStyles.borderRadius,
            padding: '20px',
            marginBottom: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <h4 style={{
              color: themeStyles.primary,
              marginBottom: '16px',
              fontSize: '15px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✨ Your Learning Profile
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '14px'
            }}>
              {[
                { icon: '🎓', label: 'Grade', value: userGrade },
                { icon: '🏫', label: 'Board', value: userBoard },
                { icon: '🌍', label: 'Language', value: userLanguage },
                { icon: '📖', label: 'Subject', value: subjects.find(s => String(s.id) === String(userSubjectId))?.name }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: isLightTheme ? 'white' : 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    border: `1px solid ${themeStyles.borderColor}`
                  }}
                >
                  <span>{item.icon}</span>
                  <div>
                    <div style={{
                      color: themeStyles.textSecondary,
                      fontSize: '12px',
                      marginBottom: '2px'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      color: item.value ? themeStyles.textPrimary : themeStyles.textSecondary,
                      fontWeight: '600',
                      fontSize: '13px'
                    }}>
                      {item.value || 'Not selected'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Begin Button - Duolingo style */}
        <button
          className="premium-button"
          onClick={handleBeginJourney}
          disabled={!allSelected}
          style={{
            width: '100%',
            padding: '18px 32px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '17px',
            fontWeight: '700',
            cursor: allSelected ? 'pointer' : 'not-allowed',
            background: allSelected
              ? themeStyles.successGreen
              : isLightTheme ? '#e5e5e5' : 'rgba(255,255,255,0.1)',
            color: allSelected ? 'white' : themeStyles.textSecondary,
            boxShadow: allSelected
              ? `0 4px 0 0 #46a302, 0 8px 16px rgba(88, 204, 2, 0.3)`
              : 'none',
            marginBottom: '8px'
          }}
        >
          🚀 Start Learning!
        </button>

        {/* Status Message */}
        {selectionStatus && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            borderRadius: themeStyles.borderRadius,
            background: selectionStatus.includes('❌')
              ? 'rgba(255, 75, 75, 0.1)'
              : 'rgba(88, 204, 2, 0.1)',
            border: `1px solid ${selectionStatus.includes('❌') ? '#FF4B4B' : '#58CC02'}30`,
            color: selectionStatus.includes('❌') ? '#FF4B4B' : themeStyles.successGreen,
            fontWeight: '600',
            fontSize: '14px',
            marginTop: '16px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {selectionStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionView;
