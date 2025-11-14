import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const FlashcardView = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = 1; // static for now

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/flashcards/get_flashcards_by_student?student_id=${studentId}`
        );
        setFlashcards(response.data.flashcards || []);
        console.log("Loaded flashcards:", response.data.flashcards);

      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, []);

  if (loading) {
    return (
      <div className="content-section">
        <p style={{ color: "white", textAlign: "center" }}>
          Loading flashcards...
        </p>
      </div>
    );
  }
  console.log("✅ FlashcardView loaded successfully");

  return (
    <div className="content-section">
      <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
        🃏 Your Flashcards
      </h3>

      {flashcards.length === 0 ? (
        <p style={{ color: "white", textAlign: "center" }}>
          No flashcards found! Try completing a quiz first.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {flashcards.map((card, index) => (
            <div key={index} className="kid-card" style={{ textAlign: "center" }}>
              <h4 style={{ color: "#667eea", marginBottom: "10px" }}>
                {card.question_text}
              </h4>
              <p style={{ color: "#333", marginBottom: "8px" }}>
                💡 {card.explanation}
              </p>
              <p style={{ color: "#888" }}>
                Difficulty: <strong>{card.difficulty}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
