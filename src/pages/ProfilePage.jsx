import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://via.placeholder.com/150";

const ProfilePage = () => {
  const { user, logout, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const storedPhoto = localStorage.getItem("profileImage");
  const storedName =
    localStorage.getItem("profileName") || user?.displayName || "User";
  const storedRole = localStorage.getItem("userType") || "student";

  const [name, setName] = useState(storedName);
  const [photoURL, setPhotoURL] = useState(
    storedPhoto || user?.photoURL || DEFAULT_AVATAR
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      localStorage.setItem("profileImage", dataUrl);
      setPhotoURL(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = () => {
    localStorage.setItem("role")
    localStorage.setItem("profileName", name);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters!");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setMessage("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (error) {
      setMessage("❌ Failed to update password!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-6 text-center border border-gray-700">
        <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
          <img
            src={photoURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <label
            htmlFor="fileInput"
            className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-400 transition-all"
          >
            📷
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-400">{storedRole.toUpperCase()}</p>

        {/* Change Password Section */}
        {isChangingPassword && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg text-left">
            <h3 className="text-lg font-semibold mb-2">🔑 Change Password</h3>
            {message && <p className="text-sm text-red-400">{message}</p>}
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 bg-gray-600 border border-gray-500 rounded mt-2 text-white"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-2 bg-gray-600 border border-gray-500 rounded mt-2 text-white"
            />
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              Show Password
            </label>
            <button
              onClick={handleChangePassword}
              className="w-full px-4 py-2 mt-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all"
            >
              Update Password
            </button>
            <button
              onClick={() => setIsChangingPassword(false)}
              className="w-full px-4 py-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          {!isChangingPassword && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
              >
                Change Password
              </button>
              {storedRole === "admin" && (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
                >
                  Go to Admin Dashboard
                </button>
              )}
            </>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
