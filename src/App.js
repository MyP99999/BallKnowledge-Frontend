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
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import GoogleCallback from "./pages/GoogleCallbackPage";
import { ProfilePage } from "./pages/ProfilePage";
import { VerifyPage } from "./pages/VerifyPage";   // ✅ import the verify page
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminQuestionsPage from "./pages/admin/AdminQuestionsPage";

function App() {
  const { user, loading } = useAuth();
  console.log(user);

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

          <Route path="/leaderboard" element={<LeaderboardPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/match" element={<MatchGame />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* ✅ New verify route */}
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/google-callback" element={<GoogleCallbackPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<div>Users & Stats (coming soon)</div>} />
            <Route path="questions" element={<AdminQuestionsPage />} />
            <Route path="daily" element={<div>Daily Challenge (coming soon)</div>} />
          </Route>

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
