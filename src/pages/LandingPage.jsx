import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  const games = [
    { name: "Guess the Player", icon: "❓" },
    { name: "Logo Quiz", icon: "🛡️" },
    { name: "Transfer Market", icon: "💰" },
    { name: "Stadium Guess", icon: "🏟️" },
    { name: "Career Path", icon: "👣" },
    { name: "Match Timeline", icon: "⏱️" },
  ];

  // Refs for custom buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="bg-gradient-to-b from-green-900 to-green-600 min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="bg-green-950 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 w-2/3 relative rounded-lg">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4 px-4">
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
              // Connect custom buttons
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
                <div className="bg-green-800 shadow-lg rounded-lg pb-8 p-4 sm:p-6 text-center hover:shadow-2xl transition transform hover:scale-105">
                  <div className="text-4xl sm:text-5xl mb-4 text-yellow-400">
                    {game.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {game.name}
                  </h3>
                  <Link to="/quiz">
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
    </div>
  );
};
