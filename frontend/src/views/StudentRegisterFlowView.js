import React, { useEffect, useMemo, useState } from 'react';
import { colors, fonts, radius, spacing } from '../design/tokens';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { fetchBoards, fetchGrades, fetchLanguages, fetchSubjects } from '../meta';
import { registerStudent, registerStudentOtp, requestOtp } from '../api';

const GOALS = [
  { id: 'exam_marks', label: 'Exam marks', desc: 'Score higher with targeted practice.' },
  { id: 'concept_clarity', label: 'Concept clarity', desc: 'Understand from first principles.' },
  { id: 'revision', label: 'Revision', desc: 'Quick recap before tests.' },
];

const StudentRegisterFlowView = ({
  theme = 'teen',
  onRegisterSuccess,
  onNavigateToLogin,
  onExistingAccount,
}) => {
  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sp = spacing[theme];

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [step, setStep] = useState(0); // 0: contact+consent, 1: profile, 2: personalization
  const [method, setMethod] = useState('phone'); // 'phone' | 'email'

  // Step 0: contact
  const [consent, setConsent] = useState(false);

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 1: profile
  const [name, setName] = useState('');
  const [grades, setGrades] = useState([]);
  const [boards, setBoards] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [gradeId, setGradeId] = useState('');
  const [boardId, setBoardId] = useState('');
  const [languageId, setLanguageId] = useState('');

  // Step 2: personalization
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [goal, setGoal] = useState('');

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
    const loadMeta = async () => {
      try {
        const [g, b, l, s] = await Promise.all([
          fetchGrades(),
          fetchBoards(),
          fetchLanguages(),
          fetchSubjects(),
        ]);

        const gradeData = g.data || [];
        const boardData = b.data || [];
        const languageData = l.data || [];
        const subjectData = s.data || [];

        setGrades(gradeData);
        setBoards(boardData);
        setLanguages(languageData);
        setSubjects(subjectData);

        setGradeId(gradeData?.[0]?.id ?? '');
        setBoardId(boardData?.[0]?.id ?? '');
        setLanguageId(languageData?.[0]?.id ?? '');
      } catch (err) {
        console.error('Failed to load registration metadata', err);
        setError('Failed to load options from backend. Please try again.');
      }
    };

    loadMeta();
  }, []);

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
    stepRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: sp.sm,
      marginBottom: sp.lg,
    },
    stepChip: (active) => ({
      textAlign: 'center',
      padding: `${sp.sm} ${sp.md}`,
      borderRadius: r.lg,
      border: `1px solid ${active ? c.primary : 'rgba(255,255,255,0.12)'}`,
      background: active
        ? theme === 'teen'
          ? `linear-gradient(135deg, ${c.primary}20 0%, ${c.secondary}20 100%)`
          : 'rgba(255,255,255,0.5)'
        : theme === 'teen'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.7)',
      fontFamily: f.body,
      fontWeight: 800,
      color: c.text,
    }),
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
    checkboxRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: sp.sm,
      padding: sp.sm,
      borderRadius: r.lg,
      background: theme === 'teen' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      marginTop: sp.md,
    },
    checkbox: {
      width: 18,
      height: 18,
      marginTop: 2,
      accentColor: c.primary,
    },
    select: {
      width: '100%',
      height: theme === 'kids' ? '56px' : '48px',
      padding: `0 ${sp.md}`,
      borderRadius: r.md,
      border: `2px solid ${theme === 'teen' ? 'rgba(255,255,255,0.2)' : c.primaryLight}`,
      background: theme === 'teen' ? 'rgba(20, 20, 35, 0.6)' : 'rgba(255,255,255,0.9)',
      color: c.text,
      fontFamily: f.body,
      fontSize: '1rem',
      outline: 'none',
    },
    goalGrid: {
      display: 'grid',
      gap: sp.sm,
    },
    goalCard: (active) => ({
      padding: sp.md,
      borderRadius: r.lg,
      border: `1px solid ${active ? c.primary : 'rgba(255,255,255,0.12)'}`,
      background: active
        ? theme === 'teen'
          ? `linear-gradient(135deg, ${c.primary}18 0%, ${c.secondary}18 100%)`
          : 'rgba(255,255,255,0.75)'
        : theme === 'teen'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.9)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    goalTitle: {
      fontFamily: f.display,
      fontWeight: 900,
      marginBottom: 4,
    },
    goalDesc: {
      fontFamily: f.body,
      color: c.textMuted,
      fontSize: '0.9rem',
    },
    subjectGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: sp.sm,
    },
    subjectChip: (active) => ({
      borderRadius: r.full,
      border: `1px solid ${active ? c.primary : 'rgba(255,255,255,0.12)'}`,
      background: active
        ? theme === 'teen'
          ? `linear-gradient(135deg, ${c.primary}20 0%, ${c.secondary}20 100%)`
          : 'rgba(255,255,255,0.65)'
        : theme === 'teen'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.9)',
      padding: `${sp.xs} ${sp.md}`,
      cursor: 'pointer',
      fontFamily: f.body,
      fontWeight: 800,
      color: c.text,
      textAlign: 'center',
      userSelect: 'none',
    }),
    footerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: sp.sm,
      marginTop: sp.lg,
    },
    footerLink: {
      fontFamily: f.body,
      color: c.primary,
      fontWeight: 800,
      cursor: 'pointer',
    },
  }), [theme, c, f, r, sp, isOnline]);

  const offlineGuard = () => {
    if (!isOnline) {
      setError('You are offline. Please reconnect and try again.');
      return true;
    }
    return false;
  };

  const selectedGrade = grades.find((g) => String(g.id) === String(gradeId));
  const selectedBoard = boards.find((b) => String(b.id) === String(boardId));
  const selectedLanguage = languages.find((l) => String(l.id) === String(languageId));

  const canContinueFromStep0 = () => {
    if (!consent) return false;
    if (method === 'phone') return !!phone.trim() && !!otp.trim() && otpSent;
    if (!email.trim()) return false;
    if (!password) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const canContinueFromStep1 = () => {
    return !!gradeId && !!boardId && !!languageId;
  };

  const toggleSubject = (subjectId) => {
    setSelectedSubjectIds((prev) => {
      const idStr = String(subjectId);
      if (prev.includes(idStr)) return prev.filter((x) => x !== idStr);
      return [...prev, idStr];
    });
  };

  const handleSendRegisterOtp = async () => {
    setError('');
    if (offlineGuard()) return;
    if (!phone.trim()) {
      setError('Enter your phone number first.');
      return;
    }
    setLoading(true);
    const res = await requestOtp({ channel: 'phone', identifier: phone, purpose: 'register' });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      if ((res.message || '').toLowerCase().includes('account already exists')) {
        onExistingAccount?.({ method: 'phone', phone });
      }
      return;
    }
    setOtpSent(true);
    setDevOtp(res.data?.dev_otp || '');
  };

  const goNext = async () => {
    setError('');
    if (step === 0) {
      if (!canContinueFromStep0()) {
        setError(method === 'phone' ? 'Enter phone, request OTP, enter OTP, and accept consent.' : 'Fill email/password and accept consent.');
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!canContinueFromStep1()) {
        setError('Please select board, grade, and language.');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (offlineGuard()) return;
      setLoading(true);

      const payloadBase = {
        name: name.trim() || undefined,
        board_id: boardId ? String(boardId) : undefined,
        grade_id: gradeId ? String(gradeId) : undefined,
        language_id: languageId ? String(languageId) : undefined,
        grade_band: selectedGrade?.name ?? undefined,
        board: selectedBoard?.name ?? undefined,
        medium: selectedLanguage?.name ?? undefined,
        goal: goal || undefined,
        preferred_subject_ids: selectedSubjectIds.length ? selectedSubjectIds : undefined,
        consent: true,
      };

      const res = method === 'phone'
        ? await registerStudentOtp({ ...payloadBase, phone: phone.trim(), otp: otp.trim() })
        : await registerStudent({
            ...payloadBase,
            email: email.trim(),
            password,
            confirmPassword,
            phone: phone.trim() ? phone.trim() : undefined,
          });

      setLoading(false);

      if (!res.success) {
        setError(res.message);
        if ((res.message || '').toLowerCase().includes('already')) {
          onExistingAccount?.({ method: method === 'phone' ? 'phone' : 'email', phone, email });
        }
        return;
      }

      const student = res.data?.student;
      if (!student) {
        setError('Registration succeeded but no student returned from backend.');
        return;
      }
      onRegisterSuccess(student);
    }
  };

  const goBack = () => {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>Create student account</div>
        <div style={styles.subtitle}>3 steps · Phone OTP (India-first) or email signup</div>

        <div style={styles.banner}>
          {isOnline ? '✅ Online' : '⚠️ Offline mode: backend unreachable'}
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}

        <div style={styles.stepRow}>
          <div style={styles.stepChip(step === 0)}>1) Contact</div>
          <div style={styles.stepChip(step === 1)}>2) Profile</div>
          <div style={styles.stepChip(step === 2)}>3) Personalize</div>
        </div>

        <Card theme={theme} style={{ padding: sp.lg, borderRadius: r.xl }}>
          {step === 0 ? (
            <>
              <div style={styles.toggleRow}>
                <div
                  role="button"
                  tabIndex={0}
                  style={styles.toggleButton(method === 'phone')}
                  onClick={() => setMethod('phone')}
                  onKeyDown={(e) => e.key === 'Enter' && setMethod('phone')}
                >
                  📱 Phone OTP
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  style={styles.toggleButton(method === 'email')}
                  onClick={() => setMethod('email')}
                  onKeyDown={(e) => e.key === 'Enter' && setMethod('email')}
                >
                  📧 Email signup
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
                    </>
                  ) : null}

                  <div style={{ display: 'grid', gap: sp.sm, marginTop: sp.md }}>
                    <Button
                      theme={theme}
                      variant="glass"
                      size="md"
                      fullWidth
                      disabled={loading}
                      onClick={handleSendRegisterOtp}
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </Button>
                  </div>
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="🔐"
                    variant="glass"
                    type="password"
                  />
                  <div style={{ height: sp.sm }} />
                  <Input
                    theme={theme}
                    label="Confirm password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon="🔁"
                    variant="glass"
                    type="password"
                  />
                </>
              )}

              <div style={styles.checkboxRow}>
                <input
                  style={styles.checkbox}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  id="consent"
                />
                <label htmlFor="consent" style={{ fontFamily: f.body, color: c.text }}>
                  I agree to basic terms and consent to account creation.
                  <div style={{ fontSize: '0.85rem', color: c.textMuted, marginTop: 4 }}>
                    (No spam. OTP is only for login/signup.)
                  </div>
                </label>
              </div>

              <div style={{ marginTop: sp.md, textAlign: 'center' }}>
                <span style={styles.footerLink} onClick={onNavigateToLogin}>
                  Already have an account? Login →
                </span>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Input
                theme={theme}
                label="Student name (optional)"
                placeholder="e.g., Nihal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon="👤"
                variant="glass"
              />

              <div style={{ height: sp.md }} />

              <label style={{ fontFamily: f.body, fontWeight: 800, marginBottom: sp.xs, display: 'block' }}>
                Board
              </label>
              <select style={styles.select} value={boardId} onChange={(e) => setBoardId(e.target.value)}>
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <div style={{ height: sp.sm }} />

              <label style={{ fontFamily: f.body, fontWeight: 800, marginBottom: sp.xs, display: 'block' }}>
                Grade
              </label>
              <select style={styles.select} value={gradeId} onChange={(e) => setGradeId(e.target.value)}>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.display || g.name}
                  </option>
                ))}
              </select>

              <div style={{ height: sp.sm }} />

              <label style={{ fontFamily: f.body, fontWeight: 800, marginBottom: sp.xs, display: 'block' }}>
                Language preference
              </label>
              <select style={styles.select} value={languageId} onChange={(e) => setLanguageId(e.target.value)}>
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div style={{ fontFamily: f.display, fontWeight: 900, marginBottom: sp.sm }}>
                Subjects (optional)
              </div>
              <div style={styles.subjectGrid}>
                {subjects.map((s) => {
                  const active = selectedSubjectIds.includes(String(s.id));
                  return (
                    <div
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      style={styles.subjectChip(active)}
                      onClick={() => toggleSubject(s.id)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleSubject(s.id)}
                    >
                      {active ? '✓ ' : ''}{s.name}
                    </div>
                  );
                })}
              </div>

              <div style={{ height: sp.lg }} />

              <div style={{ fontFamily: f.display, fontWeight: 900, marginBottom: sp.sm }}>
                Your goal (optional)
              </div>
              <div style={styles.goalGrid}>
                {GOALS.map((g) => {
                  const active = goal === g.label;
                  return (
                    <div
                      key={g.id}
                      role="button"
                      tabIndex={0}
                      style={styles.goalCard(active)}
                      onClick={() => setGoal(g.label)}
                      onKeyDown={(e) => e.key === 'Enter' && setGoal(g.label)}
                    >
                      <div style={styles.goalTitle}>{active ? '✓ ' : ''}{g.label}</div>
                      <div style={styles.goalDesc}>{g.desc}</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          <div style={styles.footerRow}>
            <Button theme={theme} variant="ghost" disabled={step === 0 || loading} onClick={goBack}>
              ← Back
            </Button>
            <Button
              theme={theme}
              variant="gradient"
              size="lg"
              loading={loading}
              onClick={goNext}
              disabled={
                loading ||
                (step === 0 && !canContinueFromStep0()) ||
                (step === 1 && !canContinueFromStep1())
              }
            >
              {step === 2 ? 'Finish →' : 'Continue →'}
            </Button>
          </div>

          <div style={{ marginTop: sp.md, textAlign: 'center', fontFamily: f.body, color: c.textMuted }}>
            {step === 0 ? null : (
              <>
                Using: <strong style={{ color: c.text }}>{method === 'phone' ? 'Phone OTP' : 'Email'}</strong>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegisterFlowView;
