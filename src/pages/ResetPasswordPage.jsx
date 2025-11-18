// src/pages/ResetPasswordPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../api/authService";
import { Overlay } from "../components/layout/Overlay";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMsg("");
    setOk(false);
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMsg("Invalid or missing reset token.");
      return;
    }
    if (newPassword !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      setOk(true);
      setMsg(res.data?.message || "Password reset successfully.");
    } catch (err) {
      setOk(false);
      setMsg(
        err.response?.data?.message || "Error during password reset. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />
      <div className="relative bg-green-950/90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
        {!token && (
          <div className="text-center text-red-300 mb-4">
            Invalid or missing token.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={loading || !token}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>

        {msg && (
          <div className={`mt-4 text-center text-sm ${ok ? "text-emerald-300" : "text-yellow-300"}`}>
            {msg}
          </div>
        )}

        {ok && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
