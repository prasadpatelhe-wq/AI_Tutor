/**
 * NewDashboardView - Modern Dashboard with Vibrant Design
 * Inspired by reference images with bright colors and engaging layout
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';
import StatCard from '../components/StatCard';
import SubjectCard from '../components/SubjectCard';
import LanguageToggle from '../components/LanguageToggle';
import DailyTip from '../components/DailyTip';

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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// ============================================
// HEADER COMPONENT
// ============================================
const DashboardHeader = ({ student, coins, grade }) => {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={styles.avatarWrapper}>
          <span style={styles.avatarEmoji}>👤</span>
        </div>
        <div>
          <h1 style={styles.greeting}>Hi, {student?.name || 'Learner'}!</h1>
          <p style={styles.gradeText}>{grade || 'Level 3 Scholar'}</p>
        </div>
      </div>
      <div style={styles.headerRight}>
        {grade && (
          <div style={styles.gradeBadge}>
            <span style={styles.gradeBadgeIcon}>🎓</span>
            <span style={styles.gradeBadgeText}>{grade}</span>
          </div>
        )}
        <div style={styles.coinsBadge}>
          <span style={styles.coinsIcon}>🪙</span>
          <span style={styles.coinsText}>{coins || 0}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HERO "NEXT UP" CARD
// ============================================
const NextUpCard = ({ chapter, difficulty, estimatedTime, onContinue }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!chapter) {
    return (
      <div style={styles.nextUpEmpty}>
        <div style={styles.emptyIconWrapper}>
          <span style={styles.emptyIcon}>📚</span>
        </div>
        <p style={styles.emptyText}>Start your learning journey today!</p>
        <button style={styles.emptyButton} onClick={onContinue}>
          <span>Pick a Chapter</span>
          <Icons.ChevronRight size={18} color={colors.neutral[900]} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.nextUpCard,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorations */}
      <div style={styles.nextUpDecor1} />
      <div style={styles.nextUpDecor2} />
      <div style={styles.nextUpDecor3} />

      {/* Content */}
      <div style={styles.nextUpContent}>
        {/* AI Recommended Badge */}
        <div style={styles.aiBadge}>
          <span style={styles.aiBadgeIcon}>✨</span>
          <span style={styles.aiBadgeText}>AI Recommended</span>
        </div>

        {/* Title */}
        <h2 style={styles.nextUpTitle}>Next Up: {chapter}</h2>

        {/* Meta info */}
        <div style={styles.nextUpMeta}>
          {difficulty && (
            <div style={styles.difficultyBadge}>
              <span style={styles.metaText}>{difficulty}</span>
            </div>
          )}
          {estimatedTime && (
            <div style={styles.timeBadge}>
              <span style={styles.metaText}>⏱ Est. Time: {estimatedTime}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p style={styles.nextUpDescription}>
          Dive back into {chapter.split(':')[0]} where you left off. Complete this chapter to earn 50 bonus coins!
        </p>
      </div>

      {/* CTA Button */}
      <button
        style={{
          ...styles.resumeButton,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        }}
        onClick={onContinue}
      >
        <Icons.Play size={20} color={colors.neutral[900]} />
        <span>Resume Learning</span>
        <Icons.ChevronRight size={20} color={colors.neutral[900]} />
      </button>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const NewDashboardView = ({
  student,
  gameState,
  lastChapter,
  lastMode,
  lastProgress,
  dueFlashcards = 0,
  recentChapters = [],
  onContinueLearning,
  onStartReview,
  onPickChapter,
  onStudyTogether,
  onRecentChapterClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    setMounted(true);
    // Load language preference from localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) setCurrentLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  // Mock data for subjects (you can replace with real data)
  const subjects = [
    {
      icon: '📐',
      name: 'Mathematics',
      description: 'Geometry Basics',
      chaptersCompleted: 6,
      totalChapters: 12,
      status: 'In Progress',
      progressPercent: 75,
      color: colors.primary[500],
    },
    {
      icon: '🧪',
      name: 'Science',
      description: 'Ecosystems',
      chaptersCompleted: 3,
      totalChapters: 10,
      status: 'In Progress',
      progressPercent: 30,
      color: colors.secondary[500],
    },
    {
      icon: '🗺️',
      name: 'Social Studies',
      description: 'Ancient Civilizations',
      chaptersCompleted: 0,
      totalChapters: 15,
      status: 'Not Started',
      progressPercent: 0,
      color: colors.orange[500],
    },
    {
      icon: '🔤',
      name: 'Languages',
      description: 'Grammar 101',
      chaptersCompleted: 0,
      totalChapters: 8,
      status: 'Not Started',
      progressPercent: 0,
      color: colors.purple[500],
    },
  ];

  return (
    <div style={{
      ...styles.container,
      opacity: mounted ? 1 : 0,
    }}>
      {/* Header */}
      <DashboardHeader
        student={student}
        coins={gameState?.coins || 0}
        grade={student?.grade_band}
      />

      {/* Language Toggle */}
      <div style={styles.section}>
        <LanguageToggle
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* Hero Next Up Card */}
      <div style={styles.section}>
        <NextUpCard
          chapter={lastChapter || "Photosynthesis Basics"}
          difficulty="Medium Difficulty"
          estimatedTime="15 mins"
          onContinue={onContinueLearning}
        />
      </div>

      {/* AI Features - Chatbot and Mind Map */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>AI Learning Tools</h2>
        <div style={styles.aiToolsGrid}>
          {/* AI Chatbot Card */}
          <div style={styles.aiToolCard}>
            <div style={styles.aiToolHeader}>
              <div style={{
                ...styles.aiToolIcon,
                backgroundColor: colors.purple[100],
              }}>
                <span style={styles.aiToolEmoji}>🤖</span>
              </div>
              <div style={styles.aiToolBadge}>AI Powered</div>
            </div>
            <h3 style={styles.aiToolTitle}>AI Tutor Chat</h3>
            <p style={styles.aiToolDescription}>
              Ask questions, get instant explanations, and learn at your own pace with our intelligent AI assistant.
            </p>
            <button
              style={{
                ...styles.aiToolButton,
                backgroundColor: colors.purple[500],
              }}
              onClick={onStudyTogether}
            >
              <span>Start Chatting</span>
              <Icons.ChevronRight size={18} color={colors.neutral[0]} />
            </button>
          </div>

          {/* Mind Map Card */}
          <div style={styles.aiToolCard}>
            <div style={styles.aiToolHeader}>
              <div style={{
                ...styles.aiToolIcon,
                backgroundColor: colors.orange[100],
              }}>
                <span style={styles.aiToolEmoji}>🧠</span>
              </div>
              <div style={{
                ...styles.aiToolBadge,
                backgroundColor: colors.orange[100],
                color: colors.orange[800],
              }}>Coming Soon</div>
            </div>
            <h3 style={styles.aiToolTitle}>Mind Maps</h3>
            <p style={styles.aiToolDescription}>
              Visualize concepts and connections with interactive mind maps for better understanding.
            </p>
            <button
              style={{
                ...styles.aiToolButton,
                backgroundColor: colors.neutral[300],
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
              disabled
            >
              <span>Coming Soon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div style={styles.section}>
        <DailyTip />
      </div>

      {/* Your Progress - Stats Grid */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Progress</h2>
        <div style={styles.statsGrid}>
          <StatCard
            icon="📚"
            value={recentChapters.length || 12}
            label="Chapters Read"
            color={colors.primary[500]}
          />
          <StatCard
            icon="🎯"
            value={gameState?.quizzes_completed || 8}
            label="Quizzes Taken"
            color={colors.purple[500]}
          />
          <StatCard
            icon="🪙"
            value={gameState?.coins || 1240}
            label="Coins Earned"
            color={colors.accent[500]}
          />
          <StatCard
            icon="🔥"
            value={gameState?.streak_days || 5}
            label="Day Streak"
            color={colors.orange[500]}
          />
        </div>
      </div>

      {/* My Subjects */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>My Subjects</h2>
          <button style={styles.viewAllButton} onClick={onPickChapter}>
            View All
          </button>
        </div>
        <div style={styles.subjectsGrid}>
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              {...subject}
              onContinue={onPickChapter}
              onStart={onPickChapter}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
    paddingBottom: spacing[8],
    transition: `opacity ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    flexWrap: 'wrap',
    gap: spacing[3],
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  avatarWrapper: {
    width: '52px',
    height: '52px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarEmoji: {
    fontSize: '28px',
  },

  greeting: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
    lineHeight: 1.2,
  },

  gradeText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    margin: 0,
    fontWeight: typography.fontWeight.medium,
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  gradeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1.5],
    backgroundColor: colors.neutral[100],
    padding: `${spacing[1.5]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
    border: `1px solid ${colors.neutral[200]}`,
  },

  gradeBadgeIcon: {
    fontSize: '16px',
  },

  gradeBadgeText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
  },

  coinsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1.5],
    backgroundColor: colors.accent[100],
    padding: `${spacing[1.5]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
    border: `1px solid ${colors.accent[300]}`,
  },

  coinsIcon: {
    fontSize: '16px',
  },

  coinsText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent[800],
  },

  // Next Up Card
  nextUpCard: {
    position: 'relative',
    background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    overflow: 'hidden',
    boxShadow: shadows.lg,
    transition: `all ${transitions.duration.normal} ${transitions.easing.out}`,
  },

  nextUpEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius['2xl'],
    padding: `${spacing[10]} ${spacing[6]}`,
    border: `2px dashed ${colors.neutral[300]}`,
  },

  emptyIconWrapper: {
    fontSize: '64px',
  },

  emptyIcon: {
    display: 'block',
  },

  emptyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg[0],
    color: colors.neutral[600],
    margin: 0,
    textAlign: 'center',
  },

  emptyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    padding: `${spacing[3]} ${spacing[6]}`,
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutalSm,
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  // Decorative elements
  nextUpDecor1: {
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  nextUpDecor2: {
    position: 'absolute',
    bottom: '-30px',
    right: '20%',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  nextUpDecor3: {
    position: 'absolute',
    bottom: '30%',
    left: '-20px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },

  nextUpContent: {
    position: 'relative',
    zIndex: 1,
    marginBottom: spacing[5],
  },

  aiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    padding: `${spacing[1]} ${spacing[2.5]}`,
    borderRadius: borderRadius.full,
    marginBottom: spacing[3],
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutalSm,
  },

  aiBadgeIcon: {
    fontSize: '12px',
  },

  aiBadgeText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  nextUpTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[0],
    margin: `0 0 ${spacing[3]} 0`,
    lineHeight: 1.2,
  },

  nextUpMeta: {
    display: 'flex',
    gap: spacing[2],
    marginBottom: spacing[3],
    flexWrap: 'wrap',
  },

  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: `${spacing[1]} ${spacing[2.5]}`,
    borderRadius: borderRadius.full,
  },

  timeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: `${spacing[1]} ${spacing[2.5]}`,
    borderRadius: borderRadius.full,
  },

  metaText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[0],
  },

  nextUpDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
    lineHeight: 1.6,
  },

  resumeButton: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    padding: `${spacing[4]} ${spacing[6]}`,
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutal,
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.bounce}`,
  },

  // Section headers
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },

  sectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },

  viewAllButton: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: spacing[3],
  },

  // AI Tools Grid
  aiToolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: spacing[4],
  },

  aiToolCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    border: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  aiToolHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  aiToolIcon: {
    width: '56px',
    height: '56px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiToolEmoji: {
    fontSize: '32px',
  },

  aiToolBadge: {
    padding: `${spacing[1]} ${spacing[2.5]}`,
    borderRadius: borderRadius.full,
    backgroundColor: colors.purple[100],
    color: colors.purple[800],
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xs'][0],
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  aiToolTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },

  aiToolDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
  },

  aiToolButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    width: '100%',
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: borderRadius.lg,
    border: 'none',
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[0],
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  // Subjects Grid
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: spacing[4],
  },
};

export default NewDashboardView;
