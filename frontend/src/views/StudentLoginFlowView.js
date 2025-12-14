import React, { useEffect, useMemo, useState } from 'react';
import { colors, fonts, radius, shadows, spacing } from '../design/tokens';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import {
  loginStudent,
  loginStudentOtp,
  requestOtp,
  confirmPasswordReset,
  requestPasswordReset,
} from '../api';

const StudentLoginFlowView = ({
  theme = 'teen',
  onLoginSuccess,
  onNavigateToRegister,
  prefill = null,
}) => {
  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const sp = spacing[theme];

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [method, setMethod] = useState(prefill?.method || 'phone'); // 'phone' | 'email'

  // Phone OTP
  const [phone, setPhone] = useState(prefill?.phone || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  // Email/password
  const [email, setEmail] = useState(prefill?.email || '');
  const [password, setPassword] = useState('');

  // Forgot password modal
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState(prefill?.email || '');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetDevOtp, setResetDevOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    // Reset per-method state
    setError('');
    if (method === 'phone') {
      setPassword('');
    } else {
      setOtpSent(false);
      setOtp('');
      setDevOtp('');
    }
  }, [method]);

  const styles = useMemo(() => ({
    page: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: sp.xl,
      background: c.bgGradient,
      color: c.text,
    },
    container: {
      width: '100%',
      maxWidth: '520px',
    },
    title: {
      fontFamily: f.display,
      fontWeight: 900,
      fontSize: '2rem',
      textAlign: 'center',
      marginBottom: sp.sm,
      letterSpacing: theme === 'teen' ? '1px' : 0,
    },
    subtitle: {
      fontFamily: f.body,
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: sp.lg,
    },
    tabRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: sp.sm,
      marginBottom: sp.md,
    },
    tabButton: (active) => ({
      borderRadius: r.lg,
      border: `1px solid ${active ? c.primary : 'rgba(255,255,255,0.12)'}`,
      background: active
        ? theme === 'teen'
          ? `linear-gradient(135deg, ${c.primary}20 0%, ${c.secondary}20 100%)`
          : 'rgba(255,255,255,0.5)'
        : theme === 'teen'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.7)',
      padding: sp.sm,
      cursor: 'pointer',
      fontFamily: f.body,
      color: c.text,
      fontWeight: 700,
      textAlign: 'center',
      userSelect: 'none',
      transition: 'all 0.2s ease',
    }),
    banner: {
      borderRadius: r.lg,
      padding: `${sp.sm} ${sp.md}`,
      background: isOnline ? `${c.success}15` : `${c.warning}15`,
      border: `1px solid ${isOnline ? c.success + '30' : c.warning + '30'}`,
      color: isOnline ? c.success : c.warning,
      fontFamily: f.body,
      fontWeight: 700,
      marginBottom: sp.md,
    },
    error: {
      borderRadius: r.lg,
      padding: `${sp.sm} ${sp.md}`,
      background: `${c.error}15`,
      border: `1px solid ${c.error}30`,
      color: c.error,
      fontFamily: f.body,
      fontWeight: 700,
      marginBottom: sp.md,
    },
    helperRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: sp.md,
      alignItems: 'center',
      marginTop: sp.sm,
    },
    helperLink: {
      fontFamily: f.body,
      color: c.primary,
      fontWeight: 700,
      cursor: 'pointer',
      textDecoration: 'none',
    },
    divider: {
      height: 1,
      background: `linear-gradient(90deg, transparent, ${c.textMuted}30, transparent)`,
      margin: `${sp.lg} 0`,
    },
    modalBackdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      display: 'grid',
      placeItems: 'center',
      padding: sp.lg,
      zIndex: 2000,
    },
    modal: {
      width: '100%',
      maxWidth: '520px',
      borderRadius: r.xl,
      background: theme === 'teen' ? 'rgba(20, 20, 35, 0.92)' : c.bgCard,
      border: `1px solid ${theme === 'teen' ? c.primary + '30' : 'rgba(255,255,255,0.2)'}`,
      boxShadow: sh.lg,
      backdropFilter: 'blur(18px)',
      padding: sp.lg,
      color: c.text,
    },
  }), [theme, c, f, r, sh, sp, isOnline]);

  const setOfflineIfNeeded = () => {
    if (!isOnline) {
      setError('You are offline. Please reconnect and try again.');
      return true;
    }
    return false;
  };

  const handleSendLoginOtp = async () => {
    setError('');
    if (setOfflineIfNeeded()) return;
    if (!phone.trim()) {
      setError('Enter your phone number first.');
      return;
    }
    setLoading(true);
    const res = await requestOtp({ channel: 'phone', identifier: phone, purpose: 'login' });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    setOtpSent(true);
    setDevOtp(res.data?.dev_otp || '');
  };

  const handleLoginWithOtp = async () => {
    setError('');
    if (setOfflineIfNeeded()) return;
    if (!phone.trim() || !otp.trim()) {
      setError('Enter phone and OTP.');
      return;
    }
    setLoading(true);
    const res = await loginStudentOtp({ phone, otp });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    onLoginSuccess(res.data?.student);
  };

  const handleLoginWithEmail = async () => {
    setError('');
    if (setOfflineIfNeeded()) return;
    if (!email.trim() || !password) {
      setError('Enter email and password.');
      return;
    }
    setLoading(true);
    const res = await loginStudent({ email, password });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    onLoginSuccess(res.data?.student);
  };

  const handleRequestResetOtp = async () => {
    setError('');
    if (setOfflineIfNeeded()) return;
    if (!resetEmail.trim()) {
      setError('Enter your email to reset password.');
      return;
    }
    setLoading(true);
    const res = await requestPasswordReset({ email: resetEmail });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    setResetOtpSent(true);
    setResetDevOtp(res.data?.dev_otp || '');
  };

  const handleConfirmReset = async () => {
    setError('');
    if (setOfflineIfNeeded()) return;
    if (!resetOtpSent) {
      setError('Request an OTP first.');
      return;
    }
    if (!resetOtp.trim() || !resetNewPassword) {
      setError('Enter OTP and a new password.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await confirmPasswordReset({ email: resetEmail, otp: resetOtp, newPassword: resetNewPassword });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }

    setShowReset(false);
    setMethod('email');
    setEmail(resetEmail);
    setPassword('');
    setResetOtpSent(false);
    setResetOtp('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetDevOtp('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>Student Login</div>
        <div style={styles.subtitle}>Login with phone OTP or email/password.</div>

        <div style={styles.banner}>
          {isOnline ? '✅ Online' : '⚠️ Offline mode: backend unreachable'}
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}

        <Card theme={theme} style={{ padding: sp.lg, borderRadius: r.xl }}>
          <div style={styles.tabRow}>
            <div
              role="button"
              tabIndex={0}
              style={styles.tabButton(method === 'phone')}
              onClick={() => setMethod('phone')}
              onKeyDown={(e) => e.key === 'Enter' && setMethod('phone')}
            >
              📱 Phone OTP
            </div>
            <div
              role="button"
              tabIndex={0}
              style={styles.tabButton(method === 'email')}
              onClick={() => setMethod('email')}
              onKeyDown={(e) => e.key === 'Enter' && setMethod('email')}
            >
              📧 Email + Password
            </div>
          </div>

          {method === 'phone' ? (
            <>
              <Input
                theme={theme}
                label="Phone"
                placeholder="10-digit number (India) or +countrycode…"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon="📱"
                variant="glass"
              />

              {otpSent ? (
                <>
                  <div style={{ height: sp.sm }} />
                  <Input
                    theme={theme}
                    label="OTP"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    icon="🔐"
                    variant="glass"
                  />
                  {devOtp ? (
                    <div style={{ marginTop: sp.sm, color: c.textMuted, fontFamily: f.body, fontSize: '0.85rem' }}>
                      Dev OTP: <span style={{ fontFamily: 'monospace', color: c.text }}>{devOtp}</span>
                    </div>
                  ) : null}

                  <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                    <Button
                      theme={theme}
                      variant="gradient"
                      size="lg"
                      fullWidth
                      loading={loading}
                      onClick={handleLoginWithOtp}
                    >
                      Login
                    </Button>
                    <Button
                      theme={theme}
                      variant="glass"
                      size="md"
                      fullWidth
                      disabled={loading}
                      onClick={handleSendLoginOtp}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                  <Button
                    theme={theme}
                    variant="gradient"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onClick={handleSendLoginOtp}
                  >
                    Send OTP
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <Input
                theme={theme}
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon="📧"
                variant="glass"
                type="email"
              />
              <div style={{ height: sp.sm }} />
              <Input
                theme={theme}
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="🔐"
                variant="glass"
                type="password"
              />

              <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                <Button
                  theme={theme}
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handleLoginWithEmail}
                >
                  Login
                </Button>
              </div>

              <div style={styles.helperRow}>
                <span style={styles.helperLink} onClick={() => setShowReset(true)}>
                  Forgot password?
                </span>
                <span style={styles.helperLink} onClick={onNavigateToRegister}>
                  Create account →
                </span>
              </div>
            </>
          )}

          <div style={styles.divider} />

          <div style={{ textAlign: 'center', fontFamily: f.body, color: c.textMuted }}>
            New here?{' '}
            <span style={styles.helperLink} onClick={onNavigateToRegister}>
              Create account
            </span>
          </div>
        </Card>
      </div>

      {showReset ? (
        <div style={styles.modalBackdrop} onMouseDown={() => setShowReset(false)}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: f.display, fontWeight: 900, fontSize: '1.4rem', marginBottom: sp.sm }}>
              Reset Password
            </div>
            <div style={{ fontFamily: f.body, color: c.textMuted, marginBottom: sp.md }}>
              Request an OTP to your email and set a new password.
            </div>

            <Input
              theme={theme}
              label="Email"
              placeholder="you@example.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              icon="📧"
              variant="glass"
              type="email"
            />

            <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
              <Button
                theme={theme}
                variant="glass"
                size="md"
                fullWidth
                disabled={loading}
                onClick={handleRequestResetOtp}
              >
                {resetOtpSent ? 'Resend OTP' : 'Send OTP'}
              </Button>
            </div>

            {resetOtpSent ? (
              <>
                <div style={{ height: sp.md }} />
                <Input
                  theme={theme}
                  label="OTP"
                  placeholder="6-digit code"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  icon="🔢"
                  variant="glass"
                />
                {resetDevOtp ? (
                  <div style={{ marginTop: sp.sm, color: c.textMuted, fontFamily: f.body, fontSize: '0.85rem' }}>
                    Dev OTP: <span style={{ fontFamily: 'monospace', color: c.text }}>{resetDevOtp}</span>
                  </div>
                ) : null}

                <div style={{ height: sp.sm }} />
                <Input
                  theme={theme}
                  label="New password"
                  placeholder="Choose a new password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  icon="🔐"
                  variant="glass"
                  type="password"
                />
                <div style={{ height: sp.sm }} />
                <Input
                  theme={theme}
                  label="Confirm new password"
                  placeholder="Repeat new password"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  icon="🔁"
                  variant="glass"
                  type="password"
                />

                <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                  <Button
                    theme={theme}
                    variant="gradient"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onClick={handleConfirmReset}
                  >
                    Update password
                  </Button>
                </div>
              </>
            ) : null}

            <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.lg }}>
              <Button theme={theme} variant="ghost" fullWidth disabled={loading} onClick={() => setShowReset(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentLoginFlowView;

