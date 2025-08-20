// src/pages/GoogleCallbackPage.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      // Call backend with code
      googleLogin(code)
        .then(() => {
          navigate("/"); // success → go to profile
        })
        .catch((err) => {
          console.error("Google login failed", err);
          navigate("/login"); // fallback
        });
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-green-950">
      <p>Logging in with Google...</p>
    </div>
  );
};

export default GoogleCallbackPage;
