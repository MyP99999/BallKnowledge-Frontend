import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { QuizGame } from "./components/QuizGame";
import { MatchGame } from "./components/MatchGame";
import { GamesPage } from "./pages/GamesPage";
import { LandingPage } from "./pages/LandingPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar fix */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Content under navbar */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/games" element={<GamesPage />} />
          {/* <Route path="/games" element={<Games />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/clans" element={<Clans />} /> */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/match" element={<MatchGame />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>

      {/* Footer fix */}
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
