// Modern, Beautiful UI Styles
export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Fredoka+One:wght@400&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background:
        radial-gradient(circle at 20% 25%, rgba(123, 97, 255, 0.24) 0%, transparent 30%),
        radial-gradient(circle at 75% 15%, rgba(106, 231, 192, 0.16) 0%, transparent 32%),
        radial-gradient(circle at 50% 80%, rgba(255, 126, 207, 0.14) 0%, transparent 28%),
        linear-gradient(145deg, #0c1230 0%, #1a153f 50%, #0a081b 100%);
    background-attachment: fixed;
    min-height: 100vh;
    line-height: 1.6;
    overflow-x: hidden;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
}

/* Floating particles animation */
.container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 2px, transparent 2px);
    background-size: 50px 50px, 80px 80px, 120px 120px;
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(120deg); }
    66% { transform: translateY(-10px) rotate(240deg); }
}

.main-title {
    font-family: 'Fredoka One', cursive;
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    text-align: center;
    margin: 30px 0;
    animation: gradientFlow 3s ease-in-out infinite;
    text-shadow: 0 4px 8px rgba(0,0,0,0.1);
    letter-spacing: 2px;
}

@keyframes gradientFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

/* Button Styles */
.big-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 25px;
    font-weight: 600;
    font-size: 18px;
    padding: 18px 35px;
    border: none;
    box-shadow: 
        0 8px 32px rgba(102, 126, 234, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin: 10px;
    min-width: 180px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Poppins', sans-serif;
}

.big-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.big-button:hover::before {
    left: 100%;
}

.big-button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
        0 12px 40px rgba(102, 126, 234, 0.4),
        inset 0 1px 0 rgba(255,255,255,0.3);
}

.big-button:active {
    transform: translateY(-2px) scale(1.02);
}

.success-button {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
    color: white;
    border-radius: 25px;
    font-weight: 600;
    font-size: 18px;
    padding: 18px 35px;
    border: none;
    box-shadow: 
        0 8px 32px rgba(86, 171, 47, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    margin: 10px;
    min-width: 180px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.success-button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 40px rgba(86, 171, 47, 0.4);
}

.warning-button {
    background: linear-gradient(135deg, #ff7f50 0%, #ff6b6b 100%);
    color: white;
    border-radius: 25px;
    font-weight: 600;
    font-size: 18px;
    padding: 18px 35px;
    border: none;
    box-shadow: 
        0 8px 32px rgba(255, 107, 107, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    margin: 10px;
    min-width: 180px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.warning-button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
}

/* Card Styles */
.kid-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 30px;
    margin: 20px 10px;
    box-shadow: 
        0 20px 60px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
}

.kid-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 25px 25px 0 0;
}

.kid-card:hover {
    transform: translateY(-8px);
    box-shadow: 
        0 30px 80px rgba(0,0,0,0.15),
        inset 0 1px 0 rgba(255,255,255,0.9);
}

/* Glass landing (welcome) */
.glass-landing {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    overflow: hidden;
}
.glass-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.8;
    transform: translate3d(0,0,0);
    animation: floaty 12s ease-in-out infinite alternate;
    pointer-events: none;
}
.glass-bg-orb.orb-a { width: 420px; height: 420px; top: -80px; left: -120px; background: radial-gradient(circle at 30% 30%, rgba(123, 97, 255, 0.55), transparent 65%); }
.glass-bg-orb.orb-b { width: 360px; height: 360px; bottom: -120px; right: -80px; background: radial-gradient(circle at 60% 40%, rgba(106, 231, 192, 0.45), transparent 60%); animation-delay: 1s; }
.glass-bg-orb.orb-c { width: 280px; height: 280px; top: 20%; right: 22%; background: radial-gradient(circle at 50% 50%, rgba(255, 126, 207, 0.35), transparent 60%); animation-delay: 2s; }
.glass-hero {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 24px;
    padding: 20px;
    backdrop-filter: blur(18px);
    box-shadow:
        0 18px 40px rgba(0,0,0,0.35),
        0 0 0 1px rgba(255,255,255,0.05),
        inset 0 1px 0 rgba(255,255,255,0.2);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
}
.glass-hero-copy { max-width: 70%; }
.glass-hero-title {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(2rem, 4vw, 2.6rem);
    margin: 8px 0;
    color: #f5f1ff;
    letter-spacing: 0.5px;
}
.glass-hero-sub {
    color: #e2def5;
    max-width: 520px;
    line-height: 1.5;
    margin: 0;
}
.glass-hero-cta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
}
.glass-cta {
    min-width: 220px;
    font-size: 16px;
    letter-spacing: 0.2px;
    box-shadow: 0 18px 38px rgba(123, 97, 255, 0.45), 0 6px 16px rgba(0,0,0,0.25);
}
.glass-hero-footnote {
    color: #c7c2da;
    font-size: 13px;
    margin: 0 4px 0 0;
}
.glass-pill {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.2);
    color: #f5f5ff;
    font-size: 12px;
    letter-spacing: 0.3px;
}
.glass-strip {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
    align-items: stretch;
}
.glass-card-hero, .glass-card-auth {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 22px;
    padding: 20px 22px;
    box-shadow:
        0 18px 48px rgba(0,0,0,0.25),
        0 0 0 1px rgba(255,255,255,0.06),
        inset 0 1px 0 rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(18px);
}
.glass-card-hero h3, .glass-card-auth h3 {
    margin: 0 0 12px 0;
    color: #f2efff;
}
.glass-card-hero ul {
    margin: 0;
    padding-left: 18px;
    color: #e6e2f5;
    display: grid;
    gap: 8px;
}
.glass-card-auth {
    display: grid;
    gap: 12px;
}

/* Selection view */
.selection-shell {
    padding-top: 20px;
    position: relative;
}
.selection-title {
    text-align: center;
    margin-bottom: 16px;
    color: #f5f1ff;
    font-size: clamp(1.8rem, 3vw, 2.3rem);
    letter-spacing: 0.3px;
    font-weight: 800;
}
.selection-subtitle {
    text-align: center;
    color: #d5d1eb;
    margin: -4px auto 12px;
    max-width: 640px;
    font-size: 15px;
}
.selection-panel {
    max-width: 1040px;
    margin: 0 auto;
    padding: 18px;
    background: rgba(12, 16, 40, 0.4);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 30px;
    box-shadow:
        0 28px 70px rgba(0,0,0,0.4),
        0 0 0 1px rgba(255,255,255,0.03),
        inset 0 1px 0 rgba(255,255,255,0.08);
    backdrop-filter: blur(22px);
}
.selection-grid {
    max-width: 720px;
    margin: 0 auto;
    display: grid;
    gap: 14px;
}
.selection-veil {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.06), transparent 45%),
        radial-gradient(circle at 80% 10%, rgba(111, 207, 255, 0.07), transparent 40%);
    pointer-events: none;
}
.selection-card {
    padding: 16px 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow:
        0 18px 48px rgba(0,0,0,0.24),
        0 0 0 1px rgba(255,255,255,0.03),
        inset 0 1px 0 rgba(255,255,255,0.12);
    backdrop-filter: blur(14px);
    border-radius: 16px;
}
.selection-label {
    color: #f2efff;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.2px;
}
.selection-input {
    font-size: 15px;
    height: 48px;
    color: #f5f1ff;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    appearance: none;
    padding-left: 12px;
}
.selection-input option {
    background: #1b0f3a;
    color: #f5f1ff;
}
.selection-input-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
}
.selection-continue {
    min-width: 120px;
    height: 48px;
    font-size: 14px;
}
.selection-primary {
    border: none;
    border-radius: 16px;
    padding: 14px 18px;
    font-size: 15px;
    font-weight: 800;
    color: #0d0a1f;
    background: linear-gradient(135deg, #6ae7c0 0%, #7b61ff 60%, #b48cff 100%);
    box-shadow:
        0 16px 34px rgba(123, 97, 255, 0.35),
        0 8px 20px rgba(0,0,0,0.25);
    cursor: pointer;
    margin: 6px auto 0;
    width: 100%;
    transition: transform 0.18s ease, box-shadow 0.2s ease;
}
.selection-primary:hover {
    transform: translateY(-2px) scale(1.01);
}
.selection-status {
    text-align: center;
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #f5f1ff;
}
.selection-step {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #d5d1eb;
    font-size: 13px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}
.step-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7b61ff, #6ae7c0);
    box-shadow: 0 0 12px rgba(123, 97, 255, 0.6);
}
.glass-card-header {
    display: flex;
    gap: 10px;
    align-items: center;
}
.glass-input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #d5ddf3;
    background: #f8f9ff;
    font-size: 15px;
    outline: none;
    transition: border 0.2s ease, box-shadow 0.2s ease;
}
.glass-input:focus {
    border-color: #7c8cff;
    box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.2);
}
.glass-btn {
    border: none;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.glass-btn.primary {
    background: linear-gradient(120deg, #7B61FF, #9f7bff);
    color: #fff;
    box-shadow: 0 12px 32px rgba(123, 97, 255, 0.35);
}
.glass-btn.solid {
    background: linear-gradient(120deg, #ffb347, #ff6b6b);
    color: #fff;
    box-shadow: 0 12px 32px rgba(255, 107, 107, 0.35);
}
.glass-btn:hover {
    transform: translateY(-1px);
}
.glass-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}
.glass-status {
    margin: 4px 0 0;
    font-weight: 600;
    text-align: center;
}

@keyframes floaty {
    0% { transform: translate3d(0,0,0); }
    100% { transform: translate3d(12px, -10px, 0); }
}

@media (max-width: 900px) {
    .glass-layout {
        grid-template-columns: 1fr;
    }
    .glass-hero {
        flex-direction: column;
        align-items: flex-start;
    }
    .glass-hero-cta {
        align-items: flex-start;
    }
    .glass-landing {
        padding: 18px;
    }
}

.coin-display {
    background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
    color: #8B4513;
    font-size: 28px;
    font-weight: 700;
    padding: 20px 30px;
    border-radius: 50px;
    text-align: center;
    box-shadow: 
        0 10px 30px rgba(247, 151, 30, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.3);
    position: relative;
    overflow: hidden;
    animation: coinGlow 2s ease-in-out infinite alternate;
    font-family: 'Fredoka One', cursive;
    letter-spacing: 2px;
}

@keyframes coinGlow {
    0% { box-shadow: 0 10px 30px rgba(247, 151, 30, 0.3); }
    100% { box-shadow: 0 10px 40px rgba(247, 151, 30, 0.5); }
}

/* Tab Navigation */
.tab-nav {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    font-size: 16px;
    font-weight: 600;
    border-radius: 20px 20px 0 0;
    padding: 15px 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 5px;
    border: 1px solid rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
}

.tab-nav::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.tab-nav:hover::before {
    transform: scaleX(1);
}

.tab-nav.active {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(255,255,255,0.1);
}

.tab-nav.active::before {
    transform: scaleX(1);
}

.quiz-card {
    background: linear-gradient(135deg, rgba(255, 228, 225, 0.9), rgba(255, 240, 245, 0.9));
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 25px;
    margin: 15px 0;
    box-shadow: 0 10px 40px rgba(255, 105, 180, 0.1);
    border-left: 6px solid #ff69b4;
    transition: all 0.3s ease;
    cursor: pointer;
}

.quiz-card:hover {
    transform: translateX(10px);
    box-shadow: 0 15px 50px rgba(255, 105, 180, 0.2);
}

.attention-alert {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    font-size: 20px;
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
        transform: scale(1.05);
        box-shadow: 0 20px 60px rgba(255, 107, 107, 0.5);
    }
}

.parent-lock {
    background: linear-gradient(135deg, #8B4513, #A0522D);
    color: white;
    border-radius: 15px;
    padding: 20px;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
    transition: all 0.3s ease;
}

.parent-lock:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(139, 69, 19, 0.4);
}

.video-container {
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    background: #000;
    height: 450px;
    position: relative;
    border: 3px solid rgba(255,255,255,0.1);
}

.webcam-preview {
    width: 250px;
    height: 180px;
    border-radius: 20px;
    border: 3px solid rgba(102, 126, 234, 0.5);
    background: linear-gradient(135deg, #000 0%, #333 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    margin: 20px auto;
    transition: all 0.3s ease;
}

.webcam-preview:hover {
    transform: scale(1.05);
    border-color: rgba(102, 126, 234, 0.8);
}

/* Typography */
h1, h2, h3 {
    color: white;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
}

h1 { font-size: clamp(2rem, 4vw, 3rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
h3 { font-size: clamp(1.2rem, 2.5vw, 2rem); }

/* Input Styles */
input, select {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 15px;
    padding: 15px 20px;
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    margin: 10px 0;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
}

input:focus, select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
}

/* Layout Improvements */
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
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
}

.content-section {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 40px;
    margin: 20px 0;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}

.button-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px 0;
}

.chat-container {
    height: 400px;
    overflow-y: auto;
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 20px;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    margin: 20px 0;
}

.chat-message {
    margin: 15px 0;
    padding: 15px 20px;
    border-radius: 20px;
    max-width: 80%;
    word-wrap: break-word;
}

.chat-message.user {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    margin-left: auto;
    text-align: right;
}

.chat-message.assistant {
    background: rgba(255,255,255,0.9);
    color: #333;
    margin-right: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    .main-title {
        font-size: 2rem;
        margin: 20px 0;
    }
    
    .big-button, .success-button, .warning-button {
        font-size: 16px;
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
        padding: 12px 20px;
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
    
    .webcam-preview {
        width: 200px;
        height: 150px;
    }
    
    .video-container {
        height: 300px;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 1.5rem;
    }
    
    .big-button, .success-button, .warning-button {
        font-size: 14px;
        padding: 12px 20px;
        min-width: 120px;
    }
    
    .coin-display {
        font-size: 18px;
        padding: 12px 16px;
    }
    
    .content-section {
        padding: 20px;
    }
    
    .kid-card {
        padding: 15px;
    }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2, #667eea);
}

/* Loading Animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

/* Flashcard Flip Animation */
.flashcard-container {
    perspective: 1000px;
    cursor: pointer;
    width: 100%;
    height: 300px; /* Fixed height for consistency */
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
    border-radius: 25px;
    padding: 30px;
    box-shadow: 
        0 20px 60px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.flashcard-front {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
}

.flashcard-front::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 25px 25px 0 0;
}

.flashcard-back {
    background: linear-gradient(135deg, #fff 0%, #f0f2f5 100%);
    transform: rotateY(180deg);
    border: 2px solid #667eea;
}

/* Swipe Animations */
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutLeft {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(-100%); opacity: 0; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
}

.slide-in-left {
    animation: slideInLeft 0.3s ease-out forwards;
}

.slide-out-left {
    animation: slideOutLeft 0.3s ease-out forwards;
}

.slide-out-right {
    animation: slideOutRight 0.3s ease-out forwards;
}

.flashcard-wrapper {
    position: relative;
    width: 100%;
    max-width: 500px; /* Increased slightly for arrows */
    margin: 0 auto;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 2rem;
    padding: 10px 15px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
    backdrop-filter: blur(5px);
}

.nav-arrow:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%) scale(1.1);
}

.nav-arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.nav-arrow.left {
    left: -60px;
}

.nav-arrow.right {
    right: -60px;
}

@media (max-width: 600px) {
    .nav-arrow.left {
        left: 0;
    }
    .nav-arrow.right {
        right: 0;
    }
    .flashcard-wrapper {
        padding: 0 40px;
    }
}

.flashcard-stack {
    position: relative;
    width: 100%;
    max-width: 460px;
    height: 320px;
    margin: 0 auto;
}

.flashcard-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transition: transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease;
    pointer-events: none;
}

.flashcard-card.card-top {
    transform: translateY(0) scale(1);
    z-index: 4;
    opacity: 1;
    pointer-events: auto;
}

.flashcard-card.card-middle {
    transform: translateY(20px) scale(0.97);
    z-index: 3;
    opacity: 0.9;
}

.flashcard-card.card-back {
    transform: translateY(40px) scale(0.94);
    z-index: 2;
    opacity: 0.8;
}

.flashcard-card.card-prev {
    transform: translate(-60%, -10%) rotate(-4deg) scale(0.95);
    opacity: 0;
    z-index: 1;
}

.flashcard-card.card-hidden {
    opacity: 0;
    pointer-events: none;
}

.flashcard-card.swipe-left {
    transform: translate(-140%, -30px) rotate(-8deg);
    opacity: 0;
}

.flashcard-card.push-right {
    transform: translate(140%, -20px) rotate(8deg);
    opacity: 0;
}

.flashcard-card.card-prev.incoming {
    transform: translateY(0) scale(1);
    opacity: 1;
    z-index: 5;
}

.flashcard-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 25px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    pointer-events: none;
}

.flashcard-card.card-top::after {
    box-shadow: 0 25px 70px rgba(0,0,0,0.18);
}

@media (max-width: 600px) {
    .flashcard-stack {
        height: 280px;
    }
}
`;
