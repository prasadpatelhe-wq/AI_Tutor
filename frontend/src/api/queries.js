/**
 * React Query Hooks
 *
 * Custom hooks for data fetching with caching and automatic refetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { fetchBoards, fetchGrades, fetchSubjects } from '../meta';

// Query Keys
export const queryKeys = {
  boards: ['boards'],
  grades: ['grades'],
  subjects: ['subjects'],
  chapters: (subjectId) => ['chapters', subjectId],
  subchapters: (chapterId) => ['subchapters', chapterId],
  flashcards: (studentId) => ['flashcards', studentId],
  studentScore: (studentId) => ['studentScore', studentId],
  chatHistory: (studentId, subject) => ['chatHistory', studentId, subject],
};

// ============================================
// CURRICULUM QUERIES
// ============================================

export const useBoards = () => {
  return useQuery({
    queryKey: queryKeys.boards,
    queryFn: async () => {
      const response = await fetchBoards();
      return response.data || [];
    },
    staleTime: Infinity, // Boards rarely change
  });
};

export const useGrades = () => {
  return useQuery({
    queryKey: queryKeys.grades,
    queryFn: async () => {
      const response = await fetchGrades();
      return response.data || [];
    },
    staleTime: Infinity,
  });
};

export const useSubjects = () => {
  return useQuery({
    queryKey: queryKeys.subjects,
    queryFn: async () => {
      const response = await fetchSubjects();
      return response.data || [];
    },
    staleTime: Infinity,
  });
};

export const useChapters = (subjectId) => {
  return useQuery({
    queryKey: queryKeys.chapters(subjectId),
    queryFn: async () => {
      const response = await api.get(`/chapters/by_subject/${subjectId}`);
      return response.data || [];
    },
    enabled: !!subjectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubchapters = (chapterId) => {
  return useQuery({
    queryKey: queryKeys.subchapters(chapterId),
    queryFn: async () => {
      const response = await api.get(`/subchapters/${chapterId}`);
      return response.data || [];
    },
    enabled: !!chapterId,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// FLASHCARD QUERIES
// ============================================

export const useFlashcards = (studentId) => {
  return useQuery({
    queryKey: queryKeys.flashcards(studentId),
    queryFn: async () => {
      const response = await api.get(`/flashcards/get_flashcards_by_student?student_id=${studentId}`);
      return response.data || [];
    },
    enabled: !!studentId && studentId !== 'guest',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateFlashcardProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ flashcardId, grade, studentId }) => {
      const response = await api.post('/flashcards/update_progress', {
        flashcard_id: flashcardId,
        grade,
        student_id: studentId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate flashcards to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.flashcards(variables.studentId),
      });
    },
  });
};

// ============================================
// STUDENT QUERIES
// ============================================

export const useStudentScore = (studentId) => {
  return useQuery({
    queryKey: queryKeys.studentScore(studentId),
    queryFn: async () => {
      const response = await api.get(`/student_score/${studentId}`);
      return response.data;
    },
    enabled: !!studentId && studentId !== 'guest',
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// QUIZ MUTATIONS
// ============================================

export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: async ({ chapterId, subchapterId, subject, grade, studentId }) => {
      // First get chapter details
      const chapterResponse = await api.get(`/chapters/${chapterId}`);
      const chapter = chapterResponse.data;

      // Get subchapter if provided
      let subchapter = null;
      if (subchapterId) {
        const subchaptersResponse = await api.get(`/subchapters/${chapterId}`);
        subchapter = (subchaptersResponse.data || []).find(
          (sc) => String(sc.id) === String(subchapterId)
        );
      }

      // Generate quiz
      const response = await api.post(`/generate_quiz?student_id=${studentId}`, {
        subject,
        grade_band: grade,
        chapter_id: String(chapter.id),
        chapter_title: chapter.title || '',
        chapter_summary: chapter.summary || chapter.description || '',
        subchapter_id: subchapter ? String(subchapter.id) : undefined,
        subchapter_title: subchapter?.title || '',
        subchapter_summary: subchapter?.description || '',
        num_questions: 5,
        difficulty: 'basic',
      });

      return response.data;
    },
  });
};

export const useCalculateQuizScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ answers, questions, difficulty, chapterId, subjectId, studentId }) => {
      const correctAnswers = questions.map((q) => q.correct_option_index ?? q.correct ?? -1);
      const response = await api.post('/calculate_quiz_score', {
        answers,
        correct_answers: correctAnswers,
        difficulty: difficulty || 'basic',
        chapter_id: chapterId,
        subject_id: subjectId,
        student_id: studentId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate student score to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentScore(variables.studentId),
      });
      // Invalidate flashcards (quiz may create new ones)
      queryClient.invalidateQueries({
        queryKey: queryKeys.flashcards(variables.studentId),
      });
    },
  });
};

// ============================================
// CHAT MUTATIONS
// ============================================

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: async ({ message, subject, grade, studentId }) => {
      const response = await api.post('/chat_with_tutor', {
        message,
        subject: subject || 'General',
        grade: grade || '10th',
        student_id: studentId,
      });
      return response.data;
    },
  });
};

export const useChatHistory = (studentId, subject) => {
  return useQuery({
    queryKey: queryKeys.chatHistory(studentId, subject),
    queryFn: async () => {
      const response = await api.get(`/chat/history/${studentId}/${subject}`);
      return response.data || [];
    },
    enabled: !!studentId && studentId !== 'guest' && !!subject,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
