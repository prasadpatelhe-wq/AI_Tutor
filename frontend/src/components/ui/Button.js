/**
 * Button Component
 * Beautiful, theme-aware button with multiple variants
 */

import React from 'react';
import { colors, radius, shadows, animations, fonts, spacing } from '../../design/tokens';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  theme = 'teen',
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
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

  // Size configurations
  const sizes = {
    sm: {
      padding: `${sp.xs} ${sp.md}`,
      fontSize: theme === 'kids' ? '0.9rem' : '0.8rem',
      minHeight: theme === 'kids' ? '40px' : '36px',
      iconSize: '16px',
    },
    md: {
      padding: `${sp.sm} ${sp.lg}`,
      fontSize: theme === 'kids' ? '1.1rem' : '1rem',
      minHeight: theme === 'kids' ? '52px' : '44px',
      iconSize: '20px',
    },
    lg: {
      padding: `${sp.md} ${sp.xl}`,
      fontSize: theme === 'kids' ? '1.25rem' : '1.125rem',
      minHeight: theme === 'kids' ? '64px' : '56px',
      iconSize: '24px',
    },
  };

  // Variant styles
  const getVariantStyles = () => {
    const baseTransition = `all ${an.duration.normal} ${an.easing.smooth}`;

    switch (variant) {
      case 'primary':
        return {
          background: theme === 'teen'
            ? `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`
            : theme === 'kids'
              ? `linear-gradient(135deg, ${c.primary} 0%, ${c.accent2} 100%)`
              : c.primary,
          color: c.textOnPrimary,
          border: 'none',
          boxShadow: glow ? sh.glow : sh.md,
        };

      case 'secondary':
        return {
          background: 'transparent',
          color: c.primary,
          border: `2px solid ${c.primary}`,
          boxShadow: 'none',
        };

      case 'ghost':
        return {
          background: 'transparent',
          color: c.text,
          border: 'none',
          boxShadow: 'none',
        };

      case 'success':
        return {
          background: c.success,
          color: '#fff',
          border: 'none',
          boxShadow: theme === 'teen' ? `0 0 20px ${c.success}40` : sh.sm,
        };

      case 'danger':
        return {
          background: c.error,
          color: '#fff',
          border: 'none',
          boxShadow: sh.sm,
        };

      case 'glass':
        return {
          background: theme === 'teen'
            ? 'rgba(255, 255, 255, 0.05)'
            : theme === 'kids'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(255, 255, 255, 0.1)',
          color: c.text,
          border: `1px solid ${theme === 'teen' ? c.primary + '40' : 'rgba(255,255,255,0.3)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme === 'teen' ? `0 0 20px ${c.primary}20` : sh.sm,
        };

      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${c.accent1} 0%, ${c.primary} 50%, ${c.accent2} 100%)`,
          backgroundSize: '200% 200%',
          color: theme === 'teen' ? c.bgPrimary : '#fff',
          border: 'none',
          boxShadow: sh.glow,
          animation: 'gradient-shift 3s ease infinite',
        };

      default:
        return {
          background: c.primary,
          color: c.textOnPrimary,
          border: 'none',
        };
    }
  };

  const sizeConfig = sizes[size];
  const variantStyles = getVariantStyles();

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp.xs,
    fontFamily: f.display,
    fontWeight: theme === 'kids' ? 700 : 600,
    fontSize: sizeConfig.fontSize,
    padding: sizeConfig.padding,
    minHeight: sizeConfig.minHeight,
    borderRadius: r.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${an.duration.normal} ${an.easing.smooth}`,
    textDecoration: 'none',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: theme === 'mature' ? '0.5px' : theme === 'teen' ? '1px' : '0',
    textTransform: theme === 'teen' ? 'uppercase' : 'none',
    ...variantStyles,
    ...style,
  };

  // Hover styles
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const hoverStyle = isHovered && !disabled ? {
    transform: theme === 'kids'
      ? 'translateY(-4px) scale(1.02)'
      : theme === 'teen'
        ? 'translateY(-2px)'
        : 'translateY(-1px)',
    boxShadow: glow || variant === 'primary' ? sh.glow : sh.lg,
    filter: theme === 'teen' ? 'brightness(1.1)' : 'none',
  } : {};

  const pressedStyle = isPressed && !disabled ? {
    transform: 'scale(0.98)',
    boxShadow: sh.sm,
  } : {};

  // Loading spinner
  const Spinner = () => (
    <svg
      width={sizeConfig.iconSize}
      height={sizeConfig.iconSize}
      viewBox="0 0 24 24"
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );

  // Ripple effect for teen theme
  const [ripples, setRipples] = React.useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    if (theme === 'teen') {
      const rect = e.currentTarget.getBoundingClientRect();
      const ripple = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now(),
      };
      setRipples([...ripples, ripple]);
      setTimeout(() => {
        setRipples((r) => r.filter((rip) => rip.id !== ripple.id));
      }, 600);
    }

    onClick && onClick(e);
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      style={{ ...buttonStyle, ...hoverStyle, ...pressedStyle }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}

      {/* Icon left */}
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ fontSize: sizeConfig.iconSize, display: 'flex' }}>{icon}</span>
      )}

      {/* Loading spinner */}
      {loading && <Spinner />}

      {/* Children */}
      {!loading && children}

      {/* Icon right */}
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ fontSize: sizeConfig.iconSize, display: 'flex' }}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
