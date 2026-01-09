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
import api from "../api/axios";

function getSecondsUntilUkMidnight() {
  const now = new Date();
  const ukNow = new Date(
    now.toLocaleString("en-GB", { timeZone: "Europe/London" })
  );
  const nextMidnightUk = new Date(ukNow);
  nextMidnightUk.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((nextMidnightUk - ukNow) / 1000));
}

export const LandingPage = () => {
  const { user } = useAuth();

  // ✅ Daily Challenge status (DECLARE FIRST)
  const [dailyStatus, setDailyStatus] = useState({ state: "LOADING" });

  // ✅ Derived values (SAFE now)
  const state = dailyStatus?.state;
  const streak = Number(dailyStatus?.streak ?? 0);

  const nextReward =
    streak >= 7
      ? 50
      : streak >= 5
      ? 40
      : streak >= 2
      ? 30
      : streak >= 1
      ? 25
      : 20;

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

  // Load daily status
  useEffect(() => {
    let cancelled = false;

    const loadStatus = async () => {
      try {
        const res = await api.get("/daily-challenge/status");
        if (!cancelled) setDailyStatus(res.data);
      } catch {
        if (!cancelled) setDailyStatus({ state: "LOGIN_REQUIRED" });
      }
    };

    loadStatus();
    return () => (cancelled = true);
  }, []);

  // Countdown
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsUntilUkMidnight()
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(getSecondsUntilUkMidnight());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const DAY_SECONDS = 24 * 60 * 60;
  const progress = ((DAY_SECONDS - secondsLeft) / DAY_SECONDS) * 100;

  const buttonLabel =
    state === "WIN"
      ? `✅ Completed Today${
          dailyStatus?.pointsAwarded
            ? ` (+${dailyStatus.pointsAwarded})`
            : ""
        }`
      : state === "LOSE"
      ? "❌ Failed Today"
      : state === "PLAYING"
      ? "▶️ Continue Daily Challenge"
      : state === "LOGIN_REQUIRED"
      ? "🔒 Login to Play"
      : state === "LOADING"
      ? "Loading..."
      : "Play Daily Challenge";

  const disabled = state === "WIN" || state === "LOSE" || state === "LOADING";
  const target = state === "LOGIN_REQUIRED" ? "/login" : "/guessTheTeam";

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white pt-16"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative z-10 w-full flex flex-col items-center px-4">
        <div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* LEFT */}
          <div className="bg-green-950/70 border border-green-900 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
            <h1 className="text-5xl font-extrabold">
              ⚽ Prove Your <span className="text-yellow-400">Ball Knowledge</span>
            </h1>

            <p className="text-gray-200 mt-4">
              Fast-paced trivia, daily challenges, and live duels.
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-green-950/70 border border-green-900 rounded-xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">🔥 Daily Challenge</h3>
              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                {state === "WIN" && "Completed"}
                {state === "LOSE" && "Failed"}
                {state === "PLAYING" && "In Progress"}
                {state === "NOT_PLAYED" && "Available"}
                {state === "LOGIN_REQUIRED" && "Login Required"}
                {state === "LOADING" && "Loading"}
              </span>
            </div>

            <p className="text-sm text-gray-300 mt-2">
              Beat today’s set to earn bonus points and keep your streak alive.
            </p>

            {/* 🔥 STREAK */}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-orange-400 font-semibold">🔥 Streak:</span>{" "}
                <span className="text-gray-200">
                  {streak} day{streak === 1 ? "" : "s"}
                </span>
              </div>
              <div className="text-xs text-gray-300">
                Next win:{" "}
                <span className="text-yellow-300 font-semibold">
                  +{nextReward}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Resets in</span>
                <span>{hh}:{mm}:{ss}</span>
              </div>
              <div className="h-2 bg-green-900 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Button */}
            <div className="mt-auto pt-4">
              {disabled ? (
                <button
                  disabled
                  className="w-full py-3 rounded-lg bg-gray-500 text-gray-200 cursor-not-allowed"
                >
                  {buttonLabel}
                </button>
              ) : (
                <Link to={target}>
                  <button className="w-full py-3 rounded-lg bg-yellow-500 text-black hover:bg-yellow-600">
                    {buttonLabel}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <GamesSlider user={user} />
        <div className="w-full my-16 max-w-6xl grid grid-cols-2 gap-8">
          <Leaderboard leaderboard={[]} />
          <Clans />
        </div>
      </div>

      <BottomAd />
    </div>
  );
};
