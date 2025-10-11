import React, { useState } from "react";
import { safeFetch } from "../utils/safeFetch.js";
import { calculateScore } from "../utils/calculateScore.js";

const DrillPage = ({ drillId, drillName, questions, onGoToDashboard , onNewAttempt}) => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [String(qId)]: value }));
  };

  const handleSubmit = async () => {
    if (!Array.isArray(questions)) return;

    const answersArray = Object.entries(answers).map(([qid, ans]) => ({
      questionId: String(qid),
      answer: ans,
    }));

    // Optional: local scoring for instant feedback
    const localScore = calculateScore(answersArray, questions);
    setScore(localScore);

    const payload = { drillId: Number(drillId), answers: answersArray };
    setIsSubmitting(true);

    try {
      const data = await safeFetch(`${API_URL}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Use backend score to ensure accuracy
      if (data.score !== undefined) {
        setScore(data.score);
      }

      // Optional: update answers with normalized backend answers
      if (data.answers) {
        const normalized = {};
        data.answers.forEach(a => {
          normalized[a.questionId] = a.answer;
        });
        setAnswers(normalized);
      }
      if (onNewAttempt && data) onNewAttempt(data);
    } catch (err) {
      console.error("❌ Error submitting attempt:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Drill: {drillName}</h1>

      {score !== null ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          You scored {score} out of {questions.length}!
        </div>
      ) : (
        questions.map(q => (
          <div key={q.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-lg font-medium text-gray-700 mb-2">{q.text}</h2>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
              value={answers[q.id] || ""}
              onChange={e => handleAnswerChange(q.id, e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        ))
      )}

      <div className="flex gap-4 mt-6">
        {score === null ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 px-6 rounded-md transition`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={onGoToDashboard}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default DrillPage;
