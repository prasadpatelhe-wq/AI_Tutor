import React from 'react';

const SelectionView = ({
  userGrade,
  setUserGrade,
  userBoard,
  setUserBoard,
  userSubjectId,
  handleSubjectChange,
  grades,
  boards,
  subjects,
  setupLearning,
  selectionStatus
}) => {
  return (
    <div className="content-section">
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>
        📚 Let's Set Up Your Learning Adventure! 📚
      </h2>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* --- GRADES LIST --- */}
        <div className="kid-card">
          <select value={userGrade} onChange={(e) => setUserGrade(e.target.value)}>
            <option value="">🎓 What grade are you in?</option>
            {grades.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* --- BOARDS LIST --- */}
        <div className="kid-card">
          <select value={userBoard} onChange={(e) => setUserBoard(e.target.value)}>
            <option value="">📖 Which board do you follow?</option>
            {boards.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* --- SUBJECT LIST --- */}
        <div className="kid-card">
          <select value={userSubjectId || ''} onChange={handleSubjectChange}>
            <option value="">🔬 What subject shall we explore?</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button className="big-button" onClick={setupLearning}>
            🌟 Begin My Learning Journey!
          </button>
        </div>

        {selectionStatus && (
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', fontWeight: '600', color: 'white' }}>
            {selectionStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionView;

