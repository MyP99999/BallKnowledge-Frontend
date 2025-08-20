import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Overlay } from "../components/Overlay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const LandingPage = () => {
  // Mock data
  const leaderboard = [
    { name: "MessiGOAT", points: 4500 },
    { name: "BallKnowledge99", points: 4100 },
    { name: "CR7Fan", points: 3850 },
    { name: "TacticsMaster", points: 3600 },
    { name: "Underdog", points: 3400 },
  ];

  const games = [
    { name: "Guess the Player", icon: "❓", link: "/match" },
    { name: "Logo Quiz", icon: "🛡️", link: "/quiz" },
    { name: "Transfer Market", icon: "💰", link: "/quiz" },
    { name: "Stadium Guess", icon: "🏟️", link: "/quiz" },
    { name: "Logo Quiz", icon: "🛡️", link: "/quiz" },
    { name: "Transfer Market", icon: "💰", link: "/quiz" },
    { name: "Stadium Guess", icon: "🏟️", link: "/quiz" },
  ];

  const features = [
    { icon: "🔥", text: "Daily Challenge" },
    { icon: "⚔️", text: "1v1 Duels" },
    { icon: "🪄", text: "Power-ups" },
    { icon: "👥", text: "Clans" },
  ];
  // 👉 Refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // ✅ Bind navigation after everything is mounted
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // Wait one microtask so refs are attached
    const id = requestAnimationFrame(() => {
      if (!prevRef.current || !nextRef.current) return;

      // Make sure navigation params exist and are enabled
      if (!swiper.params.navigation)
        swiper.params.navigation = { enabled: true };
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;

      // Re-init navigation cleanly
      if (swiper.navigation) {
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    });

    return () => cancelAnimationFrame(id);
  }, []); // run once after mount

  // Fun live counters (mock)
  const [playersOnline, setPlayersOnline] = useState(1243);
  const [answersToday, setAnswersToday] = useState(53210);
  const yourRank = 1234;

  useEffect(() => {
    const id = setInterval(() => {
      setPlayersOnline((n) => n + Math.floor(Math.random() * 5)); // +0..4
      setAnswersToday((n) => n + Math.floor(Math.random() * 20) + 5); // +5..24
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Daily challenge countdown
  const [secondsLeft, setSecondsLeft] = useState(3600);
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 3600));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white pt-16"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      {/* overlay */}
      <Overlay />

      {/* CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center px-4">
        {/* HERO TITLE
        <h1 className="text-4xl sm:text-5xl font-bold my-12 text-white text-center">
          ⚽ Ball Knowledge
        </h1> */}

        {/* HERO SECTION */}
        <div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch mb-12">
          {/* Left: Headline & CTAs */}
          <div className="bg-green-950/70 border border-green-900 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-800/70 border border-green-700 text-xs uppercase tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Season 1 • New
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              ⚽ Prove Your{" "}
              <span className="text-yellow-400">Ball Knowledge</span>
            </h1>

            <p className="text-gray-200 mt-4 text-base md:text-lg">
              Fast-paced trivia, daily challenges, and live duels. Climb the
              leaderboard and become the ultimate football brain.
            </p>

            {/* Feature chips */}
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

            {/* CTAs */}
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

            {/* Live stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <div className="bg-green-900/50 rounded-lg p-3 border border-green-800">
                <div className="text-xs text-green-300/90">Players Online</div>
                <div className="text-2xl font-extrabold tabular-nums">
                  {playersOnline.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-900/50 rounded-lg p-3 border border-green-800">
                <div className="text-xs text-green-300/90">Answers Today</div>
                <div className="text-2xl font-extrabold tabular-nums">
                  {answersToday.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-900/50 rounded-lg p-3 border border-green-800">
                <div className="text-xs text-green-300/90">Your Rank</div>
                <div className="text-2xl font-extrabold tabular-nums">
                  #{yourRank}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Panel */}
          <div className="grid grid-rows-3 gap-4">
            {/* Daily Challenge */}
            <div className="row-span-2 bg-green-950/70 border border-green-900 rounded-xl p-6 backdrop-blur-sm shadow-2xl flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">🔥 Daily Challenge</h3>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-600/50">
                  10 Q • Hard
                </span>
              </div>

              <p className="text-sm text-gray-300 mt-2">
                Beat today’s set to earn bonus points and keep your streak
                alive.
              </p>

              {/* Timer bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                  <span>Resets in</span>
                  <span className="tabular-nums font-semibold">
                    {mm}:{ss}
                  </span>
                </div>
                <div className="w-full h-2 bg-green-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-1000"
                    style={{ width: `${((3600 - secondsLeft) / 3600) * 100}%` }}
                  />
                </div>
              </div>

              <Link to="/quiz" className="mt-auto pt-4">
                <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                  Play Daily Challenge
                </button>
              </Link>
            </div>

            {/* Streak + Top Scorer */}
            <div className="grid grid-cols-2 gap-4">
              {/* Streak */}
              <div className="bg-green-950/70 border border-green-900 rounded-xl p-4">
                <div className="text-xs text-green-300/80">Current Streak</div>
                <div className="mt-1 text-2xl font-extrabold">🔥 3 days</div>
                <div className="mt-3 flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < 3 ? "bg-yellow-400" : "bg-green-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Top Scorer */}
              <div className="bg-green-950/70 border border-green-900 rounded-xl p-4">
                <div className="text-xs text-green-300/80">
                  Top Scorer Today
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-400/90 text-black font-bold flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">MessiGOAT</div>
                    <div className="text-xs text-gray-300">+1,240 pts</div>
                  </div>
                </div>
                <Link to="/leaderboard">
                  <button className="mt-3 w-full bg-transparent border border-green-700 rounded-lg py-2 text-sm hover:bg-white/5">
                    View Leaderboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* LEADERBOARD & CLANS */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch mb-12">
          <div className="bg-green-950/80 backdrop-blur-md p-6 rounded-lg shadow-xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">
              🏆 Leaderboard
            </h2>
            <ul className="space-y-2">
              {leaderboard.map((player, idx) => (
                <li
                  key={idx}
                  className="flex justify-between bg-green-800/60 px-4 py-2 rounded-md"
                >
                  <span>
                    {idx + 1}. {player.name}
                  </span>
                  <span className="font-bold">{player.points} pts</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4">
              <Link to="/leaderboard">
                <button className="text-yellow-400 hover:underline">
                  View Full Leaderboard
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-green-950/70 backdrop-blur-md p-6 rounded-lg shadow-xl w-full text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">
              👥 Clans Coming Soon
            </h2>
            <p className="text-gray-200">
              Team up with friends, compete in weekly tournaments, and climb the
              global clan leaderboard!
            </p>
          </div>
        </div>

        {/* GAMES SLIDER */}
        <div className="bg-green-950 bg-opacity-80 flex flex-col items-center px-8 justify-center mb-12 py-16 sm:px-12 md:px-16 w-11/12 sm:w-2/3 rounded-lg">
          <div className="w-full max-w-6xl relative">
            <Swiper
              modules={[Navigation, Pagination]}
              pagination={{ clickable: true }}
              loop={true}
              spaceBetween={16}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-12"
              onSwiper={(swiper) => {
                // store instance; we’ll wire buttons in useEffect
                swiperRef.current = swiper;
              }}
            >
              {games.map((game, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-green-800 bg-opacity-90 shadow-lg rounded-lg pb-8 p-4 sm:p-6 text-center hover:shadow-2xl transition transform hover:scale-105">
                    <div className="text-4xl sm:text-5xl mb-4 text-yellow-400">
                      {game.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                      {game.name}
                    </h3>
                    <Link to={game.link}>
                      <button className="bg-yellow-500 text-black px-3 sm:px-4 py-2 rounded hover:bg-yellow-600 transition text-sm sm:text-base">
                        Play
                      </button>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom arrows */}
            <button
              ref={prevRef}
              className="custom-prev absolute top-1/2 -left-16 -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition hover:scale-110"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              ref={nextRef}
              className="custom-next absolute top-1/2 -right-16 -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition hover:scale-110"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
