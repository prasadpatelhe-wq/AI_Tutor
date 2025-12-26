/**
 * useChat - Chat Hook
 *
 * Manages chat messages, sending, and loading states
 */

import { useState, useCallback } from 'react';
import { chatWithTutor } from '../api';

export const useChat = ({ subject, grade, studentId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message?.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await chatWithTutor(
        message,
        subject || 'General',
        grade || '10th',
        studentId
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.response || response.message || "I couldn't generate a response.",
        citations: response.citations || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
      return { success: true, response: assistantMessage };
    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [subject, grade, studentId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addSystemMessage = useCallback((content) => {
    setMessages(prev => [...prev, { role: 'system', content }]);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    addSystemMessage,
    setMessages,
  };
};

export default useChat;
