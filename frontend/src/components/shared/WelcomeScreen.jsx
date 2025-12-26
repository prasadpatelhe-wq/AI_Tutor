/**
 * WelcomeScreen - Landing page for unauthenticated users
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing } from '../../design/designSystem';

const WelcomeScreen = ({ onLogin, onRegister, onGuestMode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ ...styles.container, opacity: mounted ? 1 : 0 }}>
      <div style={styles.bg} />
      <div style={styles.content}>
        <div style={styles.logo}>
          <span style={styles.logoEmoji}>🎓</span>
        </div>
        <h1 style={styles.title}>AI Tutor</h1>
        <p style={styles.subtitle}>Your personal learning companion</p>
        <div style={styles.buttons}>
          <button style={styles.primaryButton} onClick={onLogin}>
            Sign In
          </button>
          <button style={styles.secondaryButton} onClick={onRegister}>
            Create Account
          </button>
          <button style={styles.guestButton} onClick={onGuestMode}>
            <span style={styles.guestIcon}>👤</span>
            Continue as Guest
          </button>
        </div>
        <p style={styles.guestInfo}>
          Guest mode lets you explore without an account.
          <br />
          Progress won't be saved.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
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
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary[100]} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colors.accent[100]} 0%, transparent 50%), radial-gradient(circle at 50% 50%, ${colors.secondary[50]} 0%, transparent 60%)`,
    opacity: 0.8,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing[8],
    maxWidth: '400px',
    width: '100%',
  },
  logo: {
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
  logoEmoji: {
    fontSize: '48px',
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: '2.5rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg[0],
    color: colors.neutral[500],
    margin: `${spacing[2]} 0 ${spacing[8]} 0`,
  },
  buttons: {
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
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
    transition: 'transform 0.2s ease, border-color 0.2s ease',
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
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  },
  guestIcon: {
    fontSize: '1.25rem',
  },
  guestInfo: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[400],
    textAlign: 'center',
    marginTop: spacing[6],
    lineHeight: 1.6,
  },
};

export default WelcomeScreen;
