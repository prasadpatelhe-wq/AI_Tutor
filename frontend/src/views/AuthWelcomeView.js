import React, { useMemo } from 'react';
import { colors, fonts, radius, shadows, spacing } from '../design/tokens';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AuthWelcomeView = ({
  theme = 'teen',
  storedStudent = null,
  onContinue,
  onLogin,
  onRegister,
  onParentEntry,
  onGuest,
  guestEnabled = false,
}) => {
  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const sp = spacing[theme];

  const styles = useMemo(() => ({
    page: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: sp.xl,
      background: c.bgGradient,
      color: c.text,
      position: 'relative',
    },
    container: {
      width: '100%',
      maxWidth: '860px',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: sp.xl,
      alignItems: 'stretch',
    },
    hero: {
      background: theme === 'teen'
        ? 'rgba(20, 20, 35, 0.75)'
        : theme === 'kids'
          ? 'rgba(255,255,255,0.92)'
          : 'rgba(24,24,27,0.85)',
      border: `1px solid ${theme === 'teen' ? c.primary + '35' : 'rgba(255,255,255,0.25)'}`,
      borderRadius: r.xl,
      padding: sp.xl,
      boxShadow: sh.lg,
      backdropFilter: 'blur(18px)',
      overflow: 'hidden',
      position: 'relative',
    },
    title: {
      fontFamily: f.display,
      fontSize: theme === 'kids' ? '2.4rem' : '2.1rem',
      lineHeight: 1.1,
      marginBottom: sp.sm,
      letterSpacing: theme === 'teen' ? '1px' : 0,
      background: theme === 'teen'
        ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 60%, ${c.accent1} 100%)`
        : 'none',
      WebkitBackgroundClip: theme === 'teen' ? 'text' : 'initial',
      WebkitTextFillColor: theme === 'teen' ? 'transparent' : c.text,
      backgroundClip: theme === 'teen' ? 'text' : 'initial',
    },
    subtitle: {
      fontFamily: f.body,
      color: c.textMuted,
      fontSize: '1rem',
      marginBottom: sp.lg,
    },
    bullet: {
      display: 'flex',
      gap: sp.sm,
      alignItems: 'flex-start',
      padding: `${sp.sm} ${sp.md}`,
      borderRadius: r.lg,
      background: theme === 'teen' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      marginBottom: sp.sm,
    },
    bulletIcon: { fontSize: '1.25rem', marginTop: '2px' },
    bulletText: { fontFamily: f.body, color: c.text, fontWeight: 600 },
    bulletSub: { fontFamily: f.body, color: c.textMuted, fontSize: '0.9rem', marginTop: '2px' },
    actions: {
      display: 'grid',
      gap: sp.sm,
      alignContent: 'start',
    },
    rightCard: {
      height: '100%',
      display: 'grid',
      gap: sp.md,
      alignContent: 'start',
      padding: sp.lg,
      borderRadius: r.xl,
      background: theme === 'teen'
        ? 'rgba(255,255,255,0.06)'
        : theme === 'kids'
          ? 'rgba(255,255,255,0.92)'
          : 'rgba(24,24,27,0.85)',
      border: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)'}`,
      boxShadow: sh.md,
      backdropFilter: 'blur(18px)',
    },
    smallNote: {
      fontFamily: f.body,
      color: c.textMuted,
      fontSize: '0.85rem',
      lineHeight: 1.5,
    },
    divider: {
      height: 1,
      background: `linear-gradient(90deg, transparent, ${c.textMuted}30, transparent)`,
      margin: `${sp.md} 0`,
    },
    mobile: `
      @media (max-width: 920px) {
        .auth-welcome-grid { grid-template-columns: 1fr; }
      }
    `,
  }), [theme, c, f, r, sh, sp]);

  const continueLabel = storedStudent?.name
    ? `Continue as ${storedStudent.name}`
    : 'Continue';

  return (
    <>
      <style>{styles.mobile}</style>
      <div style={styles.page}>
        <div className="auth-welcome-grid" style={styles.container}>
          <div style={styles.hero}>
            <div style={styles.title}>AI Tutor</div>
            <div style={styles.subtitle}>
              Learn faster with quizzes, flashcards, and a ChatGPT-style study buddy.
            </div>

            <div style={styles.bullet}>
              <div style={styles.bulletIcon}>🧠</div>
              <div>
                <div style={styles.bulletText}>Study Together (Chat)</div>
                <div style={styles.bulletSub}>Ask questions, get explanations, practice problems.</div>
              </div>
            </div>
            <div style={styles.bullet}>
              <div style={styles.bulletIcon}>🎯</div>
              <div>
                <div style={styles.bulletText}>Personalized Quizzes</div>
                <div style={styles.bulletSub}>Based on your grade, board, and subject.</div>
              </div>
            </div>
            <div style={styles.bullet}>
              <div style={styles.bulletIcon}>🃏</div>
              <div>
                <div style={styles.bulletText}>Flashcards + Progress</div>
                <div style={styles.bulletSub}>Spaced repetition to remember longer.</div>
              </div>
            </div>
          </div>

          <Card theme={theme} style={styles.rightCard}>
            <div style={{ fontFamily: f.display, fontWeight: 800, fontSize: '1.3rem' }}>
              Get Started
            </div>

            <div style={styles.actions}>
              <Button
                theme={theme}
                variant={storedStudent ? 'gradient' : 'primary'}
                size="lg"
                fullWidth
                onClick={onContinue}
              >
                {continueLabel}
              </Button>

              <Button theme={theme} variant="glass" size="lg" fullWidth onClick={onLogin}>
                Login
              </Button>

              <Button theme={theme} variant="secondary" size="lg" fullWidth onClick={onRegister}>
                Create account
              </Button>

              <div style={styles.divider} />

              <Button theme={theme} variant="ghost" size="md" fullWidth onClick={onParentEntry}>
                Parent entry (WhatsApp link)
              </Button>

              <Button
                theme={theme}
                variant="ghost"
                size="md"
                fullWidth
                disabled={!guestEnabled}
                onClick={onGuest}
              >
                Try without account (coming soon)
              </Button>
            </div>

            <div style={styles.smallNote}>
              Tip: You can log in with phone OTP (India-first) or email/password.
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AuthWelcomeView;

