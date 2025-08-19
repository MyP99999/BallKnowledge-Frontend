// src/components/Footer.jsx
import { FaTwitter, FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-green-950/80 border-t border-green-800 text-gray-300 w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-900 to-green-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,0,0.08),transparent_70%)]"></div>
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <img src="/Ball.png" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">
                Ball Knowledge
              </span>
            </div>
            <p className="text-sm text-gray-400">
              A fun way to test your football knowledge, compete with friends,
              and climb the leaderboard. ⚽
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-yellow-400 transition">
                  🏠 Home
                </a>
              </li>
              <li>
                <a
                  href="/leaderboard"
                  className="hover:text-yellow-400 transition"
                >
                  🏆 Leaderboard
                </a>
              </li>
              <li>
                <a href="/play" className="hover:text-yellow-400 transition">
                  🎮 Play Game
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-400 transition">
                  ℹ️ About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-sm mb-2 flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" /> support@myp.com
            </p>
            <div className="flex gap-4 mt-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter className="text-xl hover:text-yellow-400 transition" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook className="text-xl hover:text-yellow-400 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram className="text-xl hover:text-yellow-400 transition" />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-green-800 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Ball Knowledge . All rights reserved.
        </div>
      </div>
    </footer>
  );
}
