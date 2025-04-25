import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(
    localStorage.getItem("userType") || null
  );

  useEffect(() => {
    if (userType) {
      localStorage.setItem("userType", userType);
    }
  }, [userType]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (!userData.userType) {
          setError(
            "User role is missing in the database. Please contact support."
          );
          return;
        }

        localStorage.setItem("userType", userData.userType);

        // Redirect based on user role
        if (userData.userType === "driver") {
          navigate("/driver-profile");
        } else if (userData.userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        setError("User data not found in Firestore. Please contact support.");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("❌ Incorrect password! Try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("❌ No user found with this email.");
      } else {
        setError("⚠️ Login failed. Please check your credentials.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError("✅ Password reset link sent to your email!");
    } catch (error) {
      setError("Failed to send reset email. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white items-center justify-center px-6 py-12">
      {userType === null ? (
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-semibold text-yellow-400 mb-6">
            Login As
          </h1>
          <button
            className="w-full py-3 bg-blue-600 text-white rounded-lg mb-4 text-lg font-medium hover:bg-blue-700 transition"
            onClick={() => setUserType("student")}
          >
            Student
          </button>
          <button
            className="w-full py-3 bg-green-600 text-white rounded-lg mb-4 text-lg font-medium hover:bg-green-700 transition"
            onClick={() => setUserType("driver")}
          >
            Driver
          </button>
          <button
            className="w-full py-3 bg-red-600 text-white rounded-lg text-lg font-medium hover:bg-red-700 transition"
            onClick={() => setUserType("admin")}
          >
            Admin
          </button>
        </div>
      ) : (
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-yellow-400 mb-6">
            {userType === "driver"
              ? "Driver Login"
              : userType === "admin"
              ? "Admin Login"
              : "Student Login"}
          </h1>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-lg text-lg font-medium hover:bg-green-600 transition"
            >
              Login
            </button>
          </form>

          <p
            className="text-gray-400 text-sm text-center mt-4 cursor-pointer hover:underline"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>

          <p className="text-gray-400 text-sm text-center mt-6">
            New User?{" "}
            <span
              className="text-yellow-400 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate(`/signup?type=${userType}`)}
            >
              Sign Up as{" "}
              {userType === "driver"
                ? "Driver"
                : userType === "admin"
                ? "Admin"
                : "Student"}
            </span>
          </p>

          <p
            className="text-gray-400 text-xs text-center mt-4 cursor-pointer hover:underline"
            onClick={() => {
              setUserType(null);
              localStorage.removeItem("userType");
            }}
          >
            Back to Selection
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
