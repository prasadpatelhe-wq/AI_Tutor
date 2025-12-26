/**
 * ReviewView - Flashcard Review with Spaced Repetition
 *
 * Features:
 * - Due today count
 * - Buckets: Mistake Fixes (priority), Chapter cards
 * - Flashcard session with tap to reveal
 * - Self-grade: Again / Hard / Good / Easy
 * - Session summary with streak update
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';
import { useIsMobile } from '../hooks/useMediaQuery';

// ============================================
// ICONS
// ============================================
const Icons = {
  Repeat: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  AlertCircle: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Book: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Play: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  ChevronRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Flame: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.07 2.34-5.64 4.45-7.55C9.53 5.55 11 3.45 11 1c0 0 2.5 1.5 2.5 5 0 1.93-1 3.5-2 4.5 1.5-.5 3-2 3.5-3.5 0 0 3 3.5 3 7.5 0 4.42-4.03 8.5-6 8.5z"/>
    </svg>
  ),
  Check: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  RotateCcw: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
  ),
  Trophy: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  Sparkles: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L14.09 8.26L20 9.27L15.55 14.14L16.91 20.02L12 16.77L7.09 20.02L8.45 14.14L4 9.27L9.91 8.26L12 2Z"/>
    </svg>
  ),
  XCircle: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
};

// Grade button configurations
const GRADE_BUTTONS = [
  { id: 'again', label: 'Again', emoji: '🔄', color: colors.error, description: 'Show again soon' },
  { id: 'hard', label: 'Hard', emoji: '😓', color: colors.warning, description: 'In a few minutes' },
  { id: 'good', label: 'Good', emoji: '👍', color: colors.success, description: 'Tomorrow' },
  { id: 'easy', label: 'Easy', emoji: '✨', color: colors.primary[500], description: 'In a week' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Review Overview (before session starts)
const ReviewOverview = ({
  dueToday,
  mistakeCards,
  chapterCards,
  onStartReview,
  onStartMistakes,
}) => (
  <div style={styles.overviewContainer}>
    {/* Header */}
    <div style={styles.overviewHeader}>
      <h1 style={styles.overviewTitle}>Review</h1>
      <p style={styles.overviewSubtitle}>
        Strengthen your memory with spaced repetition
      </p>
    </div>

    {/* Due Today Card */}
    <div style={styles.dueTodayCard}>
      <div style={styles.dueIconWrapper}>
        <Icons.Repeat size={28} color={colors.primary[500]} />
      </div>
      <div style={styles.dueContent}>
        <span style={styles.dueCount}>{dueToday}</span>
        <span style={styles.dueLabel}>cards due today</span>
      </div>
      {dueToday > 0 && (
        <button style={styles.startButton} onClick={onStartReview}>
          <Icons.Play size={18} color={colors.neutral[900]} />
          Start
        </button>
      )}
    </div>

    {/* Buckets */}
    <div style={styles.bucketsSection}>
      <h2 style={styles.bucketsTitle}>Card Buckets</h2>

      {/* Mistake Fixes - Priority */}
      <div
        style={{
          ...styles.bucketCard,
          ...(mistakeCards > 0 ? styles.bucketCardPriority : {}),
        }}
      >
        <div style={{
          ...styles.bucketIcon,
          backgroundColor: mistakeCards > 0 ? colors.secondary[100] : colors.neutral[100],
        }}>
          <Icons.AlertCircle
            size={22}
            color={mistakeCards > 0 ? colors.secondary[500] : colors.neutral[400]}
          />
        </div>
        <div style={styles.bucketContent}>
          <span style={styles.bucketLabel}>Mistake Fixes</span>
          <span style={styles.bucketDescription}>
            {mistakeCards > 0
              ? `${mistakeCards} cards need attention`
              : 'No mistakes to fix'
            }
          </span>
        </div>
        {mistakeCards > 0 && (
          <button style={styles.bucketButton} onClick={onStartMistakes}>
            <span style={styles.bucketCount}>{mistakeCards}</span>
            <Icons.ChevronRight size={16} color={colors.neutral[500]} />
          </button>
        )}
      </div>

      {/* Chapter Cards */}
      <div style={styles.bucketCard}>
        <div style={styles.bucketIcon}>
          <Icons.Book size={22} color={colors.neutral[500]} />
        </div>
        <div style={styles.bucketContent}>
          <span style={styles.bucketLabel}>Chapter Cards</span>
          <span style={styles.bucketDescription}>
            {chapterCards} cards from your chapters
          </span>
        </div>
        <div style={styles.bucketButton}>
          <span style={styles.bucketCount}>{chapterCards}</span>
          <Icons.ChevronRight size={16} color={colors.neutral[500]} />
        </div>
      </div>
    </div>

    {/* Empty State */}
    {dueToday === 0 && (
      <div style={styles.allCaughtUp}>
        <div style={styles.allCaughtUpIcon}>
          <Icons.Sparkles size={32} color={colors.accent[400]} />
        </div>
        <h3 style={styles.allCaughtUpTitle}>All caught up!</h3>
        <p style={styles.allCaughtUpText}>
          No cards due for review. Keep learning to create more flashcards!
        </p>
      </div>
    )}
  </div>
);

// Flashcard Component
const Flashcard = ({ card, isFlipped, onFlip }) => (
  <div style={styles.flashcardWrapper} onClick={onFlip}>
    <div style={{
      ...styles.flashcard,
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    }}>
      {/* Front Side */}
      <div style={styles.flashcardFront}>
        <span style={styles.flashcardSide}>Question</span>
        <p style={styles.flashcardText}>{card.front || card.question}</p>
        <span style={styles.tapToReveal}>Tap to reveal answer</span>
      </div>

      {/* Back Side */}
      <div style={styles.flashcardBack}>
        <span style={styles.flashcardSide}>Answer</span>
        <p style={styles.flashcardText}>{card.back || card.answer}</p>
        {card.lastWrongReason && (
          <div style={styles.wrongReasonBlock}>
            <Icons.AlertCircle size={14} color={colors.secondary[500]} />
            <span style={styles.wrongReasonText}>
              Last time: {card.lastWrongReason}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Grade Buttons
const GradeButtons = ({ onGrade, disabled, isMobile }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: spacing[2],
  }}>
    {GRADE_BUTTONS.map((btn) => (
      <button
        key={btn.id}
        style={{
          ...styles.gradeButton,
          borderColor: btn.color,
        }}
        onClick={() => onGrade(btn.id)}
        disabled={disabled}
      >
        <span style={styles.gradeEmoji}>{btn.emoji}</span>
        <span style={styles.gradeLabel}>{btn.label}</span>
        <span style={styles.gradeDescription}>{btn.description}</span>
      </button>
    ))}
  </div>
);

// Progress Bar
const SessionProgress = ({ current, total }) => (
  <div style={styles.progressContainer}>
    <div style={styles.progressBar}>
      <div
        style={{
          ...styles.progressFill,
          width: `${(current / total) * 100}%`,
        }}
      />
    </div>
    <span style={styles.progressText}>
      {current} of {total}
    </span>
  </div>
);

// Session Summary
const SessionSummary = ({
  cardsReviewed,
  againCount,
  hardCount,
  goodCount,
  easyCount,
  streakDays,
  onDone,
  onStudyMore,
}) => (
  <div style={styles.summaryContainer}>
    <div style={styles.summaryIcon}>
      <Icons.Trophy size={48} color={colors.accent[400]} />
    </div>

    <h2 style={styles.summaryTitle}>Session Complete!</h2>

    {/* Stats Grid */}
    <div style={styles.summaryStats}>
      <div style={styles.summaryStat}>
        <span style={styles.summaryStatValue}>{cardsReviewed}</span>
        <span style={styles.summaryStatLabel}>Cards reviewed</span>
      </div>

      <div style={styles.summaryDivider} />

      <div style={styles.summaryStat}>
        <div style={styles.streakBadge}>
          <Icons.Flame size={18} color={colors.secondary[500]} />
          <span style={styles.summaryStatValue}>{streakDays}</span>
        </div>
        <span style={styles.summaryStatLabel}>Day streak</span>
      </div>
    </div>

    {/* Grade Breakdown */}
    <div style={styles.gradeBreakdown}>
      <span style={styles.gradeBreakdownTitle}>Your responses</span>
      <div style={styles.gradeBreakdownBars}>
        {[
          { label: 'Again', count: againCount, color: colors.error },
          { label: 'Hard', count: hardCount, color: colors.warning },
          { label: 'Good', count: goodCount, color: colors.success },
          { label: 'Easy', count: easyCount, color: colors.primary[500] },
        ].map((item) => (
          <div key={item.label} style={styles.gradeBreakdownItem}>
            <span style={styles.gradeBreakdownLabel}>{item.label}</span>
            <div style={styles.gradeBreakdownBarWrapper}>
              <div
                style={{
                  ...styles.gradeBreakdownBar,
                  width: `${cardsReviewed > 0 ? (item.count / cardsReviewed) * 100 : 0}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span style={styles.gradeBreakdownCount}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Suggestion */}
    {againCount > 0 && (
      <div style={styles.suggestionCard}>
        <Icons.Sparkles size={16} color={colors.primary[500]} />
        <span style={styles.suggestionText}>
          Try a quick Study Together session for the cards you struggled with
        </span>
      </div>
    )}

    {/* Actions */}
    <div style={styles.summaryActions}>
      <button style={styles.doneButton} onClick={onDone}>
        Done
      </button>
      <button style={styles.studyMoreButton} onClick={onStudyMore}>
        Study more
      </button>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const ReviewView = ({
  // Data
  dueToday = 0,
  mistakeCards = 0,
  chapterCards = 0,
  flashcards = [],
  streakDays = 0,
  // State
  isSessionActive = false,
  isSessionComplete = false,
  currentCardIndex = 0,
  sessionResults = { again: 0, hard: 0, good: 0, easy: 0 },
  // Callbacks
  onStartReview,
  onStartMistakes,
  onGrade,
  onSessionComplete,
  onDone,
  onStudyMore,
}) => {
  const isMobile = useIsMobile();
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset flip when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  const handleGrade = (grade) => {
    onGrade?.(grade);
    setIsFlipped(false);
  };

  const currentCard = flashcards[currentCardIndex];
  const totalCards = flashcards.length;

  // Session Complete View
  if (isSessionComplete) {
    return (
      <div style={{
        ...styles.container,
        opacity: mounted ? 1 : 0,
      }}>
        <SessionSummary
          cardsReviewed={totalCards}
          againCount={sessionResults.again}
          hardCount={sessionResults.hard}
          goodCount={sessionResults.good}
          easyCount={sessionResults.easy}
          streakDays={streakDays}
          onDone={onDone}
          onStudyMore={onStudyMore}
        />
      </div>
    );
  }

  // Active Session View
  if (isSessionActive && currentCard) {
    return (
      <div style={{
        ...styles.container,
        opacity: mounted ? 1 : 0,
      }}>
        {/* Progress */}
        <SessionProgress
          current={currentCardIndex + 1}
          total={totalCards}
        />

        {/* Flashcard */}
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        {/* Grade Buttons (only show when flipped) */}
        {isFlipped && (
          <GradeButtons
            onGrade={handleGrade}
            disabled={false}
            isMobile={isMobile}
          />
        )}
      </div>
    );
  }

  // Overview View (default)
  return (
    <div style={{
      ...styles.container,
      opacity: mounted ? 1 : 0,
    }}>
      <ReviewOverview
        dueToday={dueToday}
        mistakeCards={mistakeCards}
        chapterCards={chapterCards}
        onStartReview={onStartReview}
        onStartMistakes={onStartMistakes}
      />
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
    minHeight: '100%',
    paddingBottom: spacing[24],
    transition: `opacity ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  // Overview
  overviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },

  overviewHeader: {
    marginBottom: spacing[2],
  },

  overviewTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['3xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },

  overviewSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    margin: `${spacing[1]} 0 0 0`,
  },

  // Due Today Card
  dueTodayCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.primary[50],
    padding: spacing[5],
    borderRadius: borderRadius['2xl'],
    border: `1px solid ${colors.primary[200]}`,
  },

  dueIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral[0],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.sm,
  },

  dueContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  dueCount: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['3xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[700],
    lineHeight: 1,
  },

  dueLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.primary[600],
  },

  startButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    padding: `${spacing[3]} ${spacing[5]}`,
    borderRadius: borderRadius.xl,
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutalSm,
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
  },

  // Buckets
  bucketsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },

  bucketsTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    margin: 0,
  },

  bucketCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.neutral[0],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
  },

  bucketCardPriority: {
    borderColor: colors.secondary[200],
    backgroundColor: colors.secondary[50],
  },

  bucketIcon: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  bucketContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },

  bucketLabel: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
  },

  bucketDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },

  bucketButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },

  bucketCount: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[600],
  },

  // All Caught Up
  allCaughtUp: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: `${spacing[10]} ${spacing[6]}`,
  },

  allCaughtUpIcon: {
    width: '72px',
    height: '72px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },

  allCaughtUpTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[2]} 0`,
  },

  allCaughtUpText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    margin: 0,
    maxWidth: '260px',
  },

  // Progress
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    transition: `width ${transitions.duration.normal} ${transitions.easing.out}`,
  },

  progressText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    flexShrink: 0,
  },

  // Flashcard
  flashcardWrapper: {
    perspective: '1000px',
    cursor: 'pointer',
  },

  flashcard: {
    position: 'relative',
    width: '100%',
    minHeight: '320px',
    transformStyle: 'preserve-3d',
    transition: `transform ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  flashcardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    border: `2px solid ${colors.neutral[200]}`,
    boxShadow: shadows.lg,
    backfaceVisibility: 'hidden',
  },

  flashcardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    border: `2px solid ${colors.primary[300]}`,
    boxShadow: shadows.lg,
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
  },

  flashcardSide: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  flashcardText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
  },

  tapToReveal: {
    position: 'absolute',
    bottom: spacing[4],
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[400],
  },

  wrongReasonBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.secondary[100],
    borderRadius: borderRadius.lg,
  },

  wrongReasonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.secondary[700],
  },

  // Grade Buttons
  gradeButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing[2],
  },

  gradeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.neutral[0],
    padding: spacing[3],
    borderRadius: borderRadius.xl,
    border: `2px solid`,
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  gradeEmoji: {
    fontSize: '1.5rem',
  },

  gradeLabel: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
  },

  gradeDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize['2xs'][0],
    color: colors.neutral[500],
  },

  // Summary
  summaryContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: spacing[4],
  },

  summaryIcon: {
    width: '88px',
    height: '88px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    border: `3px solid ${colors.accent[400]}`,
  },

  summaryTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[6]} 0`,
  },

  summaryStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    marginBottom: spacing[6],
  },

  summaryStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[1],
  },

  summaryStatValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },

  summaryStatLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },

  summaryDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: colors.neutral[200],
  },

  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },

  // Grade Breakdown
  gradeBreakdown: {
    width: '100%',
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    border: `1px solid ${colors.neutral[200]}`,
    marginBottom: spacing[4],
  },

  gradeBreakdownTitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
    display: 'block',
    marginBottom: spacing[3],
  },

  gradeBreakdownBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },

  gradeBreakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },

  gradeBreakdownLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[600],
    width: '44px',
    flexShrink: 0,
  },

  gradeBreakdownBarWrapper: {
    flex: 1,
    height: '8px',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },

  gradeBreakdownBar: {
    height: '100%',
    borderRadius: borderRadius.full,
    transition: `width ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  gradeBreakdownCount: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[600],
    width: '24px',
    textAlign: 'right',
    flexShrink: 0,
  },

  // Suggestion
  suggestionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.primary[50],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[4],
    width: '100%',
  },

  suggestionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.primary[700],
    textAlign: 'left',
  },

  // Summary Actions
  summaryActions: {
    display: 'flex',
    gap: spacing[3],
    width: '100%',
  },

  doneButton: {
    flex: 1,
    padding: `${spacing[4]} ${spacing[6]}`,
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    borderRadius: borderRadius.xl,
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutalSm,
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
  },

  studyMoreButton: {
    flex: 1,
    padding: `${spacing[4]} ${spacing[6]}`,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[700],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[300]}`,
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
  },
};

export default ReviewView;
