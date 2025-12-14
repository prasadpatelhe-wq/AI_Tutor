/**
 * Input Component
 * Beautiful, theme-aware input fields
 */

import React, { useState, forwardRef } from 'react';
import { colors, radius, shadows, animations, fonts, spacing } from '../../design/tokens';

const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'md',
  theme = 'teen',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  ...props
}, ref) => {
  const c = colors[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const an = animations[theme];
  const f = fonts[theme];
  const sp = spacing[theme];

  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  // Size configurations
  const sizes = {
    sm: {
      padding: `${sp.xs} ${sp.sm}`,
      fontSize: theme === 'kids' ? '0.95rem' : '0.875rem',
      height: theme === 'kids' ? '44px' : '40px',
      iconSize: '18px',
    },
    md: {
      padding: `${sp.sm} ${sp.md}`,
      fontSize: theme === 'kids' ? '1.1rem' : '1rem',
      height: theme === 'kids' ? '56px' : '48px',
      iconSize: '20px',
    },
    lg: {
      padding: `${sp.md} ${sp.lg}`,
      fontSize: theme === 'kids' ? '1.25rem' : '1.125rem',
      height: theme === 'kids' ? '68px' : '56px',
      iconSize: '24px',
    },
  };

  const sizeConfig = sizes[size];

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return c.error;
    if (success) return c.success;
    if (isFocused) return c.primary;
    return theme === 'teen'
      ? 'rgba(255,255,255,0.2)'
      : theme === 'kids'
        ? c.primaryLight
        : 'rgba(255,255,255,0.1)';
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          background: theme === 'teen'
            ? 'rgba(255,255,255,0.05)'
            : theme === 'kids'
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.05)',
          border: `2px solid transparent`,
          borderColor: getBorderColor(),
        };

      case 'outline':
        return {
          background: 'transparent',
          border: `2px solid ${getBorderColor()}`,
        };

      case 'underline':
        return {
          background: 'transparent',
          border: 'none',
          borderBottom: `2px solid ${getBorderColor()}`,
          borderRadius: 0,
        };

      case 'glass':
        return {
          background: theme === 'teen'
            ? 'rgba(20, 20, 35, 0.6)'
            : theme === 'kids'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(24, 24, 27, 0.6)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${getBorderColor()}`,
        };

      default:
        return {
          background: theme === 'teen'
            ? 'rgba(255,255,255,0.08)'
            : theme === 'kids'
              ? '#fff'
              : 'rgba(255,255,255,0.05)',
          border: `2px solid ${getBorderColor()}`,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const containerStyle = {
    position: 'relative',
    width: '100%',
    marginBottom: error ? sp.xs : 0,
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    width: '100%',
    height: sizeConfig.height,
    padding: sizeConfig.padding,
    paddingLeft: icon && iconPosition === 'left' ? `calc(${sizeConfig.padding} + 28px)` : sizeConfig.padding,
    paddingRight: icon && iconPosition === 'right' ? `calc(${sizeConfig.padding} + 28px)` : sizeConfig.padding,
    fontFamily: f.body,
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    color: c.text,
    borderRadius: variant === 'underline' ? 0 : r.md,
    outline: 'none',
    transition: `all ${an.duration.normal} ${an.easing.smooth}`,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...variantStyles,
    boxShadow: isFocused
      ? theme === 'teen'
        ? `0 0 0 3px ${c.primary}30, ${sh.sm}`
        : `0 0 0 3px ${c.primary}20`
      : 'none',
    ...style,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: sp.xs,
    fontFamily: f.body,
    fontSize: theme === 'kids' ? '1rem' : '0.875rem',
    fontWeight: 600,
    color: error ? c.error : success ? c.success : c.text,
    transition: `all ${an.duration.fast} ease`,
  };

  const iconStyle = {
    position: 'absolute',
    [iconPosition]: sp.sm,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: sizeConfig.iconSize,
    color: isFocused ? c.primary : c.textMuted,
    transition: `color ${an.duration.fast} ease`,
    pointerEvents: 'none',
  };

  const errorStyle = {
    marginTop: sp.xs,
    fontFamily: f.body,
    fontSize: '0.8rem',
    color: c.error,
    display: 'flex',
    alignItems: 'center',
    gap: sp.xs,
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className={`input-container ${className}`} style={containerStyle}>
      {/* Label */}
      {label && (
        <label style={labelStyle}>
          {label}
          {theme === 'kids' && ' '}
          {theme === 'kids' && (error ? '😢' : success ? '✨' : '')}
        </label>
      )}

      {/* Input wrapper */}
      <div style={inputWrapperStyle}>
        {/* Icon */}
        {icon && <span style={iconStyle}>{icon}</span>}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          {...props}
        />

        {/* Success/Error indicator */}
        {(success || error) && !icon && (
          <span
            style={{
              position: 'absolute',
              right: sp.sm,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: sizeConfig.iconSize,
            }}
          >
            {success ? (theme === 'kids' ? '✅' : '✓') : (theme === 'kids' ? '❌' : '✕')}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && typeof error === 'string' && (
        <div style={errorStyle}>
          {theme === 'kids' ? '⚠️' : '!'} {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
