import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { StatPill } from "./StatPill";
import Tooltip from "./Tooltip";

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
  const totalPoints = 1250;
  const rank = 1234;

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
    `block hover:text-yellow-400 ${
      isActive ? "text-yellow-400 font-bold" : "text-white"
    }`;

  return (
    <nav className="bg-green-950 text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center hover:scale-105 transition duration-150">
            <img className="h-16 w-16" src="/Ball.png" alt="Logo" />
            <span className="hidden md:flex font-bold text-xl">Ball Knowledge</span>
          </NavLink>

          {/* Stats bar with tooltips */}
          <div className="flex items-center gap-2 bg-green-800/60 rounded-full px-2 py-1 shadow-sm backdrop-blur">
            <Tooltip text={lives >= maxLives ? "Lives: max" : "Your current lives. Watch ads or wait to refill."}>
              <LivesPill
                lives={lives}
                maxLives={maxLives}
                pct={pct}
                onWatchAd={() => setLives((l) => Math.min(l + 1, maxLives))}
              />
            </Tooltip>

            <div className="h-6 w-px bg-green-600/60" />

            <Tooltip text="Total Ball Knowledge points earned across all games">
              <StatPill icon="⚽" label="Points" value={totalPoints} color="yellow" />
            </Tooltip>

            <div className="h-6 w-px bg-green-600/60" />

            <Tooltip text="Your current global leaderboard position">
              <StatPill icon="🏆" label="Rank" value={`#${rank}`} color="purple" />
            </Tooltip>
          </div>

          <div className="hidden lg:flex space-x-6">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/games" className={linkClass}>Games</NavLink>
            <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
            <NavLink to="/clans" className={linkClass}>Clans</NavLink>
          </div>

          <div className="hidden lg:flex">
            <NavLink to="/login">
              <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition">Login</button>
            </NavLink>
          </div>

          <div className="lg:hidden">
            <button className="text-white hover:text-yellow-400 focus:outline-none">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
