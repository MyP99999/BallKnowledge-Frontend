import { Overlay } from "../components/Overlay";

export const LoginPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-green-700 items-center justify-center bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      {/* Dark overlay */}
      <Overlay />

      <div className="relative bg-green-950/90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-6">
          <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 font-semibold py-3 rounded-lg shadow hover:bg-gray-100 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Login with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-300 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};
