import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { colors, fonts, radius, shadows, spacing } from '../design/tokens';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const ParentEntryView = ({ theme = 'teen', onBack }) => {
  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const sp = spacing[theme];

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [authMode, setAuthMode] = useState('pin'); // pin | otp

  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState('');

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

  const parentLink = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('entry', 'parent');
      url.searchParams.delete('student');
      return url.toString();
    } catch {
      return `${window.location.origin}/?entry=parent`;
    }
  }, []);

  const whatsappLink = useMemo(() => {
    const text = `AI Tutor · Parent entry link:\n${parentLink}\n\nOpen the link and verify with PIN or OTP to view the parent dashboard.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [parentLink]);

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
      maxWidth: '760px',
    },
    title: {
      fontFamily: f.display,
      fontWeight: 900,
      fontSize: '2rem',
      textAlign: 'center',
      marginBottom: sp.sm,
    },
    subtitle: {
      fontFamily: f.body,
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: sp.lg,
    },
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
    status: {
      borderRadius: r.lg,
      padding: `${sp.sm} ${sp.md}`,
      background: `${c.primary}12`,
      border: `1px solid ${c.primary}30`,
      color: c.text,
      fontFamily: f.body,
      fontWeight: 700,
      marginBottom: sp.md,
      whiteSpace: 'pre-wrap',
    },
    linkBox: {
      padding: sp.md,
      borderRadius: r.lg,
      background: theme === 'teen' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
      border: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
      fontFamily: 'monospace',
      color: c.text,
      wordBreak: 'break-all',
    },
    dashboardBox: {
      padding: sp.lg,
      borderRadius: r.xl,
      background: theme === 'teen' ? 'rgba(20, 20, 35, 0.55)' : 'rgba(255,255,255,0.92)',
      border: `1px solid ${theme === 'teen' ? c.primary + '25' : 'rgba(0,0,0,0.08)'}`,
      boxShadow: sh.md,
      whiteSpace: 'pre-wrap',
      fontFamily: f.body,
      color: c.text,
      lineHeight: 1.6,
    },
    toggleRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: sp.sm,
      marginBottom: sp.md,
    },
    toggleButton: (active) => ({
      borderRadius: r.lg,
      border: `1px solid ${active ? c.primary : 'rgba(255,255,255,0.12)'}`,
      background: active
        ? theme === 'teen'
          ? `linear-gradient(135deg, ${c.primary}20 0%, ${c.secondary}20 100%)`
          : 'rgba(255,255,255,0.6)'
        : theme === 'teen'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.9)',
      padding: sp.sm,
      cursor: 'pointer',
      fontFamily: f.body,
      color: c.text,
      fontWeight: 800,
      textAlign: 'center',
      userSelect: 'none',
      transition: 'all 0.2s ease',
    }),
  }), [theme, c, f, r, sh, sp, isOnline]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(parentLink);
      setStatus('✅ Link copied to clipboard');
    } catch (err) {
      setStatus('❌ Could not copy link. You can manually copy it.');
    }
  };

  const verifyPin = async () => {
    setStatus('');
    setDashboard('');
    if (!isOnline) {
      setStatus('⚠️ You are offline. Start the backend and reconnect.');
      return;
    }
    if (!pin.trim()) {
      setStatus('Enter PIN.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/verify_parent', { pin: pin.trim() });
      if (!res.data?.success) {
        setStatus(res.data?.message || '❌ Wrong PIN. Try again.');
        return;
      }
      setStatus(res.data?.message || '✅ Parent access granted!');

      const dashboardRes = await api.get('/parent_dashboard');
      setDashboard(dashboardRes.data?.dashboard || '');
    } catch (err) {
      console.error('Parent verify error', err);
      setStatus('❌ Error verifying parent access. Ensure backend is running and PARENT_PIN is set.');
    } finally {
      setLoading(false);
    }
  };

  const requestParentOtp = async () => {
    setStatus('');
    setDashboard('');
    if (!isOnline) {
      setStatus('⚠️ You are offline. Start the backend and reconnect.');
      return;
    }
    if (!phone.trim()) {
      setStatus('Enter phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/parent/request_otp', { phone: phone.trim() });
      if (!res.data?.success) {
        setStatus(res.data?.message || '❌ Failed to send OTP.');
        return;
      }
      setOtpSent(true);
      setDevOtp(res.data?.dev_otp || '');
      setStatus(res.data?.message || '✅ OTP sent!');
    } catch (err) {
      console.error('Parent OTP request error', err);
      setStatus('❌ Error sending OTP. Ensure backend is running and PARENT_PHONE is set.');
    } finally {
      setLoading(false);
    }
  };

  const verifyParentOtp = async () => {
    setStatus('');
    setDashboard('');
    if (!isOnline) {
      setStatus('⚠️ You are offline. Start the backend and reconnect.');
      return;
    }
    if (!phone.trim() || !otp.trim()) {
      setStatus('Enter phone and OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/parent/verify_otp', { phone: phone.trim(), otp: otp.trim() });
      if (!res.data?.success) {
        setStatus(res.data?.message || '❌ Invalid OTP.');
        return;
      }
      setStatus(res.data?.message || '✅ Parent access granted!');

      const dashboardRes = await api.get('/parent_dashboard');
      setDashboard(dashboardRes.data?.dashboard || '');
    } catch (err) {
      console.error('Parent OTP verify error', err);
      setStatus('❌ Error verifying OTP. Ensure backend is running and PARENT_PHONE is set.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/logout_parent');
    } finally {
      setLoading(false);
      setDashboard('');
      setStatus('Logged out.');
      setOtpSent(false);
      setOtp('');
      setDevOtp('');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>Parent Entry</div>
        <div style={styles.subtitle}>Open via WhatsApp link + PIN/OTP</div>

        <div style={styles.banner}>
          {isOnline ? '✅ Online' : '⚠️ Offline mode: backend unreachable'}
        </div>

        {status ? <div style={styles.status}>{status}</div> : null}

        <Card theme={theme} style={{ padding: sp.lg, borderRadius: r.xl }}>
          <div style={{ fontFamily: f.display, fontWeight: 900, marginBottom: sp.sm }}>
            WhatsApp link
          </div>
          <div style={styles.linkBox}>{parentLink}</div>
          <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
            <Button theme={theme} variant="glass" fullWidth onClick={copyLink}>
              Copy link
            </Button>
            <a href={whatsappLink} style={{ textDecoration: 'none' }}>
              <Button theme={theme} variant="gradient" fullWidth>
                Share on WhatsApp
              </Button>
            </a>
          </div>

          <div style={{ height: sp.lg }} />

          <div style={{ fontFamily: f.display, fontWeight: 900, marginBottom: sp.sm }}>
            Parent verification
          </div>

          <div style={styles.toggleRow}>
            <div
              role="button"
              tabIndex={0}
              style={styles.toggleButton(authMode === 'pin')}
              onClick={() => setAuthMode('pin')}
              onKeyDown={(e) => e.key === 'Enter' && setAuthMode('pin')}
            >
              🔒 PIN
            </div>
            <div
              role="button"
              tabIndex={0}
              style={styles.toggleButton(authMode === 'otp')}
              onClick={() => setAuthMode('otp')}
              onKeyDown={(e) => e.key === 'Enter' && setAuthMode('otp')}
            >
              📱 Phone OTP
            </div>
          </div>

          {authMode === 'pin' ? (
            <>
              <Input
                theme={theme}
                type="password"
                label="PIN"
                placeholder="Enter PIN (default: 1234 if configured)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                icon="🔒"
                variant="glass"
              />
              <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                <Button theme={theme} variant="gradient" size="lg" fullWidth loading={loading} onClick={verifyPin}>
                  Verify
                </Button>
              </div>
            </>
          ) : (
            <>
              <Input
                theme={theme}
                label="Phone"
                placeholder="Enter parent phone (must match backend PARENT_PHONE)"
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
                </>
              ) : null}

              <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                <Button theme={theme} variant="glass" fullWidth disabled={loading} onClick={requestParentOtp}>
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </Button>
                <Button
                  theme={theme}
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={!otpSent}
                  onClick={verifyParentOtp}
                >
                  Verify OTP
                </Button>
              </div>
            </>
          )}

          <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.lg }}>
            <Button theme={theme} variant="ghost" fullWidth disabled={loading} onClick={handleLogout}>
              Logout parent
            </Button>
            <Button theme={theme} variant="ghost" fullWidth disabled={loading} onClick={onBack}>
              ← Back to student entry
            </Button>
          </div>
        </Card>

        {dashboard ? (
          <div style={{ marginTop: sp.lg }}>
            <div style={{ fontFamily: f.display, fontWeight: 900, marginBottom: sp.sm }}>
              Parent dashboard
            </div>
            <div style={styles.dashboardBox}>{dashboard}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ParentEntryView;
