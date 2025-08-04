import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const LandingPage = () => {
  const games = [
    { name: "Guess the Player", icon: "❓" },
    { name: "Logo Quiz", icon: "🛡️" },
    { name: "Transfer Market", icon: "💰" },
    { name: "Stadium Guess", icon: "🏟️" },
    { name: "Career Path", icon: "👣" },
    { name: "Match Timeline", icon: "⏱️" },
  ];

  return (
    <div className="bg-gradient-to-b from-green-900 to-green-600 min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="bg-green-950 flex flex-col items-center justify-center p-16 wf">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Prove Your Ball Knowledge!
        </h2>
        <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition mb-8">
          Play Now
        </button>

        {/* Games Slider */}
        <div className="w-full max-w-6xl">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-8"
          >
            {games.map((game, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-green-800 shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition transform hover:scale-105">
                  <div className="text-5xl mb-4 text-yellow-400">
                    {game.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {game.name}
                  </h3>
                  <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">
                    Play
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
