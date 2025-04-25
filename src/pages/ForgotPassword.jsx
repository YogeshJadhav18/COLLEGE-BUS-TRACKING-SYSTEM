import { useState } from "react";
import { auth } from "../services/firebase"; // Firebase config
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("❌ Please enter a valid email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent. Check your inbox!");
    } catch (error) {
      setMessage("❌ Failed to send reset email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔑 Forgot Password?</h2>
        {message && <p className="text-sm text-red-400">{message}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white mt-2"
        />
        <button
          onClick={handleResetPassword}
          className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
        >
          Send Reset Email
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
