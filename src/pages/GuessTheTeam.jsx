import { useEffect, useState } from "react";
import api from "../api/axios";

export const GuessTheTeamPage = () => {
  const [image, setImage] = useState(null);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState("playing"); // playing | win | lose
  const [tries, setTries] = useState(3);

  const [revealedAnswer, setRevealedAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e.message || "Failed to load daily challenge");
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
        if (!cancelled) setRevealedAnswer(res.data.correctAnswer);
      } catch (e) {
        if (!cancelled) setError("Failed to reveal answer");
      }
    };

    reveal();
    return () => (cancelled = true);
  }, [status, revealedAnswer]);

  // 4️⃣ Submit guess
  const submitAnswer = async () => {
    if (!image || status !== "playing") return;

    const guess = answer.toLowerCase().trim();
    if (!guess) return;

    try {
      const res = await api.post("/daily-challenge/guess", { guess });

      if (res.data.correct) {
        setStatus("win");
      } else {
        if (tries - 1 <= 0) {
          setTries(0);
          setStatus("lose");
        } else {
          setTries((t) => t - 1);
          setAnswer("");
        }
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Guess failed");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submitAnswer();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Guess the Team 🏳️⚽</h1>

      {loading && <div className="text-gray-300">Loading daily challenge...</div>}

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

              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Enter team name..."
                className="px-4 py-2 rounded-lg text-black w-64 mb-3"
              />

              <button
                onClick={submitAnswer}
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
            </div>
          )}

          {status === "lose" && (
            <div className="text-red-400 text-xl mt-4 text-center">
              ❌ Game over!
              <br />
              {revealedAnswer ? (
                <>Answer was: <b>{revealedAnswer.toUpperCase()}</b></>
              ) : (
                <span className="text-gray-300 text-base">(Revealing answer...)</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
