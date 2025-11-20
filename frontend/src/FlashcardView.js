import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const FlashcardView = ({ chapterId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
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
          {flashcards.map((card) => {
            const isFlipped = flippedCards[card.id];
            return (
              <div
                key={card.id}
                className="kid-card clickable"
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setFlippedCards((prev) => ({
                    ...prev,
                    [card.id]: !prev[card.id],
                  }));
                }}
              >
                <h4 style={{ color: "#667eea" }}>{card.question}</h4>
                {isFlipped ? (
                  <p>💡 {card.explanation}</p>
                ) : (
                  <p style={{ fontStyle: "italic", color: "#cbd5f5" }}>
                    Tap to reveal the answer
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
