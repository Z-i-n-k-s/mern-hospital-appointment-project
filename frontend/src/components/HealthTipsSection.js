// src/components/HealthTipsSection.jsx
import React, { useState } from "react";

const HealthTipsSection = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  const handleAskSubmit = () => {
    if (!newQuestion.trim()) return;
    const newEntry = { text: newQuestion, author: "Patient" };
    setQuestions([newEntry, ...questions]); // add new question at top
    setNewQuestion("");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Ask for Health Tips</h2>

      {/* Ask Form */}
      <textarea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="Ask your health question..."
        className="w-full border rounded-lg p-2 focus:ring focus:ring-green-300"
      />
      <button
        onClick={handleAskSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Ask Doctor
      </button>

      {/* Existing Tips */}
      <div className="space-y-3 pt-4">
        <div className="border rounded-lg p-3">
          <p className="text-gray-700">
            Stay hydrated and maintain regular sleep.
          </p>
          <span className="text-sm text-gray-500">— Doctor’s Tip</span>
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className="border rounded-lg p-3">
            <p className="text-gray-700">"{q.text}"</p>
            <span className="text-sm text-gray-500">— {q.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTipsSection;
