// src/components/Leaderboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export const Leaderboard = () => {
  const [leaderboardUsers, setleaderboardUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/user/leaderboard", { params: { limit: 5 } });
        setleaderboardUsers(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-green-950/80 backdrop-blur-md p-6 rounded-lg shadow-xl w-full text-white">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">
        🏆 Leaderboard
      </h2>

      {loading ? (
        <p className="text-center text-gray-300">Loading…</p>
      ) : (
        <ul className="space-y-2">
          {leaderboardUsers.map((user, idx) => (
            <li
              key={user.id}
              className="flex justify-between bg-green-800/60 px-4 py-2 rounded-md"
            >
              <span>
                {idx + 1}. {user.username}
              </span>
              <span className="font-bold">{user.points} pts</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-4">
        <Link to="/leaderboard">
          <button className="text-yellow-400 hover:underline">
            View Full Leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
};
