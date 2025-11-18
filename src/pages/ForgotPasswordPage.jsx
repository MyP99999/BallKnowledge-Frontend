// src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Overlay } from "../components/layout/Overlay";
import { forgotPassword } from "../api/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(
        res.data?.message || "If that email exists, we’ve sent a reset link."
      );
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
          "If that email exists, we’ve sent a reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat text-white pt-16"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />
      <div className="relative bg-green-950/90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-gray-300 text-sm mb-4">
          Enter your email and we’ll send you a password reset link.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 text-center text-yellow-300 text-sm">{msg}</div>
        )}

        <div className="text-center text-sm text-gray-300 mt-4">
          <a href="/login" className="text-yellow-400 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
