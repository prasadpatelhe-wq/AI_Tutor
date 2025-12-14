/**
 * MainLayout - Core app layout with bottom navigation
 * Features:
 * - Context pill (persistent breadcrumb)
 * - Bottom tab navigation
 * - Animated page transitions
 */

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

// Icons as SVG components for crisp rendering
const Icons = {
  Home: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Book: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Repeat: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  User: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  ChevronRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// Context Pill Component
const ContextPill = ({ context }) => {
  if (!context || !context.board) return null;

  const items = [context.board, context.grade, context.subject, context.chapter].filter(Boolean);

  return (
    <div style={styles.contextPill}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span style={styles.contextItem}>{item}</span>
          {index < items.length - 1 && (
            <span style={styles.contextDot}>•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Bottom Tab Item
const TabItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.tabItem,
      ...(active ? styles.tabItemActive : {}),
    }}
  >
    <div style={styles.tabIconWrapper}>
      <Icon
        size={22}
        color={active ? colors.primary[500] : colors.neutral[500]}
      />
      {badge > 0 && (
        <span style={styles.tabBadge}>{badge > 99 ? '99+' : badge}</span>
      )}
    </div>
    <span
      style={{
        ...styles.tabLabel,
        color: active ? colors.primary[500] : colors.neutral[500],
        fontWeight: active ? typography.fontWeight.semibold : typography.fontWeight.medium,
      }}
    >
      {label}
    </span>
    {active && <div style={styles.tabIndicator} />}
  </button>
);

// Main Layout Component
const MainLayout = ({
  children,
  activeTab = 'home',
  onTabChange,
  context = null,
  reviewDueCount = 0,
  showContextPill = true,
  hideBottomNav = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'home', label: 'Home', icon: Icons.Home },
    { id: 'learn', label: 'Learn', icon: Icons.Book },
    { id: 'review', label: 'Review', icon: Icons.Repeat, badge: reviewDueCount },
    { id: 'profile', label: 'Profile', icon: Icons.User },
  ];

  return (
    <div style={styles.container}>
      {/* Background texture */}
      <div style={styles.backgroundTexture} />

      {/* Context Pill */}
      {showContextPill && context && (
        <div style={styles.contextPillWrapper}>
          <ContextPill context={context} />
        </div>
      )}

      {/* Main Content Area */}
      <main
        style={{
          ...styles.content,
          paddingTop: showContextPill && context ? '60px' : '16px',
          paddingBottom: hideBottomNav ? '16px' : '90px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav style={styles.bottomNav}>
          <div style={styles.bottomNavInner}>
            {tabs.map((tab) => (
              <TabItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => onTabChange?.(tab.id)}
                badge={tab.badge}
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.neutral[50],
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundTexture: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, ${colors.primary[50]} 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${colors.accent[50]} 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, ${colors.secondary[50]} 0%, transparent 30%)
    `,
    opacity: 0.6,
    pointerEvents: 'none',
    zIndex: 0,
  },

  contextPillWrapper: {
    position: 'fixed',
    top: spacing[4],
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
  },

  contextPill: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.neutral[0],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: borderRadius.full,
    boxShadow: shadows.md,
    border: `1px solid ${colors.neutral[200]}`,
  },

  contextItem: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  },

  contextDot: {
    color: colors.neutral[300],
    fontSize: typography.fontSize.xs[0],
  },

  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '480px',
    margin: '0 auto',
    padding: `${spacing[4]} ${spacing[4]}`,
    transition: `opacity ${transitions.duration.normal} ${transitions.easing.out}, transform ${transitions.duration.normal} ${transitions.easing.out}`,
  },

  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral[0],
    borderTop: `1px solid ${colors.neutral[100]}`,
    padding: `${spacing[2]} ${spacing[4]} ${spacing[6]}`,
    zIndex: 1000,
  },

  bottomNavInner: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: '480px',
    margin: '0 auto',
  },

  tabItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[2]} ${spacing[3]}`,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    minWidth: '64px',
    transition: `transform ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  tabItemActive: {
    transform: 'scale(1.05)',
  },

  tabIconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    backgroundColor: colors.secondary[500],
    color: colors.neutral[0],
    fontSize: typography.fontSize['2xs'][0],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.body,
    padding: '2px 6px',
    borderRadius: borderRadius.full,
    minWidth: '18px',
    textAlign: 'center',
  },

  tabLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
  },

  tabIndicator: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
};

export default MainLayout;
export { Icons, ContextPill };
