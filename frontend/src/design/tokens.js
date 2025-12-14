/**
 * AI Tutor Design Tokens
 *
 * Three distinctive themes:
 * - Candy Dreamland (Kids 1-4): Whimsical, playful, bubbly
 * - Neon Arcade (Teens 5-7): Gaming-inspired, cyberpunk, achievement-focused
 * - Premium Scholar (Mature 8-10): Sophisticated, minimal, elegant
 */

// === TYPOGRAPHY ===
export const fonts = {
  kids: {
    display: "'Baloo 2', cursive",
    body: "'Quicksand', sans-serif",
    accent: "'Bubblegum Sans', cursive",
  },
  teen: {
    display: "'Orbitron', sans-serif",
    body: "'Outfit', sans-serif",
    accent: "'Space Mono', monospace",
  },
  mature: {
    display: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
    accent: "'JetBrains Mono', monospace",
  },
};

// === COLOR PALETTES ===
export const colors = {
  kids: {
    // Candy Dreamland Palette
    primary: '#FF6B9D',
    primaryLight: '#FFB3C6',
    primaryDark: '#E91E63',
    secondary: '#00D4AA',
    secondaryLight: '#7FFFD4',
    accent1: '#FFE135',      // Sunshine yellow
    accent2: '#A855F7',      // Grape purple
    accent3: '#3B82F6',      // Bubble blue
    success: '#10B981',
    warning: '#FBBF24',
    error: '#EF4444',

    // Backgrounds
    bgPrimary: '#FFF5F8',
    bgSecondary: '#FFF0F5',
    bgCard: 'rgba(255, 255, 255, 0.95)',
    bgGradient: 'linear-gradient(135deg, #FFE5EC 0%, #E8F4FD 50%, #F3E8FF 100%)',
    bgHero: 'linear-gradient(180deg, #FFB6C1 0%, #FFE4E1 50%, #E6E6FA 100%)',

    // Text
    text: '#2D1B4E',
    textMuted: '#6B5B7A',
    textOnPrimary: '#FFFFFF',

    // Special effects
    glow: 'rgba(255, 107, 157, 0.5)',
    shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
  },

  teen: {
    // Neon Arcade Palette
    primary: '#00F5FF',       // Electric cyan
    primaryLight: '#67FFFF',
    primaryDark: '#00B8CC',
    secondary: '#FF00FF',     // Magenta
    secondaryLight: '#FF66FF',
    accent1: '#FFE500',       // Neon yellow
    accent2: '#39FF14',       // Matrix green
    accent3: '#FF3864',       // Hot pink
    success: '#39FF14',
    warning: '#FFE500',
    error: '#FF3864',

    // Backgrounds - Dark cyberpunk
    bgPrimary: '#0A0A0F',
    bgSecondary: '#12121A',
    bgCard: 'rgba(20, 20, 35, 0.9)',
    bgGradient: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
    bgHero: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)',

    // Text
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    textOnPrimary: '#0A0A0F',

    // Special effects
    glow: 'rgba(0, 245, 255, 0.6)',
    scanlines: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
    grid: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
  },

  mature: {
    // Premium Scholar Palette
    primary: '#C9A227',       // Royal gold
    primaryLight: '#E5C158',
    primaryDark: '#9A7B0A',
    secondary: '#1E3A5F',     // Deep navy
    secondaryLight: '#2E5A8F',
    accent1: '#059669',       // Emerald
    accent2: '#7C3AED',       // Violet
    accent3: '#DC2626',       // Ruby
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',

    // Backgrounds - Sophisticated dark
    bgPrimary: '#0F0F12',
    bgSecondary: '#18181B',
    bgCard: 'rgba(24, 24, 27, 0.95)',
    bgGradient: 'linear-gradient(135deg, #0F0F12 0%, #1C1C22 100%)',
    bgHero: 'linear-gradient(180deg, #0F0F12 0%, #1A1A1F 100%)',

    // Text
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    textOnPrimary: '#0F0F12',

    // Special effects
    glow: 'rgba(201, 162, 39, 0.3)',
    noise: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
  },
};

// === SPACING & SIZING ===
export const spacing = {
  kids: {
    xs: '8px',
    sm: '12px',
    md: '20px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
  },
  teen: {
    xs: '6px',
    sm: '10px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '56px',
  },
  mature: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
};

// === BORDER RADIUS ===
export const radius = {
  kids: {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    full: '9999px',
  },
  teen: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  mature: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
};

// === SHADOWS ===
export const shadows = {
  kids: {
    sm: '0 4px 12px rgba(255, 107, 157, 0.2)',
    md: '0 8px 24px rgba(255, 107, 157, 0.25)',
    lg: '0 16px 48px rgba(255, 107, 157, 0.3)',
    glow: '0 0 40px rgba(255, 107, 157, 0.4)',
    card: '0 20px 60px rgba(45, 27, 78, 0.15)',
    float: '0 30px 80px rgba(255, 107, 157, 0.25)',
  },
  teen: {
    sm: '0 4px 12px rgba(0, 245, 255, 0.15)',
    md: '0 8px 24px rgba(0, 245, 255, 0.2)',
    lg: '0 16px 48px rgba(0, 0, 0, 0.5)',
    glow: '0 0 60px rgba(0, 245, 255, 0.4), 0 0 120px rgba(255, 0, 255, 0.2)',
    card: '0 0 30px rgba(0, 245, 255, 0.1), inset 0 0 60px rgba(0, 245, 255, 0.03)',
    neon: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
  },
  mature: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 30px rgba(201, 162, 39, 0.2)',
    card: '0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2)',
    elegant: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
};

// === ANIMATIONS ===
export const animations = {
  kids: {
    duration: {
      fast: '0.2s',
      normal: '0.4s',
      slow: '0.6s',
    },
    easing: {
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  teen: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s',
    },
    easing: {
      glitch: 'steps(3, end)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  mature: {
    duration: {
      fast: '0.15s',
      normal: '0.25s',
      slow: '0.4s',
    },
    easing: {
      elegant: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'ease-out',
      precise: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  },
};

// === TYPOGRAPHY SCALES ===
export const typography = {
  kids: {
    h1: { size: '3rem', weight: 700, lineHeight: 1.2 },
    h2: { size: '2.25rem', weight: 700, lineHeight: 1.3 },
    h3: { size: '1.75rem', weight: 600, lineHeight: 1.4 },
    h4: { size: '1.5rem', weight: 600, lineHeight: 1.4 },
    body: { size: '1.125rem', weight: 500, lineHeight: 1.6 },
    small: { size: '1rem', weight: 500, lineHeight: 1.5 },
    tiny: { size: '0.875rem', weight: 500, lineHeight: 1.5 },
  },
  teen: {
    h1: { size: '2.5rem', weight: 700, lineHeight: 1.1 },
    h2: { size: '2rem', weight: 600, lineHeight: 1.2 },
    h3: { size: '1.5rem', weight: 600, lineHeight: 1.3 },
    h4: { size: '1.25rem', weight: 600, lineHeight: 1.4 },
    body: { size: '1rem', weight: 400, lineHeight: 1.6 },
    small: { size: '0.875rem', weight: 400, lineHeight: 1.5 },
    tiny: { size: '0.75rem', weight: 500, lineHeight: 1.5 },
  },
  mature: {
    h1: { size: '2.25rem', weight: 600, lineHeight: 1.2 },
    h2: { size: '1.75rem', weight: 600, lineHeight: 1.25 },
    h3: { size: '1.375rem', weight: 500, lineHeight: 1.35 },
    h4: { size: '1.125rem', weight: 500, lineHeight: 1.4 },
    body: { size: '0.9375rem', weight: 400, lineHeight: 1.7 },
    small: { size: '0.8125rem', weight: 400, lineHeight: 1.6 },
    tiny: { size: '0.75rem', weight: 400, lineHeight: 1.5 },
  },
};

// === ICONS & DECORATIONS ===
export const icons = {
  kids: {
    home: '🏠',
    quiz: '🎯',
    video: '📺',
    rewards: '🎁',
    chat: '💬',
    parent: '👨‍👩‍👧',
    flashcards: '🃏',
    coin: '🪙',
    star: '⭐',
    trophy: '🏆',
    fire: '🔥',
    heart: '💖',
    sparkle: '✨',
  },
  teen: {
    home: '⚡',
    quiz: '🎮',
    video: '📡',
    rewards: '💎',
    chat: '🤖',
    parent: '🔐',
    flashcards: '📱',
    coin: '💎',
    star: '⚡',
    trophy: '🏆',
    fire: '🔥',
    xp: '⚡',
    level: '🎯',
  },
  mature: {
    home: '◈',
    quiz: '◉',
    video: '▶',
    rewards: '★',
    chat: '◈',
    parent: '◈',
    flashcards: '◈',
    coin: '●',
    star: '★',
    trophy: '◆',
    check: '✓',
    arrow: '→',
  },
};

// === BREAKPOINTS ===
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};

export default {
  fonts,
  colors,
  spacing,
  radius,
  shadows,
  animations,
  typography,
  icons,
  breakpoints,
};
