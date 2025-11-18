import React, { createContext, useState, useEffect } from "react";

export const SyllabusContext = createContext();

export const SyllabusProvider = ({ children }) => {
  const [syllabus, setSyllabus] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [dbChapters, setDbChapters] = useState([]);
  const [selectedDbChapter, setSelectedDbChapter] = useState(null);


  // ✅ Now this only loads syllabus *data*, not upload again
  const loadSyllabus = (data) => {
    setSyllabus(data);
    setCurrentChapterIndex(0);
    localStorage.setItem("syllabus", JSON.stringify(data));
    localStorage.setItem("chapterIndex", "0");
  };

  const fetchChaptersFromDB = async (subjectId) => {
    const res = await fetch(`http://localhost:8000/chapters/by_subject/${subjectId}`);
    const data = await res.json();
  
    setDbChapters(data);
    setSelectedDbChapter(null);
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
      setSelectedDbChapter
    }}
    
    >
      {children}
    </SyllabusContext.Provider>
  );
};
