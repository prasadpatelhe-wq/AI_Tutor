/**
 * MainLayout - Core app layout with Sidebar
 * Features:
 * - Sidebar Navigation (Left)
 * - Deep Green Theme Background
 */

import React, { useState, useEffect } from 'react';
import { colors, transitions } from '../design/designSystem';
import Sidebar from '../components/Sidebar';

// Main Layout Component
const MainLayout = ({
  children,
  activeTab = 'home',
  onTabChange,
  student, // Expecting student prop for sidebar profile
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set body background to dark theme
    document.body.style.backgroundColor = colors.theme.bg;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar (Left) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        student={student}
      />

      {/* Main Content Area (Right) */}
      <main
        style={{
          ...styles.content,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        {children}
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

  content: {
    flex: 1,
    marginLeft: '260px', // Sidebar width
    padding: '40px',
    transition: `opacity ${transitions.duration.normal} ${transitions.easing.out}, transform ${transitions.duration.normal} ${transitions.easing.out}`,
    maxWidth: '1200px', // Limit content width for readability
    width: '100%',
  },
};

export default MainLayout;

