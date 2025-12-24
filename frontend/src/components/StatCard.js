import React, { useState } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

/**
 * StatCard - Display a single statistic with icon
 * Used for chapters read, quizzes taken, coins, streak, etc.
 */
const StatCard = ({ icon, value, label, color = colors.primary[500], gradient = null }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                ...styles.card,
                background: gradient || colors.neutral[0],
                borderColor: isHovered ? color : colors.neutral[200],
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? shadows.md : shadows.sm,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Icon */}
            <div style={{
                ...styles.iconWrapper,
                backgroundColor: `${color}15`,
            }}>
                <span style={styles.icon}>{icon}</span>
            </div>

            {/* Value */}
            <div style={{
                ...styles.value,
                color: color,
            }}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>

            {/* Label */}
            <div style={styles.label}>{label}</div>
        </div>
    );
};

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        backgroundColor: colors.neutral[0],
        borderRadius: borderRadius.xl,
        padding: `${spacing[5]} ${spacing[4]}`,
        border: `1px solid ${colors.neutral[200]}`,
        transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
        cursor: 'default',
        minHeight: '120px',
    },

    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: borderRadius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    icon: {
        fontSize: '28px',
        lineHeight: 1,
    },

    value: {
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize['2xl'][0],
        fontWeight: typography.fontWeight.bold,
        lineHeight: 1,
    },

    label: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.xs[0],
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutral[600],
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'center',
    },
};

export default StatCard;
