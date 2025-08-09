import { useState, useEffect } from "react";

const correctSound = new Audio("/sounds/correct.wav");
const wrongSound = new Audio("/sounds/wrong.wav");
const gameOverSound = new Audio("/sounds/gameover.wav");

const questions = [
  {
    question: "In what year did Lionel Messi win his first Ballon d'Or?",
    options: ["2007", "2008", "2009", "2010"],
    answer: "2009",
  },
  {
    question: "Which club won the UEFA Champions League in 2020?",
    options: ["Bayern Munich", "PSG", "Real Madrid", "Liverpool"],
    answer: "Bayern Munich",
  },
  {
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Brazil", "Italy", "Argentina"],
    answer: "Brazil",
  },
];

export const QuizGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState(questions[0].options);
  const [usedExtraTime, setUsedExtraTime] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle answer click
  const handleAnswer = (selected) => {
    setSelectedAnswer(selected);

    let correct = selected === currentQuestion.answer;
    let points = correct ? 5 + Math.floor(timeLeft * 1.5) : 0;

    if (correct) {
      setScore((prev) => prev + points);
      correctSound.play();
    } else {
      setLives((prev) => prev - 1);
      wrongSound.play();
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setVisibleOptions([]);

      if (!correct && lives - 1 <= 0) {
        gameOverSound.play();
        setGameOver(true);
        return;
      }

      if (currentIndex + 1 < questions.length) {
        const nextQuestion = questions[currentIndex + 1];
        setCurrentIndex((prev) => prev + 1);
        setVisibleOptions(nextQuestion.options);
        setTimeLeft(125);
      } else {
        gameOverSound.play();
        setGameOver(true);
      }
    }, 900);
  };

  // 50/50 helper
  const handleFiftyFifty = () => {
    if (usedFiftyFifty) return;
    const wrongOptions = currentQuestion.options.filter(
      (opt) => opt !== currentQuestion.answer
    );
    const keepOneWrong =
      wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    setVisibleOptions(
      [currentQuestion.answer, keepOneWrong].sort(() => Math.random() - 0.5)
    );
    setUsedFiftyFifty(true);
  };

  const handleExtraTime = () => {
    if (usedExtraTime) return;
    setTimeLeft((prev) => prev + 10); // adds 10 seconds
    setUsedExtraTime(true);
  };

  // Restart game
  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(5);
    setTimeLeft(125);
    setGameOver(false);
    setUsedFiftyFifty(false);
    setVisibleOptions(questions[0].options);
  };

  // Game Over Screen
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
        <h1 className="text-4xl font-bold mb-4">🏆 Game Over</h1>
        <p className="text-xl mb-2">Final Score: {score}</p>
        <button
          onClick={restartGame}
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Play Again
        </button>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-4">
      {/* Question Card */}
      <div className="bg-green-800 rounded-lg p-6 max-w-xl w-full shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-8">
          ⚽ Ball Knowledge
        </h1>
        {/* Top Info Bar */}
        <div className="flex justify-between w-full max-w-xl mb-2 text-lg font-semibold">
          <p>❤️ {lives}</p>
          <p>
            📊 Question {currentIndex + 1}/{questions.length}
          </p>
          <p>🏆 {score}</p>
        </div>

        {/* Timer Bar */}
        <div className="w-full max-w-xl bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
          <div
            className={`${
              timeLeft <= 5 ? "bg-red-500" : "bg-yellow-500"
            } h-full transition-all duration-1000`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
        <p className="mb-4 flex justify-center items-center">⏱️ {timeLeft}s</p>

        <h2 className="text-xl font-bold mb-6 text-center">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleOptions.map((option, idx) => {
            let bgClass = "bg-yellow-500 hover:bg-yellow-600";
            if (selectedAnswer) {
              if (option === currentQuestion.answer) {
                bgClass = "bg-green-500";
              } else if (option === selectedAnswer) {
                bgClass = "bg-red-500";
              } else {
                bgClass = "bg-gray-500";
              }
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

        {/* Power Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          {/* 50/50 */}
          <button
            onClick={handleFiftyFifty}
            disabled={usedFiftyFifty}
            className={`flex items-center justify-center px-3 py-2 rounded-full font-bold text-sm transition ${
              usedFiftyFifty
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            🪄 50/50
          </button>

          {/* Extra Time */}
          <button
            onClick={handleExtraTime}
            disabled={usedExtraTime}
            className={`flex items-center justify-center px-3 py-2 rounded-full font-bold text-sm transition ${
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
