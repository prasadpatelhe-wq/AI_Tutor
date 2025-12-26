/**
 * useFlashcards - Flashcards Hook
 *
 * Manages flashcard data, due dates, and review state
 */

import { useState, useCallback, useMemo } from 'react';
import { api } from '../api';

export const useFlashcards = (studentId) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Review session state
  const [sessionActive, setSessionActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  // Computed values
  const dueFlashcards = useMemo(() =>
    flashcards.filter(f => new Date(f.due_date || f.next_review) <= new Date()),
    [flashcards]
  );

  const mistakeCards = useMemo(() =>
    flashcards.filter(f => f.mistake_count > 0 || f.ease_factor < 2.0),
    [flashcards]
  );

  const fetchFlashcards = useCallback(async () => {
    if (!studentId || studentId === 'guest') return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/flashcards/get_flashcards_by_student?student_id=${studentId}`);
      setFlashcards(response.data || []);
    } catch (err) {
      console.error('Failed to fetch flashcards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const updateProgress = useCallback(async (flashcardId, grade) => {
    try {
      await api.post('/flashcards/update_progress', {
        flashcard_id: flashcardId,
        grade,
        student_id: studentId,
      });
      // Refresh flashcards after update
      await fetchFlashcards();
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError(err.message);
    }
  }, [studentId, fetchFlashcards]);

  // Review session controls
  const startSession = useCallback(() => {
    setSessionActive(true);
    setCurrentIndex(0);
    setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 });
  }, []);

  const gradeCard = useCallback(async (grade) => {
    const currentCard = dueFlashcards[currentIndex];
    if (currentCard) {
      await updateProgress(currentCard.id, grade);
      setSessionResults(prev => ({ ...prev, [grade]: prev[grade] + 1 }));
    }

    if (currentIndex < dueFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session complete
      setSessionActive(false);
    }
  }, [currentIndex, dueFlashcards, updateProgress]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setCurrentIndex(0);
    setSessionResults({ again: 0, hard: 0, good: 0, easy: 0 });
  }, []);

  const isSessionComplete = sessionActive && currentIndex >= dueFlashcards.length;

  return {
    flashcards,
    dueFlashcards,
    mistakeCards,
    loading,
    error,
    fetchFlashcards,
    updateProgress,

    // Session
    sessionActive,
    currentIndex,
    sessionResults,
    currentCard: dueFlashcards[currentIndex],
    isSessionComplete,
    startSession,
    gradeCard,
    endSession,
  };
};

export default useFlashcards;
