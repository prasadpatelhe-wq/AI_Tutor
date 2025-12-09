import React, { createContext, useState, useEffect } from "react";

export const SyllabusContext = createContext();

export const SyllabusProvider = ({ children }) => {
  const [syllabus, setSyllabus] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [dbChapters, setDbChapters] = useState([]);
  const [selectedDbChapter, setSelectedDbChapter] = useState(null);
  const [dbSubchapters, setDbSubchapters] = useState([]);
  const [selectedDbSubchapter, setSelectedDbSubchapter] = useState(null);


  // ✅ Now this only loads syllabus *data*, not upload again
  const loadSyllabus = (data) => {
    setSyllabus(data);
    setCurrentChapterIndex(0);
    localStorage.setItem("syllabus", JSON.stringify(data));
    localStorage.setItem("chapterIndex", "0");
  };

  const fetchChaptersFromDB = async (subjectId) => {
    try {
      const res = await fetch(`http://localhost:8000/chapters/by_subject/${subjectId}`);
      if (!res.ok) {
        // Gracefully handle 404/500 so consumers don't break on .map
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Failed to load chapters (status ${res.status})`);
      }

      const data = await res.json();
      const chaptersArray = Array.isArray(data) ? data : [];

      setDbChapters(chaptersArray);
      // Preselect first chapter if available; otherwise clear selection
      setSelectedDbChapter(chaptersArray[0]?.id || null);
      setDbSubchapters([]);
      setSelectedDbSubchapter(null);
      return chaptersArray;
    } catch (err) {
      console.error("fetchChaptersFromDB error:", err);
      setDbChapters([]);
      setSelectedDbChapter(null);
      setDbSubchapters([]);
      setSelectedDbSubchapter(null);
      throw err;
    }
  };

  const fetchSubchaptersFromDB = async (chapterId) => {
    try {
      const res = await fetch(`http://localhost:8000/subchapters/by_chapter/${chapterId}`);
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Failed to load subchapters (status ${res.status})`);
      }
      const data = await res.json();
      const subsArray = Array.isArray(data) ? data : [];
      setDbSubchapters(subsArray);
      setSelectedDbSubchapter(subsArray[0]?.id || null);
      return subsArray;
    } catch (err) {
      console.error("fetchSubchaptersFromDB error:", err);
      setDbSubchapters([]);
      setSelectedDbSubchapter(null);
      throw err;
    }
  };
  

  // 🔁 Move to next chapter
  const nextChapter = () => {
    if (syllabus && currentChapterIndex < syllabus.chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      localStorage.setItem("chapterIndex", nextIndex.toString());
    }
  };

  // 💾 Load saved progress from localStorage
  useEffect(() => {
    const savedSyllabus = localStorage.getItem("syllabus");
    const savedIndex = localStorage.getItem("chapterIndex");

    if (savedSyllabus) {
      setSyllabus(JSON.parse(savedSyllabus));
      setCurrentChapterIndex(Number(savedIndex) || 0);
    }
  }, []);

  const currentChapter = syllabus?.chapters?.[currentChapterIndex] || null;

  return (
    <SyllabusContext.Provider
    value={{
      syllabus,
      currentChapter,
      nextChapter,
      loadSyllabus,
      fetchChaptersFromDB,
      dbChapters,
      selectedDbChapter,
      setSelectedDbChapter,
      fetchSubchaptersFromDB,
      dbSubchapters,
      selectedDbSubchapter,
      setSelectedDbSubchapter,
    }}
    
    >
      {children}
    </SyllabusContext.Provider>
  );
};
