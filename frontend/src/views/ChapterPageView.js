/**
 * ChapterPageView - Modes Hub for a selected chapter
 *
 * Tabs:
 * - Text (reading mode)
 * - Study Together (AI chat)
 * - Practice (quizzes) - optional
 * - Mind Map - later
 * - Exam Coach - later
 *
 * Features:
 * - Persistent context pill
 * - Tab navigation with icons
 * - Mode-specific content areas
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

// ============================================
// ICONS
// ============================================
const Icons = {
  FileText: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  MessageCircle: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  Target: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  GitBranch: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"/>
      <circle cx="18" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
  ),
  Award: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  ChevronLeft: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Menu: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Lock: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Play: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Sparkles: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.4 12.4l-.7-.7M5.6 18.4l.7-.7m12.4-12.4l-.7.7"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  ),
};

// Tab configuration
const TABS = [
  {
    id: 'text',
    label: 'Text',
    icon: Icons.FileText,
    description: 'Read & highlight',
    available: true,
  },
  {
    id: 'study',
    label: 'Study Together',
    icon: Icons.MessageCircle,
    description: 'Chat with AI',
    available: true,
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: Icons.Target,
    description: 'Test yourself',
    available: true,
  },
  {
    id: 'mindmap',
    label: 'Mind Map',
    icon: Icons.GitBranch,
    description: 'Visual overview',
    available: false,
    comingSoon: true,
  },
  {
    id: 'examcoach',
    label: 'Exam Coach',
    icon: Icons.Award,
    description: 'Exam prep',
    available: false,
    comingSoon: true,
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Chapter Header
const ChapterHeader = ({ chapter, subject, onBack, onMenuClick }) => (
  <div style={styles.header}>
    <button style={styles.backButton} onClick={onBack}>
      <Icons.ChevronLeft size={20} color={colors.neutral[600]} />
    </button>
    <div style={styles.headerContent}>
      <span style={styles.headerSubject}>{subject}</span>
      <h1 style={styles.headerTitle}>{chapter}</h1>
    </div>
    <button style={styles.menuButton} onClick={onMenuClick}>
      <Icons.Menu size={20} color={colors.neutral[600]} />
    </button>
  </div>
);

// Progress Card
const ProgressCard = ({ progress, completedModes, totalModes }) => (
  <div style={styles.progressCard}>
    <div style={styles.progressInfo}>
      <span style={styles.progressLabel}>Chapter Progress</span>
      <span style={styles.progressValue}>{progress}%</span>
    </div>
    <div style={styles.progressBar}>
      <div style={{ ...styles.progressFill, width: `${progress}%` }} />
    </div>
    <span style={styles.progressModes}>
      {completedModes} of {totalModes} modes completed
    </span>
  </div>
);

// Mode Tab
const ModeTab = ({ tab, active, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = tab.icon;

  if (tab.comingSoon) {
    return (
      <div
        style={{
          ...styles.modeTab,
          ...styles.modeTabDisabled,
        }}
      >
        <div style={styles.modeTabIcon}>
          <Icon size={24} color={colors.neutral[300]} />
        </div>
        <span style={{ ...styles.modeTabLabel, color: colors.neutral[400] }}>
          {tab.label}
        </span>
        <span style={styles.comingSoonBadge}>Soon</span>
      </div>
    );
  }

  return (
    <button
      style={{
        ...styles.modeTab,
        ...(active ? styles.modeTabActive : {}),
        transform: isHovered && !active ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        ...styles.modeTabIcon,
        backgroundColor: active ? colors.primary[100] : colors.neutral[100],
      }}>
        <Icon size={24} color={active ? colors.primary[600] : colors.neutral[500]} />
      </div>
      <span style={{
        ...styles.modeTabLabel,
        color: active ? colors.primary[700] : colors.neutral[700],
        fontWeight: active ? typography.fontWeight.semibold : typography.fontWeight.medium,
      }}>
        {tab.label}
      </span>
      <span style={{
        ...styles.modeTabDescription,
        color: active ? colors.primary[500] : colors.neutral[500],
      }}>
        {tab.description}
      </span>
      {active && <div style={styles.modeTabIndicator} />}
    </button>
  );
};

// Mode Content Placeholder
const ModeContentPlaceholder = ({ mode, onStart, chapterContent }) => {
  const getContent = () => {
    switch (mode) {
      case 'text':
        return {
          title: 'Reading Mode',
          description: 'Read through the chapter content. Highlight text to ask questions or create flashcards.',
          cta: 'Start Reading',
          icon: Icons.FileText,
        };
      case 'study':
        return {
          title: 'Study Together',
          description: 'Chat with your AI tutor. Ask questions, get explanations, and test your understanding.',
          cta: 'Start Chatting',
          icon: Icons.MessageCircle,
        };
      case 'practice':
        return {
          title: 'Practice Mode',
          description: 'Test yourself with AI-generated questions. Track your progress and identify weak areas.',
          cta: 'Start Practice',
          icon: Icons.Target,
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div style={styles.modeContentPlaceholder}>
      <div style={styles.placeholderIcon}>
        <Icon size={48} color={colors.primary[400]} />
      </div>
      <h2 style={styles.placeholderTitle}>{content.title}</h2>
      <p style={styles.placeholderDescription}>{content.description}</p>
      <button style={styles.placeholderCta} onClick={() => onStart(mode)}>
        <Icons.Play size={18} color={colors.neutral[900]} />
        {content.cta}
      </button>
    </div>
  );
};

// Quick Suggestion Cards (for Study Together)
const QuickSuggestions = ({ onSelect }) => {
  const suggestions = [
    { id: 'explain', label: 'Explain this topic', emoji: '💡' },
    { id: 'examples', label: 'Give me examples', emoji: '📝' },
    { id: 'questions', label: 'Ask me 5 questions', emoji: '❓' },
    { id: 'summary', label: 'Summarize key points', emoji: '📋' },
  ];

  return (
    <div style={styles.suggestionsContainer}>
      <span style={styles.suggestionsLabel}>Quick start</span>
      <div style={styles.suggestionsGrid}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            style={styles.suggestionChip}
            onClick={() => onSelect(suggestion)}
          >
            <span style={styles.suggestionEmoji}>{suggestion.emoji}</span>
            <span style={styles.suggestionText}>{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const ChapterPageView = ({
  // Data
  chapter,
  subject,
  board,
  grade,
  chapterContent,
  progress = 0,
  // Callbacks
  onBack,
  onMenuClick,
  onModeStart,
  onSuggestionSelect,
  // Children components for each mode
  textModeContent,
  studyModeContent,
  practiceModeContent,
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLabel = (value, fallback) => {
    if (!value) return fallback;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value.name || value.title || value.label || value.chapter || fallback;
  };

  const chapterLabel = getLabel(chapter, 'Chapter');
  const subjectLabel = getLabel(subject, 'Subject');

  const completedModes = [textModeContent, studyModeContent, practiceModeContent]
    .filter(Boolean).length;

  const renderModeContent = () => {
    switch (activeTab) {
      case 'text':
        return textModeContent || (
          <ModeContentPlaceholder
            mode="text"
            onStart={onModeStart}
            chapterContent={chapterContent}
          />
        );
      case 'study':
        return studyModeContent || (
          <>
            <ModeContentPlaceholder
              mode="study"
              onStart={onModeStart}
            />
            <QuickSuggestions onSelect={onSuggestionSelect} />
          </>
        );
      case 'practice':
        return practiceModeContent || (
          <ModeContentPlaceholder
            mode="practice"
            onStart={onModeStart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      ...styles.container,
      opacity: mounted ? 1 : 0,
    }}>
      {/* Header */}
      <ChapterHeader
        chapter={chapterLabel}
        subject={subjectLabel}
        onBack={onBack}
        onMenuClick={onMenuClick}
      />

      {/* Progress Card */}
      <ProgressCard
        progress={progress}
        completedModes={completedModes}
        totalModes={3}
      />

      {/* Mode Tabs */}
      <div style={styles.tabsContainer}>
        <span style={styles.tabsLabel}>Learning Modes</span>
        <div style={styles.tabsScroll}>
          {TABS.map((tab) => (
            <ModeTab
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => tab.available && setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Mode Content */}
      <div style={styles.modeContent}>
        {renderModeContent()}
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
    gap: spacing[5],
    minHeight: '100%',
    paddingBottom: spacing[24],
    transition: `opacity ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  backButton: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[100],
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
  },

  headerSubject: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  headerTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  menuButton: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[100],
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  // Progress Card
  progressCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    border: `1px solid ${colors.neutral[200]}`,
  },

  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },

  progressLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
  },

  progressValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },

  progressBar: {
    height: '8px',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    transition: `width ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  progressModes: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
  },

  // Tabs
  tabsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },

  tabsLabel: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  tabsScroll: {
    display: 'flex',
    gap: spacing[2],
    overflowX: 'auto',
    paddingBottom: spacing[2],
    marginBottom: `-${spacing[2]}`,
  },

  modeTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[2],
    minWidth: '100px',
    padding: spacing[4],
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
    cursor: 'pointer',
    position: 'relative',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  modeTabActive: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
    boxShadow: shadows.primary,
  },

  modeTabDisabled: {
    cursor: 'default',
    opacity: 0.6,
  },

  modeTabIcon: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modeTabLabel: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    textAlign: 'center',
  },

  modeTabDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    textAlign: 'center',
  },

  modeTabIndicator: {
    position: 'absolute',
    bottom: '-1px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '3px',
    backgroundColor: colors.primary[500],
    borderRadius: `${borderRadius.full} ${borderRadius.full} 0 0`,
  },

  comingSoonBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: colors.neutral[200],
    color: colors.neutral[600],
    padding: `${spacing[0.5]} ${spacing[2]}`,
    borderRadius: borderRadius.full,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize['2xs'][0],
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  // Mode Content
  modeContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },

  modeContentPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius['2xl'],
    padding: `${spacing[10]} ${spacing[6]}`,
    border: `1px solid ${colors.neutral[200]}`,
    textAlign: 'center',
  },

  placeholderIcon: {
    width: '80px',
    height: '80px',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },

  placeholderDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    margin: 0,
    maxWidth: '280px',
    lineHeight: 1.6,
  },

  placeholderCta: {
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
    transition: `all ${transitions.duration.fast} ${transitions.easing.bounce}`,
  },

  // Suggestions
  suggestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },

  suggestionsLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  suggestionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[2],
  },

  suggestionChip: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.neutral[0],
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`,
    cursor: 'pointer',
    textAlign: 'left',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  suggestionEmoji: {
    fontSize: '1.25rem',
  },

  suggestionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[700],
  },
};

export default ChapterPageView;
