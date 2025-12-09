import React, { useState, useEffect, useRef, useCallback } from 'react';
import soundManager from '../SoundManager';

const ChatView = ({
  userSubject,
  chatHistory,
  chatMessage,
  setChatMessage,
  chatWithTutor,
  loading,
  setChatHistory,
  theme = 'teen'
}) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setTheme(theme);
  }, [theme]);

  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'kids':
        return {
          primary: '#FF6B9D',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          cardBg: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          userBubble: 'linear-gradient(135deg, #FF6B9D, #FF8E53)',
          aiBubble: 'linear-gradient(135deg, #fff 0%, #fff5f7 100%)',
          aiTextColor: '#333',
          borderRadius: '25px',
          inputBg: 'rgba(255, 255, 255, 0.95)',
          shadowColor: 'rgba(255, 107, 157, 0.3)',
          sendButtonBg: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
        };
      case 'teen':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4fd1c5',
          cardBg: 'rgba(255, 255, 255, 0.1)',
          textColor: '#fff',
          userBubble: 'linear-gradient(135deg, #667eea, #764ba2)',
          aiBubble: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))',
          aiTextColor: '#333',
          borderRadius: '20px',
          inputBg: 'rgba(255, 255, 255, 0.1)',
          shadowColor: 'rgba(102, 126, 234, 0.4)',
          sendButtonBg: 'linear-gradient(135deg, #f7971e, #ffd200)',
        };
      case 'mature':
      default:
        return {
          primary: '#38B2AC',
          secondary: '#4A5568',
          accent: '#48BB78',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          textColor: '#E2E8F0',
          userBubble: 'linear-gradient(135deg, #38B2AC, #2C7A7B)',
          aiBubble: 'rgba(255, 255, 255, 0.08)',
          aiTextColor: '#E2E8F0',
          borderRadius: '12px',
          inputBg: 'rgba(255, 255, 255, 0.05)',
          shadowColor: 'rgba(56, 178, 172, 0.3)',
          sendButtonBg: 'linear-gradient(135deg, #38B2AC, #2C7A7B)',
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Animate typing dots
  useEffect(() => {
    if (loading.chat || isTyping) {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [loading.chat, isTyping]);

  // Sync chat history with animated state
  useEffect(() => {
    setDisplayedMessages(chatHistory);
  }, [chatHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [displayedMessages, loading.chat]);

  // Handle send message with animation
  const handleSend = useCallback(() => {
    if (chatMessage.trim() && !loading.chat) {
      soundManager.playClickSound();
      chatWithTutor(chatMessage);
    }
  }, [chatMessage, loading.chat, chatWithTutor]);

  // Handle keyboard shortcut
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestions
  const quickSuggestions = [
    `Explain a concept in ${userSubject}`,
    `Give me a practice problem`,
    `What are the key topics?`,
    `Help me understand better`
  ];

  return (
    <div className="content-section" style={{ position: 'relative' }}>
      {/* Keyframe Animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px ${themeStyles.shadowColor}; }
          50% { box-shadow: 0 0 30px ${themeStyles.shadowColor}; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes messageAppear {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes sendPulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        @keyframes inputGlow {
          0%, 100% { box-shadow: 0 0 0 3px transparent; }
          50% { box-shadow: 0 0 0 3px ${themeStyles.primary}40; }
        }
        
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${themeStyles.primary};
          margin: 0 3px;
          animation: typingBounce 1.4s ease-in-out infinite;
        }
        
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        .chat-input-container:focus-within {
          animation: inputGlow 2s ease-in-out infinite;
        }
        
        .quick-suggestion:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 15px ${themeStyles.shadowColor};
        }
      `}</style>

      {/* Header with gradient text */}
      <h3 style={{
        textAlign: 'center',
        marginBottom: '25px',
        background: theme !== 'mature'
          ? `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`
          : 'none',
        WebkitBackgroundClip: theme !== 'mature' ? 'text' : 'unset',
        WebkitTextFillColor: theme !== 'mature' ? 'transparent' : themeStyles.textColor,
        backgroundClip: theme !== 'mature' ? 'text' : 'unset',
        fontSize: theme === 'kids' ? '2rem' : '1.5rem',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        💬 Chat with Your AI Tutor
      </h3>

      <div className="kid-card" style={{
        animation: 'fadeInUp 0.6s ease-out',
        background: themeStyles.cardBg,
        backdropFilter: 'blur(20px)'
      }}>
        {/* Chat Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: `2px solid ${themeStyles.primary}20`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              animation: 'float 3s ease-in-out infinite',
              boxShadow: `0 4px 15px ${themeStyles.shadowColor}`
            }}>
              🤖
            </div>
            <div>
              <h4 style={{
                color: themeStyles.primary,
                margin: 0,
                fontSize: theme === 'kids' ? '1.2rem' : '1rem'
              }}>
                AI Tutor
              </h4>
              <span style={{
                fontSize: '0.8rem',
                color: loading.chat ? themeStyles.accent : (theme === 'mature' ? '#A0AEC0' : '#666'),
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {loading.chat ? (
                  <>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: themeStyles.accent,
                      animation: 'pulse 1s ease-in-out infinite'
                    }}></span>
                    Typing...
                  </>
                ) : (
                  <>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#48BB78'
                    }}></span>
                    Online • Ready to help with {userSubject}
                  </>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setChatHistory([]);
              soundManager.playClickSound();
            }}
            style={{
              background: 'rgba(245, 101, 101, 0.1)',
              border: '1px solid rgba(245, 101, 101, 0.3)',
              padding: '8px 16px',
              borderRadius: themeStyles.borderRadius,
              color: '#FC8181',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(245, 101, 101, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(245, 101, 101, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🧹 Clear
          </button>
        </div>

        {/* Chat Messages Container */}
        <div
          ref={chatContainerRef}
          className="chat-container"
          style={{
            height: '380px',
            overflowY: 'auto',
            padding: '20px',
            background: theme === 'mature' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            borderRadius: themeStyles.borderRadius,
            marginBottom: '20px',
            border: `1px solid ${themeStyles.primary}15`
          }}
        >
          {displayedMessages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              animation: 'fadeInUp 0.5s ease-out'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '20px',
                animation: 'float 3s ease-in-out infinite'
              }}>
                🎓
              </div>
              <h4 style={{
                color: themeStyles.primary,
                marginBottom: '15px',
                fontSize: theme === 'kids' ? '1.3rem' : '1.1rem'
              }}>
                Hi there! I'm your AI tutor
              </h4>
              <p style={{
                color: theme === 'mature' ? '#A0AEC0' : '#666',
                marginBottom: '25px',
                lineHeight: '1.6'
              }}>
                Ask me anything about <strong>{userSubject}</strong>!<br />
                I'm here to help you learn and understand better.
              </p>

              {/* Quick Suggestions */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center'
              }}>
                {quickSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="quick-suggestion"
                    onClick={() => {
                      setChatMessage(suggestion);
                      inputRef.current?.focus();
                      soundManager.playClickSound();
                    }}
                    style={{
                      background: `${themeStyles.primary}15`,
                      border: `1px solid ${themeStyles.primary}30`,
                      padding: '10px 18px',
                      borderRadius: '20px',
                      color: themeStyles.primary,
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.5s ease-out ${0.1 + i * 0.1}s both`
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {displayedMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '16px',
                    animation: `${msg.role === 'user' ? 'slideInRight' : 'slideInLeft'} 0.4s ease-out`
                  }}
                >
                  {/* AI Avatar */}
                  {msg.role === 'assistant' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px',
                      flexShrink: 0,
                      fontSize: '1rem'
                    }}>
                      🤖
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: '75%',
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user'
                      ? `${themeStyles.borderRadius} ${themeStyles.borderRadius} 8px ${themeStyles.borderRadius}`
                      : `${themeStyles.borderRadius} ${themeStyles.borderRadius} ${themeStyles.borderRadius} 8px`,
                    background: msg.role === 'user' ? themeStyles.userBubble : themeStyles.aiBubble,
                    color: msg.role === 'user' ? '#fff' : themeStyles.aiTextColor,
                    boxShadow: `0 4px 15px ${msg.role === 'user' ? themeStyles.shadowColor : 'rgba(0,0,0,0.1)'}`,
                    position: 'relative',
                    animation: 'messageAppear 0.3s ease-out'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '6px',
                      opacity: 0.8
                    }}>
                      {msg.role === 'user' ? '👤 You' : '🤖 AI Tutor'}
                    </div>
                    <p style={{
                      margin: 0,
                      lineHeight: '1.6',
                      fontSize: theme === 'kids' ? '1rem' : '0.95rem',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </p>
                  </div>

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${themeStyles.accent}, ${themeStyles.primary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '10px',
                      flexShrink: 0,
                      fontSize: '1rem'
                    }}>
                      👤
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {loading.chat && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animation: 'fadeInUp 0.3s ease-out'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    🤖
                  </div>
                  <div style={{
                    padding: '14px 20px',
                    background: themeStyles.aiBubble,
                    borderRadius: themeStyles.borderRadius,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Section */}
        <div
          className="chat-input-container"
          style={{
            display: 'flex',
            gap: '12px',
            padding: '15px',
            background: theme === 'mature' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
            borderRadius: themeStyles.borderRadius,
            border: inputFocused ? `2px solid ${themeStyles.primary}` : '2px solid transparent',
            transition: 'all 0.3s ease'
          }}
        >
          <input
            ref={inputRef}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={`Ask me about ${userSubject}... 🤔`}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: themeStyles.borderRadius,
              border: 'none',
              background: themeStyles.inputBg,
              color: theme === 'mature' ? themeStyles.textColor : '#333',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!chatMessage.trim() || loading.chat}
            style={{
              background: chatMessage.trim() && !loading.chat
                ? themeStyles.sendButtonBg
                : 'rgba(128,128,128,0.3)',
              border: 'none',
              padding: '14px 28px',
              borderRadius: themeStyles.borderRadius,
              color: chatMessage.trim() && !loading.chat
                ? (theme === 'teen' ? '#8B4513' : '#fff')
                : '#999',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: chatMessage.trim() && !loading.chat ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: chatMessage.trim() && !loading.chat
                ? `0 4px 20px ${themeStyles.shadowColor}`
                : 'none',
              animation: chatMessage.trim() && !loading.chat ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (chatMessage.trim() && !loading.chat) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            {loading.chat ? (
              <>
                <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>⏳</span>
                Sending...
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem' }}>📤</span>
                Send
              </>
            )}
          </button>
        </div>

        {/* Keyboard Hint */}
        <p style={{
          textAlign: 'center',
          marginTop: '12px',
          fontSize: '0.8rem',
          color: theme === 'mature' ? '#718096' : '#999',
          opacity: 0.8
        }}>
          Press <kbd style={{
            background: theme === 'mature' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>Enter</kbd> to send your message
        </p>
      </div>
    </div>
  );
};

export default ChatView;
