import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    if (["student", "driver"].includes(type)) {
      setUserType(type);
    } else if (type === "admin") {
      setError("Admin accounts must be created manually.");
      setUserType("");
    }
  }, [location.search]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    rollNumber: "",
    address: "",
    busNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  console.log("Form Data:", formData); // Check form data
  console.log("UserType:", userType);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    console.log("User Created:", user);
    console.log("User UID:", user.uid);

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      userType,
      createdAt: new Date(),
      ...(userType === "student" ? { rollNumber: formData.rollNumber } : {}),
      ...(userType === "driver"
        ? { address: formData.address, busNumber: formData.busNumber }
        : {}),
    };

    await setDoc(doc(db, "users", user.uid), userData);
    console.log("User Data Stored Successfully!");

    alert("Signup successful! Redirecting...");
    navigate("/");
  } catch (error) {
    console.error("Signup Error:", error.message);
    setError(error.message);
  }
  setLoading(false);
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-3 left-2 text-xl font-bold px-2 py-1 rounded-md text-white hover:bg-gray-600 transition duration-300"
        >
          ←
        </button>

        <h1 className="text-2xl font-bold text-center mb-4 text-yellow-400">
          {userType
            ? `Create a ${
                userType.charAt(0).toUpperCase() + userType.slice(1)
              } Account`
            : "Signup Disabled"}
        </h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {userType && (
          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
            />

            {userType === "student" && (
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
              />
            )}

            {userType === "driver" && (
              <>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
                />
                <input
                  type="text"
                  name="busNumber"
                  placeholder="Bus Number"
                  value={formData.busNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
