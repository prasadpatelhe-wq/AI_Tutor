/**
 * MainLayout - Core app layout with Sidebar
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Sidebar Navigation (Left on desktop, drawer on mobile)
 * - Deep Green Theme Background
 */

import React, { useState, useEffect } from 'react';
import { colors, transitions, spacing } from '../design/designSystem';
import Sidebar from '../components/Sidebar';
import { useIsMobile } from '../hooks/useMediaQuery';

// Main Layout Component
const MainLayout = ({
  children,
  activeTab = 'home',
  onTabChange,
  student, // Expecting student prop for sidebar profile
}) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    // Set body background to dark theme
    document.body.style.backgroundColor = colors.theme.bg;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Responsive content styles
  const contentStyle = {
    flex: 1,
    marginLeft: isMobile ? 0 : '260px', // No margin on mobile since sidebar is a drawer
    padding: isMobile ? spacing[4] : spacing[10], // Less padding on mobile
    paddingTop: isMobile ? spacing[16] : spacing[10], // Extra top padding on mobile for hamburger
    transition: `opacity ${transitions.duration.normal} ${transitions.easing.out}, transform ${transitions.duration.normal} ${transitions.easing.out}`,
    width: isMobile ? '100%' : 'calc(100% - 260px)',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
    boxSizing: 'border-box',
  };

  const contentInnerStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '1400px',
    margin: '0 auto',
  };

  return (
    <div style={styles.container}>
      {/* Sidebar (Left on desktop, drawer on mobile) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        student={student}
      />

      {/* Main Content Area */}
      <main style={contentStyle}>
        <div style={contentInnerStyle}>{children}</div>
      </main>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.theme.bg,
    color: colors.theme.text,
    display: 'flex',
  },
};

export default MainLayout;
