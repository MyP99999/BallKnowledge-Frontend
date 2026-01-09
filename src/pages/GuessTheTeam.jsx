import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export const GuessTheTeamPage = () => {
  const [image, setImage] = useState(null);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState("playing"); // playing | win | lose
  const [tries, setTries] = useState(3);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);

  const [revealedAnswer, setRevealedAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const guard = async () => {
      try {
        const res = await api.get("/daily-challenge/status");
        const state = res.data?.state;

        if (!cancelled && (state === "WIN" || state === "LOSE")) {
          navigate("/", { replace: true });
        }
      } catch {
        // ignore
      }
    };

    guard();
    return () => (cancelled = true);
  }, [navigate]);

  // 1️⃣ Load daily challenge
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/daily-challenge");
        const data = res.data;

        const img = {
          id: data.game.id,
          difficulty: data.game.difficulty,
          imagePath: `/gtt/${data.game.imagePath}.png`,
        };

        if (!cancelled) {
          setImage(img);
          setAnswer("");
          setTimeLeft(30);
          setStatus("playing");
          setTries(3);
          setRevealedAnswer("");

          // reset suggestions too
          setSuggestions([]);
          setShowSug(false);
          setActiveIndex(-1);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.response?.data?.message ||
              e.message ||
              "Failed to load daily challenge"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => (cancelled = true);
  }, []);

  // 2️⃣ Timer
  useEffect(() => {
    if (status !== "playing" || loading || !image) return;

    if (timeLeft === 0) {
      setStatus("lose");
      return;
    }

    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status, loading, image]);

  // 3️⃣ Reveal answer on finish
  useEffect(() => {
    if (!["win", "lose"].includes(status)) return;
    if (revealedAnswer) return;

    let cancelled = false;

    const reveal = async () => {
      try {
        const res = await api.get("/daily-challenge/reveal");
        if (!cancelled) setRevealedAnswer(res.data.correctAnswer || "");
      } catch (e) {
        if (!cancelled) setError("Failed to reveal answer");
      }
    };

    reveal();
    return () => (cancelled = true);
  }, [status, revealedAnswer]);

  // ✅ 3.5️⃣ Suggest teams (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = answer.trim();
    if (status !== "playing" || q.length < 2) {
      setSuggestions([]);
      setShowSug(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/players/suggestTeam", { params: { q } });
        const list = Array.isArray(res.data) ? res.data : [];
        setSuggestions(list.slice(0, 8));
        setShowSug(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSug(false);
        setActiveIndex(-1);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [answer, status]);

  // 4️⃣ Submit guess
  const submitAnswer = async (forcedValue) => {
    if (!image || status !== "playing") return;

    const guess = (forcedValue ?? answer).toLowerCase().trim();
    if (!guess) return;

    try {
      const res = await api.post("/daily-challenge/guess", { guess });

      if (res.data.correct) {
        setStatus("win");
        if (res.data.streak) {
          setStreak(res.data.streak);
        }
        if (res.data.pointsAwarded) {
          setPoints(res.data.pointsAwarded);
        }
      } else {
        if (tries - 1 <= 0) {
          setTries(0);
          setStatus("lose");
        } else {
          setTries((t) => t - 1);
          setAnswer("");
        }
      }

      // close suggestions after submit
      setShowSug(false);
      setSuggestions([]);
      setActiveIndex(-1);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Guess failed");
    }
  };

  const pickSuggestion = (value) => {
    setAnswer(value);
    setShowSug(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const onKeyDown = (e) => {
    // if dropdown is open, handle arrows/enter
    if (showSug && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0) pickSuggestion(suggestions[activeIndex]);
        else submitAnswer();
        return;
      }
      if (e.key === "Escape") {
        setShowSug(false);
        return;
      }
    }

    if (e.key === "Enter") submitAnswer();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Guess the Team 🏳️⚽</h1>

      {loading && (
        <div className="text-gray-300">Loading daily challenge...</div>
      )}

      {!loading && error && (
        <div className="text-red-300 bg-red-950/40 border border-red-800 px-4 py-3 rounded-lg max-w-md text-center">
          {error}
        </div>
      )}

      {!loading && !error && image && (
        <>
          <img
            src={image.imagePath}
            alt="Guess the team"
            className="w-[320px] md:w-[420px] rounded-xl border border-gray-700 mb-4"
          />

          {status === "playing" && (
            <>
              <div className="flex gap-6 mb-3 text-lg">
                <span>⏱ {timeLeft}s</span>
                <span>❤️ {tries}</span>
                {image.difficulty && <span>🎯 {image.difficulty}</span>}
              </div>

              {/* ✅ Input + suggestions dropdown */}
              <div className="relative w-64 mb-3">
                <input
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    // only show if we already have suggestions
                    if (suggestions.length > 0) setShowSug(true);
                  }}
                  onKeyDown={onKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSug(true)}
                  onBlur={() => setTimeout(() => setShowSug(false), 150)} // allow click
                  placeholder="Enter team name..."
                  className="px-4 py-2 rounded-lg text-black w-full"
                  autoComplete="off"
                />

                {showSug && suggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
                    {suggestions.map((s, idx) => (
                      <button
                        key={`${s}-${idx}`}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                        onClick={() => pickSuggestion(s)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 ${
                          idx === activeIndex ? "bg-slate-800" : ""
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => submitAnswer()}
                className="bg-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700"
              >
                Submit
              </button>
            </>
          )}

          {status === "win" && (
            <div className="text-green-400 text-2xl mt-4 text-center">
              ✅ Correct!
              {revealedAnswer && (
                <div className="text-base text-gray-200 mt-2">
                  Answer: <b>{revealedAnswer.toUpperCase()}</b>
                </div>
              )}
              <div className="text-base text-gray-200 mt-2">
                +{points} points
              </div>
              <div className="text-orange-400 mt-1">🔥 {streak}-day streak</div>
            </div>
          )}

          {status === "lose" && (
            <div className="text-red-400 text-xl mt-4 text-center">
              ❌ Game over!
              <br />
              {revealedAnswer ? (
                <>
                  Answer was: <b>{revealedAnswer.toUpperCase()}</b>
                </>
              ) : (
                <span className="text-gray-300 text-base">
                  (Revealing answer...)
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
