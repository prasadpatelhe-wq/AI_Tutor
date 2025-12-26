/**
 * LoadingSpinner - Reusable loading indicator
 */

import React from 'react';
import { colors, spacing } from '../../design/designSystem';

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = '' }) => {
  const sizes = {
    small: { spinner: 24, border: 2 },
    medium: { spinner: 40, border: 3 },
    large: { spinner: 60, border: 4 },
  };

  const { spinner: spinnerSize, border: borderWidth } = sizes[size] || sizes.medium;

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: `${borderWidth}px solid ${colors.neutral[200]}`,
    borderTop: `${borderWidth}px solid ${colors.primary[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const content = (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div style={styles.fullScreen}>{content}</div>;
  }

  return content;
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    padding: spacing[6],
  },
  fullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
    zIndex: 9999,
  },
  message: {
    margin: 0,
    color: colors.neutral[600],
    fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif',
  },
};

export default LoadingSpinner;
