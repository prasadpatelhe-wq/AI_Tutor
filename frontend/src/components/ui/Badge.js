/**
 * Badge Component
 * Beautiful badges, pills, and status indicators
 */

import React from 'react';
import { colors, radius, animations, fonts, spacing } from '../../design/tokens';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  theme = 'teen',
  color,
  glow = false,
  pulse = false,
  icon,
  className = '',
  style = {},
  ...props
}) => {
  const c = colors[theme];
  const r = radius[theme];
  const an = animations[theme];
  const f = fonts[theme];
  const sp = spacing[theme];

  // Size configurations
  const sizes = {
    sm: {
      padding: `${sp.xs} ${sp.sm}`,
      fontSize: theme === 'kids' ? '0.75rem' : '0.7rem',
      iconSize: '12px',
    },
    md: {
      padding: `${sp.xs} ${sp.md}`,
      fontSize: theme === 'kids' ? '0.875rem' : '0.8rem',
      iconSize: '14px',
    },
    lg: {
      padding: `${sp.sm} ${sp.lg}`,
      fontSize: theme === 'kids' ? '1rem' : '0.9rem',
      iconSize: '16px',
    },
  };

  const sizeConfig = sizes[size];

  // Get color based on variant
  const getVariantStyles = () => {
    const customColor = color || c.primary;

    switch (variant) {
      case 'solid':
        return {
          background: customColor,
          color: c.textOnPrimary,
          border: 'none',
        };

      case 'outline':
        return {
          background: 'transparent',
          color: customColor,
          border: `2px solid ${customColor}`,
        };

      case 'soft':
        return {
          background: `${customColor}20`,
          color: customColor,
          border: 'none',
        };

      case 'glass':
        return {
          background: theme === 'teen'
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(255,255,255,0.5)',
          color: c.text,
          border: `1px solid ${customColor}30`,
          backdropFilter: 'blur(8px)',
        };

      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`,
          color: c.textOnPrimary,
          border: 'none',
        };

      case 'success':
        return {
          background: theme === 'teen' ? `${c.success}30` : c.success,
          color: theme === 'teen' ? c.success : '#fff',
          border: 'none',
        };

      case 'warning':
        return {
          background: theme === 'teen' ? `${c.warning}30` : c.warning,
          color: theme === 'teen' ? c.warning : '#fff',
          border: 'none',
        };

      case 'error':
        return {
          background: theme === 'teen' ? `${c.error}30` : c.error,
          color: theme === 'teen' ? c.error : '#fff',
          border: 'none',
        };

      case 'neon':
        if (theme !== 'teen') return getVariantStyles.call(this, 'solid');
        return {
          background: 'transparent',
          color: customColor,
          border: `1px solid ${customColor}`,
          boxShadow: `0 0 10px ${customColor}60, inset 0 0 10px ${customColor}20`,
          textShadow: `0 0 10px ${customColor}`,
        };

      case 'candy':
        if (theme !== 'kids') return getVariantStyles.call(this, 'soft');
        return {
          background: `linear-gradient(135deg, ${c.primaryLight} 0%, ${c.accent1} 100%)`,
          color: c.text,
          border: `2px solid ${c.primary}`,
          boxShadow: `0 4px 15px ${c.primary}40`,
        };

      default:
        return {
          background: `${c.primary}20`,
          color: c.primary,
          border: 'none',
        };
    }
  };

  const variantStyles = getVariantStyles();

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp.xs,
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    fontFamily: f.body,
    fontWeight: 600,
    borderRadius: r.full,
    textTransform: theme === 'teen' ? 'uppercase' : 'none',
    letterSpacing: theme === 'teen' ? '0.5px' : '0',
    transition: `all ${an.duration.fast} ${an.easing.smooth}`,
    whiteSpace: 'nowrap',
    ...(glow && { boxShadow: `0 0 15px ${color || c.primary}50` }),
    ...(pulse && { animation: 'pulse-glow 2s ease-in-out infinite' }),
    ...variantStyles,
    ...style,
  };

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={badgeStyle}
      {...props}
    >
      {icon && <span style={{ fontSize: sizeConfig.iconSize }}>{icon}</span>}
      {children}
    </span>
  );
};

// Dot indicator subcomponent
Badge.Dot = ({ color, pulse = false, theme = 'teen', size = 8, style = {} }) => {
  const c = colors[theme];

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color || c.primary,
        boxShadow: pulse ? `0 0 10px ${color || c.primary}` : 'none',
        animation: pulse ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        ...style,
      }}
    />
  );
};

export default Badge;
