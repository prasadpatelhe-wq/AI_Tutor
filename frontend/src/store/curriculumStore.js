/**
 * Curriculum Store - Zustand
 *
 * Global curriculum selection state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCurriculumStore = create(
  persist(
    (set, get) => ({
      // Selection state
      selectedBoard: null,
      selectedGrade: null,
      selectedSubject: null,
      selectedChapter: null,

      // Recent chapters
      recentChapters: [],

      // Actions
      setSelectedBoard: (board) => set({ selectedBoard: board }),
      setSelectedGrade: (grade) => set({ selectedGrade: grade }),
      setSelectedSubject: (subject) => set({ selectedSubject: subject }),
      setSelectedChapter: (chapter) => set({ selectedChapter: chapter }),

      openChapter: (chapter, subjectName) => {
        const chapterName = chapter?.name || chapter?.title || 'Chapter';
        set(state => {
          const filtered = state.recentChapters.filter(r => r.chapterId !== chapter.id);
          return {
            selectedChapter: chapter,
            recentChapters: [
              {
                chapter: chapterName,
                subject: subjectName || state.selectedSubject?.name || 'Subject',
                lastAccessed: new Date().toISOString(),
                chapterId: chapter.id,
              },
              ...filtered,
            ].slice(0, 10),
          };
        });
      },

      clearSelection: () => set({
        selectedBoard: null,
        selectedGrade: null,
        selectedSubject: null,
        selectedChapter: null,
      }),

      getContext: () => {
        const state = get();
        if (!state.selectedBoard) return null;
        return {
          board: state.selectedBoard?.name || state.selectedBoard,
          grade: state.selectedGrade?.name || state.selectedGrade,
          subject: state.selectedSubject?.name || state.selectedSubject,
          chapter: state.selectedChapter?.name || state.selectedChapter?.title || state.selectedChapter,
        };
      },
    }),
    {
      name: 'ai-tutor-curriculum',
      partialize: (state) => ({
        selectedBoard: state.selectedBoard,
        selectedGrade: state.selectedGrade,
        selectedSubject: state.selectedSubject,
        recentChapters: state.recentChapters,
      }),
    }
  )
);

export default useCurriculumStore;
