import React from 'react';
import { colors, typography, spacing, borderRadius, transitions } from '../design/designSystem';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                width: '100%',
                padding: `${spacing[3]} ${spacing[4]}`,
                backgroundColor: active ? 'rgba(0, 255, 132, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
                position: 'relative',
            }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            {/* Left Active Indicator */}
            {active && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '24px',
                    backgroundColor: colors.theme.primary,
                    borderRadius: '0 4px 4px 0',
                }} />
            )}

            <Icon
                size={20}
                color={active ? colors.theme.primary : colors.theme.textMuted}
                style={{ opacity: active ? 1 : 0.8 }}
            />

            <span style={{
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm[0],
                fontWeight: active ? typography.fontWeight.bold : typography.fontWeight.medium,
                color: active ? colors.theme.primary : colors.theme.textMuted,
                flex: 1,
                textAlign: 'left',
            }}>
                {label}
            </span>

            {badge > 0 && (
                <span style={{
                    backgroundColor: colors.theme.primary,
                    color: colors.theme.bg,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: borderRadius.full,
                    minWidth: '18px',
                    textAlign: 'center',
                }}>
                    {badge}
                </span>
            )}
        </button>
    );
};

// Icons (Simple SVG placeholders or imported)
const Icons = {
    Dashboard: ({ size, color, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    ),
    Courses: ({ size, color, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
    ),
    Assignments: ({ size, color, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    Leaderboard: ({ size, color, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
    ),
    Community: ({ size, color, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    ),
    Settings: ({ size, color, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Logo: ({ size = 32 }) => (
        <div style={{
            width: size,
            height: size,
            borderRadius: '8px',
            backgroundColor: colors.theme.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
        }}>
            🎓
        </div>
    )
};

const Sidebar = ({ activeTab, onTabChange, student }) => {
    return (
        <div style={{
            width: '260px',
            height: '100vh',
            backgroundColor: colors.theme.sidebar,
            borderRight: `1px solid ${colors.theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            padding: spacing[6],
            position: 'fixed',
            left: 0,
            top: 0,
        }}>
            {/* Brand */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                marginBottom: spacing[10],
                paddingLeft: spacing[2]
            }}>
                <Icons.Logo />
                <div>
                    <h1 style={{
                        fontFamily: typography.fontFamily.display,
                        fontSize: typography.fontSize.lg[0],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.theme.text,
                        margin: 0,
                        lineHeight: 1
                    }}>EduLearn</h1>
                    <span style={{
                        fontFamily: typography.fontFamily.body,
                        fontSize: '11px',
                        color: colors.theme.textMuted,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>Student Portal</span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], flex: 1 }}>
                <SidebarItem
                    icon={Icons.Dashboard}
                    label="Dashboard"
                    active={activeTab === 'home'}
                    onClick={() => onTabChange('home')}
                />
                <SidebarItem
                    icon={Icons.Courses}
                    label="My Courses"
                    active={activeTab === 'learn'}
                    onClick={() => onTabChange('learn')}
                />
                <SidebarItem
                    icon={Icons.Assignments}
                    label="Assignments"
                    active={activeTab === 'review'}
                    onClick={() => onTabChange('review')}
                    badge={2}
                />
                <SidebarItem
                    icon={Icons.Leaderboard}
                    label="Leaderboard"
                    active={activeTab === 'leaderboard'}
                    onClick={() => onTabChange('leaderboard')}
                />
                <SidebarItem
                    icon={Icons.Community}
                    label="Community"
                    active={activeTab === 'community'}
                    onClick={() => onTabChange('community')}
                />
            </nav>

            {/* Bottom Section */}
            <div style={{ borderTop: `1px solid ${colors.theme.border}`, paddingTop: spacing[6], display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                <SidebarItem
                    icon={Icons.Settings}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />

                {/* Mini Profile */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[3],
                    padding: spacing[3],
                    marginTop: spacing[2],
                    borderRadius: borderRadius.lg,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer'
                }} onClick={() => onTabChange('profile')}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: borderRadius.full,
                        backgroundColor: colors.theme.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                    }}>
                        👤
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontFamily: typography.fontFamily.display,
                            fontSize: typography.fontSize.sm[0],
                            fontWeight: typography.fontWeight.bold,
                            color: colors.theme.text,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{student?.name || 'Guest User'}</div>
                        <div style={{
                            fontFamily: typography.fontFamily.body,
                            fontSize: '11px',
                            color: colors.theme.textMuted,
                        }}>{student?.grade_band || 'Grade 10'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
