/**
 * SelectionView - Enhanced Redesign
 * Beautiful step-by-step learning setup with theme-aware design
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, fonts, radius, shadows, spacing, icons } from '../design/tokens';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const SelectionView = ({
  userGrade,
  setUserGrade,
  userBoard,
  setUserBoard,
  userLanguage,
  setUserLanguage,
  userSubjectId,
  handleSubjectChange,
  subjects,
  grades,
  boards,
  languages,
  setupLearning,
  selectionStatus,
  theme = 'teen',
  currentStudent = null
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const c = colors[theme];
  const f = fonts[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const sp = spacing[theme];
  const ic = icons[theme];

  // Track completion progress
  useEffect(() => {
    let step = 0;
    if (userGrade) step = 1;
    if (userGrade && userBoard) step = 2;
    if (userGrade && userBoard && userLanguage) step = 3;
    if (userGrade && userBoard && userLanguage && userSubjectId) step = 4;
    setActiveStep(step);
  }, [userGrade, userBoard, userLanguage, userSubjectId]);

  const allSelected = userGrade && userBoard && userLanguage && userSubjectId;
  const isFieldsLocked = !!currentStudent;

  const steps = [
    { icon: theme === 'kids' ? '🎓' : '◎', label: 'Grade', field: 'grade' },
    { icon: theme === 'kids' ? '🏫' : '◈', label: 'Board', field: 'board' },
    { icon: theme === 'kids' ? '🌍' : '◉', label: 'Language', field: 'language' },
    { icon: theme === 'kids' ? '📖' : '★', label: 'Subject', field: 'subject' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const styles = useMemo(() => ({
    container: {
      minHeight: 'calc(100vh - 100px)',
      padding: sp.xl,
      background: c.bgGradient,
      position: 'relative',
      overflow: 'hidden',
    },
    innerContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    header: {
      textAlign: 'center',
      marginBottom: sp.xl,
    },
    title: {
      fontFamily: f.display,
      fontSize: theme === 'kids' ? '2rem' : '1.75rem',
      fontWeight: 700,
      color: c.text,
      marginBottom: sp.xs,
      background: theme === 'teen'
        ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`
        : 'none',
      WebkitBackgroundClip: theme === 'teen' ? 'text' : 'initial',
      WebkitTextFillColor: theme === 'teen' ? 'transparent' : c.text,
      backgroundClip: theme === 'teen' ? 'text' : 'initial',
    },
    subtitle: {
      fontFamily: f.body,
      fontSize: '1rem',
      color: c.textMuted,
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sp.xs,
      marginBottom: sp.xl,
    },
    stepIndicator: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: sp.xs,
    },
    stepCircle: {
      width: theme === 'kids' ? '48px' : '40px',
      height: theme === 'kids' ? '48px' : '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: f.display,
      fontWeight: 700,
      fontSize: theme === 'kids' ? '1.25rem' : '1rem',
      transition: 'all 0.4s ease',
    },
    stepLabel: {
      fontFamily: f.body,
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: theme === 'teen' ? 'uppercase' : 'none',
      letterSpacing: theme === 'teen' ? '0.5px' : '0',
      transition: 'all 0.3s ease',
    },
    connector: {
      width: '40px',
      height: '4px',
      borderRadius: r.full,
      marginBottom: '28px',
      transition: 'all 0.4s ease',
      overflow: 'hidden',
    },
    selectionCard: {
      background: c.bgCard,
      backdropFilter: 'blur(10px)',
      borderRadius: r.lg,
      padding: sp.lg,
      marginBottom: sp.md,
      border: `2px solid transparent`,
      transition: 'all 0.3s ease',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: sp.sm,
    },
    cardLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: sp.sm,
      fontFamily: f.body,
      fontSize: '0.95rem',
      fontWeight: 600,
      color: c.primary,
    },
    select: {
      width: '100%',
      padding: '14px 48px 14px 16px',
      borderRadius: r.md,
      border: `2px solid ${theme === 'teen' ? 'rgba(255,255,255,0.15)' : c.primaryLight}`,
      fontSize: '0.95rem',
      fontWeight: 500,
      fontFamily: f.body,
      background: theme === 'teen'
        ? 'rgba(255,255,255,0.08)'
        : theme === 'kids'
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(255,255,255,0.05)',
      color: c.text,
      appearance: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    lockedField: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: r.md,
      border: `2px solid ${theme === 'teen' ? 'rgba(255,255,255,0.1)' : c.primaryLight + '50'}`,
      fontSize: '0.95rem',
      fontWeight: 500,
      fontFamily: f.body,
      background: theme === 'teen'
        ? 'rgba(255,255,255,0.03)'
        : 'rgba(0,0,0,0.03)',
      color: c.textMuted,
    },
    checkBadge: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: c.success,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '14px',
      animation: 'checkPop 0.3s ease-out',
    },
    summaryCard: {
      background: theme === 'teen'
        ? `linear-gradient(135deg, ${c.primary}15 0%, ${c.secondary}15 100%)`
        : theme === 'kids'
          ? `linear-gradient(135deg, ${c.primaryLight}30 0%, ${c.accent1}20 100%)`
          : `linear-gradient(135deg, ${c.primary}10 0%, ${c.secondary}10 100%)`,
      border: `1px solid ${c.primary}30`,
      borderRadius: r.lg,
      padding: sp.lg,
      marginBottom: sp.lg,
    },
    summaryTitle: {
      fontFamily: f.display,
      fontSize: '0.95rem',
      fontWeight: 700,
      color: c.primary,
      marginBottom: sp.md,
      display: 'flex',
      alignItems: 'center',
      gap: sp.xs,
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: sp.sm,
    },
    summaryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: sp.xs,
      padding: sp.sm,
      background: c.bgCard,
      borderRadius: r.md,
      border: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    },
    status: {
      textAlign: 'center',
      padding: sp.md,
      borderRadius: r.md,
      fontWeight: 600,
      fontSize: '0.9rem',
      marginTop: sp.md,
    },
  }), [theme, c, f, r, sp]);

  const getStepStyle = (index) => {
    const isCompleted = activeStep > index;
    const isCurrent = activeStep === index;

    return {
      ...styles.stepCircle,
      background: isCompleted
        ? c.success
        : isCurrent
          ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`
          : theme === 'teen'
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.1)',
      color: isCompleted || isCurrent ? '#fff' : c.textMuted,
      boxShadow: isCurrent
        ? theme === 'teen'
          ? `0 0 20px ${c.primary}50`
          : `0 8px 20px ${c.primary}30`
        : 'none',
      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
    };
  };

  const getConnectorStyle = (index) => ({
    ...styles.connector,
    background: activeStep > index
      ? `linear-gradient(90deg, ${c.success}, ${c.success})`
      : theme === 'teen'
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.1)',
    boxShadow: activeStep > index && theme === 'teen'
      ? `0 0 10px ${c.success}50`
      : 'none',
  });

  const getCardBorderColor = (hasValue) =>
    hasValue ? c.success : theme === 'teen' ? 'rgba(255,255,255,0.1)' : c.primaryLight + '50';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={styles.container}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap');

        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .selection-select:focus {
          border-color: ${c.primary} !important;
          box-shadow: 0 0 0 3px ${c.primary}20;
        }

        .selection-select option {
          background: ${theme === 'teen' ? '#1a1a2e' : '#fff'};
          color: ${theme === 'teen' ? '#fff' : '#333'};
          padding: 12px;
        }

        .selection-card:hover {
          transform: translateY(-4px);
          box-shadow: ${sh.lg};
        }
      `}</style>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: c.bgGradient,
        zIndex: 0,
      }} />

      {/* Floating orbs */}
      {theme === 'teen' && (
        <>
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.primary}20 0%, transparent 70%)`,
            top: '-100px',
            right: '-100px',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.secondary}20 0%, transparent 70%)`,
            bottom: '-50px',
            left: '-50px',
            filter: 'blur(40px)',
          }} />
        </>
      )}

      <div style={styles.innerContainer}>
        {/* Header */}
        <motion.div variants={cardVariants} style={styles.header}>
          <h2 style={styles.title}>
            {theme === 'kids' ? '📚 ' : ''}
            {theme === 'kids' ? 'Set Up Your Learning!' : theme === 'teen' ? 'SETUP YOUR JOURNEY' : 'Configure Learning'}
          </h2>
          <p style={styles.subtitle}>
            {theme === 'kids'
              ? 'Pick your favorites to get started!'
              : 'Complete these steps to personalize your experience'}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div variants={cardVariants} style={styles.progressContainer}>
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={styles.stepIndicator}>
                <div style={getStepStyle(i)}>
                  {activeStep > i ? '✓' : step.icon}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: activeStep >= i ? c.primary : c.textMuted,
                }}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={getConnectorStyle(i)} />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Selection Cards */}
        {[
          { label: 'Grade', icon: theme === 'kids' ? '🎓' : '◎', value: userGrade, options: grades, onChange: (e) => setUserGrade(e.target.value), locked: isFieldsLocked, displayValue: userGrade ? `Grade ${userGrade}` : null },
          { label: 'Board', icon: theme === 'kids' ? '🏫' : '◈', value: userBoard, options: boards, onChange: (e) => setUserBoard(e.target.value), locked: isFieldsLocked },
          { label: 'Language', icon: theme === 'kids' ? '🌍' : '◉', value: userLanguage, options: languages, onChange: (e) => setUserLanguage(e.target.value), locked: isFieldsLocked, valueKey: 'code' },
          { label: 'Subject', icon: theme === 'kids' ? '📖' : '★', value: userSubjectId, options: subjects, onChange: handleSubjectChange, locked: false, valueKey: 'id' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            variants={cardVariants}
            className="selection-card"
            style={{
              ...styles.selectionCard,
              borderColor: getCardBorderColor(item.value),
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                {theme === 'kids' ? `Pick Your ${item.label}` : `Select ${item.label}`}
              </span>
              {item.value && <span style={styles.checkBadge}>✓</span>}
            </div>

            {item.locked ? (
              <div style={styles.lockedField}>
                {item.displayValue || item.value || 'Not set'}
              </div>
            ) : (
              <select
                className="selection-select"
                value={item.value || ''}
                onChange={item.onChange}
                style={{
                  ...styles.select,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(c.textMuted)}' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                }}
              >
                <option value="">
                  {theme === 'kids' ? `Choose your ${item.label.toLowerCase()}...` : `Select ${item.label.toLowerCase()}...`}
                </option>
                {item.options.map(opt => (
                  <option key={opt.id} value={item.valueKey ? opt[item.valueKey] : opt.name}>
                    {opt.display || opt.name}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
        ))}

        {/* Summary Card */}
        <AnimatePresence>
          {activeStep > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={styles.summaryCard}
            >
              <h4 style={styles.summaryTitle}>
                {theme === 'kids' ? '✨ Your Choices' : theme === 'teen' ? '⚡ YOUR PROFILE' : '◆ Summary'}
              </h4>
              <div style={styles.summaryGrid}>
                {[
                  { icon: theme === 'kids' ? '🎓' : '◎', label: 'Grade', value: userGrade },
                  { icon: theme === 'kids' ? '🏫' : '◈', label: 'Board', value: userBoard },
                  { icon: theme === 'kids' ? '🌍' : '◉', label: 'Language', value: userLanguage },
                  { icon: theme === 'kids' ? '📖' : '★', label: 'Subject', value: subjects.find(s => String(s.id) === String(userSubjectId))?.name },
                ].map((item, i) => (
                  <div key={i} style={styles.summaryItem}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: c.textMuted }}>{item.label}</div>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: item.value ? c.text : c.textMuted,
                      }}>
                        {item.value || 'Not selected'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Button */}
        <motion.div variants={cardVariants}>
          <Button
            variant={allSelected ? 'gradient' : 'ghost'}
            size="lg"
            theme={theme}
            fullWidth
            glow={allSelected}
            disabled={!allSelected}
            onClick={setupLearning}
            style={{
              opacity: allSelected ? 1 : 0.5,
              cursor: allSelected ? 'pointer' : 'not-allowed',
            }}
          >
            {allSelected
              ? theme === 'kids'
                ? "🚀 Let's Start Learning!"
                : theme === 'teen'
                  ? '⚡ BEGIN JOURNEY'
                  : 'Start Learning →'
              : theme === 'kids'
                ? '👆 Complete All Steps'
                : 'Complete all selections'}
          </Button>
        </motion.div>

        {/* Status Message */}
        {selectionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...styles.status,
              background: selectionStatus.includes('❌')
                ? `${c.error}15`
                : `${c.success}15`,
              border: `1px solid ${selectionStatus.includes('❌') ? c.error : c.success}30`,
              color: selectionStatus.includes('❌') ? c.error : c.success,
            }}
          >
            {selectionStatus}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SelectionView;
