// src/pages/admin/AdminQuestionsPage.jsx
import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminQuestionsPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [status, setStatus] = useState(null);
  const { user } = useAuth();
  console.log(user)
  const handleOptionChange = (value, idx) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question,
        options,
        answer,
        difficulty,
        type: "multiple_choice",
        isActive: true,
        hint,
        explanation,
        timeLimitSeconds: 30,
        basePoints: 100,
        languageCode: "en",
        mediaUrl: null,
        sourceUrl: null,
        createdBy: user?.id,
        updatedBy: user?.id,
      };

      await api.post("/questions", payload);
      setStatus("✅ Question added successfully!");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setDifficulty("EASY");
      setHint("");
      setExplanation("");
    } catch (err) {
      setStatus("❌ Failed to add question");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-green-950 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">➕ Add a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question */}
        <div>
          <label className="block mb-1 font-semibold">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 rounded bg-green-800 border border-green-600 text-white"
            required
          />
        </div>

        {/* Hint */}
        <div>
          <label className="block mb-1 font-semibold">Hint (optional)</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full p-2 rounded bg-green-800 border border-green-600 text-white"
          />
        </div>

        {/* Explanation */}
        <div>
          <label className="block mb-1 font-semibold">
            Explanation (optional)
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full p-2 rounded bg-green-800 border border-green-600 text-white"
            rows={3}
          />
        </div>

        {/* Options */}
        <div>
          <label className="block mb-2 font-semibold">Options</label>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, idx)}
              placeholder={`Option ${idx + 1}`}
              className="w-full p-2 mb-2 rounded bg-green-800 border border-green-600 text-white"
              required
            />
          ))}
        </div>

        {/* Correct Answer */}
        <div>
          <label className="block mb-1 font-semibold">Correct Answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 rounded bg-green-800 border border-green-600 text-white"
            required
          />
          <p className="text-xs text-gray-300 mt-1">
            Must match exactly one of the options to compute correct index.
          </p>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block mb-1 font-semibold">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 rounded bg-green-800 border border-green-600 text-white"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
        >
          Add Question
        </button>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
