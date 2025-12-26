/**
 * Game Store - Zustand
 *
 * Global game/progress state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStudentScore } from '../api';

const INITIAL_STATE = {
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

export const useGameStore = create(
  persist(
    (set, get) => ({
      // State
      ...INITIAL_STATE,
      loading: false,

      // Actions
      loadFromServer: async (studentId) => {
        if (!studentId || studentId === 'guest') return;
        set({ loading: true });
        try {
          const scoreData = await getStudentScore(studentId);
          if (scoreData) {
            set({
              coins: scoreData.coins ?? get().coins,
              total_score: scoreData.total_score ?? get().total_score,
              quizzes_completed: scoreData.quizzes_completed ?? get().quizzes_completed,
              streak_days: scoreData.streak_days ?? get().streak_days,
              current_level: scoreData.current_level ?? get().current_level,
              loading: false,
            });
          }
        } catch (err) {
          console.error('Failed to load game state:', err);
          set({ loading: false });
        }
      },

      addCoins: (amount, reason = '') => {
        set(state => ({
          coins: state.coins + amount,
          total_score: state.total_score + amount,
        }));
        if (reason) {
          console.log(`Earned ${amount} coins: ${reason}`);
        }
      },

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) {
          console.warn('Not enough coins');
          return false;
        }
        set({ coins: coins - amount });
        return true;
      },

      incrementQuizzesCompleted: () => {
        set(state => ({
          quizzes_completed: state.quizzes_completed + 1,
          daily_progress: {
            ...state.daily_progress,
            quizzes: state.daily_progress.quizzes + 1,
          },
        }));
      },

      incrementVideosWatched: () => {
        set(state => ({
          videos_watched: state.videos_watched + 1,
          daily_progress: {
            ...state.daily_progress,
            videos: state.daily_progress.videos + 1,
          },
        }));
      },

      incrementFlashcardsReviewed: (count = 1) => {
        set(state => ({
          flashcards_reviewed: state.flashcards_reviewed + count,
          daily_progress: {
            ...state.daily_progress,
            flashcards: state.daily_progress.flashcards + count,
          },
        }));
      },

      updateLevel: (level) => set({ current_level: level }),

      updateStreak: (days) => set({ streak_days: days }),

      resetDailyProgress: () => {
        set({
          daily_progress: {
            quizzes: 0,
            videos: 0,
            flashcards: 0,
          },
        });
      },

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'ai-tutor-game',
      partialize: (state) => ({
        coins: state.coins,
        total_score: state.total_score,
        streak_days: state.streak_days,
        quizzes_completed: state.quizzes_completed,
        current_level: state.current_level,
        videos_watched: state.videos_watched,
        flashcards_reviewed: state.flashcards_reviewed,
        daily_progress: state.daily_progress,
      }),
    }
  )
);

export default useGameStore;
