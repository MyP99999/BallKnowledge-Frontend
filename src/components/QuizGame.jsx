import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Overlay } from "./Overlay";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Sounds
const correctSound = new Audio("/sounds/correct.wav");
const wrongSound = new Audio("/sounds/wrong.wav");
const gameOverSound = new Audio("/sounds/gameover.wav");

const totalTime = 15;

// Update backend points
async function updateUserPoints(userId, amount) {
  try {
    await api.post(`/user/points/increase/${userId}/${amount}`);
  } catch (err) {
    console.error("Failed to update points:", err);
  }
}

export const QuizGame = () => {
  const { user, refreshStats } = useAuth();

  // Main states
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Rank tracking
  const [backendPoints, setBackendPoints] = useState(0);
  const [oldRank, setOldRank] = useState(null);
  const [newRank, setNewRank] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // 🟩 Fetch ONE question safely
  const loadNextQuestion = async () => {
    try {
      setLoading(true);

      const res = await api.get("/questions/random", { params: { amount: 1 } });

      const q = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!q || !q.question) {
        console.error("Invalid question received:", q);
        return;
      }

      setQuestion(q);
      setSelectedAnswer(null);
      setTimeLeft(totalTime);
    } catch (err) {
      console.error("Failed to load question", err);
    } finally {
      setLoading(false);
    }
  };

  // Load first question
  useEffect(() => {
    loadNextQuestion();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!question || gameOver) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, question, gameOver]);

  // 🟥 Handle answer
  const handleAnswer = (selected) => {
    if (!question) return;

    setSelectedAnswer(selected);

    const answers = question.answers ?? [];
    const correct = answers
      .map((a) => a.trim().toLowerCase())
      .includes(selected?.trim().toLowerCase());

    if (correct) {
      correctSound.play().catch(() => {});
      setScore((s) => s + 1);
    } else {
      wrongSound.play().catch(() => {});
      setScore((s) => s - 1);
      setLives((l) => l - 1);
    }

    if (user) {
      const change = correct ? 1 : -1;
      updateUserPoints(user.id, change);
      setBackendPoints((p) => p + change);
    }

    if (!correct && lives - 1 <= 0) {
      finalizeGame();
      return;
    }

    setTimeout(() => {
      loadNextQuestion();
    }, 800);
  };

  // Game Over logic
  const finalizeGame = () => {
    setGameOver(true);
    gameOverSound.play().catch(() => {});

    if (user) {
      api.get(`/user/rank/${user.id}`).then((r) => setOldRank(r.data));

      setTimeout(() => {
        api.get(`/user/rank/${user.id}`).then((r) => setNewRank(r.data));

        // 🔥 Trigger navbar refresh
        refreshStats();
      }, 800);
    }
  };

  // Restart game
  const restartGame = () => {
    setScore(0);
    setLives(5);
    setBackendPoints(0);
    setOldRank(null);
    setNewRank(null);
    setGameOver(false);
    loadNextQuestion();
  };

  // GAME OVER SCREEN
  if (gameOver) {
    const improved = oldRank !== null && newRank !== null && newRank < oldRank;
    const dropped = oldRank !== null && newRank !== null && newRank > oldRank;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('/pitch.jpg')" }}
      >
        <Overlay />

        <div className="relative p-8 bg-black/60 rounded-2xl shadow-2xl animate-slide-in max-w-lg w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            {backendPoints >= 0 ? "🎉 Great Job!" : "💀 Better Luck Next Time"}
          </h1>

          <p className="text-3xl font-bold mb-2">
            Score: {backendPoints >= 0 ? `+${backendPoints}` : backendPoints}
          </p>

          {oldRank !== null && newRank !== null && (
            <div className="mt-6">
              <p className="text-xl">🏅 New Rank</p>

              <p
                className={`text-4xl font-bold mt-2 ${
                  improved
                    ? "text-green-400 animate-pop"
                    : dropped
                    ? "text-red-400 animate-shake"
                    : "text-yellow-300"
                }`}
              >
                #{newRank}
              </p>

              <p className="text-lg text-gray-300 mt-1">
                (Previous: #{oldRank})
              </p>

              {improved && (
                <p className="text-green-400 font-bold mt-2 animate-glow">
                  ⬆ Climbed {oldRank - newRank} places!
                </p>
              )}

              {dropped && (
                <p className="text-red-400 font-bold mt-2 animate-shake">
                  ⬇ Dropped {newRank - oldRank} places.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600"
            >
              Play Again
            </button>

            <Link to="/">
              <button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600">
                Main Menu
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LOADING SCREEN
  if (loading || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-green-800">
        <Overlay />
        <p className="text-xl animate-pulse">Loading question…</p>
      </div>
    );
  }

  // MAIN QUIZ UI
  const options = question.options ?? [];
  const answers = question.answers ?? [];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative bg-green-950 bg-opacity-80 rounded-lg p-6 max-w-xl w-full shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-8">
          ⚽ Ball Knowledge
        </h1>

        <div className="flex justify-between text-lg font-semibold mb-3">
          <p>❤️ {lives}</p>
          <p>🏆 {score}</p>
        </div>

        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
          <div
            className={`${
              timeLeft <= 5 ? "bg-red-500" : "bg-yellow-500"
            } h-full`}
            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
          />
        </div>

        <p className="mb-4 text-center">⏱️ {timeLeft}s</p>

        <h2 className="text-xl font-bold text-center mb-6">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, idx) => {
            const isCorrect = answers
              .map((a) => a.trim().toLowerCase())
              .includes(option.trim().toLowerCase());

            let bg = "bg-yellow-500 hover:bg-yellow-600";

            if (selectedAnswer) {
              if (isCorrect) bg = "bg-green-500";
              else if (selectedAnswer === option) bg = "bg-red-500";
              else bg = "bg-gray-500";
            }

            return (
              <button
                key={idx}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(option)}
                className={`${bg} text-black px-4 py-2 rounded-lg font-semibold`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
