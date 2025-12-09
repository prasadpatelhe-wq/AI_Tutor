/**
 * Dynamic Theme-Aware Styles Generator
 * 
 * Generates CSS styles based on the current theme (kids, teen, mature)
 */

import { themes } from './themes';

/**
 * Generate dynamic styles based on theme
 * @param {string} themeName - 'kids', 'teen', or 'mature'
 * @returns {string} CSS styles
 */
export const getThemedStyles = (themeName = 'teen') => {
    const theme = themes[themeName] || themes.teen;

    return `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Fredoka+One:wght@400&family=Inter:wght@300;400;500;600;700&family=Comic+Neue:wght@400;700&family=Rajdhani:wght@400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


body {
    font-family: ${theme.fonts.primary};
    background: url('/assets/${themeName === 'kids' ? 'kids_bg.png' : themeName === 'teen' ? 'teen_bg.png' : 'mature_bg.png'}') no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    line-height: 1.6;
    overflow-x: hidden;
    font-size: ${theme.fonts.size.base};
    color: ${theme.colors.text};
    transition: all 0.5s ease;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    z-index: 1;
}

/* Overlay for better text readability */
.container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${themeName === 'kids'
            ? 'rgba(255, 255, 255, 0.4)'
            : themeName === 'teen'
                ? 'rgba(19, 31, 36, 0.7)'
                : 'rgba(0, 0, 0, 0.6)'};
    pointer-events: none;
    z-index: -1;
    backdrop-filter: blur(3px);
}


/* Main Title */
.main-title {
    font-family: ${theme.fonts.primary};
    ${themeName === 'kids' ? `
    background: linear-gradient(135deg, #ff6b9d, #4ecdc4, #ffe66d, #ff6b6b);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientFlow 3s ease-in-out infinite;
    ` : themeName === 'teen' ? `
    background: linear-gradient(135deg, #667eea, #764ba2, #4fd1c5);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientFlow 4s ease-in-out infinite;
    ` : `
    color: ${theme.colors.text};
    `}
    font-size: ${theme.fonts.size.title};
    font-weight: 700;
    text-align: center;
    margin: 30px 0;
    letter-spacing: ${themeName === 'kids' ? '3px' : '1px'};
}

@keyframes gradientFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

/* Button Styles */
.big-button {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)'};
    color: ${theme.colors.textOnPrimary};
    border-radius: ${theme.borderRadius.pill};
    font-weight: 600;
    font-size: ${theme.buttons.fontSize};
    padding: ${theme.buttons.padding};
    border: none;
    box-shadow: ${theme.shadows.button};
    transition: all ${theme.animations.duration} ${theme.animations.timing};
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin: 10px;
    min-width: ${themeName === 'kids' ? '200px' : themeName === 'teen' ? '180px' : '160px'};
    text-transform: ${themeName === 'mature' ? 'none' : 'uppercase'};
    letter-spacing: ${theme.buttons.letterSpacing};
    font-family: ${theme.fonts.primary};
}

.big-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,${themeName === 'kids' ? '0.3' : '0.2'}), transparent);
    transition: left 0.5s;
}

.big-button:hover::before {
    left: 100%;
}

.big-button:hover {
    ${theme.animations.hover}
    box-shadow: ${theme.shadows.hover};
}

.big-button:active {
    transform: translateY(-2px) scale(${themeName === 'kids' ? '1.02' : '1.01'});
}

/* Success Button */
.success-button {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #7ED321 0%, #B8E986 100%)'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, #48bb78 0%, #68d391 100%)'
                : 'linear-gradient(135deg, #48BB78 0%, #276749 100%)'};
    color: ${theme.colors.textOnPrimary};
    border-radius: ${theme.borderRadius.pill};
    font-weight: 600;
    font-size: ${theme.buttons.fontSize};
    padding: ${theme.buttons.padding};
    border: none;
    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
    transition: all ${theme.animations.duration} ${theme.animations.timing};
    cursor: pointer;
    margin: 10px;
    min-width: ${themeName === 'kids' ? '200px' : '180px'};
    letter-spacing: ${theme.buttons.letterSpacing};
    font-family: ${theme.fonts.primary};
}

.success-button:hover {
    ${theme.animations.hover}
    box-shadow: 0 12px 35px rgba(72, 187, 120, 0.4);
}

/* Warning Button */
.warning-button {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #FFB74D 0%, #FF8A50 100%)'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                : 'linear-gradient(135deg, #ED8936 0%, #C05621 100%)'};
    color: ${theme.colors.textOnPrimary};
    border-radius: ${theme.borderRadius.pill};
    font-weight: 600;
    font-size: ${theme.buttons.fontSize};
    padding: ${theme.buttons.padding};
    border: none;
    box-shadow: 0 8px 25px rgba(237, 137, 54, 0.3);
    transition: all ${theme.animations.duration} ${theme.animations.timing};
    cursor: pointer;
    margin: 10px;
    font-family: ${theme.fonts.primary};
}

.warning-button:hover {
    ${theme.animations.hover}
    box-shadow: 0 12px 35px rgba(237, 137, 54, 0.4);
}

/* Card Styles */
.kid-card {
    background: ${theme.colors.cardBg};
    backdrop-filter: blur(20px);
    border-radius: ${theme.borderRadius.large};
    padding: ${themeName === 'kids' ? '35px' : themeName === 'teen' ? '30px' : '25px'};
    margin: 20px 10px;
    box-shadow: ${theme.shadows.card};
    border: 1px solid rgba(255,255,255,${themeName === 'mature' ? '0.05' : '0.2'});
    transition: all ${theme.animations.duration} ease;
    position: relative;
    overflow: hidden;
}

.kid-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${themeName === 'kids' ? '6px' : themeName === 'teen' ? '4px' : '2px'};
    background: ${themeName === 'kids'
            ? 'linear-gradient(90deg, #FF6B9D, #4ECDC4, #FFE66D)'
            : themeName === 'teen'
                ? 'linear-gradient(90deg, #667eea, #764ba2)'
                : theme.colors.accent};
    border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
}

.kid-card:hover {
    transform: translateY(${themeName === 'kids' ? '-10px' : themeName === 'teen' ? '-6px' : '-3px'});
    box-shadow: ${theme.shadows.hover};
}

/* Coin Display */
.coin-display {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #38B2AC 0%, #2C7A7B 100%)'};
    color: ${themeName === 'kids' ? '#8B4513' : theme.colors.textOnPrimary};
    font-size: ${themeName === 'kids' ? '28px' : themeName === 'teen' ? '24px' : '20px'};
    font-weight: 700;
    padding: ${themeName === 'kids' ? '20px 35px' : themeName === 'teen' ? '18px 30px' : '15px 25px'};
    border-radius: ${theme.borderRadius.pill};
    text-align: center;
    box-shadow: ${themeName === 'kids'
            ? '0 10px 30px rgba(255, 215, 0, 0.4)'
            : theme.shadows.button};
    position: relative;
    overflow: hidden;
    ${themeName === 'kids' ? 'animation: coinGlow 2s ease-in-out infinite alternate;' : ''}
    font-family: ${theme.fonts.primary};
    letter-spacing: 2px;
}

@keyframes coinGlow {
    0% { box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4); }
    100% { box-shadow: 0 15px 45px rgba(255, 215, 0, 0.6); }
}

/* Tab Navigation */
.tab-nav {
    background: ${themeName === 'mature' ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
    backdrop-filter: blur(10px);
    color: ${theme.colors.text};
    font-size: ${themeName === 'kids' ? '17px' : themeName === 'teen' ? '15px' : '14px'};
    font-weight: 600;
    border-radius: ${theme.borderRadius.medium} ${theme.borderRadius.medium} 0 0;
    padding: ${themeName === 'kids' ? '18px 28px' : '15px 22px'};
    cursor: pointer;
    transition: all ${theme.animations.duration} ease;
    margin: 0 ${themeName === 'kids' ? '8px' : '5px'};
    border: ${themeName === 'mature' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.1)'};
    position: relative;
    overflow: hidden;
    font-family: ${theme.fonts.primary};
}

.tab-nav::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${themeName === 'kids' ? '4px' : '3px'};
    background: ${themeName === 'kids'
            ? 'linear-gradient(90deg, #FF6B9D, #4ECDC4)'
            : themeName === 'teen'
                ? 'linear-gradient(90deg, #667eea, #764ba2)'
                : theme.colors.accent};
    transform: scaleX(0);
    transition: transform ${theme.animations.duration} ease;
}

.tab-nav:hover::before {
    transform: scaleX(1);
}

.tab-nav.active {
    background: rgba(255, 255, 255, ${themeName === 'mature' ? '0.1' : '0.2'});
    backdrop-filter: blur(15px);
    box-shadow: ${themeName === 'mature' ? 'none' : '0 8px 32px rgba(255,255,255,0.1)'};
}

.tab-nav.active::before {
    transform: scaleX(1);
}

/* Quiz Card */
.quiz-card {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, rgba(255, 228, 225, 0.95), rgba(255, 240, 245, 0.95))'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
                : 'rgba(255, 255, 255, 0.05)'};
    backdrop-filter: blur(10px);
    border-radius: ${theme.borderRadius.medium};
    padding: ${themeName === 'kids' ? '30px' : '25px'};
    margin: 15px 0;
    box-shadow: ${themeName === 'kids'
            ? '0 10px 40px rgba(255, 105, 180, 0.15)'
            : theme.shadows.card};
    border-left: ${themeName === 'kids' ? '8px' : '6px'} solid ${theme.colors.primary};
    transition: all ${theme.animations.duration} ease;
    cursor: pointer;
}

.quiz-card:hover {
    transform: translateX(${themeName === 'kids' ? '15px' : '10px'});
    box-shadow: ${theme.shadows.hover};
}

/* Input Styles */
input, select {
    background: ${themeName === 'mature'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.9)'};
    border: 2px solid ${themeName === 'mature'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(102, 126, 234, 0.3)'};
    border-radius: ${theme.borderRadius.medium};
    padding: ${themeName === 'kids' ? '18px 22px' : '15px 20px'};
    font-size: ${theme.fonts.size.base};
    font-weight: 500;
    width: 100%;
    margin: 10px 0;
    transition: all ${theme.animations.duration} ease;
    font-family: ${theme.fonts.primary};
    color: ${themeName === 'mature' ? theme.colors.text : '#333'};
}

input:focus, select:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 20px ${themeName === 'kids'
            ? 'rgba(255, 107, 157, 0.3)'
            : themeName === 'teen'
                ? 'rgba(102, 126, 234, 0.3)'
                : 'rgba(56, 178, 172, 0.3)'};
    transform: translateY(-2px);
}

/* Layout */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
}

.tab-container {
    display: flex;
    flex-wrap: wrap;
    gap: ${themeName === 'kids' ? '12px' : '10px'};
    margin-bottom: 30px;
    justify-content: center;
}

.content-section {
    background: ${themeName === 'mature'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(255, 255, 255, 0.1)'};
    backdrop-filter: blur(20px);
    border-radius: ${theme.borderRadius.large};
    padding: ${themeName === 'kids' ? '45px' : '40px'};
    margin: 20px 0;
    border: 1px solid rgba(255,255,255,${themeName === 'mature' ? '0.05' : '0.2'});
    box-shadow: ${theme.shadows.card};
}

.button-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px 0;
}

/* Chat Styles */
.chat-container {
    height: 400px;
    overflow-y: auto;
    border: 2px solid rgba(255,255,255,${themeName === 'mature' ? '0.1' : '0.2'});
    border-radius: ${theme.borderRadius.medium};
    padding: 20px;
    background: ${themeName === 'mature'
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255,255,255,0.05)'};
    backdrop-filter: blur(10px);
    margin: 20px 0;
}

.chat-message {
    margin: 15px 0;
    padding: 15px 20px;
    border-radius: ${theme.borderRadius.medium};
    max-width: 80%;
    word-wrap: break-word;
    font-size: ${theme.fonts.size.base};
}

.chat-message.user {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #FF6B9D, #FF8E53)'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : theme.colors.primary};
    color: ${theme.colors.textOnPrimary};
    margin-left: auto;
    text-align: right;
}

.chat-message.assistant {
    background: ${themeName === 'mature'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255,255,255,0.9)'};
    color: ${themeName === 'mature' ? theme.colors.text : '#333'};
    margin-right: auto;
}

/* Typography */
h1, h2, h3 {
    color: ${theme.colors.text};
    font-weight: 700;
    text-shadow: ${themeName === 'mature' ? 'none' : '0 2px 10px rgba(0,0,0,0.2)'};
    margin-bottom: 20px;
    font-family: ${theme.fonts.primary};
}

h1 { font-size: ${theme.fonts.size.title}; }
h2 { font-size: ${theme.fonts.size.xlarge}; }
h3 { font-size: ${theme.fonts.size.large}; }

/* Video Container */
.video-container {
    border-radius: ${theme.borderRadius.large};
    overflow: hidden;
    box-shadow: ${theme.shadows.card};
    background: #000;
    height: 450px;
    position: relative;
    border: ${themeName === 'kids' ? '4px' : '3px'} solid rgba(255,255,255,${themeName === 'mature' ? '0.05' : '0.1'});
}

/* Attention Alert */
.attention-alert {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #FF6B9D, #FF5252)'
            : 'linear-gradient(135deg, #fc8181, #f56565)'};
    color: ${theme.colors.textOnPrimary};
    border-radius: ${theme.borderRadius.medium};
    padding: ${themeName === 'kids' ? '35px' : '30px'};
    text-align: center;
    font-size: ${themeName === 'kids' ? '22px' : '20px'};
    font-weight: 600;
    animation: alertPulse 2s infinite;
    box-shadow: 0 15px 50px rgba(255, 107, 107, 0.3);
    border: 2px solid rgba(255,255,255,0.2);
}

@keyframes alertPulse {
    0%, 100% { 
        transform: scale(1);
        box-shadow: 0 15px 50px rgba(255, 107, 107, 0.3);
    }
    50% { 
        transform: scale(${themeName === 'kids' ? '1.05' : '1.02'});
        box-shadow: 0 20px 60px rgba(255, 107, 107, 0.5);
    }
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: ${themeName === 'kids'
            ? 'linear-gradient(135deg, #FF6B9D, #4ECDC4)'
            : themeName === 'teen'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : theme.colors.accent};
    border-radius: 4px;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    .main-title {
        font-size: calc(${theme.fonts.size.title} * 0.7);
        margin: 20px 0;
    }
    
    .big-button, .success-button, .warning-button {
        font-size: calc(${theme.buttons.fontSize} * 0.9);
        padding: 15px 25px;
        min-width: 150px;
    }
    
    .coin-display {
        font-size: 20px;
        padding: 15px 20px;
    }
    
    .kid-card {
        padding: 20px;
        margin: 15px 5px;
    }
    
    .content-section {
        padding: 25px;
    }
    
    .tab-nav {
        padding: 12px 18px;
        font-size: 14px;
    }
    
    .header-section {
        flex-direction: column;
        text-align: center;
    }
    
    .tab-container {
        flex-direction: column;
        align-items: center;
    }
    
    .button-group {
        flex-direction: column;
        align-items: center;
    }
    
    .video-container {
        height: 300px;
    }
}

/* Flashcard styles (theme-aware) */
.flashcard-container {
    perspective: 1000px;
    cursor: pointer;
    width: 100%;
    height: 300px;
}

.flashcard-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flashcard-inner.flipped {
    transform: rotateY(180deg);
}

.flashcard-front, .flashcard-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: ${theme.borderRadius.large};
    padding: 30px;
    box-shadow: ${theme.shadows.card};
    border: 1px solid rgba(255,255,255,0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.flashcard-front {
    background: ${theme.colors.cardBg};
    backdrop-filter: blur(20px);
}

.flashcard-front::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${themeName === 'kids'
            ? 'linear-gradient(90deg, #FF6B9D, #4ECDC4, #FFE66D)'
            : themeName === 'teen'
                ? 'linear-gradient(90deg, #667eea, #764ba2)'
                : theme.colors.accent};
    border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
}

.flashcard-back {
    background: ${themeName === 'mature'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'linear-gradient(135deg, #fff 0%, #f0f2f5 100%)'};
    transform: rotateY(180deg);
    border: 2px solid ${theme.colors.primary};
    color: ${themeName === 'mature' ? theme.colors.text : '#333'};
}

/* Flashcard stack and navigation */
.flashcard-stack {
    position: relative;
    width: 100%;
    max-width: 460px;
    height: 320px;
    margin: 0 auto;
}

.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: ${themeName === 'kids'
            ? 'rgba(255, 107, 157, 0.3)'
            : 'rgba(255, 255, 255, 0.2)'};
    border: none;
    color: ${theme.colors.text};
    font-size: ${themeName === 'kids' ? '2.5rem' : '2rem'};
    padding: 10px 15px;
    border-radius: 50%;
    cursor: pointer;
    transition: all ${theme.animations.duration} ease;
    z-index: 10;
    backdrop-filter: blur(5px);
}

.nav-arrow:hover:not(:disabled) {
    background: ${themeName === 'kids'
            ? 'rgba(255, 107, 157, 0.5)'
            : 'rgba(255, 255, 255, 0.4)'};
    transform: translateY(-50%) scale(1.1);
}

.nav-arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.nav-arrow.left { left: -60px; }
.nav-arrow.right { right: -60px; }

@media (max-width: 600px) {
    .nav-arrow.left { left: 0; }
    .nav-arrow.right { right: 0; }
    .flashcard-wrapper { padding: 0 40px; }
}

/* ==================== ENHANCED GLOBAL ANIMATIONS ==================== */

/* Bounce Animation */
@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    60% {
        transform: translateY(-10px);
    }
}

.bounce {
    animation: bounce 1s ease infinite;
}

/* Wobble Animation */
@keyframes wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
    75% { transform: rotate(-3deg); }
}

.wobble:hover {
    animation: wobble 0.5s ease;
}

/* Pulse Glow */
@keyframes pulseGlow {
    0%, 100% {
        box-shadow: 0 0 5px rgba(102, 126, 234, 0.4),
                    0 0 10px rgba(102, 126, 234, 0.3),
                    0 0 15px rgba(102, 126, 234, 0.2);
    }
    50% {
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.6),
                    0 0 20px rgba(102, 126, 234, 0.4),
                    0 0 30px rgba(102, 126, 234, 0.3);
    }
}

.pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
}

/* Shake Animation */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s ease;
}

/* Scale Pop */
@keyframes scalePop {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
}

.scale-pop {
    animation: scalePop 0.3s ease-out;
}

/* Ripple Effect for buttons */
.ripple {
    position: relative;
    overflow: hidden;
}

.ripple::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
}

.ripple:active::after {
    transform: scale(4);
    opacity: 1;
    transition: 0s;
}

/* Slide animations */
@keyframes slideInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInDown {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInLeft {
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.slide-in-up { animation: slideInUp 0.5s ease-out; }
.slide-in-down { animation: slideInDown 0.5s ease-out; }
.slide-in-left { animation: slideInLeft 0.5s ease-out; }
.slide-in-right { animation: slideInRight 0.5s ease-out; }

/* Rotate Animation */
@keyframes rotate360 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.rotate {
    animation: rotate360 1s linear infinite;
}

/* Heartbeat Animation */
@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.1); }
    28% { transform: scale(1); }
    42% { transform: scale(1.1); }
    70% { transform: scale(1); }
}

.heartbeat {
    animation: heartbeat 1.5s ease-in-out infinite;
}

/* Float Animation */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.float {
    animation: float 3s ease-in-out infinite;
}

/* Shimmer Effect */
@keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}

.shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
}

/* Loading Spinner */
@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-top-color: ${theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* Typing Animation */
@keyframes typing {
    0%, 60%, 100% { width: 0; }
    30% { width: 100%; }
}

/* Coin Flip */
@keyframes coinFlip {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
}

.coin-flip {
    animation: coinFlip 1s ease-in-out;
}

/* Confetti Fall */
@keyframes confettiFall {
    0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

/* Success Check Animation */
@keyframes successCheck {
    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
    50% { transform: scale(1.2) rotate(-45deg); }
    100% { transform: scale(1) rotate(-45deg); opacity: 1; }
}

/* Error Shake */
@keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
}

/* Enhanced Tab Hover */
.tab-nav:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Enhanced Button Animations */
.big-button:hover,
.success-button:hover,
.warning-button:hover {
    transform: translateY(-4px) scale(1.02);
}

.big-button:active,
.success-button:active,
.warning-button:active {
    transform: translateY(-2px) scale(1.01);
    transition: transform 0.1s ease;
}

/* Enhanced Card Interactions */
.kid-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.kid-card:hover {
    transform: translateY(-8px);
}

/* Focus States */
input:focus,
select:focus,
button:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primary}40;
}

/* Smooth Selection */
::selection {
    background: ${theme.colors.primary};
    color: white;
}

/* Tooltip Animation */
@keyframes tooltipAppear {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Progress Bar Animation */
@keyframes progressPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Achievement Unlock */
@keyframes achievementUnlock {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    50% { transform: scale(1.2) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.achievement-unlock {
    animation: achievementUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Stagger Animation Helper Classes */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }

/* Accessibility - Reduce Motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;
};

// Export default styles (teen theme as fallback)
export const styles = getThemedStyles('teen');

export default getThemedStyles;
