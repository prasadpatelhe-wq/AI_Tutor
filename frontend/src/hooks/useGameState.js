/**
 * useGameState - Game/Progress State Hook
 *
 * Manages coins, streaks, levels, and progress tracking
 */

import { useState, useCallback, useEffect } from 'react';
import { getStudentScore } from '../api';

const INITIAL_GAME_STATE = {
  coins: 100,
  total_score: 0,
  streak_days: 0,
  quizzes_completed: 0,
  current_level: 1,
  videos_watched: 0,
  flashcards_reviewed: 0,
  daily_progress: {
    quizzes: 0,
    videos: 0,
    flashcards: 0,
  },
};

const STORAGE_KEY = 'ai_tutor_game_state';

export const useGameState = (studentId) => {
  const [gameState, setGameState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...INITIAL_GAME_STATE, ...JSON.parse(stored) } : INITIAL_GAME_STATE;
    } catch {
      return INITIAL_GAME_STATE;
    }
  });
  const [loading, setLoading] = useState(false);

  // Persist game state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Load game state from server when studentId changes
  useEffect(() => {
    if (studentId && studentId !== 'guest') {
      loadFromServer(studentId);
    }
  }, [studentId]);

  const loadFromServer = async (id) => {
    setLoading(true);
    try {
      const scoreData = await getStudentScore(id);
      if (scoreData) {
        setGameState(prev => ({
          ...prev,
          coins: scoreData.coins ?? prev.coins,
          total_score: scoreData.total_score ?? prev.total_score,
          quizzes_completed: scoreData.quizzes_completed ?? prev.quizzes_completed,
          streak_days: scoreData.streak_days ?? prev.streak_days,
          current_level: scoreData.current_level ?? prev.current_level,
        }));
      }
    } catch (err) {
      console.error('Failed to load game state:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCoins = useCallback((amount, reason = '') => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount,
      total_score: prev.total_score + amount,
    }));
    if (reason) {
      console.log(`Earned ${amount} coins: ${reason}`);
    }
  }, []);

  const spendCoins = useCallback((amount) => {
    setGameState(prev => {
      if (prev.coins < amount) {
        console.warn('Not enough coins');
        return prev;
      }
      return {
        ...prev,
        coins: prev.coins - amount,
      };
    });
  }, []);

  const incrementQuizzesCompleted = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      quizzes_completed: prev.quizzes_completed + 1,
      daily_progress: {
        ...prev.daily_progress,
        quizzes: prev.daily_progress.quizzes + 1,
      },
    }));
  }, []);

  const incrementVideosWatched = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      videos_watched: prev.videos_watched + 1,
      daily_progress: {
        ...prev.daily_progress,
        videos: prev.daily_progress.videos + 1,
      },
    }));
  }, []);

  const incrementFlashcardsReviewed = useCallback((count = 1) => {
    setGameState(prev => ({
      ...prev,
      flashcards_reviewed: prev.flashcards_reviewed + count,
      daily_progress: {
        ...prev.daily_progress,
        flashcards: prev.daily_progress.flashcards + count,
      },
    }));
  }, []);

  const updateLevel = useCallback((level) => {
    setGameState(prev => ({
      ...prev,
      current_level: level,
    }));
  }, []);

  const updateStreak = useCallback((days) => {
    setGameState(prev => ({
      ...prev,
      streak_days: days,
    }));
  }, []);

  const resetDailyProgress = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      daily_progress: {
        quizzes: 0,
        videos: 0,
        flashcards: 0,
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    gameState,
    loading,
    addCoins,
    spendCoins,
    incrementQuizzesCompleted,
    incrementVideosWatched,
    incrementFlashcardsReviewed,
    updateLevel,
    updateStreak,
    resetDailyProgress,
    reset,
    refresh: () => studentId && loadFromServer(studentId),
  };
};

export default useGameState;
