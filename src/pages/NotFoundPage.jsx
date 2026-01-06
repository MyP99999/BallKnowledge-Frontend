import { Link } from "react-router-dom";
import { Overlay } from "../components/layout/Overlay";

export const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />
      <div className="relative bg-black/60 p-10 rounded-2xl shadow-2xl text-center max-w-lg">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>

        <h2 className="text-2xl mb-3 font-semibold">Page Not Found</h2>

        <p className="text-gray-300 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <button className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-600 transition">
            🔙 Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};
