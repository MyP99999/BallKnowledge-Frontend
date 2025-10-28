import { useEffect, useState } from "react";
import { Overlay } from "../components/Overlay";
import { useAuth } from "../context/AuthContext";
import ChangePasswordModal from "../components/ChangePasswordModal";
import api from "../api/axios";

export function ProfilePage() {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0); 
  const [rank, setRank] = useState(null);
  const isGoogleUser = user.isExternalAuth;

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
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-950 text-white">
        <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
        <p className="text-gray-400">Please login to see your profile.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-green-950 text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/pitch.jpg')" }}
      />
      <Overlay />

      <div className="relative z-10 flex flex-col items-center pt-24 px-4">
        <div className="w-full max-w-3xl bg-green-950/70 border border-green-900 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-green-700">
            <div className="w-24 h-24 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-4xl shadow-lg">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
              <p className="text-gray-300">{user.email || "No email"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-green-800/40 rounded-xl p-6 text-center shadow-md hover:bg-green-800/60 transition">
              <p className="text-yellow-400 text-2xl">⚽</p>
              <p className="text-2xl font-bold mt-2">{totalPoints}</p>
              <p className="text-gray-400 text-sm">Total Points</p>
            </div>
            <div className="bg-green-800/40 rounded-xl p-6 text-center shadow-md hover:bg-green-800/60 transition">
              <p className="text-purple-400 text-2xl">🏆</p>
              <p className="text-2xl font-bold mt-2">#{rank}</p>
              <p className="text-gray-400 text-sm">Global Rank</p>
            </div>
            <div className="bg-green-800/40 rounded-xl p-6 text-center shadow-md hover:bg-green-800/60 transition">
              <p className="text-red-400 text-2xl">❤️</p>
              <p className="text-2xl font-bold mt-2">5 / 5</p>
              <p className="text-gray-400 text-sm">Lives</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-600 shadow-md transition">
              Edit Profile
            </button>

            {!isGoogleUser && (
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 shadow-md transition"
              >
                Change Password
              </button>
            )}

            <button className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 shadow-md transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
