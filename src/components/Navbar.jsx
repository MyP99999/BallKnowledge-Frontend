import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-950 text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-16 w-16"
              src="/Ball.png"
              alt="Logo"
            />
            <span className="font-bold text-xl">Ball Knowledge</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-yellow-400">Home</a>
            <a href="/games" className="hover:text-yellow-400">Games</a>
            <a href="/leaderboard" className="hover:text-yellow-400">Leaderboard</a>
            <a href="/clans" className="hover:text-yellow-400">Clans</a>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex">
            <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-green-900 px-4 pb-4 space-y-2">
          <a href="/" className="block hover:text-yellow-400">Home</a>
          <a href="/games" className="block hover:text-yellow-400">Games</a>
          <a href="/leaderboard" className="block hover:text-yellow-400">Leaderboard</a>
          <a href="/clans" className="block hover:text-yellow-400">Clans</a>
          <button className="w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
