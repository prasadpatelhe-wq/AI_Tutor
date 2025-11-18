import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const FlashcardView = ({ chapterId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = 1; // static for now

  useEffect(() => {
    if (!chapterId) return;

    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/flashcards/chapter/${studentId}/${chapterId}`
        );

        setFlashcards(response.data || []);
        console.log("Loaded chapter-wise flashcards:", response.data);

      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [chapterId]);

  if (loading) {
    return <p style={{ color: "white" }}>Loading flashcards...</p>;
  }

  return (
    <div className="content-section">
      <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
        🃏 Flashcards for Chapter {chapterId}
      </h3>

      {flashcards.length === 0 ? (
        <p style={{ color: "white", textAlign: "center" }}>
          No flashcards found for this chapter.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {flashcards.map((card) => (
            <div key={card.id} className="kid-card" style={{ textAlign: "center" }}>
              <h4 style={{ color: "#667eea" }}>{card.question}</h4>
              <p>💡 {card.explanation}</p>
              <p>Difficulty: <strong>{card.difficulty}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
