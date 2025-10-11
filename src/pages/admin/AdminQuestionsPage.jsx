import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminQuestionsPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // ✅ start with 2
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [status, setStatus] = useState(null);
  const { user } = useAuth();

  // ✅ Debounce helper — prevents API spam while typing
  const debounce = (fn, delay = 300) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  // ✅ fetch suggestions dynamically (debounced)
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggest(true);
      try {
        const res = await api.get("/players/suggest", { params: { q: query } });
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      } finally {
        setLoadingSuggest(false);
      }
    }, 350),
    []
  );

  const handleOptionChange = (value, idx) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
    setActiveField(idx);
    fetchSuggestions(value);
  };

  const selectSuggestion = (name) => {
    const updated = [...options];
    if (activeField !== null) {
      updated[activeField] = name;
      setOptions(updated);
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const addOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const removeOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
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
      setOptions(["", ""]);
      setAnswer("");
      setDifficulty("EASY");
      setHint("");
      setExplanation("");
    } catch (err) {
      console.error("Submit error", err);
      setStatus("❌ Failed to add question");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-green-950 p-6 rounded-lg shadow-lg relative">
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

        {/* Options with suggestions */}
        <div>
          <label className="block mb-2 font-semibold flex justify-between items-center">
            <span>Options</span>
            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="bg-yellow-500 text-black text-sm px-2 py-1 rounded hover:bg-yellow-600 transition"
              >
                ➕ Add Option
              </button>
            )}
          </label>

          {options.map((opt, idx) => (
            <div key={idx} className="relative mb-2">
              <div className="flex items-center">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  placeholder={`Option ${idx + 1}`}
                  onFocus={() => setActiveField(idx)}
                  onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                  className="flex-1 p-2 rounded bg-green-800 border border-green-600 text-white"
                  required
                />

                {/* Remove option button */}
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="ml-2 px-2 py-1 text-red-400 hover:text-red-600"
                  >
                    ✖
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {activeField === idx && suggestions.length > 0 && (
                <ul className="absolute z-20 bg-green-900 border border-green-700 rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                  {suggestions.map((player, sIdx) => (
                    <li
                      key={sIdx}
                      onMouseDown={() => selectSuggestion(player.playerName)}
                      className="px-3 py-2 cursor-pointer hover:bg-green-700 flex justify-between items-center"
                    >
                      <span>{player.playerName}</span>
                      {player.playerDob && (
                        <span className="text-xs text-gray-400 ml-2">
                          ({player.playerDob})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Loading state */}
              {activeField === idx && loadingSuggest && (
                <div className="absolute right-2 top-2 text-sm text-gray-400 animate-pulse">
                  Loading...
                </div>
              )}
            </div>
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
