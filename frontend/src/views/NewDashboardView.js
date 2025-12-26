/**
 * NewDashboardView - Modern Dashboard matching the "EduLearn" reference style
 * Now with responsive design for mobile/tablet/desktop
 */

import React from 'react';
import { colors, typography, spacing, borderRadius } from '../design/designSystem';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

// ============================================
// ICONS
// ============================================
const Icons = {
  Play: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  ChevronRight: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Configure: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
};

// ============================================
// SUB-COMPONENTS
// ============================================

const Header = ({ student, coins, streak, isMobile }) => (
  <div style={{
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    marginBottom: spacing[6],
    gap: isMobile ? spacing[4] : 0,
  }}>
    <div>
      <h1 style={{
        fontFamily: typography.fontFamily.display,
        fontSize: isMobile ? '24px' : '32px',
        fontWeight: typography.fontWeight.bold,
        color: colors.theme.text,
        margin: 0,
        marginBottom: spacing[2]
      }}>
        Welcome back, {student?.name?.split(' ')[0] || 'Learner'}!
      </h1>
      <p style={{
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.base[0],
        color: colors.theme.textMuted,
        margin: 0
      }}>Ready to continue your learning journey today?</p>
    </div>

    <div style={{ display: 'flex', gap: spacing[3] }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${colors.theme.border}`,
        padding: `${spacing[2]} ${spacing[4]}`,
        borderRadius: borderRadius.full,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      }}>
        <span style={{ fontSize: '18px' }}>🪙</span>
        <span style={{
          fontFamily: typography.fontFamily.display,
          fontWeight: typography.fontWeight.bold,
          color: colors.theme.text,
          fontSize: '14px',
        }}>{coins}</span>
      </div>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${colors.theme.border}`,
        padding: `${spacing[2]} ${spacing[4]}`,
        borderRadius: borderRadius.full,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      }}>
        <span style={{ fontSize: '18px' }}>🔥</span>
        <span style={{
          fontFamily: typography.fontFamily.display,
          fontWeight: typography.fontWeight.bold,
          color: colors.theme.text,
          fontSize: '14px',
        }}>{streak} Days</span>
      </div>
    </div>
  </div>
);

const LanguagePreferenceCard = ({ isMobile }) => (
  <div style={{
    backgroundColor: colors.theme.card,
    borderRadius: borderRadius.xl,
    padding: isMobile ? spacing[4] : spacing[6],
    border: `1px solid ${colors.theme.border}`,
  }}>
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? spacing[4] : 0,
    }}>
      <div style={{ display: 'flex', gap: spacing[4], alignItems: 'center' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: borderRadius.full,
          backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${colors.theme.border}`,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '24px', color: colors.theme.primary }}>文</span>
        </div>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: colors.theme.text,
            margin: `0 0 ${spacing[1]} 0`,
          }}>Language Preference</h3>
          <p style={{
            fontSize: '14px',
            color: colors.theme.textMuted,
            margin: 0,
            lineHeight: 1.5,
          }}>Enhance your understanding by switching to Kannada, English, or Dual Mode.</p>
        </div>
      </div>
      <button style={{
        backgroundColor: colors.theme.primary,
        color: colors.theme.bg,
        border: 'none',
        padding: `${spacing[2.5]} ${spacing[5]}`,
        borderRadius: borderRadius.lg,
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        width: isMobile ? '100%' : 'auto',
      }}>
        Configure Language
      </button>
    </div>
  </div>
);

const NextUpHero = ({ chapter, subject, isMobile }) => (
  <div style={{
    backgroundColor: colors.theme.card,
    borderRadius: borderRadius.xl,
    padding: isMobile ? spacing[4] : spacing[6],
    background: `linear-gradient(135deg, rgba(21, 31, 25, 1) 0%, rgba(26, 46, 36, 1) 100%)`,
    border: `1px solid ${colors.theme.border}`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        display: 'inline-block',
        backgroundColor: 'rgba(0, 255, 132, 0.1)',
        color: colors.theme.primary,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: spacing[2],
      }}>
        AI Recommended
      </div>
      <h2 style={{
        fontFamily: typography.fontFamily.display,
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: typography.fontWeight.bold,
        color: colors.theme.text,
        margin: `${spacing[4]} 0 ${spacing[2]} 0`
      }}>
        Next Best Chapter: {chapter || 'Quadratic Equations'}
      </h2>
      <p style={{
        fontSize: '14px',
        color: colors.theme.textMuted,
        margin: 0,
        lineHeight: 1.5,
        maxWidth: isMobile ? '100%' : '80%',
        marginBottom: spacing[6]
      }}>
        Based on your recent quiz scores, tackling {subject || 'Math'} now will boost your grade significantly.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: spacing[4]
      }}>
        <button style={{
          backgroundColor: colors.theme.primary,
          color: colors.theme.bg,
          border: 'none',
          padding: `${spacing[3]} ${spacing[6]}`,
          borderRadius: borderRadius.lg,
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          boxShadow: '0 4px 12px rgba(0, 255, 132, 0.3)',
        }}>
          <Icons.Play size={20} color={colors.theme.bg} />
          Resume Learning
        </button>
        <div style={{
          display: 'flex',
          gap: spacing[4],
          color: colors.theme.textMuted,
          fontSize: '14px',
          flexWrap: 'wrap',
        }}>
          <span>Difficulty: <span style={{ color: colors.theme.warning }}>Medium</span></span>
          <span>Est. Time: 15 mins</span>
        </div>
      </div>
    </div>
  </div>
);

const QuoteCard = () => (
  <div style={{
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    backgroundColor: colors.theme.secondary,
    color: colors.theme.text,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(43, 78, 255, 0.3)',
    minHeight: '180px',
  }}>
    <span style={{ fontSize: '48px', lineHeight: 0.5, opacity: 0.5, marginBottom: spacing[4] }}>❝</span>
    <p style={{
      fontFamily: typography.fontFamily.display,
      fontSize: '18px',
      fontStyle: 'italic',
      lineHeight: 1.5,
      marginBottom: spacing[4]
    }}>
      "The beautiful thing about learning is that no one can take it away from you."
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
      <div style={{ width: '20px', height: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
      <span style={{ fontSize: '14px', fontWeight: 'bold', opacity: 0.9 }}>B.B. King</span>
    </div>
  </div>
);

const StatsGrid = ({ isMobile, isTablet }) => {
  const items = [
    { label: 'Chapters Read', value: '24', sub: '+2 this week', icon: '📖' },
    { label: 'Quizzes Taken', value: '12', sub: '+1 today', icon: '📝' },
    { label: 'Coins Earned', value: '450', sub: '+50', icon: '🪙' },
    { label: 'Study Streak', value: '5 Days', sub: 'Keep it up!', icon: '🔥' },
  ];

  const getGridColumns = () => {
    if (isMobile) return 'repeat(2, 1fr)';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };

  return (
    <div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: colors.theme.text,
        marginBottom: spacing[4],
      }}>Your Progress</h3>
      <div style={{ display: 'grid', gridTemplateColumns: getGridColumns(), gap: spacing[4] }}>
        {items.map((item, i) => (
          <div key={i} style={{
            backgroundColor: colors.theme.card,
            padding: spacing[5],
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.theme.border}`,
          }}>
            <div style={{ marginBottom: spacing[3], fontSize: '24px' }}>{item.icon}</div>
            <div style={{ color: colors.theme.textMuted, fontSize: '13px', marginBottom: spacing[1] }}>{item.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2], flexWrap: 'wrap' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: colors.theme.text }}>{item.value}</span>
              <span style={{ fontSize: '12px', color: colors.theme.primary }}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubjectsGrid = ({ onContinue, isMobile, isTablet }) => {
  const subjects = [
    { name: 'Mathematics', chapter: 'Chapter 4: Linear Equations', progress: 75, icon: '➗', color: '#1CB0F6', status: 'In Progress' },
    { name: 'Science', chapter: 'Chapter 2: Physics Basics', progress: 30, icon: '⚛️', color: '#8549BA', status: 'In Progress' },
    { name: 'History', chapter: 'Chapter 1: Ancient Civilizations', progress: 0, icon: '🏛️', color: '#FF9600', status: 'Not Started' },
    { name: 'English', chapter: 'Chapter 5: Poetry Analysis', progress: 60, icon: '📝', color: '#FF4B4B', status: 'In Progress' },
  ];

  const getGridColumns = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: colors.theme.text,
          marginBottom: 0,
        }}>Subjects Overview</h3>
        <button style={{
          background: 'none',
          border: 'none',
          color: colors.theme.primary,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>View All</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridColumns(), gap: spacing[4] }}>
        {subjects.map((sub, i) => (
          <div key={i} style={{
            backgroundColor: colors.theme.card,
            borderRadius: borderRadius.lg,
            padding: spacing[5],
            border: `1px solid ${colors.theme.border}`,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[4] }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                backgroundColor: `${sub.color}20`, color: sub.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>
                {sub.icon}
              </div>
              <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', backgroundColor: sub.status === 'In Progress' ? 'rgba(0, 255, 132, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: sub.status === 'In Progress' ? colors.theme.primary : colors.theme.textMuted }}>
                {sub.status.toUpperCase()}
              </span>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.theme.text, margin: `0 0 ${spacing[2]} 0` }}>{sub.name}</h4>
            <p style={{ fontSize: '12px', color: colors.theme.textMuted, margin: `0 0 ${spacing[4]} 0`, minHeight: '32px' }}>{sub.chapter}</p>

            <div style={{ marginBottom: spacing[4] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: colors.theme.textMuted }}>
                <span>{sub.progress}% Complete</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: `${sub.progress}%`, height: '100%', backgroundColor: sub.color, borderRadius: '2px' }}></div>
              </div>
            </div>

            <button style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.theme.border}`,
              color: colors.theme.text,
              padding: '10px',
              borderRadius: borderRadius.lg,
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
            }} onClick={onContinue}>
              {sub.progress > 0 ? 'Continue' : 'Start'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============================================
// MAIN VIEW
// ============================================

const NewDashboardView = ({
  student,
  gameState,
  onContinueLearning,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      <Header
        student={student}
        coins={gameState?.coins || 450}
        streak={gameState?.streak_days || 5}
        isMobile={isMobile}
      />

      <LanguagePreferenceCard isMobile={isMobile} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: spacing[4]
      }}>
        <NextUpHero chapter="Quadratic Equations" subject="Math" isMobile={isMobile} />
        <QuoteCard />
      </div>

      <StatsGrid isMobile={isMobile} isTablet={isTablet} />

      <SubjectsGrid onContinue={onContinueLearning} isMobile={isMobile} isTablet={isTablet} />
    </div>
  );
};

export default NewDashboardView;
