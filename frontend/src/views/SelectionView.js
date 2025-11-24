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
  return (
    <div className="content-section">
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>
        📚 Let's Set Up Your Learning Adventure! 📚
      </h2>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

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

