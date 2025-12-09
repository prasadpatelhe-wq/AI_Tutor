/**
 * Theme Context for Grade-Based Dynamic Theming
 * 
 * Provides theme state and utilities to all components in the app.
 * Theme is determined by the logged-in student's grade level.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes, getThemeFromGrade } from './themes';

// Create the context
const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps the app and provides theme context to all children
 */
export const ThemeProvider = ({ children, gradeBand }) => {
    // Get initial theme based on grade
    const [currentTheme, setCurrentTheme] = useState(() => getThemeFromGrade(gradeBand));

    // Update theme when grade changes (e.g., after login)
    useEffect(() => {
        if (gradeBand) {
            const newTheme = getThemeFromGrade(gradeBand);
            setCurrentTheme(newTheme);
        }
    }, [gradeBand]);

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        theme: currentTheme,
        themeName: currentTheme.name,
        setTheme: (themeName) => {
            if (themes[themeName]) {
                setCurrentTheme(themes[themeName]);
            }
        },
        isKidsTheme: currentTheme.name === 'kids',
        isTeenTheme: currentTheme.name === 'teen',
        isMatureTheme: currentTheme.name === 'mature',
        // Utility to get specific theme values
        getColor: (colorName) => currentTheme.colors[colorName] || '#000',
        getFont: (fontType) => currentTheme.fonts[fontType] || currentTheme.fonts.primary,
        getRadius: (size) => currentTheme.borderRadius[size] || currentTheme.borderRadius.medium,
        getIcon: (iconName) => currentTheme.icons[iconName] || '•',
    }), [currentTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to use the theme context
 * @returns {object} Theme context value
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

/**
 * Generate CSS variables from current theme
 * @param {object} theme - Theme configuration object
 * @returns {string} CSS variables string
 */
export const generateThemeCSS = (theme) => {
    if (!theme) return '';

    return `
    :root {
      /* Colors */
      --theme-primary: ${theme.colors.primary};
      --theme-primary-hover: ${theme.colors.primaryHover};
      --theme-secondary: ${theme.colors.secondary};
      --theme-accent: ${theme.colors.accent};
      --theme-success: ${theme.colors.success};
      --theme-warning: ${theme.colors.warning};
      --theme-danger: ${theme.colors.danger};
      --theme-background: ${theme.colors.background};
      --theme-card-bg: ${theme.colors.cardBg};
      --theme-card-bg-alt: ${theme.colors.cardBgAlt};
      --theme-header-bg: ${theme.colors.headerBg};
      --theme-text: ${theme.colors.text};
      --theme-text-light: ${theme.colors.textLight};
      --theme-text-on-primary: ${theme.colors.textOnPrimary};
      
      /* Typography */
      --theme-font-primary: ${theme.fonts.primary};
      --theme-font-secondary: ${theme.fonts.secondary};
      --theme-font-size-base: ${theme.fonts.size.base};
      --theme-font-size-small: ${theme.fonts.size.small};
      --theme-font-size-large: ${theme.fonts.size.large};
      --theme-font-size-xlarge: ${theme.fonts.size.xlarge};
      --theme-font-size-title: ${theme.fonts.size.title};
      
      /* Border Radius */
      --theme-radius-small: ${theme.borderRadius.small};
      --theme-radius-medium: ${theme.borderRadius.medium};
      --theme-radius-large: ${theme.borderRadius.large};
      --theme-radius-pill: ${theme.borderRadius.pill};
      
      /* Shadows */
      --theme-shadow-card: ${theme.shadows.card};
      --theme-shadow-button: ${theme.shadows.button};
      --theme-shadow-hover: ${theme.shadows.hover};
      
      /* Animations */
      --theme-animation-duration: ${theme.animations.duration};
      --theme-animation-timing: ${theme.animations.timing};
      
      /* Buttons */
      --theme-button-padding: ${theme.buttons.padding};
      --theme-button-font-size: ${theme.buttons.fontSize};
      --theme-button-letter-spacing: ${theme.buttons.letterSpacing};
    }
  `;
};

export default ThemeContext;
