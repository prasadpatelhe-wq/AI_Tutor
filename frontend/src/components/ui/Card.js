/**
 * Card Component
 * Beautiful glass-morphism cards with theme-aware styling
 */

import React, { useState } from 'react';
import { colors, radius, shadows, animations, spacing } from '../../design/tokens';

const Card = ({
  children,
  variant = 'default',
  theme = 'teen',
  padding = 'md',
  hover = true,
  glow = false,
  onClick,
  className = '',
  style = {},
  header,
  footer,
  accent,
  ...props
}) => {
  const c = colors[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const an = animations[theme];
  const sp = spacing[theme];

  const [isHovered, setIsHovered] = useState(false);

  // Padding sizes
  const paddings = {
    none: '0',
    sm: sp.sm,
    md: sp.md,
    lg: sp.lg,
    xl: sp.xl,
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          background: theme === 'teen'
            ? 'rgba(20, 20, 35, 0.8)'
            : theme === 'kids'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(24, 24, 27, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme === 'teen' ? c.primary + '30' : 'rgba(255,255,255,0.2)'}`,
          boxShadow: sh.card,
        };

      case 'solid':
        return {
          background: c.bgCard,
          border: 'none',
          boxShadow: sh.md,
        };

      case 'outline':
        return {
          background: 'transparent',
          border: `2px solid ${c.primary}`,
          boxShadow: 'none',
        };

      case 'gradient':
        return {
          background: theme === 'teen'
            ? `linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(255,0,255,0.1) 100%)`
            : theme === 'kids'
              ? `linear-gradient(135deg, ${c.primaryLight}30 0%, ${c.accent2}30 100%)`
              : `linear-gradient(135deg, ${c.primary}10 0%, ${c.secondary}20 100%)`,
          border: `1px solid ${c.primary}30`,
          backdropFilter: 'blur(10px)',
          boxShadow: sh.card,
        };

      case 'elevated':
        return {
          background: c.bgCard,
          border: 'none',
          boxShadow: sh.lg,
          transform: 'translateY(-4px)',
        };

      case 'neon':
        if (theme !== 'teen') return getVariantStyles.call(this, 'glass');
        return {
          background: 'rgba(10, 10, 15, 0.95)',
          border: `1px solid ${c.primary}`,
          boxShadow: `0 0 20px ${c.primary}40, inset 0 0 30px ${c.primary}10`,
          animation: 'neon-border 3s ease-in-out infinite',
        };

      case 'candy':
        if (theme !== 'kids') return getVariantStyles.call(this, 'glass');
        return {
          background: `linear-gradient(135deg, #FFE5EC 0%, #E8F4FD 50%, #F3E8FF 100%)`,
          border: `3px solid ${c.primary}`,
          boxShadow: `0 10px 40px ${c.primary}40`,
          borderRadius: r.xl,
        };

      default:
        return {
          background: c.bgCard,
          border: theme === 'teen'
            ? `1px solid rgba(255,255,255,0.1)`
            : theme === 'kids'
              ? `2px solid ${c.primaryLight}`
              : `1px solid rgba(255,255,255,0.05)`,
          boxShadow: sh.card,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const cardStyle = {
    borderRadius: r.lg,
    overflow: 'hidden',
    position: 'relative',
    transition: `all ${an.duration.normal} ${an.easing.smooth}`,
    cursor: onClick ? 'pointer' : 'default',
    ...variantStyles,
    ...style,
  };

  // Hover effects
  const hoverStyles = hover && isHovered ? {
    transform: theme === 'kids'
      ? 'translateY(-8px) rotate(-1deg)'
      : theme === 'teen'
        ? 'translateY(-4px)'
        : 'translateY(-2px)',
    boxShadow: glow ? sh.glow : sh.lg,
  } : {};

  // Accent bar at top
  const accentBar = accent && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: theme === 'kids' ? '6px' : '4px',
        background: typeof accent === 'string'
          ? accent
          : `linear-gradient(90deg, ${c.primary} 0%, ${c.secondary} 100%)`,
        borderRadius: `${r.lg} ${r.lg} 0 0`,
      }}
    />
  );

  return (
    <div
      className={`card card-${variant} ${className}`}
      style={{ ...cardStyle, ...hoverStyles }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {accentBar}

      {/* Header */}
      {header && (
        <div
          style={{
            padding: paddings[padding],
            paddingBottom: sp.sm,
            borderBottom: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {header}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: paddings[padding] }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div
          style={{
            padding: paddings[padding],
            paddingTop: sp.sm,
            borderTop: `1px solid ${theme === 'teen' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: theme === 'teen'
              ? 'rgba(0,0,0,0.2)'
              : theme === 'kids'
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(0,0,0,0.1)',
          }}
        >
          {footer}
        </div>
      )}

      {/* Decorative elements for kids theme */}
      {theme === 'kids' && variant === 'candy' && (
        <>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '24px',
            opacity: 0.5,
            animation: 'float 3s ease-in-out infinite',
          }}>
            ✨
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontSize: '20px',
            opacity: 0.4,
            animation: 'float 3s ease-in-out infinite 0.5s',
          }}>
            🌟
          </div>
        </>
      )}

      {/* Scan line effect for teen theme */}
      {theme === 'teen' && variant === 'neon' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(transparent 50%, rgba(0,245,255,0.03) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
};

export default Card;
