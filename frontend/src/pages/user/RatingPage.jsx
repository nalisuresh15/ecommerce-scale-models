import React, { useState } from "react";

const RatingPage = () => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (value) => setRating(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #111827, #1f2937)",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#3b82f6", marginBottom: "20px", fontSize: "2rem" }}>
        ⭐ Rate Your Experience
      </h2>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#1f2937",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            width: "300px",
          }}
        >
          <p style={{ marginBottom: "15px", fontSize: "16px" }}>
            How would you rate your experience with Scale Models?
          </p>

          {/* Star Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "15px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                style={{
                  fontSize: "2rem",
                  color: star <= rating ? "#facc15" : "#9ca3af",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#3b82f6",
              border: "none",
              padding: "10px 20px",
              color: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Submit Rating
          </button>
        </form>
      ) : (
        <div
          style={{
            background: "#1f2937",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            width: "320px",
          }}
        >
          <h3 style={{ color: "#22c55e" }}>Thank you! 💖</h3>
          <p>Your rating of {rating} star{rating > 1 ? "s" : ""} has been recorded.</p>
        </div>
      )}
    </div>
  );
};

export default RatingPage;
