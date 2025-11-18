import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { StatPill } from "../mini-components/StatPill";
import Tooltip from "../mini-components/Tooltip";

const ringBg = (pct) =>
  `conic-gradient(#f59e0b ${pct}%, rgba(255,255,255,0.10) 0)`;

function LivesPill({ lives, maxLives, pct, onWatchAd }) {
  const isFull = lives >= maxLives;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/40">
      <div className="relative w-7 h-7 sm:w-8 sm:h-8">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isFull ? "rgba(255,255,255,0.10)" : ringBg(pct),
          }}
        />
        <div className="absolute inset-[3px] rounded-full bg-green-950 flex items-center justify-center text-[14px]">
          ❤️
        </div>
      </div>
      <div className="text-white text-sm font-bold tabular-nums">
        {lives}/{maxLives}
      </div>
      {!isFull && (
        <button
          onClick={onWatchAd}
          className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center shadow-md transition"
        >
          🎥
        </button>
      )}
    </div>
  );
}

export default function Navbar() {
  const maxLives = 5;
  const [lives, setLives] = useState(5);
  const [timeUntilNextLife, setTimeUntilNextLife] = useState(900);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const [totalPoints, setTotalPoints] = useState(0); // ✅ start from 0
  const [rank, setRank] = useState(null);

  const { user, logout, statsTrigger } = useAuth();

  const signout = () => {
    setMobileMenuOpen(false);
    setAvatarMenuOpen(false);
    logout();
  };

  useEffect(() => {
    if (lives >= maxLives) return;
    const id = setInterval(() => {
      setTimeUntilNextLife((prev) => {
        if (prev <= 1) {
          setLives((l) => Math.min(l + 1, maxLives));
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [lives]);

  const pct =
    lives >= maxLives
      ? 100
      : Math.round(((900 - timeUntilNextLife) / 900) * 100);

  const linkClass = ({ isActive }) =>
    `block px-3 my-1 py-1 rounded hover:text-yellow-400 bg-green-950 hover:bg-green-900 ${
      isActive ? "text-yellow-400 font-bold" : "text-white"
    }`;

  useEffect(() => {
    const fetchPointsAndRank = async () => {
      try {
        if (!user?.id) return;

        // Points
        const p = await api.get(`/user/points/${user.id}`);
        setTotalPoints(p.data);

        // Rank
        const r = await api.get(`/user/rank/${user.id}`);
        setRank(r.data);
      } catch (e) {
        console.error("Error fetching points/rank:", e);
      }
    };

    fetchPointsAndRank();
  }, [user, statsTrigger]); // ← updates when game ends

  return (
    <nav className="bg-green-950 text-white w-full shadow-md relative border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center hover:scale-105 transition duration-150"
          >
            <img className="h-16 w-16" src="/Ball.png" alt="Logo" />
            <span className="hidden md:flex font-bold text-xl">
              Ball Knowledge
            </span>
          </NavLink>

          {/* Stats bar */}
          {user && (
            <div className="flex items-center gap-2 bg-green-800/60 rounded-full px-2 py-1 shadow-sm backdrop-blur">
              {/* Lives
            <Tooltip
              text={
                lives >= maxLives
                  ? "Lives: max"
                  : "Your current lives. Watch ads or wait to refill."
              }
            >
              <LivesPill
                lives={lives}
                maxLives={maxLives}
                pct={pct}
                onWatchAd={() => setLives((l) => Math.min(l + 1, maxLives))}
              />
            </Tooltip>

            <div className="h-6 w-px bg-green-600/60" /> */}

              {/* Points */}
              <Tooltip text="Total Ball Knowledge points earned across all games">
                <StatPill
                  icon="⚽"
                  label="Points"
                  value={totalPoints}
                  color="yellow"
                />
              </Tooltip>

              <div className="h-6 w-px bg-green-600/60" />

              {/* Rank */}
              <Tooltip text="Your current global leaderboard position">
                <StatPill
                  icon="🏆"
                  label="Rank"
                  value={`#${rank ? rank : "N/A"}`}
                  color="purple"
                />
              </Tooltip>
            </div>
          )}

          {/* Desktop links */}
          <div className="hidden lg:flex space-x-6">
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
          {/* Desktop user menu */}
          <div className="hidden lg:flex justify-center items-center relative">
            {!user ? (
              <NavLink to="/login">
                <button className="w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">
                  Login
                </button>
              </NavLink>
            ) : (
              <div className="relative group">
                {/* Avatar */}
                <NavLink to="/profile">
                  <button className="flex items-center focus:outline-none">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center">
                      {user.username[0].toUpperCase()}
                    </div>
                  </button>
                </NavLink>

                {/* Dropdown wrapper with hover bridge */}
                <div className="absolute left-0 mt-2 w-40 z-50">
                  {/* Invisible hover bridge */}
                  <div className="absolute -top-2 left-0 right-0 h-2"></div>

                  {/* Dropdown */}
                  <div
                    className="bg-green-900 border border-green-700 rounded-md shadow-lg 
                     opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto 
                     pointer-events-none transition duration-200"
                  >
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-green-800 rounded-t-md"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/admin"
                      className="block px-4 py-2 text-sm text-white hover:bg-green-800 rounded-t-md"
                    >
                      Admin
                    </NavLink>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-green-800 rounded-b-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Burger button (mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-white text-2xl hover:text-yellow-400 focus:outline-none"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-green-950 shadow-lg z-50 border-t border-green-800">
          <div className="flex flex-col px-4 py-4 space-y-3">
            {/* User info */}
            {user && (
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2 rounded-md text-white hover:bg-green-800 transition"
              >
                <div className="flex items-center gap-3 mb-2 border-b border-green-800 pb-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">
                      {user.name || "User"}
                    </span>
                    <span className="text-sm text-gray-400">
                      {user.email || ""}
                    </span>
                  </div>
                </div>
              </NavLink>
            )}

            {/* Links */}
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/games"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Games
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/clans"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Clans
            </NavLink>

            {/* Auth actions */}
            {!user ? (
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">
                  Login
                </button>
              </NavLink>
            ) : (
              <div className="flex flex-col space-y-2 mt-3">
                <button
                  onClick={signout}
                  className="w-2/3 mx-auto px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
