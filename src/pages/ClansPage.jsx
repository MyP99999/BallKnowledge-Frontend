import { Overlay } from "../components/layout/Overlay";

export const ClansPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />
      <div className="relative bg-black/60 px-10 py-8 rounded-2xl shadow-2xl text-center max-w-lg">
        <h1 className="text-4xl font-extrabold mb-4">🏰 Clans</h1>

        <p className="text-xl text-yellow-400 font-semibold mb-4">
          Coming Soon!
        </p>

        <p className="text-gray-300 mb-6">
          We're building something special... Soon you'll be able to join clans,
          compete with others, and climb the leaderboards.
        </p>

        <div className="animate-pulse text-5xl">⚽</div>

        <p className="mt-6 text-gray-400 text-sm">Stay tuned for updates!</p>
      </div>
    </div>
  );
};
