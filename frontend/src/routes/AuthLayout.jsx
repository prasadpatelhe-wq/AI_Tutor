/**
 * AuthLayout - Layout for authentication screens
 *
 * Wraps login/register views with theme and back navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { colors, spacing, typography } from '../design/designSystem';

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <ThemeProvider gradeBand="Grade 9">
      <div style={styles.container}>
        {children}
        <button style={styles.backButton} onClick={handleBack}>
          ← Back
        </button>
      </div>
    </ThemeProvider>
  );
};

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
  },
  backButton: {
    position: 'fixed',
    top: spacing[4],
    left: spacing[4],
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[700],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: '12px',
    fontFamily: typography.fontFamily.body,
    fontSize: '0.875rem',
    cursor: 'pointer',
    zIndex: 100,
  },
};

export default AuthLayout;
