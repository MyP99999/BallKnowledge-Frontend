import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { Overlay } from "../components/Overlay";

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    let called = false;

    const verifyAccount = async () => {
      if (called) return; // prevent double calls
      called = true;

      try {
        const res = await api.get(`/auth/verify?token=${token}`);
        console.log("✅ Backend response:", res.data);
        setMessage(
          "✅ " + res.data.message || "✅ Account verified successfully!"
        );
      } catch (err) {
        console.error("❌ Error:", err.response?.data);
        setMessage(
          err.response?.data?.message || "❌ Invalid or expired token."
        );
      }
    };

    if (token) {
      verifyAccount();
    } else {
      setMessage("❌ No token provided.");
    }
  }, [token]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-green-950 text-white px-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/pitch.jpg')" }}
      />

      {/* Dark overlay */}
      <Overlay />

      {/* Content */}
      <div className="relative bg-green-950/70 border border-green-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
        <p className="text-lg">{message}</p>

        {message.toLowerCase().includes("success") && (
          <a
            href="/login"
            className="mt-6 inline-block bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Go to Login
          </a>
        )}
      </div>
    </div>
  );
}
