/**
 * Global Styles Generator
 * Creates comprehensive CSS with theme-specific variables and animations
 */

import { fonts, colors, spacing, radius, shadows, animations, typography } from './tokens';

// Google Fonts import string
export const fontImports = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Quicksand:wght@300;400;500;600;700&family=Bubblegum+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

export const generateGlobalStyles = (themeName) => {
  const theme = themeName || 'teen';
  const c = colors[theme];
  const f = fonts[theme];
  const s = spacing[theme];
  const r = radius[theme];
  const sh = shadows[theme];
  const an = animations[theme];
  const ty = typography[theme];

  return `
    ${fontImports}

    /* === CSS VARIABLES === */
    :root {
      --font-display: ${f.display};
      --font-body: ${f.body};
      --font-accent: ${f.accent};

      --color-primary: ${c.primary};
      --color-primary-light: ${c.primaryLight};
      --color-primary-dark: ${c.primaryDark};
      --color-secondary: ${c.secondary};
      --color-secondary-light: ${c.secondaryLight};
      --color-accent1: ${c.accent1};
      --color-accent2: ${c.accent2};
      --color-accent3: ${c.accent3};
      --color-success: ${c.success};
      --color-warning: ${c.warning};
      --color-error: ${c.error};

      --bg-primary: ${c.bgPrimary};
      --bg-secondary: ${c.bgSecondary};
      --bg-card: ${c.bgCard};
      --bg-gradient: ${c.bgGradient};
      --bg-hero: ${c.bgHero};

      --text-primary: ${c.text};
      --text-muted: ${c.textMuted};
      --text-on-primary: ${c.textOnPrimary};

      --shadow-sm: ${sh.sm};
      --shadow-md: ${sh.md};
      --shadow-lg: ${sh.lg};
      --shadow-glow: ${sh.glow};
      --shadow-card: ${sh.card};

      --radius-sm: ${r.sm};
      --radius-md: ${r.md};
      --radius-lg: ${r.lg};
      --radius-xl: ${r.xl};
      --radius-full: ${r.full};

      --space-xs: ${s.xs};
      --space-sm: ${s.sm};
      --space-md: ${s.md};
      --space-lg: ${s.lg};
      --space-xl: ${s.xl};
      --space-xxl: ${s.xxl};

      --duration-fast: ${an.duration.fast};
      --duration-normal: ${an.duration.normal};
      --duration-slow: ${an.duration.slow};
      --easing-smooth: ${an.easing.smooth};
    }

    /* === RESET & BASE === */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: var(--font-body);
      background: var(--bg-gradient);
      color: var(--text-primary);
      min-height: 100vh;
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* === KEYFRAME ANIMATIONS === */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-10px) rotate(2deg); }
      50% { transform: translateY(-20px) rotate(0deg); }
      75% { transform: translateY(-10px) rotate(-2deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: var(--shadow-glow); }
      50% { box-shadow: var(--shadow-lg), var(--shadow-glow); }
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes slide-up {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes slide-down {
      0% { transform: translateY(-30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes scale-in {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }

    @keyframes neon-flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        text-shadow:
          0 0 4px var(--color-primary),
          0 0 11px var(--color-primary),
          0 0 19px var(--color-primary);
      }
      20%, 24%, 55% {
        text-shadow: none;
      }
    }

    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes typing {
      0% { width: 0; }
      100% { width: 100%; }
    }

    @keyframes blink-caret {
      0%, 100% { border-color: transparent; }
      50% { border-color: var(--color-primary); }
    }

    @keyframes confetti-fall {
      0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }

    @keyframes coin-spin {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }

    @keyframes progress-fill {
      0% { width: 0%; }
      100% { width: var(--progress-value, 0%); }
    }

    @keyframes ripple {
      0% { transform: scale(0); opacity: 0.5; }
      100% { transform: scale(4); opacity: 0; }
    }

    @keyframes scan-line {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @keyframes glow-pulse {
      0%, 100% { filter: drop-shadow(0 0 5px var(--color-primary)); }
      50% { filter: drop-shadow(0 0 20px var(--color-primary)) drop-shadow(0 0 40px var(--color-secondary)); }
    }

    /* === THEME-SPECIFIC ANIMATIONS === */
    ${theme === 'kids' ? `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }

      @keyframes bubble-float {
        0%, 100% {
          transform: translateY(0) scale(1);
          border-radius: 50% 50% 50% 50%;
        }
        25% {
          transform: translateY(-15px) scale(1.05);
          border-radius: 55% 45% 55% 45%;
        }
        50% {
          transform: translateY(-25px) scale(1);
          border-radius: 50% 50% 50% 50%;
        }
        75% {
          transform: translateY(-10px) scale(1.02);
          border-radius: 45% 55% 45% 55%;
        }
      }

      @keyframes candy-spin {
        0% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(90deg) scale(1.1); }
        50% { transform: rotate(180deg) scale(1); }
        75% { transform: rotate(270deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }
    ` : ''}

    ${theme === 'teen' ? `
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }

      @keyframes cyber-scan {
        0% {
          background-position: 0 0;
          opacity: 0.1;
        }
        50% { opacity: 0.2; }
        100% {
          background-position: 0 100%;
          opacity: 0.1;
        }
      }

      @keyframes neon-border {
        0%, 100% {
          border-color: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary), inset 0 0 10px rgba(0,245,255,0.1);
        }
        50% {
          border-color: var(--color-secondary);
          box-shadow: 0 0 20px var(--color-secondary), inset 0 0 20px rgba(255,0,255,0.1);
        }
      }

      @keyframes data-stream {
        0% { background-position: 0 0; }
        100% { background-position: 0 -200px; }
      }
    ` : ''}

    ${theme === 'mature' ? `
      @keyframes subtle-glow {
        0%, 100% {
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        50% {
          box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 20px rgba(201,162,39,0.1);
        }
      }

      @keyframes elegant-reveal {
        0% {
          clip-path: inset(0 100% 0 0);
          opacity: 0;
        }
        100% {
          clip-path: inset(0 0 0 0);
          opacity: 1;
        }
      }

      @keyframes gold-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    ` : ''}

    /* === UTILITY CLASSES === */
    .text-display { font-family: var(--font-display); }
    .text-body { font-family: var(--font-body); }
    .text-accent { font-family: var(--font-accent); }

    .text-primary { color: var(--color-primary); }
    .text-secondary { color: var(--color-secondary); }
    .text-muted { color: var(--text-muted); }

    .bg-primary { background: var(--bg-primary); }
    .bg-secondary { background: var(--bg-secondary); }
    .bg-card { background: var(--bg-card); }
    .bg-gradient { background: var(--bg-gradient); }

    .rounded-sm { border-radius: var(--radius-sm); }
    .rounded-md { border-radius: var(--radius-md); }
    .rounded-lg { border-radius: var(--radius-lg); }
    .rounded-xl { border-radius: var(--radius-xl); }
    .rounded-full { border-radius: var(--radius-full); }

    .shadow-sm { box-shadow: var(--shadow-sm); }
    .shadow-md { box-shadow: var(--shadow-md); }
    .shadow-lg { box-shadow: var(--shadow-lg); }
    .shadow-glow { box-shadow: var(--shadow-glow); }

    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-bounce-in { animation: bounce-in 0.6s ease-out forwards; }
    .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
    .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }

    /* === SCROLLBAR STYLING === */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: var(--radius-full);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--color-primary);
      border-radius: var(--radius-full);
      border: 2px solid var(--bg-secondary);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-primary-dark);
    }

    /* === SELECTION STYLING === */
    ::selection {
      background: var(--color-primary);
      color: var(--text-on-primary);
    }

    /* === FOCUS STYLES === */
    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    /* === REDUCED MOTION === */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* === RESPONSIVE UTILITIES === */
    @media (max-width: 768px) {
      :root {
        --space-lg: ${theme === 'kids' ? '24px' : theme === 'teen' ? '20px' : '20px'};
        --space-xl: ${theme === 'kids' ? '32px' : theme === 'teen' ? '28px' : '24px'};
      }
    }

    /* === STAGGER ANIMATION DELAYS === */
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }
    .stagger-6 { animation-delay: 0.6s; }
    .stagger-7 { animation-delay: 0.7s; }
    .stagger-8 { animation-delay: 0.8s; }
  `;
};

export default generateGlobalStyles;
