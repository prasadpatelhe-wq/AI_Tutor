import React from 'react';

const ChapterSelectionView = ({ selectedDbChapter, setSelectedDbChapter, dbChapters, setCurrentScreen }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>📘 Select a Chapter</h2>

      <select
        className="kid-card"
        style={{ width: "80%", padding: "15px", marginTop: "20px" }}
        value={selectedDbChapter || ""}
        onChange={(e) => setSelectedDbChapter(e.target.value)}
      >
        <option value="">-- Choose a Chapter --</option>
        {dbChapters.map((ch) => (
          <option key={ch.id} value={ch.id}>{ch.title}</option>
        ))}
      </select>

      <button
        className="big-button"
        style={{ marginTop: "20px" }}
        disabled={!selectedDbChapter}
        onClick={() => setCurrentScreen("main")}
      >
        🚀 Start Learning!
      </button>
    </div>
  );
};

export default ChapterSelectionView;

