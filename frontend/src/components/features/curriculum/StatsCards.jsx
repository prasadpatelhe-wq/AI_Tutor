/**
 * StatsCards - Memoized game stats display
 *
 * Displays coins, streak, and level with proper memoization.
 */

import React, { memo, useMemo } from 'react';
import { colors, spacing, typography } from '../../../design/designSystem';

const StatCard = memo(({ icon, label, value, color }) => (
  <div style={{ ...styles.card, borderColor: color }}>
    <span style={styles.icon}>{icon}</span>
    <div style={styles.cardContent}>
      <span style={styles.value}>{value}</span>
      <span style={styles.label}>{label}</span>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

const StatsCards = memo(({ gameState }) => {
  // Memoize the stats array to prevent recreation on every render
  const stats = useMemo(() => [
    {
      icon: '🪙',
      label: 'Coins',
      value: gameState?.coins ?? 0,
      color: colors.accent[400],
    },
    {
      icon: '🔥',
      label: 'Day Streak',
      value: gameState?.streak_days ?? 0,
      color: colors.orange[400],
    },
    {
      icon: '⭐',
      label: 'Level',
      value: gameState?.current_level ?? 1,
      color: colors.primary[400],
    },
    {
      icon: '📝',
      label: 'Quizzes',
      value: gameState?.quizzes_completed ?? 0,
      color: colors.secondary[400],
    },
  ], [
    gameState?.coins,
    gameState?.streak_days,
    gameState?.current_level,
    gameState?.quizzes_completed,
  ]);

  return (
    <div style={styles.container}>
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: spacing[3],
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.neutral[0],
    padding: spacing[4],
    borderRadius: '16px',
    border: `2px solid`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  icon: {
    fontSize: '1.5rem',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },
  value: {
    fontFamily: typography.fontFamily.display,
    fontSize: '1.25rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },
  label: {
    fontFamily: typography.fontFamily.body,
    fontSize: '0.75rem',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export default StatsCards;
