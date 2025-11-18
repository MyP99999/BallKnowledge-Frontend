// src/pages/ProposeQuestionPage.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Overlay } from "../components/layout/Overlay";

export default function ProposeQuestionPage() {
  const { user } = useAuth();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [answers, setAnswers] = useState([""]);
  const [difficulty, setDifficulty] = useState("EASY");
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [labelSuggestions, setLabelSuggestions] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [status, setStatus] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const debounce = (fn, delay = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const fetchPlayerSuggestions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggest(true);
      try {
        const res = await api.get("/players/suggest", { params: { q: query } });
        setSuggestions(res.data || []);
      } catch {
        // ignore
      } finally {
        setLoadingSuggest(false);
      }
    }, 350),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/labels", { params: { size: 100 } });
        setAllLabels(res.data?.content || []);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (newLabel.length > 1) {
      api
        .get("/labels", { params: { size: 50 } })
        .then((res) => {
          const list = res.data?.content || [];
          setLabelSuggestions(
            list.filter((l) =>
              l.name.toLowerCase().includes(newLabel.toLowerCase())
            )
          );
        })
        .catch(() => {});
    } else {
      setLabelSuggestions([]);
    }
  }, [newLabel]);

  const handleOptionChange = (value, idx) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
    setActiveField(idx);
    fetchPlayerSuggestions(value);
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

  const addAnswer = () => {
    if (answers.length < 4) setAnswers([...answers, ""]);
  };
  const removeAnswer = (idx) => {
    if (answers.length > 1) {
      setAnswers(answers.filter((_, i) => i !== idx));
    }
  };

  const addLabel = (nameOrObj) => {
    const name =
      typeof nameOrObj === "string" ? nameOrObj : nameOrObj?.name || "";
    if (!name.trim()) return;
    setLabels((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setAllLabels((prev) =>
      prev.some((l) => l.name === name)
        ? prev
        : [...prev, { id: Date.now(), name }]
    );
  };
  const removeLabel = (l) => setLabels(labels.filter((x) => x !== l));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    if (options.length < 2) {
      setStatus("❌ Please add at least two options.");
      return;
    }
    const tOptions = options.map((o) => o.trim().toLowerCase());
    const invalid = answers.filter(
      (a) => !tOptions.includes(a.trim().toLowerCase())
    );
    if (invalid.length) {
      setStatus(
        `❌ These answers don't match any option: ${invalid.join(", ")}`
      );
      return;
    }
    if (labels.length < 2) {
      setStatus("❌ Please add at least two labels.");
      return;
    }

    try {
      const payload = {
        // proposal payload
        question,
        options,
        answers,
        difficulty,
        labels,
        questionType: "Quiz",
        createdBy: user?.id,
        status: "PENDING",
      };

      await api.post("/proposals", payload);
      setStatus("✅ Proposal submitted! It will go live after approvals.");
      // reset
      setQuestion("");
      setOptions(["", ""]);
      setAnswers([""]);
      setDifficulty("EASY");
      setLabels([]);
      setNewLabel("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to submit proposal.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white relative"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />
      <div className="relative z-10 bg-green-950/90 rounded-xl p-8 sm:p-6 max-w-xl w-11/12 shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">
          ✍️ Propose a Question
        </h1>

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
                    onClick={() => removeAnswer(idx)}
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
                onClick={addAnswer}
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

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
          >
            Submit Proposal
          </button>
        </form>

        {status && <p className="mt-4 text-center">{status}</p>}

        {/* Right panel of all labels (optional) */}
        {allLabels?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3 text-yellow-400">
              🏷️ Popular Labels
            </h3>
            <div className="flex flex-wrap gap-2">
              {allLabels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => addLabel(l.name)}
                  className={`px-3 py-1 rounded ${
                    labels.includes(l.name)
                      ? "bg-green-700 text-yellow-400"
                      : "bg-green-800 hover:bg-green-700 text-white"
                  } transition`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
