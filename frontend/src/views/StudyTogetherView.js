/**
 * StudyTogetherView - Core AI Chat Learning Interface
 *
 * Features:
 * - Empty state suggestions
 * - Student asks questions → AI answers with citations
 * - Actions: Make revision card, Try follow-up, Expand
 * - Off-topic handling with chapter switch suggestion
 * - Misconception loop (max 2 follow-ups)
 * - Save to flashcard (manual & auto)
 */

import React, { useState, useEffect, useRef } from 'react';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../design/designSystem';

// ============================================
// ICONS
// ============================================
const Icons = {
  Send: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  ),
  Bookmark: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  BookmarkFilled: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  ChevronDown: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronUp: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  AlertTriangle: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Lightbulb: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  RefreshCw: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  Maximize2: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
      <line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  ),
  Zap: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  CheckCircle: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ArrowRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Sparkles: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L14.09 8.26L20 9.27L15.55 14.14L16.91 20.02L12 16.77L7.09 20.02L8.45 14.14L4 9.27L9.91 8.26L12 2Z"/>
    </svg>
  ),
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Empty State with Suggestions
const EmptyState = ({ suggestions, onSuggestionClick }) => (
  <div style={styles.emptyState}>
    <div style={styles.emptyStateIcon}>
      <Icons.Sparkles size={40} color={colors.primary[400]} />
    </div>
    <h2 style={styles.emptyStateTitle}>Let's study together!</h2>
    <p style={styles.emptyStateDescription}>
      Ask me anything about this chapter. I'll help you understand concepts,
      give examples, and test your knowledge.
    </p>
    <div style={styles.suggestionsGrid}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          style={styles.suggestionCard}
          onClick={() => onSuggestionClick(suggestion)}
        >
          <span style={styles.suggestionEmoji}>{suggestion.emoji}</span>
          <span style={styles.suggestionText}>{suggestion.label}</span>
        </button>
      ))}
    </div>
  </div>
);

// Chat Message Bubble
const MessageBubble = ({
  message,
  isUser,
  citations,
  onSaveToFlashcard,
  onFollowUp,
  onExpand,
  saved,
}) => {
  const [citationsExpanded, setCitationsExpanded] = useState(false);

  return (
    <div style={{
      ...styles.messageBubble,
      ...(isUser ? styles.userMessage : styles.aiMessage),
    }}>
      {!isUser && (
        <div style={styles.aiAvatar}>
          <Icons.Sparkles size={16} color={colors.primary[500]} />
        </div>
      )}

      <div style={{
        ...styles.messageContent,
        ...(isUser ? styles.userMessageContent : styles.aiMessageContent),
      }}>
        <p style={styles.messageText}>{message}</p>

        {/* Citations Block (AI only) */}
        {!isUser && citations && citations.length > 0 && (
          <div style={styles.citationsBlock}>
            <button
              style={styles.citationsToggle}
              onClick={() => setCitationsExpanded(!citationsExpanded)}
            >
              <span style={styles.citationsLabel}>
                {citations.length} source{citations.length > 1 ? 's' : ''}
              </span>
              {citationsExpanded ? (
                <Icons.ChevronUp size={16} color={colors.neutral[500]} />
              ) : (
                <Icons.ChevronDown size={16} color={colors.neutral[500]} />
              )}
            </button>

            {citationsExpanded && (
              <div style={styles.citationsList}>
                {citations.map((citation, index) => (
                  <div key={index} style={styles.citationItem}>
                    <span style={styles.citationNumber}>{index + 1}</span>
                    <span style={styles.citationText}>{citation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons (AI only) */}
        {!isUser && (
          <div style={styles.messageActions}>
            <button
              style={{
                ...styles.actionButton,
                ...(saved ? styles.actionButtonSaved : {}),
              }}
              onClick={onSaveToFlashcard}
              disabled={saved}
            >
              {saved ? (
                <Icons.BookmarkFilled size={14} color={colors.primary[500]} />
              ) : (
                <Icons.Bookmark size={14} color={colors.neutral[500]} />
              )}
              <span>{saved ? 'Saved' : 'Make card'}</span>
            </button>
            <button style={styles.actionButton} onClick={onFollowUp}>
              <Icons.RefreshCw size={14} color={colors.neutral[500]} />
              <span>Follow-up</span>
            </button>
            <button style={styles.actionButton} onClick={onExpand}>
              <Icons.Maximize2 size={14} color={colors.neutral[500]} />
              <span>Expand</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Off-Topic Banner
const OffTopicBanner = ({ onSwitchChapter, onStayInChapter, suggestedTopics }) => (
  <div style={styles.offTopicBanner}>
    <div style={styles.offTopicHeader}>
      <Icons.AlertTriangle size={18} color={colors.warning} />
      <span style={styles.offTopicTitle}>This seems outside this chapter</span>
    </div>
    <p style={styles.offTopicDescription}>
      Would you like to switch to a different chapter or stay focused here?
    </p>
    <div style={styles.offTopicActions}>
      <button style={styles.offTopicSecondary} onClick={onStayInChapter}>
        Stay here
      </button>
      <button style={styles.offTopicPrimary} onClick={onSwitchChapter}>
        Switch chapter
        <Icons.ArrowRight size={14} color={colors.neutral[0]} />
      </button>
    </div>
    {suggestedTopics && suggestedTopics.length > 0 && (
      <div style={styles.suggestedTopics}>
        <span style={styles.suggestedLabel}>Related in this chapter:</span>
        {suggestedTopics.map((topic, index) => (
          <span key={index} style={styles.suggestedTopic}>{topic}</span>
        ))}
      </div>
    )}
  </div>
);

// Misconception Block
const MisconceptionBlock = ({
  misconception,
  correction,
  followUpQuestion,
  attemptCount,
  onAnswer,
  onSkip,
}) => (
  <div style={styles.misconceptionBlock}>
    <div style={styles.misconceptionHeader}>
      <Icons.Lightbulb size={18} color={colors.secondary[500]} />
      <span style={styles.misconceptionTitle}>Common trap detected</span>
    </div>

    <div style={styles.misconceptionContent}>
      <p style={styles.misconceptionText}>{correction}</p>

      {followUpQuestion && (
        <div style={styles.followUpSection}>
          <p style={styles.followUpQuestion}>{followUpQuestion}</p>
          <div style={styles.followUpActions}>
            <button style={styles.followUpButton} onClick={onAnswer}>
              Let me try
            </button>
            {attemptCount >= 2 && (
              <button style={styles.skipButton} onClick={onSkip}>
                Review later
              </button>
            )}
          </div>
        </div>
      )}
    </div>

    <div style={styles.misconceptionFooter}>
      <span style={styles.attemptCounter}>
        Attempt {attemptCount} of 2
      </span>
    </div>
  </div>
);

// Toast Notification
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div style={styles.toast}>
      <Icons.CheckCircle size={18} color={colors.success} />
      <span style={styles.toastMessage}>{message}</span>
    </div>
  );
};

// Typing Indicator
const TypingIndicator = () => (
  <div style={styles.typingIndicator}>
    <div style={styles.aiAvatar}>
      <Icons.Sparkles size={16} color={colors.primary[500]} />
    </div>
    <div style={styles.typingDots}>
      <span style={{ ...styles.typingDot, animationDelay: '0ms' }} />
      <span style={{ ...styles.typingDot, animationDelay: '150ms' }} />
      <span style={{ ...styles.typingDot, animationDelay: '300ms' }} />
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const StudyTogetherView = ({
  // Data
  chapter,
  subject,
  messages = [],
  selectedText = null, // Pre-attached excerpt from text mode
  // State
  isLoading = false,
  offTopicState = null,
  misconceptionState = null,
  // Callbacks
  onSendMessage,
  onSaveToFlashcard,
  onFollowUp,
  onExpand,
  onSwitchChapter,
  onStayInChapter,
  onMisconceptionAnswer,
  onMisconceptionSkip,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [savedMessages, setSavedMessages] = useState(new Set());
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Default suggestions
  const suggestions = [
    { emoji: '💡', label: 'Explain this topic', prompt: 'Can you explain the key concepts in this chapter?' },
    { emoji: '📝', label: 'Give me examples', prompt: 'Can you give me some real-world examples?' },
    { emoji: '❓', label: 'Ask me 5 questions', prompt: 'Ask me 5 questions to test my understanding' },
    { emoji: '📋', label: 'Summarize key points', prompt: 'Can you summarize the key points?' },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle send
  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage?.(inputValue.trim());
    setInputValue('');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onSendMessage?.(suggestion.prompt);
  };

  // Handle save to flashcard
  const handleSaveToFlashcard = (messageIndex, message) => {
    setSavedMessages(prev => new Set([...prev, messageIndex]));
    setToastMessage('Saved as a revision card ✓');
    setToastVisible(true);
    onSaveToFlashcard?.(message);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div style={styles.container}>
      {/* Selected Text Banner (from text mode) */}
      {selectedText && (
        <div style={styles.selectedTextBanner}>
          <span style={styles.selectedTextLabel}>Asking about:</span>
          <p style={styles.selectedTextContent}>"{selectedText}"</p>
        </div>
      )}

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {!hasMessages ? (
          <EmptyState
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <>
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <MessageBubble
                  message={msg.content}
                  isUser={msg.role === 'user'}
                  citations={msg.citations}
                  onSaveToFlashcard={() => handleSaveToFlashcard(index, msg)}
                  onFollowUp={() => onFollowUp?.(msg)}
                  onExpand={() => onExpand?.(msg)}
                  saved={savedMessages.has(index)}
                />

                {/* Off-topic banner after AI message */}
                {msg.role === 'assistant' && offTopicState && index === messages.length - 1 && (
                  <OffTopicBanner
                    onSwitchChapter={onSwitchChapter}
                    onStayInChapter={onStayInChapter}
                    suggestedTopics={offTopicState.suggestedTopics}
                  />
                )}

                {/* Misconception block after AI message */}
                {msg.role === 'assistant' && misconceptionState && index === messages.length - 1 && (
                  <MisconceptionBlock
                    misconception={misconceptionState.misconception}
                    correction={misconceptionState.correction}
                    followUpQuestion={misconceptionState.followUpQuestion}
                    attemptCount={misconceptionState.attemptCount}
                    onAnswer={onMisconceptionAnswer}
                    onSkip={onMisconceptionSkip}
                  />
                )}
              </React.Fragment>
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            style={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            rows={1}
          />
          <button
            style={{
              ...styles.sendButton,
              ...(inputValue.trim() ? styles.sendButtonActive : {}),
            }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          >
            <Icons.Send
              size={18}
              color={inputValue.trim() ? colors.neutral[0] : colors.neutral[400]}
            />
          </button>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '500px',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },

  // Selected Text Banner
  selectedTextBanner: {
    backgroundColor: colors.primary[50],
    padding: spacing[3],
    borderBottom: `1px solid ${colors.primary[100]}`,
  },

  selectedTextLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },

  selectedTextContent: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.primary[800],
    margin: `${spacing[1]} 0 0 0`,
    fontStyle: 'italic',
  },

  // Messages Area
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: spacing[8],
    flex: 1,
  },

  emptyStateIcon: {
    width: '72px',
    height: '72px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },

  emptyStateTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl[0],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
  },

  emptyStateDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    margin: `${spacing[2]} 0 ${spacing[6]} 0`,
    maxWidth: '280px',
    lineHeight: 1.6,
  },

  suggestionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[2],
    width: '100%',
    maxWidth: '320px',
  },

  suggestionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.neutral[0],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  suggestionEmoji: {
    fontSize: '1.5rem',
  },

  suggestionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[700],
    textAlign: 'center',
  },

  // Message Bubbles
  messageBubble: {
    display: 'flex',
    gap: spacing[2],
    maxWidth: '90%',
  },

  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },

  aiMessage: {
    alignSelf: 'flex-start',
  },

  aiAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },

  userMessageContent: {
    backgroundColor: colors.primary[500],
    padding: spacing[3],
    borderRadius: `${borderRadius.xl} ${borderRadius.xl} ${borderRadius.sm} ${borderRadius.xl}`,
  },

  aiMessageContent: {
    backgroundColor: colors.neutral[0],
    padding: spacing[4],
    borderRadius: `${borderRadius.xl} ${borderRadius.xl} ${borderRadius.xl} ${borderRadius.sm}`,
    border: `1px solid ${colors.neutral[200]}`,
  },

  messageText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    lineHeight: 1.6,
    margin: 0,
    color: 'inherit',
  },

  // Citations
  citationsBlock: {
    borderTop: `1px solid ${colors.neutral[100]}`,
    paddingTop: spacing[2],
    marginTop: spacing[2],
  },

  citationsToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },

  citationsLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
  },

  citationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    marginTop: spacing[2],
  },

  citationItem: {
    display: 'flex',
    gap: spacing[2],
  },

  citationNumber: {
    width: '20px',
    height: '20px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize['2xs'][0],
    color: colors.neutral[600],
    flexShrink: 0,
  },

  citationText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[600],
    lineHeight: 1.4,
  },

  // Message Actions
  messageActions: {
    display: 'flex',
    gap: spacing[2],
    marginTop: spacing[2],
    borderTop: `1px solid ${colors.neutral[100]}`,
    paddingTop: spacing[2],
  },

  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  actionButtonSaved: {
    backgroundColor: colors.primary[50],
    color: colors.primary[600],
  },

  // Off-topic Banner
  offTopicBanner: {
    backgroundColor: colors.warning + '15',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.warning}30`,
  },

  offTopicHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },

  offTopicTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
  },

  offTopicDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    margin: `0 0 ${spacing[3]} 0`,
  },

  offTopicActions: {
    display: 'flex',
    gap: spacing[2],
  },

  offTopicSecondary: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.lg,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[700],
    cursor: 'pointer',
  },

  offTopicPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    border: 'none',
    borderRadius: borderRadius.lg,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[0],
    cursor: 'pointer',
  },

  suggestedTopics: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTop: `1px solid ${colors.warning}20`,
  },

  suggestedLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
    width: '100%',
  },

  suggestedTopic: {
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.full,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[700],
  },

  // Misconception Block
  misconceptionBlock: {
    backgroundColor: colors.secondary[50],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.secondary[200]}`,
  },

  misconceptionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },

  misconceptionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.semibold,
    color: colors.secondary[700],
  },

  misconceptionContent: {
    marginBottom: spacing[3],
  },

  misconceptionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[800],
    margin: 0,
    lineHeight: 1.6,
  },

  followUpSection: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTop: `1px solid ${colors.secondary[200]}`,
  },

  followUpQuestion: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[700],
    margin: `0 0 ${spacing[3]} 0`,
    fontStyle: 'italic',
  },

  followUpActions: {
    display: 'flex',
    gap: spacing[2],
  },

  followUpButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.secondary[500],
    border: 'none',
    borderRadius: borderRadius.lg,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[0],
    cursor: 'pointer',
  },

  skipButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.lg,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[600],
    cursor: 'pointer',
  },

  misconceptionFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  attemptCounter: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs[0],
    color: colors.neutral[500],
  },

  // Typing Indicator
  typingIndicator: {
    display: 'flex',
    gap: spacing[2],
    alignSelf: 'flex-start',
  },

  typingDots: {
    display: 'flex',
    gap: spacing[1],
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral[200]}`,
  },

  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[400],
    animation: 'typingBounce 1s infinite',
  },

  // Input Area
  inputArea: {
    padding: spacing[4],
    backgroundColor: colors.neutral[0],
    borderTop: `1px solid ${colors.neutral[200]}`,
  },

  inputWrapper: {
    display: 'flex',
    gap: spacing[2],
    alignItems: 'flex-end',
  },

  input: {
    flex: 1,
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.neutral[50],
    border: `2px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.xl,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    color: colors.neutral[900],
    resize: 'none',
    outline: 'none',
    transition: `border-color ${transitions.duration.fast} ${transitions.easing.out}`,
  },

  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[200],
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${transitions.duration.fast} ${transitions.easing.out}`,
    flexShrink: 0,
  },

  sendButtonActive: {
    backgroundColor: colors.primary[500],
  },

  // Toast
  toast: {
    position: 'fixed',
    bottom: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.neutral[900],
    color: colors.neutral[0],
    padding: `${spacing[3]} ${spacing[5]}`,
    borderRadius: borderRadius.full,
    boxShadow: shadows.xl,
    animation: 'slideUp 0.3s ease-out',
    zIndex: 1000,
  },

  toastMessage: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#study-together-styles')) {
  styleSheet.id = 'study-together-styles';
  document.head.appendChild(styleSheet);
}

export default StudyTogetherView;
