import React, { useState } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

/**
 * SubjectCard - Display a subject with progress
 * Shows subject name, chapter count, progress bar, status, and CTA button
 */
const SubjectCard = ({
    icon,
    name,
    description,
    chaptersCompleted = 0,
    totalChapters = 0,
    status = 'Not Started', // 'In Progress' | 'Not Started' | 'Just Started'
    progressPercent = 0,
    color = colors.primary[500],
    onContinue,
    onStart,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const isInProgress = status === 'In Progress' || status === 'Just Started';
    const buttonText = isInProgress ? 'Continue' : 'Start Now';
    const buttonAction = isInProgress ? onContinue : onStart;

    // Status badge colors
    const getStatusColor = () => {
        if (status === 'In Progress') return colors.secondary[500];
        if (status === 'Just Started') return colors.purple[500];
        return colors.neutral[400];
    };

    const getStatusBgColor = () => {
        if (status === 'In Progress') return colors.secondary[50];
        if (status === 'Just Started') return colors.purple[50];
        return colors.neutral[100];
    };

    return (
        <div
            style={{
                ...styles.card,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? shadows.md : shadows.sm,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header with Icon and Status */}
            <div style={styles.header}>
                <div style={{
                    ...styles.iconWrapper,
                    backgroundColor: `${color}15`,
                }}>
                    <span style={styles.icon}>{icon}</span>
                </div>

                <div style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusBgColor(),
                    color: getStatusColor(),
                }}>
                    {status}
                </div>
            </div>

            {/* Subject Name */}
            <h3 style={styles.name}>{name}</h3>

            {/* Description */}
            {description && <p style={styles.description}>{description}</p>}

            {/* Progress Info */}
            <div style={styles.progressInfo}>
                <span style={styles.chaptersText}>
                    {chaptersCompleted}/{totalChapters} Chapters
                </span>
                {progressPercent > 0 && (
                    <span style={{
                        ...styles.percentText,
                        color: color,
                    }}>
                        {progressPercent}%
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            <div style={styles.progressBarContainer}>
                <div
                    style={{
                        ...styles.progressBar,
                        width: `${progressPercent}%`,
                        backgroundColor: color,
                    }}
                />
            </div>

            {/* CTA Button */}
            <button
                style={{
                    ...styles.button,
                    ...(isInProgress ? styles.buttonContinue : styles.buttonStart),
                }}
                onClick={buttonAction}
            >
                {buttonText}
            </button>
        </div>
    );
};

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.neutral[0],
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        border: `1px solid ${colors.neutral[200]}`,
        transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
        gap: spacing[3],
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[1],
    },

    iconWrapper: {
        width: '52px',
        height: '52px',
        borderRadius: borderRadius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    icon: {
        fontSize: '28px',
        lineHeight: 1,
    },

    statusBadge: {
        padding: `${spacing[1]} ${spacing[2.5]}`,
        borderRadius: borderRadius.full,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize['2xs'][0],
        fontWeight: typography.fontWeight.semibold,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },

    name: {
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.lg[0],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        margin: 0,
        lineHeight: 1.3,
    },

    description: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm[0],
        color: colors.neutral[600],
        margin: 0,
        lineHeight: 1.5,
    },

    progressInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing[1],
    },

    chaptersText: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm[0],
        color: colors.neutral[600],
        fontWeight: typography.fontWeight.medium,
    },

    percentText: {
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.sm[0],
        fontWeight: typography.fontWeight.bold,
    },

    progressBarContainer: {
        width: '100%',
        height: '8px',
        backgroundColor: colors.neutral[100],
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },

    progressBar: {
        height: '100%',
        borderRadius: borderRadius.full,
        transition: `width ${transitions.duration.slow} ${transitions.easing.out}`,
    },

    button: {
        width: '100%',
        padding: `${spacing[2.5]} ${spacing[4]}`,
        borderRadius: borderRadius.lg,
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.sm[0],
        fontWeight: typography.fontWeight.semibold,
        border: 'none',
        cursor: 'pointer',
        transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
        marginTop: spacing[2],
    },

    buttonContinue: {
        backgroundColor: colors.primary[500],
        color: colors.neutral[0],
    },

    buttonStart: {
        backgroundColor: colors.accent[400],
        color: colors.neutral[900],
        border: `2px solid ${colors.neutral[900]}`,
        boxShadow: shadows.brutalSm,
    },
};

export default SubjectCard;
