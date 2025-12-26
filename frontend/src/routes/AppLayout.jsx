/**
 * AppLayout - Main application layout with navigation
 *
 * Wraps authenticated views with navigation and theme
 */

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { useCurriculumStore } from '../store/curriculumStore';
import WelcomeScreen from '../components/shared/WelcomeScreen';
import { colors, spacing } from '../design/designSystem';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Store state
  const student = useAuthStore((state) => state.student);
  const authView = useAuthStore((state) => state.authView);
  const setAuthView = useAuthStore((state) => state.setAuthView);
  const loadFromServer = useGameStore((state) => state.loadFromServer);
  const getContext = useCurriculumStore((state) => state.getContext);

  // Get active tab from location
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'home';
    if (path.startsWith('/learn')) return 'learn';
    if (path === '/review') return 'review';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  // Load game state when student changes
  useEffect(() => {
    if (student && !student.isGuest) {
      loadFromServer(student.id);
    }
  }, [student, loadFromServer]);

  // Handle tab changes
  const handleTabChange = (tab) => {
    const routes = {
      home: '/',
      learn: '/learn',
      review: '/review',
      profile: '/profile',
    };
    navigate(routes[tab] || '/');
  };

  // If not authenticated, show welcome/auth screens
  if (!student) {
    if (authView === 'login') {
      navigate('/login');
      return null;
    }
    if (authView === 'register') {
      navigate('/register');
      return null;
    }
    if (authView === 'parent') {
      navigate('/parent');
      return null;
    }

    return (
      <WelcomeScreen
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
        onGuestMode={() => useAuthStore.getState().enterGuestMode()}
      />
    );
  }

  const context = getContext();
  const activeTab = getActiveTab();

  return (
    <ThemeProvider gradeBand={student?.grade_band || 'Grade 8'}>
      <MainLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        context={context}
        reviewDueCount={0}
        showContextPill={!!context && activeTab !== 'home' && activeTab !== 'profile'}
      >
        {student.isGuest && <GuestBanner />}
        <Outlet />
      </MainLayout>
    </ThemeProvider>
  );
};

// Guest mode banner
const GuestBanner = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleCreateAccount = () => {
    logout();
    navigate('/register');
  };

  return (
    <div style={styles.guestBanner}>
      <span>Guest Mode - </span>
      <button style={styles.guestBannerLink} onClick={handleCreateAccount}>
        Create account to save progress
      </button>
    </div>
  );
};

const styles = {
  guestBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    backgroundColor: colors.accent[100],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: '12px',
    marginBottom: spacing[4],
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    color: colors.neutral[800],
  },
  guestBannerLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.primary[600],
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default AppLayout;
