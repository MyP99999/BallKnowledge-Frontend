import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { Overlay } from "../components/layout/Overlay";
import { useAuth } from "../context/AuthContext";
import { GamesSlider } from "../components/mini-components/GamesSlider";
import { Leaderboard } from "../components/mini-components/Leaderboard";
import { Clans } from "../components/mini-components/Clans";

export const GamesPage = () => {
  const games = [
    { name: "Quiz", icon: "🛡️", link: "/quiz" },
    { name: "Match ", icon: "❓", link: "/match" },
    { name: "Guess the Player", icon: "💰", link: "/match" },
  ];

  // Mock leaderboard
  const leaderboard = [
    { name: "MessiGOAT", points: 4500 },
    { name: "BallKnowledge99", points: 4100 },
    { name: "CR7Fan", points: 3850 },
    { name: "TacticsMaster", points: 3600 },
    { name: "Underdog", points: 3400 },
  ];

  const { user } = useAuth(); // 👈 verificăm dacă e logat sau nu

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

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      {/* Overlay */}
      <Overlay />

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 py-16">
        {/* HERO TITLE always visible */}
        <h1 className="text-4xl sm:text-5xl font-bold my-12 text-white text-center">
          ⚽ Ball Knowledge
        </h1>
        <GamesSlider user={user} />
        {/* LEADERBOARD & CLANS */}
        <div className="w-full my-16 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-white items-stretch mb-12">
          <Leaderboard leaderboard={leaderboard} />
          <Clans />
        </div>
      </div>
    </div>
  );
};
