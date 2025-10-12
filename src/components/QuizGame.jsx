import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Overlay } from "./Overlay";
import api from "../api/axios";

const correctSound = new Audio("/sounds/correct.wav");
const wrongSound = new Audio("/sounds/wrong.wav");
const gameOverSound = new Audio("/sounds/gameover.wav");

const totalTime = 15;
const SAVE_KEY = "quizGameState";
const EXPIRY_MINUTES = 30;

export const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [usedExtraTime, setUsedExtraTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await api.get("/questions/random", { params: { amount: 5 } });
      setQuestions(res.data);
      setCurrentIndex(0);
      setVisibleOptions(res.data[0]?.options ?? []);
      setScore(0);
      setLives(5);
      setTimeLeft(totalTime);
      setGameOver(false);
      setUsedFiftyFifty(false);
      setUsedExtraTime(false);
    } catch (err) {
      setLoadError(err?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      if (
        parsed.timestamp &&
        now - parsed.timestamp > EXPIRY_MINUTES * 60 * 1000
      ) {
        localStorage.removeItem(SAVE_KEY);
      } else if (parsed.questions?.length) {
        setQuestions(parsed.questions);
        setCurrentIndex(parsed.currentIndex || 0);
        setScore(parsed.score || 0);
        setLives(parsed.lives ?? 5);
        setTimeLeft(parsed.timeLeft ?? totalTime);
        setUsedFiftyFifty(parsed.usedFiftyFifty || false);
        setUsedExtraTime(parsed.usedExtraTime || false);
        setGameOver(parsed.gameOver || false);
        setVisibleOptions(parsed.questions[parsed.currentIndex]?.options ?? []);
        setLoading(false);
        return;
      }
    }
    fetchQuestions();
  }, []);

  const currentQuestion = useMemo(
    () => (questions.length ? questions[currentIndex] : null),
    [questions, currentIndex]
  );

  useEffect(() => {
    if (currentQuestion) setVisibleOptions(currentQuestion.options);
    else setVisibleOptions([]);
  }, [currentQuestion]);

  useEffect(() => {
    if (!currentQuestion || gameOver) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, currentQuestion, gameOver]);

  const handleAnswer = (selected) => {
    if (!currentQuestion) return;
    setSelectedAnswer(selected);

    const correct = (currentQuestion.answers || [])
      .map((a) => a.trim().toLowerCase())
      .includes(selected?.trim().toLowerCase());

    console.log(
      "Selected:",
      selected,
      "| Expected:",
      currentQuestion.answers,
      "| Match:",
      correct
    );

    const points = correct ? 5 + Math.floor(timeLeft * 1.5) : 0;

    if (correct) {
      correctSound.play().catch(() => {});
      setScore((p) => p + points);
    } else {
      wrongSound.play().catch(() => {});
      setLives((p) => p - 1);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setVisibleOptions([]);
      if (!correct && lives - 1 <= 0) {
        gameOverSound.play().catch(() => {});
        setGameOver(true);
        localStorage.removeItem(SAVE_KEY);
        return;
      }
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((p) => p + 1);
        setTimeLeft(totalTime);
        setUsedFiftyFifty(false);
        setUsedExtraTime(false);
      } else {
        setGameOver(true);
        localStorage.removeItem(SAVE_KEY);
      }
    }, 900);
  };

  const handleFiftyFifty = () => {
    if (usedFiftyFifty || !currentQuestion) return;
    const correctAnswers = currentQuestion.answers || [];
    const wrongs = currentQuestion.options.filter(
      (o) => !correctAnswers.includes(o)
    );
    if (!wrongs.length) return;
    const keepOneWrong = wrongs[Math.floor(Math.random() * wrongs.length)];
    setVisibleOptions(
      [...correctAnswers, keepOneWrong].sort(() => Math.random() - 0.5)
    );
    setUsedFiftyFifty(true);
  };

  const handleExtraTime = () => {
    if (usedExtraTime || !currentQuestion) return;
    setTimeLeft((p) => p + 10);
    setUsedExtraTime(true);
  };

  const restartGame = () => {
    localStorage.removeItem(SAVE_KEY);
    fetchQuestions();
  };

  useEffect(() => {
    if (questions.length === 0) return;
    const state = {
      questions,
      currentIndex,
      score,
      lives,
      timeLeft,
      usedFiftyFifty,
      usedExtraTime,
      gameOver,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [
    questions,
    currentIndex,
    score,
    lives,
    timeLeft,
    usedFiftyFifty,
    usedExtraTime,
    gameOver,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-green-700">
        <Overlay />
        <p className="text-xl animate-pulse">Loading questions…</p>
      </div>
    );
  }

  if (loadError || !questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-green-700 p-6">
        <p className="text-xl mb-4">
          {loadError
            ? `Error: ${loadError}`
            : "No multiple-choice questions available."}
        </p>
        <Link to="/">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
            Main Menu
          </button>
        </Link>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col bg-green-700 items-center justify-center bg-cover bg-center bg-no-repeat text-white" style={{ backgroundImage: "url('/pitch.jpg')" }}>
        <Overlay />
        <div className="relative bg-green-950 bg-opacity-80 rounded-lg p-6 py-12 max-w-xl w-full shadow-xl flex items-center justify-center flex-col">
          <h1 className="text-4xl font-bold mb-4">Game Over</h1>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={restartGame}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Play Again
            </button>
            <Link to="/">
              <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                Main Menu
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-green-700 items-center justify-center bg-cover bg-center bg-no-repeat text-white" style={{ backgroundImage: "url('/pitch.jpg')" }}>
      <Overlay />
      <div className="relative bg-green-950 bg-opacity-80 rounded-lg p-6 max-w-xl w-full shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-8">⚽ Ball Knowledge</h1>

        <div className="flex justify-between w-full max-w-xl mb-2 text-lg font-semibold">
          <p>❤️ {lives}</p>
          <p>📊 Question {currentIndex + 1}/{questions.length}</p>
          <p>🏆 {score}</p>
        </div>

        <div className="w-full max-w-xl bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
          <div
            className={`${timeLeft <= 5 ? "bg-red-500" : "bg-yellow-500"} h-full transition-all duration-1000`}
            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
          />
        </div>
        <p className="mb-4 flex justify-center items-center">⏱️ {timeLeft}s</p>

        <h2 className="text-xl font-bold mb-6 text-center">
          {currentQuestion?.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(visibleOptions || []).map((option, idx) => {
            const isCorrect = (currentQuestion.answers || [])
              .map((a) => a.trim().toLowerCase())
              .includes(option.trim().toLowerCase());

            let bgClass = "bg-yellow-500 hover:bg-yellow-600";
            if (selectedAnswer) {
              if (isCorrect) bgClass = "bg-green-500";
              else if (option === selectedAnswer) bgClass = "bg-red-500";
              else bgClass = "bg-gray-500";
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`${bgClass} text-black px-4 py-2 rounded font-semibold transition`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={handleFiftyFifty}
            disabled={usedFiftyFifty}
            className={`px-3 py-2 rounded-full font-bold text-sm transition ${
              usedFiftyFifty
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            🪄 50/50
          </button>

          <button
            onClick={handleExtraTime}
            disabled={usedExtraTime}
            className={`px-3 py-2 rounded-full font-bold text-sm transition ${
              usedExtraTime
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            ⏳ +10s
          </button>
        </div>
      </div>
    </div>
  );
};
