/**
 * AI Tutor - Main Application with New Design & Guest Mode
 */

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { SyllabusContext } from './SyllabusContext';
import { ThemeProvider } from './ThemeContext';
import { fetchSubjects, fetchGrades, fetchBoards } from './meta';

// New Design Components
import MainLayout from './layouts/MainLayout';
import NewDashboardView from './views/NewDashboardView';
import LearnView from './views/LearnView';
import ChapterPageView from './views/ChapterPageView';
import StudyTogetherView from './views/StudyTogetherView';
import ReviewView from './views/ReviewView';
import ProfileView from './views/ProfileView';
import { colors, typography, spacing, googleFontsUrl, generateCSSVariables } from './design/designSystem';

// Auth / Entry Views (keep existing UI)
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ParentEntryView from './views/ParentEntryView';

// API Functions
import {
  chatWithTutor as apiChatWithTutor,
  getStudentScore as apiGetStudentScore,
} from './api';

// Guest Mode Data
const GUEST_STUDENT = {
  id: 'guest',
  name: 'Guest Learner',
  grade_band: 'Grade 8',
  board: 'CBSE',
  medium: 'en',
  isGuest: true,
};

const INITIAL_GAME_STATE = {
  coins: 100,
  total_score: 0,
  streak_days: 0,
  quizzes_completed: 0,
  current_level: 1,
};

// Welcome Screen Component (keep existing UI)
const WelcomeScreen = ({ onLogin, onRegister, onGuestMode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ ...styles.welcomeContainer, opacity: mounted ? 1 : 0 }}>
      <div style={styles.welcomeBg} />
      <div style={styles.welcomeContent}>
        <div style={styles.welcomeLogo}><span style={styles.logoEmoji}>🎓</span></div>
        <h1 style={styles.welcomeTitle}>AI Tutor</h1>
        <p style={styles.welcomeSubtitle}>Your personal learning companion</p>
        <div style={styles.welcomeButtons}>
          <button style={styles.primaryButton} onClick={onLogin}>Sign In</button>
          <button style={styles.secondaryButton} onClick={onRegister}>Create Account</button>
          <button style={styles.guestButton} onClick={onGuestMode}>
            <span style={styles.guestIcon}>👤</span>Continue as Guest
          </button>
        </div>
        <p style={styles.guestInfo}>Guest mode lets you explore without an account.<br />Progress won't be saved.</p>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  // Auth State
  const [currentStudent, setCurrentStudent] = useState(null);
  const [authView, setAuthView] = useState('welcome'); // welcome | login | register | parent
  const [isGuest, setIsGuest] = useState(false);

  // Game State
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);

  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [subView, setSubView] = useState(null);

  // Selection State
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Data State
  const [boards, setBoards] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [recentChapters, setRecentChapters] = useState([]);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Review State
  const [isReviewSession, setIsReviewSession] = useState(false);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  // Syllabus Context
  const { fetchChaptersFromDB, dbChapters, setSelectedDbChapter } = useContext(SyllabusContext);

  // Load fonts and CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.href = googleFontsUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'design-system-vars';
    style.textContent = generateCSSVariables();
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      const existingStyle = document.getElementById('design-system-vars');
      if (existingStyle) document.head.removeChild(existingStyle);
    };
  }, []);

  // Deep link entry points (e.g., parent entry via WhatsApp link)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('entry') === 'parent') {
        setAuthView('parent');
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Load dropdown data
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [boardsRes, gradesRes, subjectsRes] = await Promise.all([
          fetchBoards(), fetchGrades(), fetchSubjects()
        ]);
        setBoards(boardsRes.data || []);
        setGrades(gradesRes.data || []);
        setSubjects(subjectsRes.data || []);
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      }
    };
    loadDropdowns();
  }, []);

  // Load student data
  useEffect(() => {
    if (currentStudent && !currentStudent.isGuest) {
      apiGetStudentScore(currentStudent.id).then(scoreData => {
        if (scoreData) {
          setGameState(prev => ({
            ...prev,
            coins: scoreData.coins || prev.coins,
            total_score: scoreData.total_score || prev.total_score,
            quizzes_completed: scoreData.quizzes_completed || prev.quizzes_completed,
            streak_days: scoreData.streak_days || prev.streak_days,
          }));
        }
      }).catch(console.error);
    }
  }, [currentStudent]);

  // Load chapters when subject selected
  useEffect(() => {
    if (selectedSubject?.id) {
      fetchChaptersFromDB(selectedSubject.id).catch(console.error);
    }
  }, [selectedSubject, fetchChaptersFromDB]);

  // Auth Handlers
  const handleLoginSuccess = (student) => {
    setCurrentStudent(student);
    setIsGuest(false);
    setAuthView('welcome');
    setActiveTab('home');
  };

  const handleRegisterSuccess = () => {
    setAuthView('login');
  };

  const handleGuestMode = () => {
    setCurrentStudent(GUEST_STUDENT);
    setIsGuest(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setIsGuest(false);
    setAuthView('welcome');
    setActiveTab('home');
    setSubView(null);
    setSelectedBoard(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setFlashcards([]);
    setRecentChapters([]);
    setChatMessages([]);
    setGameState(INITIAL_GAME_STATE);
  };

  // Navigation Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSubView(null);
    if (tab !== 'review') {
      setIsReviewSession(false);
      setIsReviewComplete(false);
      setCurrentCardIndex(0);
      setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 });
    }
  };

  const openChapter = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedDbChapter(chapter.id);
    setSubView('chapter');
    setRecentChapters(prev => {
      const filtered = prev.filter(r => r.chapterId !== chapter.id);
      return [{ chapter: chapter.name, subject: selectedSubject?.name, lastAccessed: new Date(), chapterId: chapter.id }, ...filtered].slice(0, 10);
    });
  };

  // Chat Handler
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    setChatLoading(true);
    try {
      const gradeForChat = selectedGrade?.name || currentStudent?.grade_band || '10th';
      const response = await apiChatWithTutor(
        message,
        selectedSubject?.name || 'General',
        gradeForChat,
        currentStudent?.id
      );
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response || response.message || 'I couldn\'t generate a response.',
        citations: response.citations || [],
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Review Handlers
  const handleStartReview = () => {
    setIsReviewSession(true);
    setCurrentCardIndex(0);
    setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  const handleGradeCard = (grade) => {
    setSessionResults(prev => ({ ...prev, [grade]: prev[grade] + 1 }));
    const dueCards = flashcards.filter(f => new Date(f.due_date || f.next_review) <= new Date());
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsReviewComplete(true);
    }
  };

  // Computed Values
  const dueFlashcards = useMemo(() => flashcards.filter(f => new Date(f.due_date || f.next_review) <= new Date()), [flashcards]);
  const mistakeCards = useMemo(() => flashcards.filter(f => f.mistake_count > 0 || f.ease_factor < 2.0), [flashcards]);

  const getContext = () => {
    if (!selectedBoard) return null;
    return { board: selectedBoard?.name, grade: selectedGrade?.name, subject: selectedSubject?.name, chapter: selectedChapter?.name };
  };

  const getParentEntryLink = () => {
    try {
      const url = new URL(window.location.origin);
      url.searchParams.set('entry', 'parent');
      return url.toString();
    } catch (err) {
      return '/?entry=parent';
    }
  };

  const openWhatsAppParentInvite = () => {
    const link = getParentEntryLink();
    const studentName = currentStudent?.name || 'Student';
    const text = `AI Tutor · Parent entry link for ${studentName}:\n${link}\n\nOpen the link and verify with PIN or OTP to view the parent dashboard.`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Render Views
  const renderView = () => {
    if (subView === 'chapter') {
      return (
        <ChapterPageView
          chapter={selectedChapter}
          subject={selectedSubject}
          progress={35}
          onBack={() => setSubView(null)}
          onMenuClick={() => {}}
          onModeStart={(mode) => {
            if (mode === 'study') { setChatMessages([]); setSubView('study'); }
          }}
          onSuggestionSelect={(s) => { setChatMessages([]); handleSendMessage(s.prompt || s.label); setSubView('study'); }}
        />
      );
    }

    if (subView === 'study') {
      return (
        <StudyTogetherView
          chapter={selectedChapter}
          subject={selectedSubject}
          messages={chatMessages}
          isLoading={chatLoading}
          onSendMessage={handleSendMessage}
          onSaveToFlashcard={(msg) => console.log('Save:', msg)}
          onFollowUp={(msg) => handleSendMessage(`Tell me more about: ${msg.content.slice(0, 50)}...`)}
          onExpand={(msg) => handleSendMessage(`Explain in more detail: ${msg.content.slice(0, 50)}...`)}
          onSwitchChapter={() => { setSubView(null); handleTabChange('learn'); }}
          onStayInChapter={() => {}}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <NewDashboardView
            student={currentStudent}
            gameState={gameState}
            lastChapter={recentChapters[0]?.chapter}
            lastMode="study"
            lastProgress={65}
            dueFlashcards={dueFlashcards.length}
            recentChapters={recentChapters}
            onContinueLearning={() => recentChapters[0] ? openChapter({ id: recentChapters[0].chapterId, name: recentChapters[0].chapter }) : handleTabChange('learn')}
            onStartReview={() => handleTabChange('review')}
            onPickChapter={() => handleTabChange('learn')}
            onStudyTogether={() => selectedChapter ? (setChatMessages([]), setSubView('study')) : handleTabChange('learn')}
            onRecentChapterClick={(item) => openChapter({ id: item.chapterId, name: item.chapter })}
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
              onMenuClick={() => {}}
              onModeStart={(mode) => { if (mode === 'study') { setChatMessages([]); setSubView('study'); } }}
              onSuggestionSelect={(s) => { setChatMessages([]); handleSendMessage(s.prompt || s.label); setSubView('study'); }}
            />
          );
        }
        return (
          <LearnView
            boards={boards}
            grades={grades}
            subjects={subjects}
            chapters={dbChapters || []}
            recentChapters={recentChapters}
            selectedBoard={selectedBoard}
            selectedGrade={selectedGrade}
            selectedSubject={selectedSubject}
            selectedChapter={selectedChapter}
            onBoardSelect={setSelectedBoard}
            onGradeSelect={setSelectedGrade}
            onSubjectSelect={setSelectedSubject}
            onChapterSelect={setSelectedChapter}
            onOpenChapter={openChapter}
          />
        );

      case 'review':
        return (
          <ReviewView
            dueToday={dueFlashcards.length}
            mistakeCards={mistakeCards.length}
            chapterCards={flashcards.length - mistakeCards.length}
            flashcards={dueFlashcards}
            streakDays={gameState.streak_days}
            isSessionActive={isReviewSession}
            isSessionComplete={isReviewComplete}
            currentCardIndex={currentCardIndex}
            sessionResults={sessionResults}
            onStartReview={handleStartReview}
            onStartMistakes={handleStartReview}
            onGrade={handleGradeCard}
            onDone={() => { setIsReviewSession(false); setIsReviewComplete(false); setCurrentCardIndex(0); setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 }); }}
            onStudyMore={() => handleTabChange('learn')}
          />
        );

      case 'profile':
        return (
          <ProfileView
            student={currentStudent}
            stats={{ level: gameState.current_level, streakDays: gameState.streak_days, totalCards: flashcards.length, coins: gameState.coins }}
            settings={{ language: currentStudent?.medium || 'en', autoSaveCards: true, weeklySummary: true }}
            isParentLinked={false}
            onLanguageChange={() => {}}
            onBoardGradeChange={() => handleTabChange('learn')}
            onAutoSaveToggle={() => {}}
            onWeeklySummaryToggle={() => {}}
            onAddParent={openWhatsAppParentInvite}
            onManageParentSettings={() => window.open(getParentEntryLink(), '_blank', 'noopener,noreferrer')}
            onDownloadData={() => {}}
            onDeleteData={() => {}}
            onLogout={handleLogout}
          />
        );

      default:
        return null;
    }
  };

  const setEntryParam = (value) => {
    try {
      const url = new URL(window.location.href);
      if (!value) {
        url.searchParams.delete('entry');
      } else {
        url.searchParams.set('entry', value);
      }
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      // ignore
    }
  };

  // Auth Screens
  if (!currentStudent) {
    if (authView === 'parent') {
      return (
        <ThemeProvider gradeBand="Grade 9">
          <ParentEntryView
            theme="teen"
            onBack={() => {
              setAuthView('welcome');
              setEntryParam(null);
            }}
          />
        </ThemeProvider>
      );
    }

    if (authView === 'login') {
      return (
        <ThemeProvider gradeBand="Grade 9">
          <div style={styles.authContainer}>
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => setAuthView('register')}
            />
            <button style={styles.backToWelcome} onClick={() => setAuthView('welcome')}>← Back</button>
          </div>
        </ThemeProvider>
      );
    }

    if (authView === 'register') {
      return (
        <ThemeProvider gradeBand="Grade 9">
          <div style={styles.authContainer}>
            <RegisterView
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => setAuthView('login')}
            />
            <button style={styles.backToWelcome} onClick={() => setAuthView('welcome')}>← Back</button>
          </div>
        </ThemeProvider>
      );
    }

    return (
      <WelcomeScreen
        onLogin={() => setAuthView('login')}
        onRegister={() => setAuthView('register')}
        onGuestMode={handleGuestMode}
      />
    );
  }

  // Main App
  return (
    <ThemeProvider gradeBand={currentStudent?.grade_band || 'Grade 8'}>
      <MainLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        context={getContext()}
        reviewDueCount={dueFlashcards.length}
        showContextPill={!!getContext() && activeTab !== 'home' && activeTab !== 'profile'}
      >
        {isGuest && (
          <div style={styles.guestBanner}>
            <span>👤 Guest Mode - </span>
            <button style={styles.guestBannerLink} onClick={() => { setCurrentStudent(null); setAuthView('register'); }}>
              Create account to save progress
            </button>
          </div>
        )}
        {renderView()}
      </MainLayout>
    </ThemeProvider>
  );
};

// Styles
const styles = {
  welcomeContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
    position: 'relative',
    overflow: 'hidden',
    transition: 'opacity 0.5s ease-out',
  },
  welcomeBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary[100]} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colors.accent[100]} 0%, transparent 50%), radial-gradient(circle at 50% 50%, ${colors.secondary[50]} 0%, transparent 60%)`,
    opacity: 0.8,
  },
  welcomeContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing[8],
    maxWidth: '400px',
    width: '100%',
  },
  welcomeLogo: {
    width: '100px',
    height: '100px',
    borderRadius: '28px',
    backgroundColor: colors.primary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    boxShadow: `0 20px 40px ${colors.primary[500]}40`,
  },
  logoEmoji: { fontSize: '48px' },
  welcomeTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: '2.5rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },
  welcomeSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg[0],
    color: colors.neutral[500],
    margin: `${spacing[2]} 0 ${spacing[8]} 0`,
  },
  welcomeButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    padding: `${spacing[4]} ${spacing[6]}`,
    backgroundColor: colors.primary[500],
    color: colors.neutral[0],
    border: 'none',
    borderRadius: '16px',
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    boxShadow: `0 4px 14px ${colors.primary[500]}30`,
  },
  secondaryButton: {
    width: '100%',
    padding: `${spacing[4]} ${spacing[6]}`,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[800],
    border: `2px solid ${colors.neutral[200]}`,
    borderRadius: '16px',
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
  },
  guestButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: `${spacing[4]} ${spacing[6]}`,
    backgroundColor: colors.accent[400],
    color: colors.neutral[900],
    border: `2px solid ${colors.neutral[900]}`,
    borderRadius: '16px',
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
    boxShadow: '4px 4px 0 0 rgba(26, 26, 26, 1)',
  },
  guestIcon: { fontSize: '1.25rem' },
  guestInfo: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[400],
    textAlign: 'center',
    marginTop: spacing[6],
    lineHeight: 1.6,
  },
  authContainer: { position: 'relative', minHeight: '100vh' },
  backToWelcome: {
    position: 'fixed',
    top: spacing[4],
    left: spacing[4],
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[700],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: '12px',
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    cursor: 'pointer',
    zIndex: 100,
  },
  guestBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    backgroundColor: colors.accent[100],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: '12px',
    marginBottom: spacing[4],
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[800],
  },
  guestBannerLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default App;
