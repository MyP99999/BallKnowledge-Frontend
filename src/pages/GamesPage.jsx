import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { Overlay } from "../components/Overlay";

export const GamesPage = () => {
  const games = [
    { name: "Guess the Player", icon: "❓", link: "/match" },
    { name: "Logo Quiz", icon: "🛡️", link: "/quiz" },
    { name: "Transfer Market", icon: "💰", link: "/quiz" },
    { name: "Stadium Guess", icon: "🏟️", link: "/quiz" },
    { name: "Career Path", icon: "👣", link: "/quiz" },
    { name: "Match Timeline", icon: "⏱️", link: "/quiz" },
  ];

  // Mock leaderboard
  const leaderboard = [
    { name: "MessiGOAT", points: 4500 },
    { name: "BallKnowledge99", points: 4100 },
    { name: "CR7Fan", points: 3850 },
    { name: "TacticsMaster", points: 3600 },
    { name: "Underdog", points: 3400 },
  ];

  const prevRef = useRef(null);
  const nextRef = useRef(null);

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

        {/* Games card */}
        <div className="bg-green-950 bg-opacity-80 flex flex-col items-center justify-center py-16 sm:px-12 md:px-16 w-11/12 sm:w-2/3 rounded-lg">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4 px-4">
            Prove Your Ball Knowledge!
          </h2>
          <button className="bg-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition mb-8 text-sm sm:text-base md:text-lg">
            Play Now
          </button>

          {/* Games Slider */}
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
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
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

            {/* Custom buttons */}
            <button
              ref={prevRef}
              className="custom-prev absolute top-1/2 -left-16 transform -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition hover:scale-110"
            >
              ‹
            </button>
            <button
              ref={nextRef}
              className="custom-next absolute top-1/2 -right-16 transform -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition hover:scale-110"
            >
              ›
            </button>
          </div>
        </div>

        {/* LEADERBOARD + CLANS */}
        <div className="my-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 text-white justify-center items-start">
          {/* Leaderboard */}
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
                  See Full Leaderboard
                </button>
              </Link>
            </div>
          </div>

          {/* Clans teaser */}
          <div className="bg-green-950/70 backdrop-blur-md p-6 my-auto rounded-lg shadow-xl w-full text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">
              👥 Clans Coming Soon
            </h2>
            <p className="text-gray-200">
              Team up with friends, compete in weekly tournaments, and climb the
              global clan leaderboard!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
