import { useState } from "react";
import { auth } from "../services/firebase"; // Firebase setup
import { sendEmailVerification } from "firebase/auth";

const VerifyOTP = () => {
  const [otp, setOTP] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      // Mock OTP, replace with backend verification
      setMessage("✅ OTP Verified! Redirecting...");
    } else {
      setMessage("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔒 Verify OTP</h2>
        {message && <p className="text-sm text-red-400">{message}</p>}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white mt-2"
        />
        <button
          onClick={handleVerifyOTP}
          className="w-full px-4 py-2 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
