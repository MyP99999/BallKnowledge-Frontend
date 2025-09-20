// src/pages/LeaderboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Overlay } from "../components/Overlay";
import { useAuth } from "../context/AuthContext"; // 👈 to get logged user
import api from "../api/axios";

const PAGE_SIZE = 10;

// Medal for top 3
const medalFor = (rank) =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

function Paginator({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className={`px-3 py-1 rounded-lg border ${
          page <= 1
            ? "opacity-40 cursor-not-allowed border-green-700 text-white"
            : "border-green-700 hover:bg-green-800"
        }`}
      >
        ← Prev
      </button>
      <div className="text-sm text-green-200">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className={`px-3 py-1 rounded-lg border ${
          page >= totalPages
            ? "opacity-40 cursor-not-allowed border-green-700 text-white"
            : "border-green-700 hover:bg-green-800"
        }`}
      >
        Next →
      </button>
    </div>
  );
}

export const LeaderboardPage = () => {
  const { user } = useAuth(); // 👈 check if logged in
  const [seasonTop, setSeasonTop] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- Fetch leaderboard ----
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/user/leaderboard", {
          params: { limit: 200 }, // get more users for ranking
        });
        setSeasonTop(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [seasonPage, setSeasonPage] = useState(1);

  // Sort leaderboard
  const seasonSortedForTable = useMemo(
    () => [...seasonTop].sort((a, b) => b.points - a.points),
    [seasonTop]
  );
  const seasonTotalPages = Math.max(
    1,
    Math.ceil(seasonSortedForTable.length / PAGE_SIZE)
  );
  const seasonPageData = useMemo(() => {
    const start = (seasonPage - 1) * PAGE_SIZE;
    return seasonSortedForTable.slice(start, start + PAGE_SIZE);
  }, [seasonPage, seasonSortedForTable]);

  // ---- Find current user's rank ----
  const yourRank =
    user &&
    seasonSortedForTable.findIndex((u) => u.username === user.username) + 1;
  const yourPoints =
    user &&
    seasonSortedForTable.find((u) => u.username === user.username)?.points;

  // ---- Table renderer ----
  const renderSeasonTable = (data, offset = 0) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-green-800/70 text-yellow-400">
            <th className="p-3">Rank</th>
            <th className="p-3">Player</th>
            <th className="p-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const absoluteRank = offset + i + 1;
            return (
              <tr
                key={`${row.username}-${absoluteRank}`}
                className={`${
                  i % 2 === 0 ? "bg-green-900/40" : "bg-green-800/40"
                } hover:bg-green-700/50 transition`}
              >
                <td className="p-3 font-semibold">{medalFor(absoluteRank)}</td>
                <td className="p-3">{row.username}</td>
                <td className="p-3 text-right font-bold text-yellow-300">
                  {row.points?.toLocaleString() ?? 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white pt-16"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative z-10 w-full flex flex-col items-center px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold my-8 text-center">
          🏆 Leaderboards
        </h1>

        {/* Show your rank if logged in */}
        {user && yourRank > 0 && (
          <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-5 mb-6 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-green-300/90">Your Rank</div>
                <div className="text-2xl font-extrabold">
                  {medalFor(yourRank)} • {user.username}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-300/90">Your Points</div>
                <div className="text-2xl font-extrabold text-yellow-300">
                  {yourPoints?.toLocaleString() ?? 0}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-6">
            {loading ? (
              <p className="text-center text-gray-300">Loading…</p>
            ) : (
              <>
                {renderSeasonTable(seasonPageData, (seasonPage - 1) * PAGE_SIZE)}
                <Paginator
                  page={seasonPage}
                  totalPages={seasonTotalPages}
                  onPrev={() => setSeasonPage((p) => Math.max(1, p - 1))}
                  onNext={() =>
                    setSeasonPage((p) => Math.min(seasonTotalPages, p + 1))
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
