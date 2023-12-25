import React from "react";

// Showing the error while posting images gracefully
export default function PostError({ error, setError }) {
  return (
    <div className="postError">
      <div className="postError_error">{error}</div>
      <button
        className="blue_btn"
        onClick={() => {
          setError("");
        }}
      >
        Try again
      </button>
    </div>
  );
}
