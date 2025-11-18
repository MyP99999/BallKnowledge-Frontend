// src/components/GamesSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const GamesSlider = ({ user }) => {
  const games = [
    {
      name: "Trivia",
      icon: "🛡️",
      link: "/quiz",
      practiceLink: "/practice-quiz",
    },
    // { name: "Match", icon: "❓", link: "/match" },
    // { name: "Guess the Player", icon: "🧠", link: "/guess-player" },

    // 🔥 New mini-games
    { name: "Propose Question", icon: "✍️", link: "/propose" },
    { name: "Approve Questions", icon: "✅", link: "/approve" },
  ];

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // ✅ Bind navigation after everything is mounted
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const id = requestAnimationFrame(() => {
      if (!prevRef.current || !nextRef.current) return;

      if (!swiper.params.navigation)
        swiper.params.navigation = { enabled: true };
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;

      if (swiper.navigation) {
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    });

    return () => cancelAnimationFrame(id);
  }, []); // run once after mount

  return (
    <div className="bg-green-950 bg-opacity-80 flex flex-col items-center px-6 sm:px-12 md:px-16 py-12 max-w-6xl sm:py-16 w-11/12 sm:w-4/5 rounded-2xl shadow-lg mx-auto mb-12">
      <div className="w-full max-w-6xl relative">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-yellow-400 mb-10">
          🎮 Play Games
        </h2>

        <Swiper
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={24}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          className="pb-12"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {games.map((game, idx) =>
            user || game.practiceLink ? (
              <SwiperSlide key={idx}>
                <div className="bg-green-800 bg-opacity-90 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center h-60 hover:shadow-2xl transition transform hover:scale-105">
                  <div className="text-5xl mb-4 text-yellow-400">
                    {game.icon}
                  </div>

                  <h3 className="text-lg sm:text-xl text-center font-semibold text-white mb-3">
                    {game.name}
                  </h3>

                  <div className="flex gap-2">
                    {/* PLAY button */}
                    <Link to={user ? game.link : "#"}>
                      <button
                        disabled={!user}
                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                          user
                            ? "bg-yellow-500 text-black hover:bg-yellow-600"
                            : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {game.name === "Propose Question" ||
                        game.name === "Approve Questions"
                          ? "Open"
                          : "Play"}
                      </button>
                    </Link>

                    {/* PRACTICE button */}
                    {game.practiceLink && (
                      <Link to={game.practiceLink}>
                        <button className="bg-transparent border border-yellow-400 text-yellow-300 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-500/10 transition">
                          {game.name === "Propose Question" ||
                          game.name === "Approve Questions"
                            ? "Preview"
                            : "Practice"}
                        </button>
                      </Link>
                    )}
                  </div>

                  {!user && (
                    <p className="text-xs text-red-300 mt-2 text-center">
                      🔑 Log in to access this feature. You can still 
                      <span className="font-bold text-yellow-400"> Practice</span> without an account
                      .
                    </p>
                  )}
                </div>
              </SwiperSlide>
            ) : null
          )}
          {/* ➕ Extra "coming soon" card */}
          <SwiperSlide>
            <div className="bg-green-800 bg-opacity-90 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center h-60 hover:shadow-2xl transition transform hover:scale-105">
              <div className="text-5xl mb-4 text-gray-300">⏳</div>
              <h3 className="text-lg text-center sm:text-xl font-semibold text-gray-300">
                More Coming Soon…
              </h3>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Custom arrows */}
        <button
          ref={prevRef}
          className="custom-prev absolute top-[60%] left-0 z-10 sm:-left-16 -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition hover:scale-110"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          ref={nextRef}
          className="custom-next absolute top-[60%] right-0 z-10 sm:-right-16 -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition hover:scale-110"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
};
