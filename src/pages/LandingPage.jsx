import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAuth } from "../context/AuthContext";
import { Overlay } from "../components/layout/Overlay";
import { Leaderboard } from "../components/mini-components/Leaderboard";
import { Clans } from "../components/mini-components/Clans";
import { GamesSlider } from "../components/mini-components/GamesSlider";
import { BottomAd } from "../components/layout/BottomAd";

function getSecondsUntilUkMidnight() {
  const now = new Date();
  const ukNow = new Date(now.toLocaleString("en-GB", { timeZone: "Europe/London" }));
  const nextMidnightUk = new Date(ukNow);
  nextMidnightUk.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((nextMidnightUk - ukNow) / 1000));
}

export const LandingPage = () => {
  const leaderboard = [
    { name: "MessiGOAT", points: 4500 },
    { name: "BallKnowledge99", points: 4100 },
    { name: "CR7Fan", points: 3850 },
    { name: "TacticsMaster", points: 3600 },
    { name: "Underdog", points: 3400 },
  ];

  const features = [
    { icon: "🔥", text: "Quiz Games" },
    { icon: "🔥", text: "Daily Challenge" },
  ];

  const futureFeatures = [
    { icon: "⚔️", text: "1v1 Matches" },
    { icon: "👥", text: "Clans" },
    { icon: "👥", text: "News" },
  ];

  const { user } = useAuth();

  // Fun live counters (mock)
  const [playersOnline, setPlayersOnline] = useState(1243);
  const [answersToday, setAnswersToday] = useState(53210);

  useEffect(() => {
    const id = setInterval(() => {
      setPlayersOnline((n) => n + Math.floor(Math.random() * 5));
      setAnswersToday((n) => n + Math.floor(Math.random() * 20) + 5);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // ✅ Daily challenge countdown (UK midnight)
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsUntilUkMidnight());

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(getSecondsUntilUkMidnight());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ✅ Derived display values (must be AFTER secondsLeft exists)
  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const DAY_SECONDS = 24 * 60 * 60;
  const progress = ((DAY_SECONDS - secondsLeft) / DAY_SECONDS) * 100;

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white pt-16"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative z-10 w-full flex flex-col items-center px-4">
        <div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch mb-12">
          <div className="bg-green-950/70 border border-green-900 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              ⚽ Prove Your <span className="text-yellow-400">Ball Knowledge</span>
            </h1>

            <p className="text-gray-200 mt-4 text-base md:text-lg">
              Fast-paced trivia, daily challenges, and live duels. Climb the leaderboard and become the ultimate football brain.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/60 border border-green-800 text-sm"
                >
                  <span className="text-lg">{f.icon}</span> {f.text}
                </span>
              ))}
            </div>

            <div className="flex items-center flex-wrap gap-2 mt-5">
              <h1>Coming Soon: </h1>
              {futureFeatures.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/60 border border-green-800 text-sm"
                >
                  <span className="text-lg">{f.icon}</span> {f.text}
                </span>
              ))}
            </div>

            <div className="flex xs:flex-wrap gap-2 xs:gap-3 mt-6">
              <Link to="/games">
                <button className="bg-yellow-500 text-black px-3 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-md">
                  Play Now
                </button>
              </Link>
              <Link to="/quiz">
                <button className="bg-transparent border border-yellow-400/70 text-yellow-300 px-3 py-3 rounded-lg font-semibold hover:bg-yellow-500/10 transition">
                  Quick Practice
                </button>
              </Link>
              <Link to="/leaderboard" className="ml-auto md:ml-0">
                <button className="bg-transparent border border-green-700 text-white px-3 py-3 rounded-lg hover:bg-white/5 transition">
                  View Leaderboard
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-rows-3 gap-4">
            <div className="row-span-2 bg-green-950/70 border border-green-900 rounded-xl p-6 backdrop-blur-sm shadow-2xl flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">🔥 Daily Challenge</h3>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-600/50">
                  10 Q • Hard
                </span>
              </div>

              <p className="text-sm text-gray-300 mt-2">
                Beat today’s set to earn bonus points and keep your streak alive.
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                  <span>Resets in</span>
                  <span className="tabular-nums font-semibold">
                    {hh}:{mm}:{ss}
                  </span>
                </div>

                <div className="w-full h-2 bg-green-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
              </div>

              <Link to="/guessTheTeam" className="mt-auto pt-4">
                <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                  Play Daily Challenge
                </button>
              </Link>
            </div>

            {/* rest of your component unchanged... */}
          </div>
        </div>

        <GamesSlider user={user} />

        <div className="w-full my-16 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch mb-12">
          <Leaderboard leaderboard={leaderboard} />
          <Clans />
        </div>
      </div>

      <BottomAd />
    </div>
  );
};
