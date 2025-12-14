/**
 * DemoPreview - Interactive preview of the new AI Tutor design
 *
 * This component demonstrates all the new views with mock data.
 * Use this to preview the redesign before integrating with the backend.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import NewDashboardView from '../NewDashboardView';
import LearnView from '../LearnView';
import ChapterPageView from '../ChapterPageView';
import StudyTogetherView from '../StudyTogetherView';
import ReviewView from '../ReviewView';
import ProfileView from '../ProfileView';
import { colors, typography, spacing, borderRadius, googleFontsUrl, generateCSSVariables } from '../../design/designSystem';

// ============================================
// MOCK DATA
// ============================================
const mockStudent = {
  id: 1,
  name: 'Alex Johnson',
  grade: 'Grade 8',
  board: 'CBSE',
  language: 'en',
};

const mockGameState = {
  coins: 1250,
  total_score: 8450,
  streak_days: 7,
  quizzes_completed: 23,
  videos_watched: 15,
  current_level: 12,
};

const mockStats = {
  level: 12,
  streakDays: 7,
  totalCards: 156,
  coins: 1250,
};

const mockBoards = [
  { id: 1, name: 'CBSE' },
  { id: 2, name: 'ICSE' },
  { id: 3, name: 'State Board' },
];

const mockGrades = [
  { id: 1, name: 'Grade 6' },
  { id: 2, name: 'Grade 7' },
  { id: 3, name: 'Grade 8' },
  { id: 4, name: 'Grade 9' },
  { id: 5, name: 'Grade 10' },
];

const mockSubjects = [
  { id: 1, name: 'Mathematics', chapters_count: 15 },
  { id: 2, name: 'Science', chapters_count: 12 },
  { id: 3, name: 'English', chapters_count: 10 },
  { id: 4, name: 'Social Studies', chapters_count: 14 },
];

const mockChapters = [
  { id: 1, name: 'Linear Equations in One Variable' },
  { id: 2, name: 'Quadrilaterals' },
  { id: 3, name: 'Data Handling' },
  { id: 4, name: 'Squares and Square Roots' },
  { id: 5, name: 'Exponents and Powers' },
];

const mockRecentChapters = [
  { chapter: 'Linear Equations', subject: 'Mathematics', lastAccessed: new Date(Date.now() - 3600000) },
  { chapter: 'Cell Structure', subject: 'Science', lastAccessed: new Date(Date.now() - 86400000) },
  { chapter: 'The French Revolution', subject: 'Social Studies', lastAccessed: new Date(Date.now() - 172800000) },
];

const mockMessages = [
  { role: 'user', content: 'Can you explain linear equations?' },
  {
    role: 'assistant',
    content: 'A linear equation is an equation where the highest power of the variable is 1. For example, 2x + 5 = 11 is a linear equation. To solve it, we isolate the variable x by performing the same operations on both sides of the equation.',
    citations: ['Chapter 2, Section 2.1: Introduction to Linear Equations', 'Page 45: Definition and Examples'],
  },
];

const mockFlashcards = [
  { id: 1, front: 'What is a linear equation?', back: 'An equation where the highest power of the variable is 1', lastWrongReason: 'Confused with quadratic equations' },
  { id: 2, front: 'Solve: 2x + 5 = 11', back: 'x = 3' },
  { id: 3, front: 'What is the standard form of a linear equation?', back: 'ax + b = c, where a ≠ 0' },
];

// ============================================
// DEMO PREVIEW COMPONENT
// ============================================
const DemoPreview = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [subView, setSubView] = useState(null); // 'chapter', 'study', 'flashcard-session'
  const [mounted, setMounted] = useState(false);

  // Learn flow state
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Review state
  const [isReviewSession, setIsReviewSession] = useState(false);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  useEffect(() => {
    // Inject Google Fonts
    const link = document.createElement('link');
    link.href = googleFontsUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Inject CSS Variables
    const style = document.createElement('style');
    style.textContent = generateCSSVariables();
    document.head.appendChild(style);

    setMounted(true);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSubView(null);
    // Reset learn flow when changing tabs
    if (tab !== 'learn') {
      setSelectedBoard(null);
      setSelectedGrade(null);
      setSelectedSubject(null);
      setSelectedChapter(null);
    }
    // Reset review state
    if (tab !== 'review') {
      setIsReviewSession(false);
      setIsReviewComplete(false);
      setCurrentCardIndex(0);
      setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 });
    }
  };

  // Handle grade in review
  const handleGrade = (grade) => {
    setSessionResults(prev => ({
      ...prev,
      [grade]: prev[grade] + 1,
    }));

    if (currentCardIndex < mockFlashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsReviewComplete(true);
    }
  };

  // Get context for context pill
  const getContext = () => {
    if (!selectedBoard) return null;
    return {
      board: selectedBoard?.name,
      grade: selectedGrade?.name,
      subject: selectedSubject?.name,
      chapter: selectedChapter?.name,
    };
  };

  // Render current view
  const renderView = () => {
    // Sub-views (modals/stacked screens)
    if (subView === 'chapter') {
      return (
        <ChapterPageView
          chapter={selectedChapter}
          subject={selectedSubject}
          progress={35}
          onBack={() => setSubView(null)}
          onMenuClick={() => console.log('Menu clicked')}
          onModeStart={(mode) => {
            if (mode === 'study') {
              setSubView('study');
            } else {
              console.log('Starting mode:', mode);
            }
          }}
          onSuggestionSelect={(suggestion) => console.log('Suggestion:', suggestion)}
        />
      );
    }

    if (subView === 'study') {
      return (
        <StudyTogetherView
          chapter={selectedChapter}
          subject={selectedSubject}
          messages={mockMessages}
          onSendMessage={(msg) => console.log('Message sent:', msg)}
          onSaveToFlashcard={(msg) => console.log('Saved to flashcard:', msg)}
          onFollowUp={(msg) => console.log('Follow up:', msg)}
          onExpand={(msg) => console.log('Expand:', msg)}
          onSwitchChapter={() => setSubView(null)}
          onStayInChapter={() => console.log('Staying in chapter')}
        />
      );
    }

    // Main tab views
    switch (activeTab) {
      case 'home':
        return (
          <NewDashboardView
            student={mockStudent}
            gameState={mockGameState}
            lastChapter="Linear Equations in One Variable"
            lastMode="study"
            lastProgress={65}
            dueFlashcards={12}
            recentChapters={mockRecentChapters}
            onContinueLearning={() => {
              setSelectedChapter({ id: 1, name: 'Linear Equations in One Variable' });
              setSelectedSubject({ id: 1, name: 'Mathematics' });
              setSubView('chapter');
            }}
            onStartReview={() => handleTabChange('review')}
            onPickChapter={() => handleTabChange('learn')}
            onStudyTogether={() => {
              setSelectedChapter({ id: 1, name: 'Linear Equations in One Variable' });
              setSubView('study');
            }}
            onRecentChapterClick={(item) => console.log('Recent chapter:', item)}
          />
        );

      case 'learn':
        if (selectedChapter && !subView) {
          return (
            <ChapterPageView
              chapter={selectedChapter}
              subject={selectedSubject}
              progress={0}
              onBack={() => setSelectedChapter(null)}
              onMenuClick={() => console.log('Menu clicked')}
              onModeStart={(mode) => {
                if (mode === 'study') {
                  setSubView('study');
                }
              }}
              onSuggestionSelect={(suggestion) => console.log('Suggestion:', suggestion)}
            />
          );
        }
        return (
          <LearnView
            boards={mockBoards}
            grades={mockGrades}
            subjects={mockSubjects}
            chapters={mockChapters}
            recentChapters={mockRecentChapters}
            selectedBoard={selectedBoard}
            selectedGrade={selectedGrade}
            selectedSubject={selectedSubject}
            selectedChapter={selectedChapter}
            onBoardSelect={setSelectedBoard}
            onGradeSelect={setSelectedGrade}
            onSubjectSelect={setSelectedSubject}
            onChapterSelect={setSelectedChapter}
            onOpenChapter={(chapter) => {
              console.log('Opening chapter:', chapter);
              // Chapter page will show after selection
            }}
          />
        );

      case 'review':
        return (
          <ReviewView
            dueToday={12}
            mistakeCards={3}
            chapterCards={9}
            flashcards={mockFlashcards}
            streakDays={mockGameState.streak_days}
            isSessionActive={isReviewSession}
            isSessionComplete={isReviewComplete}
            currentCardIndex={currentCardIndex}
            sessionResults={sessionResults}
            onStartReview={() => setIsReviewSession(true)}
            onStartMistakes={() => setIsReviewSession(true)}
            onGrade={handleGrade}
            onDone={() => {
              setIsReviewSession(false);
              setIsReviewComplete(false);
              setCurrentCardIndex(0);
              setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 });
            }}
            onStudyMore={() => handleTabChange('learn')}
          />
        );

      case 'profile':
        return (
          <ProfileView
            student={mockStudent}
            stats={mockStats}
            settings={{ language: 'en', autoSaveCards: true, weeklySummary: true }}
            isParentLinked={false}
            onLanguageChange={(lang) => console.log('Language:', lang)}
            onBoardGradeChange={() => console.log('Change board/grade')}
            onAutoSaveToggle={(val) => console.log('Auto-save:', val)}
            onWeeklySummaryToggle={(val) => console.log('Weekly summary:', val)}
            onAddParent={() => console.log('Add parent')}
            onManageParentSettings={() => console.log('Manage parent settings')}
            onDownloadData={() => console.log('Download data')}
            onDeleteData={() => console.log('Delete data')}
            onLogout={() => console.log('Logout')}
          />
        );

      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingSpinner} />
        <span style={styles.loadingText}>Loading design preview...</span>
      </div>
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      context={getContext()}
      reviewDueCount={12}
      showContextPill={!!getContext() && activeTab !== 'home' && activeTab !== 'profile'}
    >
      {renderView()}
    </MainLayout>
  );
};

// Styles
const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: spacing[4],
    backgroundColor: colors.neutral[50],
  },

  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: `3px solid ${colors.neutral[200]}`,
    borderTopColor: colors.primary[500],
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },
};

// Add spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#demo-preview-styles')) {
  styleSheet.id = 'demo-preview-styles';
  document.head.appendChild(styleSheet);
}

export default DemoPreview;
