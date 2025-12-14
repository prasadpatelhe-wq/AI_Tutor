/**
 * ProfileView - Settings & Student Profile
 *
 * Features:
 * - Student profile overview
 * - Language preference
 * - Board/Grade change
 * - Auto-save mistake cards toggle
 * - Parent linking
 * - Logout
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

// ============================================
// ICONS
// ============================================
const Icons = {
  User: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Globe: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  GraduationCap: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Bookmark: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Users: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  LogOut: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Check: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Phone: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Link: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  Download: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Trash2: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  ),
  Bell: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Flame: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.07 2.34-5.64 4.45-7.55C9.53 5.55 11 3.45 11 1c0 0 2.5 1.5 2.5 5 0 1.93-1 3.5-2 4.5 1.5-.5 3-2 3.5-3.5 0 0 3 3.5 3 7.5 0 4.42-4.03 8.5-6 8.5z"/>
    </svg>
  ),
  Award: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Profile Header
const ProfileHeader = ({ student, stats, onEdit }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.profileHeader}>
      {/* Avatar */}
      <div style={styles.avatarWrapper}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>{getInitials(student?.name)}</span>
        </div>
        <div style={styles.levelBadge}>
          <Icons.Award size={12} color={colors.neutral[0]} />
          <span style={styles.levelText}>Lv {stats?.level || 1}</span>
        </div>
      </div>

      {/* Info */}
      <div style={styles.profileInfo}>
        <h1 style={styles.profileName}>{student?.name || 'Student'}</h1>
        <p style={styles.profileDetails}>
          {student?.grade} • {student?.board}
        </p>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <Icons.Flame size={16} color={colors.secondary[500]} />
          <span style={styles.statValue}>{stats?.streakDays || 0}</span>
          <span style={styles.statLabel}>streak</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats?.totalCards || 0}</span>
          <span style={styles.statLabel}>cards</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats?.coins || 0}</span>
          <span style={styles.statLabel}>coins</span>
        </div>
      </div>
    </div>
  );
};

// Settings Section
const SettingsSection = ({ title, children }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <div style={styles.sectionContent}>
      {children}
    </div>
  </div>
);

// Settings Item
const SettingsItem = ({
  icon: Icon,
  label,
  value,
  onClick,
  toggle,
  toggleValue,
  onToggle,
  danger,
}) => (
  <button
    style={{
      ...styles.settingsItem,
      ...(danger ? styles.settingsItemDanger : {}),
    }}
    onClick={onClick}
  >
    <div style={styles.settingsItemLeft}>
      <div style={{
        ...styles.settingsIcon,
        backgroundColor: danger ? colors.error + '15' : colors.primary[50],
      }}>
        <Icon size={20} color={danger ? colors.error : colors.primary[600]} />
      </div>
      <div style={styles.settingsItemText}>
        <span style={{
          ...styles.settingsLabel,
          color: danger ? colors.error : colors.neutral[800],
        }}>{label}</span>
        {value && (
          <span style={styles.settingsValue}>{value}</span>
        )}
      </div>
    </div>

    {toggle ? (
      <div
        style={{
          ...styles.toggle,
          backgroundColor: toggleValue ? colors.primary[500] : colors.neutral[300],
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(!toggleValue);
        }}
      >
        <div style={{
          ...styles.toggleKnob,
          transform: toggleValue ? 'translateX(18px)' : 'translateX(2px)',
        }} />
      </div>
    ) : (
      <Icons.ChevronRight size={20} color={colors.neutral[400]} />
    )}
  </button>
);

// Parent Link Section
const ParentLinkSection = ({ isLinked, parentPhone, onAddParent, onManageSettings }) => (
  <div style={styles.parentLinkCard}>
    <div style={styles.parentLinkHeader}>
      <div style={styles.parentLinkIcon}>
        <Icons.Users size={24} color={colors.primary[500]} />
      </div>
      <div>
        <h3 style={styles.parentLinkTitle}>Parent Updates</h3>
        <p style={styles.parentLinkSubtitle}>
          {isLinked
            ? 'Weekly summaries enabled'
            : 'Link a parent for weekly progress updates'
          }
        </p>
      </div>
    </div>

    {isLinked ? (
      <div style={styles.parentLinkedInfo}>
        <div style={styles.linkedBadge}>
          <Icons.Check size={14} color={colors.success} />
          <span style={styles.linkedText}>Linked to {parentPhone}</span>
        </div>
        <button style={styles.manageButton} onClick={onManageSettings}>
          Manage
        </button>
      </div>
    ) : (
      <div style={styles.parentLinkActions}>
        <button style={styles.addParentButton} onClick={onAddParent}>
          <Icons.Phone size={16} color={colors.neutral[900]} />
          Add parent phone
        </button>
        <button style={styles.generateLinkButton} onClick={onAddParent}>
          <Icons.Link size={16} color={colors.primary[600]} />
          Generate link
        </button>
      </div>
    )}
  </div>
);

// Language Picker Modal
const LanguagePicker = ({ languages, selected, onSelect, onClose }) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
      <h3 style={styles.modalTitle}>Select Language</h3>
      <div style={styles.languageList}>
        {languages.map((lang) => (
          <button
            key={lang.id}
            style={{
              ...styles.languageItem,
              ...(selected === lang.id ? styles.languageItemSelected : {}),
            }}
            onClick={() => onSelect(lang.id)}
          >
            <span style={styles.languageName}>{lang.name}</span>
            {selected === lang.id && (
              <Icons.Check size={18} color={colors.primary[500]} />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const ProfileView = ({
  // Data
  student,
  stats = {},
  settings = {},
  languages = [
    { id: 'en', name: 'English' },
    { id: 'hi', name: 'Hindi' },
    { id: 'kn', name: 'Kannada' },
    { id: 'ta', name: 'Tamil' },
  ],
  // State
  isParentLinked = false,
  parentPhone,
  // Callbacks
  onLanguageChange,
  onBoardGradeChange,
  onAutoSaveToggle,
  onWeeklySummaryToggle,
  onAddParent,
  onManageParentSettings,
  onDownloadData,
  onDeleteData,
  onLogout,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [autoSaveCards, setAutoSaveCards] = useState(settings.autoSaveCards ?? true);
  const [weeklySummary, setWeeklySummary] = useState(settings.weeklySummary ?? true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAutoSaveToggle = (value) => {
    setAutoSaveCards(value);
    onAutoSaveToggle?.(value);
  };

  const handleWeeklySummaryToggle = (value) => {
    setWeeklySummary(value);
    onWeeklySummaryToggle?.(value);
  };

  const selectedLanguage = languages.find(l => l.id === settings.language) || languages[0];

  return (
    <div style={{
      ...styles.container,
      opacity: mounted ? 1 : 0,
    }}>
      {/* Profile Header */}
      <ProfileHeader
        student={student}
        stats={stats}
      />

      {/* Parent Link */}
      <ParentLinkSection
        isLinked={isParentLinked}
        parentPhone={parentPhone}
        onAddParent={onAddParent}
        onManageSettings={onManageParentSettings}
      />

      {/* Preferences */}
      <SettingsSection title="Preferences">
        <SettingsItem
          icon={Icons.Globe}
          label="Language"
          value={selectedLanguage.name}
          onClick={() => setShowLanguagePicker(true)}
        />
        <SettingsItem
          icon={Icons.GraduationCap}
          label="Board & Grade"
          value={`${student?.board || 'Not set'} • ${student?.grade || 'Not set'}`}
          onClick={onBoardGradeChange}
        />
        <SettingsItem
          icon={Icons.Bookmark}
          label="Auto-save mistake cards"
          toggle
          toggleValue={autoSaveCards}
          onToggle={handleAutoSaveToggle}
        />
        {isParentLinked && (
          <SettingsItem
            icon={Icons.Bell}
            label="Weekly summary"
            toggle
            toggleValue={weeklySummary}
            onToggle={handleWeeklySummaryToggle}
          />
        )}
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Your Data">
        <SettingsItem
          icon={Icons.Download}
          label="Download my data"
          onClick={onDownloadData}
        />
        <SettingsItem
          icon={Icons.Trash2}
          label="Delete my data"
          onClick={onDeleteData}
          danger
        />
      </SettingsSection>

      {/* Account */}
      <SettingsSection title="Account">
        <SettingsItem
          icon={Icons.LogOut}
          label="Log out"
          onClick={onLogout}
          danger
        />
      </SettingsSection>

      {/* Version */}
      <div style={styles.versionInfo}>
        <span style={styles.versionText}>AI Tutor v1.0.0</span>
      </div>

      {/* Language Picker Modal */}
      {showLanguagePicker && (
        <LanguagePicker
          languages={languages}
          selected={settings.language}
          onSelect={(langId) => {
            onLanguageChange?.(langId);
            setShowLanguagePicker(false);
          }}
          onClose={() => setShowLanguagePicker(false)}
        />
      )}
    </div>
  );
};

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
    minHeight: '100%',
    paddingBottom: spacing[24],
    transition: `opacity ${transitions.duration.slow} ${transitions.easing.out}`,
  },

  // Profile Header
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[4],
    padding: `${spacing[6]} ${spacing[4]}`,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius['2xl'],
    border: `1px solid ${colors.neutral[200]}`,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[0],
  },

  levelBadge: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[0.5],
    backgroundColor: colors.accent[400],
    padding: `${spacing[0.5]} ${spacing[2]}`,
    borderRadius: borderRadius.full,
    border: `2px solid ${colors.neutral[0]}`,
  },

  levelText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xs'][0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },

  profileInfo: {
    textAlign: 'center',
  },

  profileName: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },

  profileDetails: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
    margin: `${spacing[1]} 0 0 0`,
  },

  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.neutral[100]}`,
    width: '100%',
    justifyContent: 'center',
  },

  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1.5],
  },

  statValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },

  statLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
  },

  statDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: colors.neutral[200],
  },

  // Parent Link
  parentLinkCard: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    border: `1px solid ${colors.primary[200]}`,
  },

  parentLinkHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },

  parentLinkIcon: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[0],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.sm,
  },

  parentLinkTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: 0,
  },

  parentLinkSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    margin: 0,
  },

  parentLinkedInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  linkedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1.5],
    backgroundColor: colors.success + '15',
    padding: `${spacing[1.5]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
  },

  linkedText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.success,
  },

  manageButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.primary[300]}`,
    borderRadius: borderRadius.lg,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.primary[600],
    cursor: 'pointer',
  },

  parentLinkActions: {
    display: 'flex',
    gap: spacing[2],
  },

  addParentButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.accent[400],
    border: `2px solid ${colors.neutral[900]}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.brutalSm,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    cursor: 'pointer',
  },

  generateLinkButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.neutral[0],
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.lg,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.primary[600],
    cursor: 'pointer',
  },

  // Section
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },

  sectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
    margin: 0,
    paddingLeft: spacing[1],
  },

  sectionContent: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
  },

  // Settings Item
  settingsItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: spacing[4],
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${colors.neutral[100]}`,
    cursor: 'pointer',
    textAlign: 'left',
    transition: `background-color ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  settingsItemDanger: {
    borderBottom: 'none',
  },

  settingsItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  settingsIcon: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsItemText: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },

  settingsLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.medium,
  },

  settingsValue: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[500],
  },

  // Toggle
  toggle: {
    width: '44px',
    height: '26px',
    borderRadius: borderRadius.full,
    padding: '2px',
    cursor: 'pointer',
    transition: `background-color ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  toggleKnob: {
    width: '22px',
    height: '22px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[0],
    boxShadow: shadows.sm,
    transition: `transform ${transitions.duration.fast} ${transitions.easing.bounce}`,
  },

  // Version
  versionInfo: {
    textAlign: 'center',
    padding: spacing[4],
  },

  versionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[400],
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  },

  modalContent: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: colors.neutral[0],
    borderRadius: `${borderRadius['2xl']} ${borderRadius['2xl']} 0 0`,
    padding: spacing[6],
    animation: 'slideUp 0.3s ease-out',
  },

  modalTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[4]} 0`,
    textAlign: 'center',
  },

  languageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },

  languageItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: spacing[4],
    backgroundColor: colors.neutral[50],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.xl,
    cursor: 'pointer',
    textAlign: 'left',
  },

  languageItemSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },

  languageName: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[800],
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#profile-view-styles')) {
  styleSheet.id = 'profile-view-styles';
  document.head.appendChild(styleSheet);
}

export default ProfileView;
