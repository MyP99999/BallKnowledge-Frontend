// src/components/MatchGame.jsx
import { useMemo, useState } from "react";
import { Overlay } from "../layout/Overlay";
import { Link } from "react-router-dom";

const baseData = {
  teams: ["PSG", "Liverpool", "Real Madrid", "Barcelona", "Man City"],
  players: ["Messi", "Mbappe", "Bellingham", "Salah", "Haaland"],
  answers: {
    Messi: "Barcelona",
    Mbappe: "PSG",
    Bellingham: "Real Madrid",
    Salah: "Liverpool",
    Haaland: "Man City",
  },
};

// simple shuffle helper (stable enough for UI use)
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export const MatchGame = () => {
  // shuffle on mount for variety
  const matchData = useMemo(
    () => ({
      teams: shuffle(baseData.teams),
      players: shuffle(baseData.players),
      answers: baseData.answers,
    }),
    []
  );

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matches, setMatches] = useState({});
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setFeedback(null);
  };

  const handleSelectPlayer = (player) => {
    if (!selectedTeam) return;

    const correctTeam = matchData.answers[player];
    if (selectedTeam === correctTeam) {
      setMatches((prev) => ({ ...prev, [player]: correctTeam }));
      setScore((prev) => prev + 100);
      setFeedback("correct");
    } else {
      setLives((prev) => prev - 1);
      setFeedback("wrong");
    }
    // clear selection after a short flash
    setTimeout(() => setSelectedTeam(null), 250);
  };

  const allMatched = Object.keys(matches).length === matchData.players.length;

  // Proper restart (no undefined states)
  const restartGame = () => {
    setSelectedTeam(null);
    setMatches({});
    setLives(3);
    setScore(0);
    setFeedback(null);
    // NOTE: if you want to re-shuffle on restart, force remount by routing or lift state up
    // or add a local key state to trigger useMemo again.
  };

  /* ---------------- Game Over Screen ---------------- */
  if (lives <= 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white relative"
        style={{ backgroundImage: "url('/pitch.jpg')" }}
      >
        <Overlay />
        <div className="relative z-10 bg-green-950/90 rounded-xl p-8 sm:p-10 max-w-xl w-11/12 shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-2">💀 Game Over</h1>
          <p className="text-xl mb-6">Final Score: {score}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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

  /* ---------------- All Matched Screen ---------------- */
  if (allMatched) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white relative"
        style={{ backgroundImage: "url('/pitch.jpg')" }}
      >
        <Overlay />
        <div className="relative z-10 bg-green-950/90 rounded-xl p-8 sm:p-10 max-w-xl w-11/12 shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-2">🏆 You Matched All!</h1>
          <p className="text-xl mb-6">Final Score: {score}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={restartGame}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Play Again
            </button>
            <Link to="/games">
              <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                More Games
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Game Screen ---------------- */
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white relative"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative z-10 bg-green-950/90 rounded-xl p-8 sm:p-10 max-w-5xl w-11/12 shadow-2xl flex flex-col">
        <h1 className="text-xl sm:text-3xl font-bold text-center mb-6">
          Match the Player with the Current Team
        </h1>

        {/* Selection hint / feedback */}
        <div className="flex justify-center items-center mb-4 text-sm sm:text-base">
          {selectedTeam ? (
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
              Selected team: <b>{selectedTeam}</b> — now choose a player
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-200">
              Pick a <b>team</b>, then click the matching <b>player</b>
            </span>
          )}
          {feedback === "correct" && (
            <span className="ml-3 text-green-400">✔ Correct!</span>
          )}
          {feedback === "wrong" && (
            <span className="ml-3 text-red-400">✖ Wrong!</span>
          )}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Teams */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow-400 text-center">
              Teams
            </h2>
            <div className="flex flex-col gap-3">
              {matchData.teams.map((team, idx) => {
                const isSelected = selectedTeam === team;
                const isUsed = Object.values(matches).includes(team);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectTeam(team)}
                    disabled={isUsed}
                    className={`px-4 py-3 rounded-lg font-semibold shadow-md transition text-lg border
                      ${isSelected
                        ? "bg-yellow-500 text-black border-yellow-400 scale-[1.02]"
                        : isUsed
                        ? "bg-green-700 text-gray-300 cursor-not-allowed border-green-700"
                        : "bg-green-800 hover:bg-green-700 border-green-700"}`}
                  >
                    {team}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Players */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow-400 text-center">
              Players
            </h2>
            <div className="flex flex-col gap-3">
              {matchData.players.map((player, idx) => {
                const matchedTeam = matches[player];
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPlayer(player)}
                    disabled={!!matchedTeam}
                    className={`px-4 py-3 rounded-lg font-semibold shadow-md transition text-lg border
                      ${matchedTeam
                        ? "bg-green-600 text-white cursor-not-allowed border-green-500"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-400"}`}
                  >
                    {player}{" "}
                    {matchedTeam ? (
                      <span className="text-green-200">✅ ({matchedTeam})</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex justify-between items-center mt-8 text-lg border-t border-green-700 pt-4">
          <p>
            ❤️ Lives:{" "}
            <span className="text-red-400 font-bold">{lives}</span>
          </p>
          <p>
            🏆 Score:{" "}
            <span className="text-yellow-400 font-bold">{score}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
