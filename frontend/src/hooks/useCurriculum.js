/**
 * useCurriculum - Curriculum Selection Hook
 *
 * Manages board, grade, subject, chapter selection state
 */

import { useState, useCallback, useEffect } from 'react';
import { fetchBoards, fetchGrades, fetchSubjects } from '../meta';
import { api } from '../api';

export const useCurriculum = () => {
  // Selection state
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Data state
  const [boards, setBoards] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subchapters, setSubchapters] = useState([]);

  // Recent chapters
  const [recentChapters, setRecentChapters] = useState(() => {
    try {
      const stored = localStorage.getItem('ai_tutor_recent_chapters');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Loading states
  const [loading, setLoading] = useState({
    boards: false,
    grades: false,
    subjects: false,
    chapters: false,
    subchapters: false,
  });

  // Persist recent chapters
  useEffect(() => {
    localStorage.setItem('ai_tutor_recent_chapters', JSON.stringify(recentChapters));
  }, [recentChapters]);

  // Load initial data
  useEffect(() => {
    loadDropdowns();
  }, []);

  // Load chapters when subject changes
  useEffect(() => {
    if (selectedSubject?.id) {
      fetchChapters(selectedSubject.id);
    } else {
      setChapters([]);
    }
  }, [selectedSubject]);

  // Load subchapters when chapter changes
  useEffect(() => {
    if (selectedChapter?.id) {
      fetchSubchapters(selectedChapter.id);
    } else {
      setSubchapters([]);
    }
  }, [selectedChapter]);

  const loadDropdowns = async () => {
    setLoading(prev => ({ ...prev, boards: true, grades: true, subjects: true }));
    try {
      const [boardsRes, gradesRes, subjectsRes] = await Promise.all([
        fetchBoards(),
        fetchGrades(),
        fetchSubjects(),
      ]);
      setBoards(boardsRes.data || []);
      setGrades(gradesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (err) {
      console.error('Failed to load dropdown data:', err);
    } finally {
      setLoading(prev => ({ ...prev, boards: false, grades: false, subjects: false }));
    }
  };

  const fetchChapters = async (subjectId) => {
    setLoading(prev => ({ ...prev, chapters: true }));
    try {
      const response = await api.get(`/chapters/by_subject/${subjectId}`);
      setChapters(response.data || []);
    } catch (err) {
      console.error('Failed to fetch chapters:', err);
      setChapters([]);
    } finally {
      setLoading(prev => ({ ...prev, chapters: false }));
    }
  };

  const fetchSubchapters = async (chapterId) => {
    setLoading(prev => ({ ...prev, subchapters: true }));
    try {
      const response = await api.get(`/subchapters/${chapterId}`);
      setSubchapters(response.data || []);
    } catch (err) {
      console.error('Failed to fetch subchapters:', err);
      setSubchapters([]);
    } finally {
      setLoading(prev => ({ ...prev, subchapters: false }));
    }
  };

  const getDisplayName = useCallback((item, fallback = '') => {
    if (!item) return fallback;
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    return item.name || item.title || item.label || item.chapter || fallback;
  }, []);

  const openChapter = useCallback((chapter) => {
    const chapterName = getDisplayName(chapter, 'Chapter');
    const subjectName = getDisplayName(selectedSubject, 'Subject');

    setSelectedChapter(chapter);

    setRecentChapters(prev => {
      const filtered = prev.filter(r => r.chapterId !== chapter.id);
      return [
        {
          chapter: chapterName,
          subject: subjectName,
          lastAccessed: new Date().toISOString(),
          chapterId: chapter.id,
        },
        ...filtered,
      ].slice(0, 10);
    });
  }, [selectedSubject, getDisplayName]);

  const clearSelection = useCallback(() => {
    setSelectedBoard(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setChapters([]);
    setSubchapters([]);
  }, []);

  const getContext = useCallback(() => {
    if (!selectedBoard) return null;
    return {
      board: getDisplayName(selectedBoard),
      grade: getDisplayName(selectedGrade),
      subject: getDisplayName(selectedSubject),
      chapter: getDisplayName(selectedChapter),
    };
  }, [selectedBoard, selectedGrade, selectedSubject, selectedChapter, getDisplayName]);

  return {
    // Selection
    selectedBoard,
    selectedGrade,
    selectedSubject,
    selectedChapter,
    setSelectedBoard,
    setSelectedGrade,
    setSelectedSubject,
    setSelectedChapter,

    // Data
    boards,
    grades,
    subjects,
    chapters,
    subchapters,
    recentChapters,

    // Loading
    loading,

    // Actions
    openChapter,
    clearSelection,
    getContext,
    getDisplayName,
    refresh: loadDropdowns,
  };
};

export default useCurriculum;
