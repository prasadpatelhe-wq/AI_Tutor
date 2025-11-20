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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
`;


