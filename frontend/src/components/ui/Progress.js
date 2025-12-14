/**
 * Progress Component
 * Beautiful progress bars and circular progress indicators
 */

import React from 'react';
import { colors, radius, shadows, animations, fonts, spacing } from '../../design/tokens';

// Linear Progress Bar
const Progress = ({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  theme = 'teen',
  color,
  showLabel = false,
  label,
  animated = true,
  striped = false,
  glow = false,
  className = '',
  style = {},
  ...props
}) => {
  const c = colors[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const an = animations[theme];
  const f = fonts[theme];
  const sp = spacing[theme];

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Size configurations
  const sizes = {
    sm: { height: theme === 'kids' ? '10px' : '6px', fontSize: '0.7rem' },
    md: { height: theme === 'kids' ? '16px' : '10px', fontSize: '0.8rem' },
    lg: { height: theme === 'kids' ? '24px' : '16px', fontSize: '0.9rem' },
    xl: { height: theme === 'kids' ? '32px' : '24px', fontSize: '1rem' },
  };

  const sizeConfig = sizes[size];

  // Get fill color/gradient
  const getFillStyle = () => {
    const baseColor = color || c.primary;

    switch (variant) {
      case 'gradient':
        return {
          background: `linear-gradient(90deg, ${c.primary} 0%, ${c.secondary} 50%, ${c.accent1} 100%)`,
          backgroundSize: '200% 100%',
          animation: animated ? 'gradient-shift 3s ease infinite' : 'none',
        };

      case 'rainbow':
        return {
          background: `linear-gradient(90deg, ${c.error} 0%, ${c.warning} 25%, ${c.accent1} 50%, ${c.success} 75%, ${c.primary} 100%)`,
        };

      case 'neon':
        if (theme !== 'teen') return { background: baseColor };
        return {
          background: baseColor,
          boxShadow: `0 0 10px ${baseColor}, 0 0 20px ${baseColor}60`,
        };

      case 'candy':
        if (theme !== 'kids') return { background: baseColor };
        return {
          background: `repeating-linear-gradient(
            45deg,
            ${c.primary},
            ${c.primary} 10px,
            ${c.primaryLight} 10px,
            ${c.primaryLight} 20px
          )`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        };

      case 'success':
        return { background: c.success };

      case 'warning':
        return { background: c.warning };

      case 'error':
        return { background: c.error };

      default:
        return { background: baseColor };
    }
  };

  const containerStyle = {
    width: '100%',
    ...style,
  };

  const trackStyle = {
    width: '100%',
    height: sizeConfig.height,
    borderRadius: r.full,
    background: theme === 'teen'
      ? 'rgba(255,255,255,0.1)'
      : theme === 'kids'
        ? 'rgba(0,0,0,0.1)'
        : 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative',
  };

  const fillStyle = {
    height: '100%',
    width: `${percentage}%`,
    borderRadius: r.full,
    transition: animated ? `width ${an.duration.slow} ${an.easing.smooth}` : 'none',
    position: 'relative',
    ...getFillStyle(),
    ...(glow && { boxShadow: `0 0 15px ${color || c.primary}60` }),
  };

  // Striped overlay
  const stripedOverlay = striped && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255,255,255,0.1) 10px,
          rgba(255,255,255,0.1) 20px
        )`,
        backgroundSize: '28px 28px',
        animation: animated ? 'shimmer 1s linear infinite' : 'none',
      }}
    />
  );

  const labelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sp.xs,
    fontFamily: f.body,
    fontSize: sizeConfig.fontSize,
    fontWeight: 600,
    color: c.text,
  };

  const percentStyle = {
    fontFamily: theme === 'teen' ? f.accent : f.body,
    color: c.primary,
  };

  return (
    <div className={`progress ${className}`} style={containerStyle} {...props}>
      {/* Label */}
      {(showLabel || label) && (
        <div style={labelStyle}>
          <span>{label || 'Progress'}</span>
          <span style={percentStyle}>{Math.round(percentage)}%</span>
        </div>
      )}

      {/* Track */}
      <div style={trackStyle}>
        {/* Fill */}
        <div style={fillStyle}>
          {stripedOverlay}
        </div>
      </div>
    </div>
  );
};

// Circular Progress
Progress.Circle = ({
  value = 0,
  max = 100,
  size = 100,
  strokeWidth = 8,
  theme = 'teen',
  color,
  showLabel = true,
  label,
  animated = true,
  glow = false,
  className = '',
  style = {},
  children,
  ...props
}) => {
  const c = colors[theme];
  const f = fonts[theme];

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const containerStyle = {
    position: 'relative',
    width: size,
    height: size,
    ...style,
  };

  const svgStyle = {
    transform: 'rotate(-90deg)',
    filter: glow ? `drop-shadow(0 0 10px ${color || c.primary})` : 'none',
  };

  const trackStyle = {
    fill: 'none',
    stroke: theme === 'teen'
      ? 'rgba(255,255,255,0.1)'
      : theme === 'kids'
        ? 'rgba(0,0,0,0.1)'
        : 'rgba(255,255,255,0.1)',
    strokeWidth,
  };

  const fillStyle = {
    fill: 'none',
    stroke: color || c.primary,
    strokeWidth,
    strokeLinecap: 'round',
    strokeDasharray: circumference,
    strokeDashoffset: offset,
    transition: animated ? 'stroke-dashoffset 0.6s ease' : 'none',
  };

  const labelContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  };

  const percentageStyle = {
    fontFamily: theme === 'teen' ? f.accent : f.display,
    fontSize: size * 0.25,
    fontWeight: 700,
    color: c.text,
    lineHeight: 1,
  };

  const labelTextStyle = {
    fontFamily: f.body,
    fontSize: size * 0.1,
    color: c.textMuted,
    marginTop: '4px',
  };

  return (
    <div className={`progress-circle ${className}`} style={containerStyle} {...props}>
      <svg width={size} height={size} style={svgStyle}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={trackStyle}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={fillStyle}
        />
      </svg>

      {/* Center content */}
      <div style={labelContainerStyle}>
        {children || (
          <>
            {showLabel && (
              <div style={percentageStyle}>
                {Math.round(percentage)}
                <span style={{ fontSize: '0.5em' }}>%</span>
              </div>
            )}
            {label && <div style={labelTextStyle}>{label}</div>}
          </>
        )}
      </div>
    </div>
  );
};

// XP/Level Progress (Gaming style)
Progress.XP = ({
  currentXP = 0,
  maxXP = 100,
  level = 1,
  theme = 'teen',
  color,
  className = '',
  style = {},
  ...props
}) => {
  const c = colors[theme];
  const r = radius[theme];
  const f = fonts[theme];
  const sp = spacing[theme];

  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: sp.sm,
    ...style,
  };

  const levelBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme === 'kids' ? '48px' : '40px',
    height: theme === 'kids' ? '48px' : '40px',
    borderRadius: theme === 'kids' ? r.lg : r.md,
    background: theme === 'teen'
      ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`
      : theme === 'kids'
        ? `linear-gradient(135deg, ${c.accent1} 0%, ${c.primary} 100%)`
        : c.primary,
    fontFamily: f.display,
    fontSize: theme === 'kids' ? '1.25rem' : '1rem',
    fontWeight: 700,
    color: c.textOnPrimary,
    boxShadow: theme === 'teen'
      ? `0 0 20px ${c.primary}60`
      : `0 4px 15px ${c.primary}40`,
  };

  const barContainerStyle = {
    flex: 1,
  };

  const xpTextStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: theme === 'teen' ? f.accent : f.body,
    fontSize: '0.75rem',
    color: c.textMuted,
    marginBottom: sp.xs,
  };

  const barStyle = {
    height: theme === 'kids' ? '12px' : '8px',
    borderRadius: r.full,
    background: theme === 'teen'
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const fillStyle = {
    height: '100%',
    width: `${percentage}%`,
    borderRadius: r.full,
    background: theme === 'teen'
      ? `linear-gradient(90deg, ${c.primary} 0%, ${c.accent1} 100%)`
      : theme === 'kids'
        ? `linear-gradient(90deg, ${c.accent1} 0%, ${c.primary} 100%)`
        : c.primary,
    transition: 'width 0.5s ease',
    boxShadow: theme === 'teen' ? `0 0 10px ${c.primary}` : 'none',
  };

  return (
    <div className={`progress-xp ${className}`} style={containerStyle} {...props}>
      {/* Level badge */}
      <div style={levelBadgeStyle}>
        {theme === 'kids' ? `L${level}` : level}
      </div>

      {/* XP bar */}
      <div style={barContainerStyle}>
        <div style={xpTextStyle}>
          <span>{theme === 'teen' ? 'XP' : 'Experience'}</span>
          <span>{currentXP} / {maxXP}</span>
        </div>
        <div style={barStyle}>
          <div style={fillStyle} />
        </div>
      </div>
    </div>
  );
};

export default Progress;
