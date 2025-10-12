import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminQuestionsPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [answers, setAnswers] = useState([""]);
  const [difficulty, setDifficulty] = useState("EASY");
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [status, setStatus] = useState(null);
  const { user } = useAuth();

  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [labelSuggestions, setLabelSuggestions] = useState([]);
  const [allLabels, setAllLabels] = useState([]);

  // ✅ Debounce helper
  const debounce = (fn, delay = 300) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  // ✅ Fetch player suggestions dynamically
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

  // ✅ Fetch all existing labels (for right panel)
  useEffect(() => {
    const fetchAllLabels = async () => {
      try {
        const res = await api.get("/labels", { params: { size: 100 } });
        setAllLabels(res.data.content || []);
      } catch (err) {
        console.error("Failed to load labels", err);
      }
    };
    fetchAllLabels();
  }, []);

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

  const addLabel = (nameOrObj) => {
    const name =
      typeof nameOrObj === "string" ? nameOrObj : nameOrObj?.name || "";

    if (!name.trim()) return;

    // prevent duplicates
    setLabels((prev) => (prev.includes(name) ? prev : [...prev, name]));

    // add to allLabels if new
    setAllLabels((prev) =>
      prev.some((l) => l.name === name)
        ? prev
        : [...prev, { id: Date.now(), name }]
    );
  };

  const removeLabel = (label) => {
    setLabels(labels.filter((l) => l !== label));
  };

  // ✅ Fetch label suggestions as user types
  useEffect(() => {
    if (newLabel.length > 1) {
      api
        .get("/labels", { params: { size: 50 } })
        .then((res) =>
          setLabelSuggestions(
            res.data.content.filter((l) =>
              l.name.toLowerCase().includes(newLabel.toLowerCase())
            )
          )
        )
        .catch(() => {});
    } else {
      setLabelSuggestions([]);
    }
  }, [newLabel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation: question must have at least 2 options
    if (options.length < 2) {
      setStatus("❌ Please add at least two options.");
      return;
    }

    // ✅ Validation: each answer must exactly match an option
    const trimmedOptions = options.map((o) => o.trim().toLowerCase());
    const invalidAnswers = answers.filter(
      (a) => !trimmedOptions.includes(a.trim().toLowerCase())
    );

    if (invalidAnswers.length > 0) {
      setStatus(
        `❌ These answers do not match any option: ${invalidAnswers.join(", ")}`
      );
      return;
    }

    try {
      const payload = {
        questionType: "Quiz", // ✅ matches backend DTO field
        question,
        options,
        answers,
        difficulty,
        labels: labels.map((l) => (typeof l === "string" ? l : l.name)),
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
      setAnswers([""]);
      setDifficulty("EASY");
      setHint("");
      setExplanation("");
      setLabels([]);
    } catch (err) {
      console.error("Submit error", err);
      setStatus("❌ Failed to add question");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left panel: Question form */}
      <div className="flex-1 max-w-2xl bg-green-950 p-6 rounded-lg shadow-lg">
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

          {/* Options */}
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

                {activeField === idx && loadingSuggest && (
                  <div className="absolute right-2 top-2 text-sm text-gray-400 animate-pulse">
                    Loading...
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Correct answers */}
          <div>
            <label className="block mb-1 font-semibold">Correct Answers</label>

            {answers.map((ans, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="text"
                  value={ans}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[idx] = e.target.value;
                    setAnswers(updated);
                  }}
                  placeholder={`Correct answer ${idx + 1}`}
                  className="flex-1 p-2 rounded bg-green-800 border border-green-600 text-white"
                  required={idx === 0}
                />
                {answers.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers(answers.filter((_, i) => i !== idx))
                    }
                    className="ml-2 px-2 py-1 text-red-400 hover:text-red-600"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}

            {answers.length < 4 && (
              <button
                type="button"
                onClick={() => setAnswers([...answers, ""])}
                className="bg-yellow-500 text-black text-sm px-2 py-1 rounded hover:bg-yellow-600 transition"
              >
                ➕ Add Another Correct Answer
              </button>
            )}

            <p className="text-xs text-gray-300 mt-1">
              Each correct answer must match one of the options.
            </p>
          </div>

          {/* Labels */}
          <div>
            <label className="block mb-1 font-semibold">Labels (min. 2)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {labels.map((l, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-800 rounded-full text-sm flex items-center gap-2"
                >
                  {l}
                  <button
                    type="button"
                    onClick={() => removeLabel(l)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add or search label..."
                className="w-full p-2 rounded bg-green-800 border border-green-600 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  addLabel(newLabel);
                  setNewLabel("");
                }}
                className="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                +
              </button>
            </div>

            {labelSuggestions.length > 0 && (
              <ul className="bg-green-900 border border-green-700 rounded-lg mt-1 max-h-32 overflow-y-auto">
                {labelSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      addLabel(s.name);
                      setNewLabel("");
                      setLabelSuggestions([]);
                    }}
                    className="px-3 py-1 cursor-pointer hover:bg-green-700"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
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

      {/* Right panel: All labels */}
      <div className="w-full md:w-64 bg-green-950 p-4 rounded-lg shadow-lg h-fit">
        <h3 className="text-lg font-bold mb-3 text-yellow-400">
          🏷️ All Labels
        </h3>
        {allLabels.length === 0 ? (
          <p className="text-gray-400 text-sm">No labels found.</p>
        ) : (
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
            {allLabels.map((l) => (
              <li
                key={l.id}
                onClick={() => {
                  if (!labels.includes(l.name)) addLabel(l.name);
                }}
                className={`cursor-pointer px-3 py-2 rounded ${
                  labels.includes(l.name)
                    ? "bg-green-700 text-yellow-400"
                    : "bg-green-800 hover:bg-green-700 text-white"
                } transition`}
              >
                {l.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
