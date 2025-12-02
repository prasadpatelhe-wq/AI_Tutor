import React from 'react';

const SelectionView = ({
  userGrade,
  setUserGrade,
  userBoard,
  setUserBoard,
  userSubjectId,
  handleSubjectChange,
  subjects,
  setupLearning,
  selectionStatus
}) => {
  const availableSubjects = (subjects && subjects.length > 0)
    ? subjects
    : [
        { id: 'math', name: 'Math' },
        { id: 'science', name: 'Science' },
        { id: 'english', name: 'English' },
        { id: 'social', name: 'Social Studies' },
      ];

  const handleSubjectSelect = (e) => {
    handleSubjectChange(e);
  };

  return (
    <div className="content-section selection-shell">
      <div className="selection-veil"></div>
      <div className="selection-panel">
        <h2 className="selection-title">📚 Shape your learning path</h2>
        <p className="selection-subtitle">
          Tell us your grade, board, and subject so we can tailor your roadmap, quizzes, and flashcards.
        </p>

        <div className="selection-grid">
          <div className="glass-card-hero selection-card">
            <div className="selection-step">
              <span className="step-dot" /> Step 1
            </div>
            <label className="input-label selection-label">Select Class</label>
            <select
              value={userGrade || ''}
              onChange={(e) => setUserGrade(e.target.value)}
              className="glass-input selection-input"
            >
              <option value="">Choose your class/grade</option>
              {['1-4', '5-7', '8-10', '11-12'].map(g => (
                <option key={g} value={g}>Class {g}</option>
              ))}
            </select>
          </div>

          <div className="glass-card-hero selection-card">
            <div className="selection-step">
              <span className="step-dot" /> Step 2
            </div>
            <label className="input-label selection-label">Select Board</label>
            <select
              value={userBoard || ''}
              onChange={(e) => setUserBoard(e.target.value)}
              className="glass-input selection-input"
            >
              <option value="">Choose your board</option>
              {['CBSE', 'ICSE', 'State', 'IB'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="glass-card-hero selection-card">
            <div className="selection-step">
              <span className="step-dot" /> Step 3
            </div>
            <label className="input-label selection-label">Select Subject</label>
            <div className="glass-input-row selection-input-row">
              <select
                value={userSubjectId || ''}
                onChange={handleSubjectSelect}
                className="glass-input selection-input"
              >
                <option value="">🔬 What subject shall we explore?</option>
                {availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button className="glass-btn primary selection-continue" type="button" onClick={setupLearning}>
                Continue
              </button>
            </div>
          </div>

          <button className="selection-primary" onClick={setupLearning}>
            🌟 Begin My Learning Journey!
          </button>

          {selectionStatus && (
            <div className="selection-status">
              {selectionStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionView;
