export const RegisterPage = () => {
  return (
    <div className="bg-gradient-to-b from-green-900 to-green-700 min-h-screen flex items-center justify-center px-4">
      <div className="bg-green-950 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your username"
            />
          </div>
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
            Register
          </button>
        </form>

        {/* Google Register */}
        <div className="mt-6">
          <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 font-semibold py-3 rounded-lg shadow hover:bg-gray-100 transition">
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
