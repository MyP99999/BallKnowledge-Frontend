import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Overlay } from "../components/layout/Overlay";

export const RegisterPage = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(formData);
      setSuccessMsg(
        "Registration successful! Please check your email to verify your account."
      );
    } catch (err) {
      console.error("Register failed:", err);
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-green-700 items-center justify-center bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />

      <div className="relative bg-green-950/90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Register
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}
        {successMsg && (
          <p className="text-green-400 text-center font-semibold mt-4">
            {successMsg}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your username"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 font-semibold py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign up with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-300 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
