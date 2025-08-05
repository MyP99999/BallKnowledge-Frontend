import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Styles for active link
  const linkClass = ({ isActive }) =>
    `block hover:text-yellow-400 ${
      isActive ? "text-yellow-400 font-bold" : "text-white"
    }`;

  return (
    <nav className="bg-green-950 text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center hover:scale-105 transition duration-150">
            <img className="h-16 w-16" src="/Ball.png" alt="Logo" />
            <span className="font-bold text-xl">Ball Knowledge</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/games" className={linkClass}>
              Games
            </NavLink>
            <NavLink to="/leaderboard" className={linkClass}>
              Leaderboard
            </NavLink>
            <NavLink to="/clans" className={linkClass}>
              Clans
            </NavLink>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex">
            <NavLink to="/login">
              <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">
                Login
              </button>
            </NavLink>
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
        <div className="md:hidden h-screen bg-green-800 text-2xl space-y-2 flex flex-col justify-center items-center">
          <NavLink
            to="/"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/games"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Games
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/clans"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Clans
          </NavLink>
          <NavLink to="/login" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-yellow-500 text-black mt-1 px-4 py-2 rounded hover:bg-yellow-600 transition">
              Login
            </button>
          </NavLink>
        </div>
      )}
    </nav>
  );
}
