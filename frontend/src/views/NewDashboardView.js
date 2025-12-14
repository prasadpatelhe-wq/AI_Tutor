/**
 * NewDashboardView - Home screen (post-login)
 *
 * Primary blocks:
 * - Continue Learning (last chapter + last mode)
 * - Today's Review (due flashcards count)
 * - Pick a chapter (shortcut)
 *
 * Secondary:
 * - Streak badge
 * - Recent chapters list
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

// ============================================
// ICONS
// ============================================
const Icons = {
  Play: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Book: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Repeat: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Flame: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.07 2.34-5.64 4.45-7.55C9.53 5.55 11 3.45 11 1c0 0 2.5 1.5 2.5 5 0 1.93-1 3.5-2 4.5 1.5-.5 3-2 3.5-3.5 0 0 3 3.5 3 7.5 0 4.42-4.03 8.5-6 8.5z"/>
    </svg>
  ),
  ChevronRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Clock: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Sparkles: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L14.09 8.26L20 9.27L15.55 14.14L16.91 20.02L12 16.77L7.09 20.02L8.45 14.14L4 9.27L9.91 8.26L12 2Z"/>
    </svg>
  ),
  Target: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  MessageCircle: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Greeting Header
const GreetingHeader = ({ studentName, streakDays }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={styles.greetingHeader}>
      <div style={styles.greetingText}>
        <span style={styles.greetingLabel}>{getGreeting()}</span>
        <h1 style={styles.greetingName}>{studentName || 'Learner'}</h1>
      </div>
      {streakDays > 0 && (
        <div style={styles.streakBadge}>
          <Icons.Flame size={18} color={colors.secondary[500]} />
          <span style={styles.streakCount}>{streakDays}</span>
          <span style={styles.streakLabel}>day streak</span>
        </div>
      )}
    </div>
  );
};

// Continue Learning Card - Hero card
const ContinueLearningCard = ({ chapter, mode, progress, onContinue }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!chapter) {
    return (
      <div style={styles.continueCardEmpty}>
        <div style={styles.emptyIconWrapper}>
          <Icons.Book size={32} color={colors.neutral[400]} />
        </div>
        <p style={styles.emptyText}>Start your learning journey</p>
        <button
          style={styles.emptyButton}
          onClick={onContinue}
        >
          Pick a chapter
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.continueCard,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? shadows.xl : shadows.lg,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      <div style={styles.continueCardDecor1} />
      <div style={styles.continueCardDecor2} />

      <div style={styles.continueCardContent}>
        <span style={styles.continueBadge}>
          <Icons.Clock size={12} color={colors.neutral[0]} />
          Continue where you left off
        </span>

        <h2 style={styles.continueTitle}>{chapter}</h2>

        <div style={styles.continueModeTag}>
          {mode === 'text' && <Icons.Book size={14} color={colors.primary[600]} />}
          {mode === 'study' && <Icons.MessageCircle size={14} color={colors.primary[600]} />}
          {mode === 'practice' && <Icons.Target size={14} color={colors.primary[600]} />}
          <span>{mode === 'text' ? 'Reading' : mode === 'study' ? 'Study Together' : 'Practice'}</span>
        </div>

        {/* Progress bar */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress || 0}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>{progress || 0}% complete</span>
        </div>
      </div>

      <button
        style={{
          ...styles.continueButton,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
        onClick={onContinue}
      >
        <Icons.Play size={20} color={colors.neutral[900]} />
      </button>
    </div>
  );
};

// Today's Review Card
const TodayReviewCard = ({ dueCount, onStartReview }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasDue = dueCount > 0;

  return (
    <div
      style={{
        ...styles.reviewCard,
        ...(hasDue ? styles.reviewCardActive : {}),
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.reviewCardLeft}>
        <div style={{
          ...styles.reviewIconWrapper,
          backgroundColor: hasDue ? colors.secondary[100] : colors.neutral[100],
        }}>
          <Icons.Repeat
            size={22}
            color={hasDue ? colors.secondary[500] : colors.neutral[500]}
          />
        </div>
        <div>
          <h3 style={styles.reviewTitle}>Today's Review</h3>
          <p style={styles.reviewSubtitle}>
            {hasDue
              ? `${dueCount} card${dueCount > 1 ? 's' : ''} ready to review`
              : 'All caught up!'
            }
          </p>
        </div>
      </div>

      {hasDue && (
        <button
          style={styles.reviewButton}
          onClick={onStartReview}
        >
          Start
          <Icons.ChevronRight size={16} color={colors.neutral[0]} />
        </button>
      )}
    </div>
  );
};

// Quick Action Card
const QuickActionCard = ({ icon: Icon, label, sublabel, onClick, accent = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.quickAction,
        ...(accent ? styles.quickActionAccent : {}),
        transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? (accent ? shadows.brutalAccent : shadows.md) : (accent ? shadows.brutalSm : shadows.sm),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{
        ...styles.quickActionIcon,
        backgroundColor: accent ? colors.neutral[900] : colors.primary[100],
      }}>
        <Icon size={20} color={accent ? colors.accent[400] : colors.primary[600]} />
      </div>
      <div style={styles.quickActionText}>
        <span style={{
          ...styles.quickActionLabel,
          color: accent ? colors.neutral[900] : colors.neutral[800],
        }}>{label}</span>
        {sublabel && (
          <span style={styles.quickActionSublabel}>{sublabel}</span>
        )}
      </div>
      <Icons.ChevronRight
        size={18}
        color={accent ? colors.neutral[900] : colors.neutral[400]}
      />
    </button>
  );
};

// Recent Chapter Item
const RecentChapterItem = ({ chapter, subject, lastAccessed, onClick }) => {
  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <button style={styles.recentItem} onClick={onClick}>
      <div style={styles.recentItemLeft}>
        <div style={styles.recentDot} />
        <div>
          <p style={styles.recentChapter}>{chapter}</p>
          <p style={styles.recentSubject}>{subject}</p>
        </div>
      </div>
      <span style={styles.recentTime}>{formatTime(lastAccessed)}</span>
    </button>
  );
};

// Section Header
const SectionHeader = ({ title, action, onAction }) => (
  <div style={styles.sectionHeader}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    {action && (
      <button style={styles.sectionAction} onClick={onAction}>
        {action}
      </button>
    )}
  </div>
);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{
      ...styles.container,
      opacity: mounted ? 1 : 0,
    }}>
      {/* Greeting */}
      <GreetingHeader
        studentName={student?.name}
        streakDays={gameState?.streak_days || 0}
      />

      {/* Continue Learning - Hero Card */}
      <div style={styles.section}>
        <ContinueLearningCard
          chapter={lastChapter}
          mode={lastMode}
          progress={lastProgress}
          onContinue={onContinueLearning}
        />
      </div>

      {/* Today's Review */}
      <div style={styles.section}>
        <TodayReviewCard
          dueCount={dueFlashcards}
          onStartReview={onStartReview}
        />
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <SectionHeader title="Quick Actions" />
        <div style={styles.quickActionsGrid}>
          <QuickActionCard
            icon={Icons.Book}
            label="Pick a chapter"
            sublabel="Browse curriculum"
            onClick={onPickChapter}
            accent
          />
          <QuickActionCard
            icon={Icons.MessageCircle}
            label="Study Together"
            sublabel="Chat with AI tutor"
            onClick={onStudyTogether}
          />
        </div>
      </div>

      {/* Recent Chapters */}
      {recentChapters.length > 0 && (
        <div style={styles.section}>
          <SectionHeader
            title="Recent Chapters"
            action="See all"
            onAction={onPickChapter}
          />
          <div style={styles.recentList}>
            {recentChapters.slice(0, 3).map((item, index) => (
              <RecentChapterItem
                key={index}
                chapter={item.chapter}
                subject={item.subject}
                lastAccessed={item.lastAccessed}
                onClick={() => onRecentChapterClick?.(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stats Summary - Compact */}
      {gameState && (
        <div style={styles.section}>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{gameState.quizzes_completed || 0}</span>
              <span style={styles.statLabel}>Quizzes</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statValue}>{gameState.total_score || 0}</span>
              <span style={styles.statLabel}>Points</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statValue}>{gameState.coins || 0}</span>
              <span style={styles.statLabel}>Coins</span>
            </div>
          </div>
        </div>
      )}
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
    paddingBottom: spacing[4],
    transition: `opacity ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },

  // Greeting
  greetingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },

  greetingText: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },

  greetingLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[500],
  },

  greetingName: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['3xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
    letterSpacing: typography.letterSpacing.tight,
  },

  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1.5],
    backgroundColor: colors.secondary[50],
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
    border: `1px solid ${colors.secondary[200]}`,
  },

  streakCount: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary[600],
  },

  streakLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.secondary[600],
  },

  // Continue Learning Card
  continueCard: {
    position: 'relative',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    overflow: 'hidden',
    transition: `all ${transitions.duration.normal} ${transitions.easing.out}`,
  },

  continueCardEmpty: {
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
    width: '64px',
    height: '64px',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base[0],
    color: colors.neutral[500],
    margin: 0,
  },

  emptyButton: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },

  continueCardDecor1: {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: colors.primary[400],
    opacity: 0.5,
  },

  continueCardDecor2: {
    position: 'absolute',
    bottom: '-30px',
    left: '30%',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary[600],
    opacity: 0.3,
  },

  continueCardContent: {
    position: 'relative',
    zIndex: 1,
  },

  continueBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[0],
    opacity: 0.9,
    marginBottom: spacing[3],
  },

  continueTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[0],
    margin: `0 0 ${spacing[2]} 0`,
    lineHeight: 1.2,
  },

  continueModeTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    backgroundColor: colors.neutral[0],
    padding: `${spacing[1]} ${spacing[2.5]}`,
    borderRadius: borderRadius.full,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[600],
    marginBottom: spacing[4],
  },

  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: colors.primary[400],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent[400],
    borderRadius: borderRadius.full,
    transition: `width ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  progressText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[0],
    opacity: 0.9,
  },

  continueButton: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[6],
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent[400],
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutalSm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `transform ${transitions.duration.fast} ${transitions.easing.bounce}`,
    zIndex: 2,
  },

  // Review Card
  reviewCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    border: `1px solid ${colors.neutral[200]}`,
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  reviewCardActive: {
    borderColor: colors.secondary[200],
    backgroundColor: colors.secondary[50],
  },

  reviewCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  reviewIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: 0,
  },

  reviewSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    margin: 0,
  },

  reviewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.secondary[500],
    color: colors.neutral[0],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: borderRadius.lg,
    border: 'none',
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  // Section Header
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: 0,
  },

  sectionAction: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[500],
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },

  // Quick Actions
  quickActionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },

  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    width: '100%',
    backgroundColor: colors.neutral[0],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
    cursor: 'pointer',
    textAlign: 'left',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  quickActionAccent: {
    backgroundColor: colors.accent[400],
    border: `2px solid ${colors.neutral[900]}`,
  },

  quickActionIcon: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  quickActionText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },

  quickActionLabel: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
  },

  quickActionSublabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },

  // Recent Chapters
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
  },

  recentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${colors.neutral[100]}`,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: `background-color ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  recentItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  recentDot: {
    width: '8px',
    height: '8px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[400],
  },

  recentChapter: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[800],
    margin: 0,
  },

  recentSubject: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
    margin: 0,
  },

  recentTime: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[400],
  },

  // Stats Row
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    border: `1px solid ${colors.neutral[200]}`,
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[0.5],
  },

  statValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },

  statLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
  },

  statDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: colors.neutral[200],
  },
};

export default NewDashboardView;
