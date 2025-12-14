/**
 * AI Tutor - New Design System
 * Aesthetic: Warm Neo-Brutalist meets Playful Learning
 *
 * Key principles:
 * - Bold geometric shapes with soft edges
 * - Warm, inviting color palette with electric accents
 * - Confident typography that scales with grade
 * - Purposeful whitespace and visual rhythm
 * - Tactile micro-interactions
 */

// ============================================
// COLOR TOKENS
// ============================================
export const colors = {
  // Primary palette
  primary: {
    50: '#e6f2f2',
    100: '#b3d9d9',
    200: '#80c0c0',
    300: '#4da6a6',
    400: '#268c8c',
    500: '#1a6b6b', // Main primary
    600: '#155a5a',
    700: '#104848',
    800: '#0b3636',
    900: '#062424',
  },

  // Accent - Electric Lime (CTAs, highlights)
  accent: {
    50: '#f8fde6',
    100: '#eefab3',
    200: '#e4f780',
    300: '#daf44d',
    400: '#c4f042', // Main accent
    500: '#a8d435',
    600: '#8cb82a',
    700: '#709c1f',
    800: '#548014',
    900: '#386409',
  },

  // Secondary - Warm Coral (alerts, emphasis)
  secondary: {
    50: '#fff0ee',
    100: '#ffd4cf',
    200: '#ffb8b0',
    300: '#ff9c91',
    400: '#ff8072',
    500: '#ff6b5b', // Main secondary
    600: '#e55a4a',
    700: '#cc4939',
    800: '#b23828',
    900: '#992717',
  },

  // Neutrals - Warm grays
  neutral: {
    0: '#ffffff',
    50: '#faf8f5',   // Background cream
    100: '#f5f2ed',
    200: '#e8e4dd',
    300: '#d4cfc5',
    400: '#b8b2a6',
    500: '#9c9587',
    600: '#807868',
    700: '#645c4a',
    800: '#48412c',
    900: '#1a1a1a',  // Text black
  },

  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Special surfaces
  glass: 'rgba(255, 255, 255, 0.7)',
  overlay: 'rgba(26, 26, 26, 0.5)',
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Font families - distinctive choices
  fontFamily: {
    display: '"Plus Jakarta Sans", "SF Pro Display", system-ui, sans-serif',
    body: '"DM Sans", "SF Pro Text", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", monospace',
  },

  // Font sizes with line heights
  fontSize: {
    '2xs': ['0.625rem', { lineHeight: '0.875rem' }],   // 10px
    xs: ['0.75rem', { lineHeight: '1rem' }],           // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],       // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],          // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],       // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],        // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],    // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
    '5xl': ['3rem', { lineHeight: '1.1' }],            // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],           // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],            // 72px
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================
// SPACING & SIZING
// ============================================
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
};

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',
};

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(26, 26, 26, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(26, 26, 26, 0.1), 0 1px 2px -1px rgba(26, 26, 26, 0.1)',
  md: '0 4px 6px -1px rgba(26, 26, 26, 0.1), 0 2px 4px -2px rgba(26, 26, 26, 0.1)',
  lg: '0 10px 15px -3px rgba(26, 26, 26, 0.1), 0 4px 6px -4px rgba(26, 26, 26, 0.1)',
  xl: '0 20px 25px -5px rgba(26, 26, 26, 0.1), 0 8px 10px -6px rgba(26, 26, 26, 0.1)',
  '2xl': '0 25px 50px -12px rgba(26, 26, 26, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(26, 26, 26, 0.05)',

  // Colored shadows
  primary: '0 4px 14px 0 rgba(26, 107, 107, 0.25)',
  accent: '0 4px 14px 0 rgba(196, 240, 66, 0.35)',
  secondary: '0 4px 14px 0 rgba(255, 107, 91, 0.25)',

  // Brutalist shadow (offset)
  brutal: '4px 4px 0 0 rgba(26, 26, 26, 1)',
  brutalSm: '2px 2px 0 0 rgba(26, 26, 26, 1)',
  brutalAccent: '4px 4px 0 0 rgba(196, 240, 66, 1)',
};

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  // Durations
  duration: {
    fastest: '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms',
  },

  // Easings
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
  overlay: 1700,
  max: 9999,
};

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// GRADE-BASED ADJUSTMENTS
// ============================================
export const gradeThemes = {
  // Kids (Grades 1-4): Larger, rounder, more playful
  kids: {
    scale: 1.15,
    borderRadius: borderRadius['2xl'],
    fontWeight: typography.fontWeight.bold,
    iconSize: '1.5rem',
    buttonPadding: `${spacing[4]} ${spacing[8]}`,
    animation: 'bouncy',
  },

  // Tween (Grades 5-7): Balanced, engaging
  tween: {
    scale: 1,
    borderRadius: borderRadius.lg,
    fontWeight: typography.fontWeight.semibold,
    iconSize: '1.25rem',
    buttonPadding: `${spacing[3]} ${spacing[6]}`,
    animation: 'smooth',
  },

  // Teen (Grades 8-10): Refined, minimal
  teen: {
    scale: 0.95,
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    iconSize: '1.125rem',
    buttonPadding: `${spacing[2.5]} ${spacing[5]}`,
    animation: 'subtle',
  },
};

// ============================================
// COMPONENT STYLES
// ============================================
export const componentStyles = {
  // Card styles
  card: {
    base: {
      backgroundColor: colors.neutral[0],
      borderRadius: borderRadius.xl,
      padding: spacing[6],
      border: `1px solid ${colors.neutral[200]}`,
    },
    elevated: {
      backgroundColor: colors.neutral[0],
      borderRadius: borderRadius.xl,
      padding: spacing[6],
      boxShadow: shadows.lg,
      border: 'none',
    },
    brutal: {
      backgroundColor: colors.neutral[0],
      borderRadius: borderRadius.md,
      padding: spacing[6],
      border: `2px solid ${colors.neutral[900]}`,
      boxShadow: shadows.brutal,
    },
    accent: {
      backgroundColor: colors.accent[400],
      borderRadius: borderRadius.xl,
      padding: spacing[6],
      border: `2px solid ${colors.neutral[900]}`,
      boxShadow: shadows.brutalSm,
    },
  },

  // Button styles
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.semibold,
      border: 'none',
      boxShadow: shadows.primary,
      transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
    },
    accent: {
      backgroundColor: colors.accent[400],
      color: colors.neutral[900],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.bold,
      border: `2px solid ${colors.neutral[900]}`,
      boxShadow: shadows.brutalSm,
      transition: `all ${transitions.duration.fast} ${transitions.easing.bounce}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[700],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      border: 'none',
      transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.semibold,
      border: `2px solid ${colors.primary[500]}`,
      transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
    },
  },

  // Input styles
  input: {
    base: {
      backgroundColor: colors.neutral[0],
      color: colors.neutral[900],
      padding: `${spacing[3]} ${spacing[4]}`,
      borderRadius: borderRadius.lg,
      border: `2px solid ${colors.neutral[200]}`,
      fontSize: typography.fontSize.base[0],
      transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
    },
    focus: {
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 3px ${colors.primary[100]}`,
    },
  },
};

// ============================================
// ANIMATION KEYFRAMES (as strings for injection)
// ============================================
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `,
  wiggle: `
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-3deg); }
      75% { transform: rotate(3deg); }
    }
  `,
};

// ============================================
// CSS VARIABLE GENERATOR
// ============================================
export const generateCSSVariables = () => `
  :root {
    /* Colors */
    --color-primary: ${colors.primary[500]};
    --color-primary-light: ${colors.primary[100]};
    --color-primary-dark: ${colors.primary[700]};
    --color-accent: ${colors.accent[400]};
    --color-accent-light: ${colors.accent[100]};
    --color-secondary: ${colors.secondary[500]};
    --color-secondary-light: ${colors.secondary[100]};

    /* Neutrals */
    --color-bg: ${colors.neutral[50]};
    --color-surface: ${colors.neutral[0]};
    --color-border: ${colors.neutral[200]};
    --color-text: ${colors.neutral[900]};
    --color-text-muted: ${colors.neutral[600]};
    --color-text-light: ${colors.neutral[400]};

    /* Semantic */
    --color-success: ${colors.success};
    --color-warning: ${colors.warning};
    --color-error: ${colors.error};
    --color-info: ${colors.info};

    /* Typography */
    --font-display: ${typography.fontFamily.display};
    --font-body: ${typography.fontFamily.body};
    --font-mono: ${typography.fontFamily.mono};

    /* Spacing */
    --space-1: ${spacing[1]};
    --space-2: ${spacing[2]};
    --space-3: ${spacing[3]};
    --space-4: ${spacing[4]};
    --space-6: ${spacing[6]};
    --space-8: ${spacing[8]};
    --space-12: ${spacing[12]};

    /* Radius */
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    --radius-2xl: ${borderRadius['2xl']};
    --radius-full: ${borderRadius.full};

    /* Shadows */
    --shadow-sm: ${shadows.sm};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
    --shadow-brutal: ${shadows.brutal};

    /* Transitions */
    --transition-fast: ${transitions.duration.fast};
    --transition-normal: ${transitions.duration.normal};
    --ease-out: ${transitions.easing.out};
    --ease-bounce: ${transitions.easing.bounce};
  }
`;

// ============================================
// GOOGLE FONTS IMPORT
// ============================================
export const googleFontsUrl = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  gradeThemes,
  componentStyles,
  keyframes,
  generateCSSVariables,
  googleFontsUrl,
};
