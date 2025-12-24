import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../design/designSystem';

/**
 * DailyTip - Displays a motivational quote that changes daily
 */
const DailyTip = () => {
    const [currentQuote, setCurrentQuote] = useState(null);

    const quotes = [
        {
            text: "Learning is not a sprint, it's a marathon. Just 15 minutes a day builds a lifetime of knowledge.",
            author: "Daily Learning Tip",
        },
        {
            text: "The beautiful thing about learning is that no one can take it away from you.",
            author: "B.B. King",
        },
        {
            text: "Education is the most powerful weapon which you can use to change the world.",
            author: "Nelson Mandela",
        },
        {
            text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
            author: "Dr. Seuss",
        },
        {
            text: "Success is the sum of small efforts repeated day in and day out.",
            author: "Robert Collier",
        },
        {
            text: "The expert in anything was once a beginner.",
            author: "Helen Hayes",
        },
        {
            text: "You don't have to be great to start, but you have to start to be great.",
            author: "Zig Ziglar",
        },
    ];

    useEffect(() => {
        // Pick a quote based on the day of the year (changes daily)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const quoteIndex = dayOfYear % quotes.length;
        setCurrentQuote(quotes[quoteIndex]);
    }, []);

    if (!currentQuote) return null;

    return (
        <div style={styles.container}>
            {/* Icon */}
            <div style={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.info} opacity="0.8">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>

            {/* Content */}
            <div style={styles.content}>
                <h3 style={styles.title}>Daily Tip</h3>
                <p style={styles.quote}>"{currentQuote.text}"</p>
                {currentQuote.author && (
                    <p style={styles.author}>— {currentQuote.author}</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: colors.info + '10',
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        border: `1px solid ${colors.info}30`,
        display: 'flex',
        gap: spacing[4],
        alignItems: 'flex-start',
    },

    iconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: borderRadius.full,
        backgroundColor: colors.info + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    content: {
        flex: 1,
    },

    title: {
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.sm[0],
        fontWeight: typography.fontWeight.bold,
        color: colors.info,
        margin: 0,
        marginBottom: spacing[2],
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },

    quote: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.base[0],
        fontWeight: typography.fontWeight.medium,
        color: colors.neutral[900],
        margin: 0,
        marginBottom: spacing[2],
        lineHeight: 1.6,
        fontStyle: 'italic',
    },

    author: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm[0],
        color: colors.neutral[600],
        margin: 0,
        fontWeight: typography.fontWeight.medium,
    },
};

export default DailyTip;
