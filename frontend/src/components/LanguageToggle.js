import React from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

/**
 * LanguageToggle - Switch between language preferences
 * Allows toggling between English, Kannada, and Dual mode
 */
const LanguageToggle = ({ currentLanguage = 'en', onLanguageChange }) => {
    const languages = [
        { code: 'kn', label: 'ಕನ್ನಡ', display: 'Kannada' },
        { code: 'en', label: 'English', display: 'English' },
        { code: 'dual', label: 'Dual (Eng + Kan)', display: 'Dual Mode' },
    ];

    const getCurrentLabel = () => {
        const lang = languages.find(l => l.code === currentLanguage);
        return lang ? lang.label : 'English';
    };

    return (
        <div style={styles.container}>
            {/* Icon and Title */}
            <div style={styles.header}>
                <div style={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.primary[500]} strokeWidth="2">
                        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                </div>
                <div style={styles.textContent}>
                    <h3 style={styles.title}>Learning Language</h3>
                    <p style={styles.subtitle}>Switch between English and Kannada anytime.</p>
                </div>
            </div>

            {/* Language Buttons */}
            <div style={styles.buttonGroup}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        style={{
                            ...styles.button,
                            ...(currentLanguage === lang.code ? styles.buttonActive : styles.buttonInactive),
                        }}
                        onClick={() => onLanguageChange?.(lang.code)}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: colors.neutral[0],
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        border: `1px solid ${colors.neutral[200]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[4],
    },

    header: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[3],
    },

    iconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    textContent: {
        flex: 1,
    },

    title: {
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.base[0],
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutral[900],
        margin: 0,
        marginBottom: spacing[0.5],
    },

    subtitle: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm[0],
        color: colors.neutral[600],
        margin: 0,
        lineHeight: 1.5,
    },

    buttonGroup: {
        display: 'flex',
        gap: spacing[2],
        flexWrap: 'wrap',
    },

    button: {
        padding: `${spacing[2]} ${spacing[4]}`,
        borderRadius: borderRadius.lg,
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.sm[0],
        fontWeight: typography.fontWeight.semibold,
        cursor: 'pointer',
        transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
        border: `2px solid transparent`,
        flex: '1 1 auto',
        minWidth: '80px',
    },

    buttonActive: {
        backgroundColor: colors.accent[400],
        color: colors.neutral[900],
        border: `2px solid ${colors.neutral[900]}`,
        boxShadow: shadows.brutalSm,
    },

    buttonInactive: {
        backgroundColor: colors.neutral[100],
        color: colors.neutral[700],
        border: `2px solid ${colors.neutral[200]}`,
    },
};

export default LanguageToggle;
