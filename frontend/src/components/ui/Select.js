/**
 * Select Component
 * Beautiful dropdown select with theme-aware styling
 */

import React, { useState, forwardRef } from 'react';
import { colors, radius, shadows, animations, fonts, spacing } from '../../design/tokens';

const Select = forwardRef(({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  size = 'md',
  theme = 'teen',
  variant = 'default',
  error,
  disabled = false,
  icon,
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

  // Size configurations
  const sizes = {
    sm: {
      padding: `${sp.xs} ${sp.sm}`,
      fontSize: theme === 'kids' ? '0.95rem' : '0.875rem',
      height: theme === 'kids' ? '44px' : '40px',
    },
    md: {
      padding: `${sp.sm} ${sp.md}`,
      fontSize: theme === 'kids' ? '1.1rem' : '1rem',
      height: theme === 'kids' ? '56px' : '48px',
    },
    lg: {
      padding: `${sp.md} ${sp.lg}`,
      fontSize: theme === 'kids' ? '1.25rem' : '1.125rem',
      height: theme === 'kids' ? '68px' : '56px',
    },
  };

  const sizeConfig = sizes[size];

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return c.error;
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
        };

      case 'glass':
        return {
          background: theme === 'teen'
            ? 'rgba(20, 20, 35, 0.6)'
            : theme === 'kids'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(24, 24, 27, 0.6)',
          backdropFilter: 'blur(10px)',
        };

      default:
        return {
          background: theme === 'teen'
            ? 'rgba(255,255,255,0.08)'
            : theme === 'kids'
              ? '#fff'
              : 'rgba(255,255,255,0.05)',
        };
    }
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: sp.xs,
    fontFamily: f.body,
    fontSize: theme === 'kids' ? '1rem' : '0.875rem',
    fontWeight: 600,
    color: error ? c.error : c.text,
  };

  const selectWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const selectStyle = {
    width: '100%',
    height: sizeConfig.height,
    padding: sizeConfig.padding,
    paddingLeft: icon ? `calc(${sizeConfig.padding} + 28px)` : sizeConfig.padding,
    paddingRight: '40px', // Space for chevron
    fontFamily: f.body,
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    color: value ? c.text : c.textMuted,
    borderRadius: r.md,
    border: `2px solid ${getBorderColor()}`,
    outline: 'none',
    transition: `all ${an.duration.normal} ${an.easing.smooth}`,
    appearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    ...getVariantStyles(),
    boxShadow: isFocused
      ? theme === 'teen'
        ? `0 0 0 3px ${c.primary}30`
        : `0 0 0 3px ${c.primary}20`
      : 'none',
    ...style,
  };

  const iconStyle = {
    position: 'absolute',
    left: sp.sm,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    color: isFocused ? c.primary : c.textMuted,
    pointerEvents: 'none',
    transition: `color ${an.duration.fast} ease`,
  };

  // Custom chevron
  const chevronStyle = {
    position: 'absolute',
    right: sp.sm,
    top: '50%',
    transform: `translateY(-50%) ${isFocused ? 'rotate(180deg)' : 'rotate(0deg)'}`,
    transition: `transform ${an.duration.fast} ease`,
    pointerEvents: 'none',
    color: c.textMuted,
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

  return (
    <div className={`select-container ${className}`} style={containerStyle}>
      {/* Label */}
      {label && <label style={labelStyle}>{label}</label>}

      {/* Select wrapper */}
      <div style={selectWrapperStyle}>
        {/* Icon */}
        {icon && <span style={iconStyle}>{icon}</span>}

        {/* Select */}
        <select
          ref={ref}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          style={selectStyle}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option
              key={option.value || option.id || index}
              value={option.value || option.id}
            >
              {option.label || option.name || option}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <span style={chevronStyle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
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

Select.displayName = 'Select';

export default Select;
