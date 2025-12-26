/**
 * LearnView - Context Picker for chapter selection
 *
 * Stepper flow:
 * 1. Board
 * 2. Grade
 * 3. Subject
 * 4. Chapter
 *
 * Features:
 * - Search chapter
 * - Recent shortcuts
 * - Animated step transitions
 */

import React, { useState, useEffect, useRef } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

// ============================================
// ICONS
// ============================================
const Icons = {
  Search: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  ChevronRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronLeft: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Check: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Clock: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Book: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Grid: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  GraduationCap: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Layers: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
};

// Step configuration
const STEPS = [
  { id: 'board', label: 'Board', icon: Icons.Grid, description: 'Select your education board' },
  { id: 'grade', label: 'Grade', icon: Icons.GraduationCap, description: 'Choose your class' },
  { id: 'subject', label: 'Subject', icon: Icons.Layers, description: 'Pick a subject to study' },
  { id: 'chapter', label: 'Chapter', icon: Icons.Book, description: 'Select a chapter' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Stepper Progress Indicator
const StepperProgress = ({ currentStep, steps, onStepClick, selections }) => (
  <div style={styles.stepperContainer}>
    {steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isCurrent = index === currentStep;
      const isClickable = index < currentStep;

      return (
        <React.Fragment key={step.id}>
          <button
            style={{
              ...styles.stepItem,
              ...(isClickable ? { cursor: 'pointer' } : { cursor: 'default' }),
            }}
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
          >
            <div style={{
              ...styles.stepCircle,
              ...(isCompleted ? styles.stepCircleCompleted : {}),
              ...(isCurrent ? styles.stepCircleCurrent : {}),
            }}>
              {isCompleted ? (
                <Icons.Check size={14} color={colors.neutral[0]} />
              ) : (
                <span style={{
                  ...styles.stepNumber,
                  color: isCurrent ? colors.primary[500] : colors.neutral[400],
                }}>{index + 1}</span>
              )}
            </div>
            <div style={styles.stepTextWrapper}>
              <span style={{
                ...styles.stepLabel,
                color: isCurrent ? colors.neutral[900] : isCompleted ? colors.primary[600] : colors.neutral[400],
                fontWeight: isCurrent ? typography.fontWeight.semibold : typography.fontWeight.medium,
              }}>
                {step.label}
              </span>
              {isCompleted && selections[step.id] && (
                <span style={styles.stepSelection}>{selections[step.id]}</span>
              )}
            </div>
          </button>
          {index < steps.length - 1 && (
            <div style={{
              ...styles.stepConnector,
              backgroundColor: isCompleted ? colors.primary[500] : colors.neutral[200],
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// Search Bar
const SearchBar = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);

  return (
    <div style={styles.searchBar}>
      <Icons.Search size={18} color={colors.neutral[400]} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.searchInput}
      />
      {value && (
        <button
          style={styles.searchClear}
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Option Card
const OptionCard = ({ label, sublabel, selected, onClick, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.optionCard,
        ...(selected ? styles.optionCardSelected : {}),
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? shadows.md : selected ? shadows.primary : shadows.sm,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {Icon && (
        <div style={{
          ...styles.optionIcon,
          backgroundColor: selected ? colors.primary[100] : colors.neutral[100],
        }}>
          <Icon size={20} color={selected ? colors.primary[600] : colors.neutral[500]} />
        </div>
      )}
      <div style={styles.optionContent}>
        <span style={{
          ...styles.optionLabel,
          color: selected ? colors.primary[700] : colors.neutral[800],
        }}>{label}</span>
        {sublabel && (
          <span style={styles.optionSublabel}>{sublabel}</span>
        )}
      </div>
      {selected && (
        <div style={styles.optionCheck}>
          <Icons.Check size={16} color={colors.primary[500]} />
        </div>
      )}
    </button>
  );
};

// Recent Shortcuts
const RecentShortcuts = ({ items, onSelect }) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={styles.recentSection}>
      <div style={styles.recentHeader}>
        <Icons.Clock size={14} color={colors.neutral[400]} />
        <span style={styles.recentTitle}>Recent</span>
      </div>
      <div style={styles.recentChips}>
        {items.slice(0, 5).map((item, index) => (
          <button
            key={index}
            style={styles.recentChip}
            onClick={() => onSelect(item)}
          >
            {item.chapter || item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Empty State
const EmptyState = ({ message }) => (
  <div style={styles.emptyState}>
    <div style={styles.emptyIcon}>
      <Icons.Search size={32} color={colors.neutral[300]} />
    </div>
    <p style={styles.emptyText}>{message}</p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const LearnView = ({
  // Data
  boards = [],
  grades = [],
  subjects = [],
  chapters = [],
  recentChapters = [],
  // Selection state
  selectedBoard,
  selectedGrade,
  selectedSubject,
  selectedChapter,
  // Callbacks
  onBoardSelect,
  onGradeSelect,
  onSubjectSelect,
  onChapterSelect,
  onOpenChapter,
  onBack,
  // Loading states
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine current step based on selections
  useEffect(() => {
    if (!selectedBoard) setCurrentStep(0);
    else if (!selectedGrade) setCurrentStep(1);
    else if (!selectedSubject) setCurrentStep(2);
    else setCurrentStep(3);
  }, [selectedBoard, selectedGrade, selectedSubject]);

  const getOptionLabel = (opt) => {
    if (!opt) return '';
    if (typeof opt === 'string' || typeof opt === 'number') return String(opt);
    return opt.name || opt.title || opt.label || opt.chapter || opt.subject || '';
  };

  const getOptionSublabel = (opt) => {
    if (!opt || typeof opt === 'string' || typeof opt === 'number') return '';
    if (opt.description) return opt.description;
    if (opt.summary) return opt.summary;
    if (typeof opt.chapters_count !== 'undefined') return `${opt.chapters_count} chapters`;
    return '';
  };

  // Get selections object for stepper
  const selections = {
    board: getOptionLabel(selectedBoard),
    grade: getOptionLabel(selectedGrade),
    subject: getOptionLabel(selectedSubject),
    chapter: getOptionLabel(selectedChapter),
  };

  // Handle step navigation
  const goToStep = (stepIndex) => {
    if (stepIndex === 0) {
      onBoardSelect?.(null);
      onGradeSelect?.(null);
      onSubjectSelect?.(null);
    } else if (stepIndex === 1) {
      onGradeSelect?.(null);
      onSubjectSelect?.(null);
    } else if (stepIndex === 2) {
      onSubjectSelect?.(null);
    }
  };

  // Filter options based on search
  const filterOptions = (options) => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(opt => getOptionLabel(opt).toLowerCase().includes(query));
  };

  // Get current step data
  const getCurrentOptions = () => {
    switch (currentStep) {
      case 0: return filterOptions(boards);
      case 1: return filterOptions(grades);
      case 2: return filterOptions(subjects);
      case 3: return filterOptions(chapters);
      default: return [];
    }
  };

  // Handle option selection
  const handleSelect = (option) => {
    switch (currentStep) {
      case 0:
        onBoardSelect?.(option);
        break;
      case 1:
        onGradeSelect?.(option);
        break;
      case 2:
        onSubjectSelect?.(option);
        break;
      case 3:
        onChapterSelect?.(option);
        break;
      default:
        break;
    }
    setSearchQuery('');
  };

  const options = getCurrentOptions();
  const step = STEPS[currentStep];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {currentStep > 0 && (
          <button style={styles.backButton} onClick={() => goToStep(currentStep - 1)}>
            <Icons.ChevronLeft size={20} color={colors.neutral[600]} />
          </button>
        )}
        <div style={styles.headerText}>
          <h1 style={styles.headerTitle}>Pick a Chapter</h1>
          <p style={styles.headerSubtitle}>{step.description}</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <StepperProgress
        currentStep={currentStep}
        steps={STEPS}
        onStepClick={goToStep}
        selections={selections}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={`Search ${step.label.toLowerCase()}...`}
      />

      {/* Recent Shortcuts (only on chapter step) */}
      {currentStep === 3 && !searchQuery && (
        <RecentShortcuts
          items={recentChapters}
          onSelect={(item) => {
            onChapterSelect?.(item);
          }}
        />
      )}

      {/* Options List */}
      <div style={styles.optionsList}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner} />
            <span style={styles.loadingText}>Loading...</span>
          </div>
        ) : options.length === 0 ? (
          <EmptyState
            message={searchQuery
              ? `No ${step.label.toLowerCase()} found for "${searchQuery}"`
              : `No ${step.label.toLowerCase()} available`
            }
          />
        ) : (
          options.map((option, index) => {
            const name = getOptionLabel(option) || 'Untitled';
            const sublabel = getOptionSublabel(option);
            const isSelected =
              (currentStep === 0 && selectedBoard?.id === option.id) ||
              (currentStep === 1 && selectedGrade?.id === option.id) ||
              (currentStep === 2 && selectedSubject?.id === option.id) ||
              (currentStep === 3 && selectedChapter?.id === option.id);

            return (
              <OptionCard
                key={option.id || index}
                label={name}
                sublabel={sublabel}
                selected={isSelected}
                onClick={() => handleSelect(option)}
                icon={step.icon}
              />
            );
          })
        )}
      </div>

      {/* Open Chapter CTA (when chapter is selected) */}
      {selectedChapter && (
        <div style={styles.ctaWrapper}>
          <button
            style={styles.ctaButton}
            onClick={() => onOpenChapter?.(selectedChapter)}
          >
            Open Chapter
            <Icons.ChevronRight size={18} color={colors.neutral[900]} />
          </button>
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
    gap: spacing[5],
    minHeight: '100%',
    paddingBottom: spacing[24],
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'flex-start',
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
    marginTop: spacing[0.5],
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
    letterSpacing: typography.letterSpacing.tight,
  },

  headerSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    margin: `${spacing[1]} 0 0 0`,
  },

  // Stepper
  stepperContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[1],
    padding: `${spacing[4]} 0`,
    overflowX: 'auto',
  },

  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[2],
    background: 'none',
    border: 'none',
    padding: spacing[1],
    minWidth: '60px',
  },

  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    border: `2px solid ${colors.neutral[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  stepCircleCompleted: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },

  stepCircleCurrent: {
    borderColor: colors.primary[500],
    backgroundColor: colors.neutral[0],
    boxShadow: `0 0 0 4px ${colors.primary[100]}`,
  },

  stepNumber: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
  },

  stepTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[0.5],
  },

  stepLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
  },

  stepSelection: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize['2xs'][0],
    color: colors.primary[600],
    maxWidth: '70px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  stepConnector: {
    flex: 1,
    height: '2px',
    marginTop: '16px',
    minWidth: '20px',
    transition: `background-color ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  // Search
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.neutral[0],
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: borderRadius.xl,
    border: `2px solid ${colors.neutral[200]}`,
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base[0],
    color: colors.neutral[900],
    backgroundColor: 'transparent',
  },

  searchClear: {
    width: '24px',
    height: '24px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[200],
    border: 'none',
    color: colors.neutral[600],
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recent
  recentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },

  recentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1.5],
  },

  recentTitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  recentChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing[2],
  },

  recentChip: {
    backgroundColor: colors.neutral[100],
    padding: `${spacing[1.5]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
    border: 'none',
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[700],
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  // Options
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },

  optionCard: {
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

  optionCardSelected: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },

  optionIcon: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  optionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },

  optionLabel: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.medium,
  },

  optionSublabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },

  optionCheck: {
    width: '24px',
    height: '24px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty & Loading
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: `${spacing[12]} ${spacing[4]}`,
  },

  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    textAlign: 'center',
    margin: 0,
  },

  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: `${spacing[12]} ${spacing[4]}`,
  },

  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: `3px solid ${colors.neutral[200]}`,
    borderTopColor: colors.primary[500],
    borderRadius: borderRadius.full,
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },

  // CTA - Made responsive
  ctaWrapper: {
    position: 'fixed',
    bottom: '24px',
    left: spacing[4],
    right: spacing[4],
    maxWidth: '448px',
    margin: '0 auto',
    zIndex: 100,
  },

  ctaButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    padding: `${spacing[4]} ${spacing[6]}`,
    borderRadius: borderRadius.xl,
    border: `2px solid ${colors.neutral[900]}`,
    boxShadow: shadows.brutal,
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.bounce}`,
  },
};

// Add keyframe animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#learn-view-styles')) {
  styleSheet.id = 'learn-view-styles';
  document.head.appendChild(styleSheet);
}

export default LearnView;
