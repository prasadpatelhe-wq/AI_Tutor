import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const FlashcardView = ({ chapterId, studentId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const CARD_ANIMATION_DURATION = 320;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextCard();
    } else if (isRightSwipe) {
      handlePrevCard();
    }
  };

  const handleNextCard = () => {
    if (isAnimating || currentIndex >= flashcards.length - 1) return;
    setTransitionDirection("next");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setTransitionDirection("");
      setIsAnimating(false);
    }, CARD_ANIMATION_DURATION);
  };

  const handlePrevCard = () => {
    if (isAnimating || currentIndex <= 0) return;
    setTransitionDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1);
      setTransitionDirection("");
      setIsAnimating(false);
    }, CARD_ANIMATION_DURATION);
  };

  // Bind handlers
  const handleTouchStart = onTouchStart;
  const handleTouchMove = onTouchMove;
  const handleTouchEnd = onTouchEnd;

  useEffect(() => {
    if (!chapterId) return;

    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/flashcards/chapter/${studentId}/${chapterId}`
        );

        const incomingCards = response.data || [];
        setFlashcards(incomingCards);
        setCurrentIndex(0);
        setFlippedCards({});
        setTransitionDirection("");
        setIsAnimating(false);
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

  const deckIndices = [
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
    currentIndex + 2,
  ].filter((idx) => idx >= 0 && idx < flashcards.length);

  const getCardPositionClass = (index) => {
    if (index === currentIndex) return "card-top";
    if (index === currentIndex + 1) return "card-middle";
    if (index === currentIndex + 2) return "card-back";
    if (index === currentIndex - 1) return "card-prev";
    return "card-hidden";
  };

  const getCardAnimationClass = (index) => {
    let classes = [getCardPositionClass(index)];
    if (index === currentIndex && transitionDirection === "next") {
      classes.push("swipe-left");
    }
    if (index === currentIndex && transitionDirection === "prev") {
      classes.push("push-right");
    }
    if (index === currentIndex - 1 && transitionDirection === "prev") {
      classes.push("incoming");
    }
    return classes.join(" ");
  };

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
          className="flashcard-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            className="nav-arrow left"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevCard();
            }}
            disabled={currentIndex === 0 || isAnimating}
          >
            ❮
          </button>

          <button
            className="nav-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              handleNextCard();
            }}
            disabled={currentIndex === flashcards.length - 1 || isAnimating}
          >
            ❯
          </button>

          <div className="flashcard-stack">
            {deckIndices.map((cardIndex) => {
              const card = flashcards[cardIndex];
              if (!card) return null;
              const isTopCard = cardIndex === currentIndex;
              const isFlipped = !!flippedCards[card.id];
              return (
                <div
                  key={card.id}
                  className={`flashcard-container flashcard-card ${getCardAnimationClass(
                    cardIndex
                  )}`}
                  onClick={() => {
                    if (!isTopCard || isAnimating) return;
                    setFlippedCards((prev) => ({
                      ...prev,
                      [card.id]: !prev[card.id],
                    }));
                  }}
                >
                  <div
                    className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}
                  >
                    <div className="flashcard-front">
                      <h4 style={{ color: "#667eea", fontSize: "1.2rem" }}>
                        {card.question}
                      </h4>
                      <p
                        style={{
                          fontStyle: "italic",
                          color: "#cbd5f5",
                          marginTop: "15px",
                          fontSize: "0.9rem",
                        }}
                      >
                        Tap to reveal
                      </p>
                    </div>
                    <div className="flashcard-back">
                      <h4 style={{ color: "#667eea", marginBottom: "10px" }}>
                        Answer:
                      </h4>
                      <p style={{ fontSize: "1.1rem", color: "#4a5568" }}>
                        {card.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
            <p>Card {currentIndex + 1} of {flashcards.length}</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>Swipe left/right to navigate</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
