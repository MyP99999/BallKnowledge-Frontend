import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Overlay } from "../layout/Overlay";
import api from "../../api/axios";

// Sounds
const correctSound = new Audio("/sounds/correct.wav");
const wrongSound = new Audio("/sounds/wrong.wav");

// How many questions per difficulty
const GAME_SETTINGS = {
  easy: 2,
  medium: 2,
  hard: 1,
};

const totalTime = 15;

export const PracticeQuizGame = () => {
  // Game states
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);

  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [gameOver, setGameOver] = useState(false);

  //-------------------------------
  // 🟩 FETCH ALL QUESTIONS BY SETTINGS
  //-------------------------------
  const loadAllQuestions = async () => {
    setLoading(true);

    try {
      const results = [];

      if (GAME_SETTINGS.easy > 0) {
        const r = await api.get("/questions/random", {
          params: { amount: GAME_SETTINGS.easy, difficulty: "EASY" },
        });
        results.push(...r.data);
      }

      if (GAME_SETTINGS.medium > 0) {
        const r = await api.get("/questions/random", {
          params: { amount: GAME_SETTINGS.medium, difficulty: "MEDIUM" },
        });
        results.push(...r.data);
      }

      if (GAME_SETTINGS.hard > 0) {
        const r = await api.get("/questions/random", {
          params: { amount: GAME_SETTINGS.hard, difficulty: "HARD" },
        });
        results.push(...r.data);
      }

      // Shuffle
      const shuffled = results.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setQuestion(shuffled[0]);
    } catch (err) {
      console.error("Failed loading questions", err);
    }

    setLoading(false);
    setTimeLeft(totalTime);
  };

  useEffect(() => {
    loadAllQuestions();
  }, []);

  //-------------------------------
  // 🟦 TIMER
  //-------------------------------
  useEffect(() => {
    if (!question || gameOver) return;

    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, question, gameOver]);

  //-------------------------------
  // 🟥 HANDLE ANSWER
  //-------------------------------
  const handleAnswer = (selected) => {
    if (!question) return;
    setSelectedAnswer(selected);

    const isCorrect = question.answers
      .map((x) => x.trim().toLowerCase())
      .includes(selected?.trim().toLowerCase());

    if (isCorrect) {
      correctSound.play().catch(() => {});
      setScore((s) => s + 1);
    } else {
      wrongSound.play().catch(() => {});
    }

    // Next question
    setTimeout(() => {
      const next = index + 1;
      if (next >= questions.length) {
        setGameOver(true);
        return;
      }

      setIndex(next);
      setQuestion(questions[next]);
      setSelectedAnswer(null);
      setTimeLeft(totalTime);
    }, 900);
  };

  //-------------------------------
  // ⏳ LOADING SCREEN
  //-------------------------------
  if (loading || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-green-800">
        <Overlay />
        <p className="text-xl animate-pulse">Loading practice questions…</p>
      </div>
    );
  }

  //-------------------------------
  // 🟪 PRACTICE MODE — GAME OVER SCREEN
  //-------------------------------
  if (gameOver) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/pitch.jpg')" }}
      >
        <Overlay />

        <div className="relative p-8 bg-black/60 rounded-2xl text-center max-w-lg shadow-2xl">
          <h1 className="text-4xl font-bold mb-4">🏁 Practice Finished!</h1>

          <p className="text-2xl mb-6">
            Final Score: <span className="font-bold">{score}</span>
          </p>

          <p className="text-lg text-gray-300 mb-6">
            Practice mode does not affect your rank or points.
          </p>

          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={loadAllQuestions}
              className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-600"
            >
              Practice Again
            </button>

            <Link to="/games">
              <button className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-600">
                Back to Games
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  //-------------------------------
  // 🎮 MAIN QUIZ UI
  //-------------------------------
  const options = question.options ?? [];
  const answers = question.answers ?? [];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative bg-green-950 bg-opacity-80 p-6 rounded-lg shadow-xl max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-8">
          🎯 Practice Mode
        </h1>

        <div className="flex justify-between font-semibold mb-3">
          <p>
            Question {index + 1}/{questions.length}
          </p>
          <p>🏆 {score}</p>
        </div>

        <div className="w-full bg-gray-700 h-3 rounded-full mb-2">
          <div
            className={`${
              timeLeft <= 5 ? "bg-red-500" : "bg-yellow-500"
            } h-full transition-all duration-[1000ms] ease-linear`}
            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
          />
        </div>

        <p className="text-center mb-4">⏱️ {timeLeft}s</p>

        <h2 className="text-xl font-bold text-center mb-6">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, i) => {
            const isCorrect = answers
              .map((x) => x.trim().toLowerCase())
              .includes(option.trim().toLowerCase());

            let bg = "bg-yellow-500 hover:bg-yellow-600";
            if (selectedAnswer) {
              if (isCorrect) bg = "bg-green-500";
              else if (selectedAnswer === option) bg = "bg-red-500";
              else bg = "bg-gray-500";
            }

            return (
              <button
                key={i}
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
