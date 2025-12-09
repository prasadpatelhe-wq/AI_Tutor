/**
 * Grade-Based Theme Configuration
 * 
 * Three themes based on student grade levels:
 * - kids (Grade 1-4): Fun, colorful, playful
 * - teen (Grade 5-8): Modern, gaming-inspired
 * - mature (Grade 8-10): Clean, professional
 */

export const themes = {
    // Kids Theme (Grade 1-4) 🎨
    kids: {
        name: 'kids',
        displayName: '🎨 Fun Mode',

        // Colors
        colors: {
            primary: '#FF6B9D',
            primaryHover: '#FF4081',
            secondary: '#4ECDC4',
            accent: '#FFE66D',
            success: '#7ED321',
            warning: '#FFB74D',
            danger: '#FF5252',
            background: 'linear-gradient(135deg, #667eea 0%, #FF9A8B 50%, #FECFEF 100%)',
            cardBg: 'rgba(255, 255, 255, 0.95)',
            cardBgAlt: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0F7 100%)',
            headerBg: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
            text: '#333333',
            textLight: '#666666',
            textOnPrimary: '#ffffff',
        },

        // Typography
        fonts: {
            primary: "'Fredoka One', cursive",
            secondary: "'Comic Neue', cursive, sans-serif",
            size: {
                base: '18px',
                small: '16px',
                large: '24px',
                xlarge: '32px',
                title: '42px',
            },
        },

        // Shapes
        borderRadius: {
            small: '15px',
            medium: '25px',
            large: '35px',
            pill: '50px',
        },

        // Shadows
        shadows: {
            card: '0 15px 40px rgba(255, 107, 157, 0.25)',
            button: '0 8px 25px rgba(255, 107, 157, 0.4)',
            hover: '0 20px 50px rgba(255, 107, 157, 0.35)',
        },

        // Animations
        animations: {
            duration: '0.4s',
            timing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy
            hover: 'transform: translateY(-8px) scale(1.05) rotate(-2deg);',
        },

        // Button Styles
        buttons: {
            padding: '18px 35px',
            fontSize: '18px',
            letterSpacing: '1px',
        },

        // Decorations
        decorations: {
            enabled: true,
            particles: ['⭐', '🌟', '✨', '🎈', '🎉', '🌈', '🦋', '🌸'],
            confetti: true,
        },

        // Specific Component Styles
        header: {
            height: '70px',
            showMascot: true,
        },

        // Emojis for UI elements
        icons: {
            home: '🏠',
            quiz: '🎯',
            video: '📺',
            rewards: '🏆',
            chat: '💬',
            parent: '👨‍👩‍👧',
            flashcards: '🃏',
            coin: '🪙',
            star: '⭐',
            trophy: '🏆',
        },
    },

    // Teen Theme (Grade 5-8) 🎮
    teen: {
        name: 'teen',
        displayName: '🎮 Gamer Mode',

        // Colors
        colors: {
            primary: '#667eea',
            primaryHover: '#5a6fd6',
            secondary: '#764ba2',
            accent: '#4fd1c5',
            success: '#48bb78',
            warning: '#ed8936',
            danger: '#fc8181',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            cardBg: 'rgba(255, 255, 255, 0.1)',
            cardBgAlt: 'rgba(255, 255, 255, 0.05)',
            headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            text: '#ffffff',
            textLight: 'rgba(255, 255, 255, 0.8)',
            textOnPrimary: '#ffffff',
        },

        // Typography
        fonts: {
            primary: "'Poppins', sans-serif",
            secondary: "'Rajdhani', sans-serif",
            size: {
                base: '16px',
                small: '14px',
                large: '20px',
                xlarge: '28px',
                title: '36px',
            },
        },

        // Shapes
        borderRadius: {
            small: '10px',
            medium: '15px',
            large: '20px',
            pill: '30px',
        },

        // Shadows
        shadows: {
            card: '0 15px 40px rgba(102, 126, 234, 0.3)',
            button: '0 8px 25px rgba(102, 126, 234, 0.4)',
            hover: '0 20px 50px rgba(102, 126, 234, 0.5)',
        },

        // Animations
        animations: {
            duration: '0.3s',
            timing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth
            hover: 'transform: translateY(-5px) scale(1.02);',
        },

        // Button Styles
        buttons: {
            padding: '15px 30px',
            fontSize: '16px',
            letterSpacing: '0.5px',
        },

        // Decorations
        decorations: {
            enabled: true,
            particles: ['✨', '💫', '🔥', '⚡'],
            confetti: false,
            glowEffects: true,
        },

        // Specific Component Styles
        header: {
            height: '60px',
            showMascot: false,
        },

        // Emojis for UI elements
        icons: {
            home: '🏠',
            quiz: '🎯',
            video: '📺',
            rewards: '🏆',
            chat: '💬',
            parent: '👨‍👩‍👧‍👦',
            flashcards: '🃏',
            coin: '💎',
            star: '⚡',
            trophy: '🏆',
        },
    },

    // Mature Theme (Grade 8-10) 💼
    mature: {
        name: 'mature',
        displayName: '📚 Focus Mode',

        // Colors
        colors: {
            primary: '#4A5568',
            primaryHover: '#2D3748',
            secondary: '#718096',
            accent: '#38B2AC',
            success: '#48BB78',
            warning: '#ECC94B',
            danger: '#F56565',
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            cardBg: 'rgba(255, 255, 255, 0.05)',
            cardBgAlt: 'rgba(255, 255, 255, 0.03)',
            headerBg: '#1a202c',
            text: '#E2E8F0',
            textLight: '#A0AEC0',
            textOnPrimary: '#ffffff',
        },

        // Typography
        fonts: {
            primary: "'Inter', sans-serif",
            secondary: "'Roboto', sans-serif",
            size: {
                base: '15px',
                small: '13px',
                large: '18px',
                xlarge: '24px',
                title: '30px',
            },
        },

        // Shapes
        borderRadius: {
            small: '6px',
            medium: '8px',
            large: '12px',
            pill: '20px',
        },

        // Shadows
        shadows: {
            card: '0 4px 20px rgba(0, 0, 0, 0.3)',
            button: '0 4px 15px rgba(0, 0, 0, 0.2)',
            hover: '0 8px 30px rgba(0, 0, 0, 0.4)',
        },

        // Animations
        animations: {
            duration: '0.2s',
            timing: 'ease-out',
            hover: 'transform: translateY(-2px);',
        },

        // Button Styles
        buttons: {
            padding: '12px 24px',
            fontSize: '14px',
            letterSpacing: '0.3px',
        },

        // Decorations
        decorations: {
            enabled: false,
            particles: [],
            confetti: false,
            glowEffects: false,
        },

        // Specific Component Styles
        header: {
            height: '56px',
            showMascot: false,
        },

        // Icons (text-based for mature)
        icons: {
            home: '🏠',
            quiz: '📝',
            video: '▶️',
            rewards: '🎖️',
            chat: '💬',
            parent: '👤',
            flashcards: '📑',
            coin: '●',
            star: '★',
            trophy: '🏅',
        },
    },
};

/**
 * Get theme based on grade band
 * @param {string} gradeBand - e.g., "1-2", "3-5", "6-8", "9-10"
 * @returns {object} - Theme configuration
 */
export const getThemeFromGrade = (gradeBand) => {
    if (!gradeBand) return themes.teen; // Default

    const gradeStr = gradeBand.toString().toLowerCase();

    // Extract first number from grade band
    const firstNum = parseInt(gradeStr.match(/\d+/)?.[0] || '5');

    if (firstNum <= 4) {
        return themes.kids;
    } else if (firstNum <= 7) {
        return themes.teen;
    } else {
        return themes.mature;
    }
};

/**
 * Get theme name from grade band
 * @param {string} gradeBand
 * @returns {string} - 'kids', 'teen', or 'mature'
 */
export const getThemeNameFromGrade = (gradeBand) => {
    return getThemeFromGrade(gradeBand).name;
};

export default themes;
