import React from 'react';

const SubchapterSelectionView = ({ selectedDbSubchapter, setSelectedDbSubchapter, dbSubchapters, onContinue }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>📚 Select a Subchapter</h2>

      <select
        className="kid-card"
        style={{ width: "80%", padding: "15px", marginTop: "20px" }}
        value={selectedDbSubchapter || ""}
        onChange={(e) => setSelectedDbSubchapter(e.target.value)}
      >
        <option value="">-- Choose a Subchapter --</option>
        {dbSubchapters.map((sc) => (
          <option key={sc.id} value={sc.id}>
            {sc.title}
          </option>
        ))}
      </select>

      <button
        className="big-button"
        style={{ marginTop: "20px" }}
        disabled={!selectedDbSubchapter}
        onClick={onContinue}
      >
        🚀 Continue
      </button>
    </div>
  );
};

export default SubchapterSelectionView;
