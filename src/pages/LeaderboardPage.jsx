// src/pages/LeaderboardPage.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Overlay } from "../components/Overlay";

const PAGE_SIZE = 10;

// Medal for top 3
const medalFor = (rank) =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

// Simple paginator
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
  const [tab, setTab] = useState("season");

  // ---- Mock Current User / Clan ----
  const currentUser = { name: "You", points: 10900, clan: "🔥 Red Devils" };

  // ---- Mock Data ----
  const seasonTop = [
    { name: "MessiGOAT", points: 12500 },
    { name: "CR7Fan", points: 11800 },
    { name: "BallKnowledge99", points: 11100 },
    { name: "TacticsMaster", points: 10600 },
    { name: "Underdog", points: 10100 },
    // repeated to simulate long list
    { name: "R9Prime", points: 9900 },
    { name: "ZizouMagic", points: 9800 },
    { name: "PirloMaestro", points: 9700 },
    { name: "KDBVision", points: 9600 },
    { name: "Lewy9", points: 9500 },
    { name: "MaldiniWall", points: 9400 },
    { name: "BuffonGigi", points: 9300 },
    { name: "KahnTitan", points: 9200 },
    { name: "ThaiProdigy", points: 9100 },
    { name: "LaMasiaKid", points: 9000 },
    { name: "AjaxDNA", points: 8900 },
    { name: "GiggsRunner", points: 8800 },
    { name: "KingCantona", points: 8700 },
    { name: "SambaSkillz", points: 8600 },
    { name: "BocaLegend", points: 8500 },
    { name: "IbraLion", points: 8400 },
  ];

  const clanTop = [
    { clan: "⚡ UltraBallers", points: 55000 },
    { clan: "🔥 Red Devils", points: 52000 },
    { clan: "🛡️ Invincibles", points: 49700 },
    { clan: "⚔️ Dark Horses", points: 48200 },
    { clan: "🌍 Global GOATs", points: 47000 },
    { clan: "🧠 TacticNerds", points: 46500 },
    { clan: "🟡 Yellow Submarines", points: 45200 },
    { clan: "🐺 Wolves Den", points: 44750 },
    { clan: "🔵 Sky Blues", points: 44100 },
    { clan: "🍀 Celtic Pride", points: 43210 },
    { clan: "🦅 Eagles", points: 42500 },
    { clan: "🍷 Claret Army", points: 41900 },
  ];

  const clanMembersByClan = {
    "🔥 Red Devils": [
      { name: "You", points: 10900 },
      { name: "CR7Fan", points: 11800 },
      { name: "TacticsMaster", points: 10600 },
      { name: "Underdog", points: 10100 },
      { name: "GiggsRunner", points: 8800 },
      { name: "KingCantona", points: 8700 },
    ],

  };

  const [selectedClan, setSelectedClan] = useState(currentUser.clan);

  // ---- Season: build full list including current user to compute rank ----
  const fullSeasonList = useMemo(() => {
    const copy = [...seasonTop];
    // If current user not in top list, insert them for rank calc
    if (!copy.some((p) => p.name === currentUser.name)) {
      copy.push({ name: currentUser.name, points: currentUser.points });
    }
    // sort desc by points
    copy.sort((a, b) => b.points - a.points);
    return copy;
  }, [seasonTop, currentUser]);

  const yourRank =
    fullSeasonList.findIndex((p) => p.name === currentUser.name) + 1;

  const yourNextOpponent =
    yourRank > 1 ? fullSeasonList[yourRank - 2] : null; // user above you
  const diffToNext =
    yourNextOpponent && yourNextOpponent.points - currentUser.points;

  // ---- Pagination states ----
  const [seasonPage, setSeasonPage] = useState(1);
  const [clanPage, setClanPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);

  // Helpers
  const paginate = (arr, page, size) => {
    const start = (page - 1) * size;
    return arr.slice(start, start + size);
  };

  // Season data paged (use the sorted copy without double-including "You" in the visible table unless truly in it)
  const seasonSortedForTable = useMemo(
    () => [...seasonTop].sort((a, b) => b.points - a.points),
    [seasonTop]
  );
  const seasonTotalPages = Math.max(
    1,
    Math.ceil(seasonSortedForTable.length / PAGE_SIZE)
  );
  const seasonPageData = paginate(seasonSortedForTable, seasonPage, PAGE_SIZE);

  // Clan top paged
  const clanSorted = useMemo(
    () => [...clanTop].sort((a, b) => b.points - a.points),
    [clanTop]
  );
  const clanTotalPages = Math.max(1, Math.ceil(clanSorted.length / PAGE_SIZE));
  const clanPageData = paginate(clanSorted, clanPage, PAGE_SIZE);

  // Current clan rank (pin this)
  const yourClanRank =
    clanSorted.findIndex((c) => c.clan === currentUser.clan) + 1;
  const yourClanRow =
    yourClanRank > 0
      ? clanSorted[yourClanRank - 1]
      : { clan: currentUser.clan, points: 0 };

  // Members in selected clan
  const members = useMemo(() => {
    const arr = clanMembersByClan[selectedClan] || [];
    return [...arr].sort((a, b) => b.points - a.points);
  }, [selectedClan]);
  const memberTotalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const memberPageData = paginate(members, memberPage, PAGE_SIZE);

  // ---- Table renderers ----
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
                key={`${row.name}-${absoluteRank}`}
                className={`${
                  i % 2 === 0 ? "bg-green-900/40" : "bg-green-800/40"
                } hover:bg-green-700/50 transition`}
              >
                <td className="p-3 font-semibold">{medalFor(absoluteRank)}</td>
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-right font-bold text-yellow-300">
                  {row.points.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderClanTable = (data, offset = 0) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-green-800/70 text-yellow-400">
            <th className="p-3">Rank</th>
            <th className="p-3">Clan</th>
            <th className="p-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const absoluteRank = offset + i + 1;
            return (
              <tr
                key={`${row.clan}-${absoluteRank}`}
                className={`${
                  i % 2 === 0 ? "bg-green-900/40" : "bg-green-800/40"
                } hover:bg-green-700/50 transition`}
              >
                <td className="p-3 font-semibold">{medalFor(absoluteRank)}</td>
                <td className="p-3">{row.clan}</td>
                <td className="p-3 text-right font-bold text-yellow-300">
                  {row.points.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderMemberTable = (data, offset = 0) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-green-800/70 text-yellow-400">
            <th className="p-3">Rank</th>
            <th className="p-3">Member</th>
            <th className="p-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const absoluteRank = offset + i + 1;
            return (
              <tr
                key={`${row.name}-${absoluteRank}`}
                className={`${
                  i % 2 === 0 ? "bg-green-900/40" : "bg-green-800/40"
                } hover:bg-green-700/50 transition`}
              >
                <td className="p-3 font-semibold">{medalFor(absoluteRank)}</td>
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-right font-bold text-yellow-300">
                  {row.points.toLocaleString()}
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

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setTab("season")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              tab === "season"
                ? "bg-yellow-500 text-black"
                : "bg-green-900 border border-green-700 hover:bg-green-800"
            }`}
          >
            Season Top
          </button>
          <button
            onClick={() => setTab("clans")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              tab === "clans"
                ? "bg-yellow-500 text-black"
                : "bg-green-900 border border-green-700 hover:bg-green-800"
            }`}
          >
            Clan Top
          </button>
          <button
            onClick={() => setTab("clanMembers")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              tab === "clanMembers"
                ? "bg-yellow-500 text-black"
                : "bg-green-900 border border-green-700 hover:bg-green-800"
            }`}
          >
            Members in Clan
          </button>
        </div>

        {/* SEASON TAB */}
        {tab === "season" && (
          <div className="w-full">
            {/* Your Rank Summary */}
            <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-5 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-green-300/90">Your Rank</div>
                  <div className="text-2xl font-extrabold">
                    {medalFor(yourRank)} • {currentUser.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-300/90">Your Points</div>
                  <div className="text-2xl font-extrabold text-yellow-300">
                    {currentUser.points.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress to next */}
              {yourNextOpponent && diffToNext > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-300 mb-1">
                    {diffToNext.toLocaleString()} pts to pass{" "}
                    <span className="font-semibold">{yourNextOpponent.name}</span>
                  </div>
                  <div className="w-full h-2 bg-green-900 rounded-full overflow-hidden">
                    {/* purely visual; you could compute real progress if you track deltas */}
                    <div className="h-full bg-yellow-500 w-1/3" />
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-6">
              {renderSeasonTable(
                seasonPageData,
                (seasonPage - 1) * PAGE_SIZE
              )}
              <Paginator
                page={seasonPage}
                totalPages={seasonTotalPages}
                onPrev={() =>
                  setSeasonPage((p) => Math.max(1, p - 1))
                }
                onNext={() =>
                  setSeasonPage((p) => Math.min(seasonTotalPages, p + 1))
                }
              />
            </div>
          </div>
        )}

        {/* CLANS TAB */}
        {tab === "clans" && (
          <div className="w-full">
            {/* Your Clan Summary */}
            <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-5 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-green-300/90">Your Clan</div>
                  <div className="text-2xl font-extrabold">
                    {yourClanRow.clan}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-green-300/90">Rank</div>
                  <div className="text-2xl font-extrabold">
                    {yourClanRank > 0 ? medalFor(yourClanRank) : "—"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-300/90">Clan Points</div>
                  <div className="text-2xl font-extrabold text-yellow-300">
                    {yourClanRow.points.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-6">
              {renderClanTable(
                clanPageData,
                (clanPage - 1) * PAGE_SIZE
              )}
              <Paginator
                page={clanPage}
                totalPages={clanTotalPages}
                onPrev={() => setClanPage((p) => Math.max(1, p - 1))}
                onNext={() => setClanPage((p) => Math.min(clanTotalPages, p + 1))}
              />
            </div>
          </div>
        )}

        {/* CLAN MEMBERS TAB */}
        {tab === "clanMembers" && (
          <div className="w-full">
            {/* Clan Picker */}
            <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-5 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-green-300/90">Selected Clan</div>
                  <div className="text-2xl font-extrabold">
                    {selectedClan}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-green-300/90 mr-2">
                    Change:
                  </label>
                  <select
                    className="bg-green-900 border border-green-700 rounded px-3 py-2"
                    value={selectedClan}
                    onChange={(e) => {
                      setSelectedClan(e.target.value);
                      setMemberPage(1);
                    }}
                  >
                    {Object.keys(clanMembersByClan).map((cl) => (
                      <option key={cl} value={cl}>
                        {cl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-green-950/80 backdrop-blur-md rounded-xl shadow-xl p-6">
              {members.length === 0 ? (
                <div className="text-center text-green-200">
                  No members found for this clan.
                </div>
              ) : (
                <>
                  {renderMemberTable(
                    memberPageData,
                    (memberPage - 1) * PAGE_SIZE
                  )}
                  <Paginator
                    page={memberPage}
                    totalPages={memberTotalPages}
                    onPrev={() =>
                      setMemberPage((p) => Math.max(1, p - 1))
                    }
                    onNext={() =>
                      setMemberPage((p) => Math.min(memberTotalPages, p + 1))
                    }
                  />
                </>
              )}
            </div>
          </div>
        )}

        <Link to="/" className="mt-10">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
            ⬅ Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};
