import { useAuth } from "../context/AuthContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BusFront,
  LogOut,
  LayoutDashboard,
  Pencil,
  Save,
  ArrowLeft,
  Camera,
} from "lucide-react";

const DriverProfilePage = () => {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || "");
  const [editedBus, setEditedBus] = useState(userData?.busNumber || "");
  const [editedRoute, setEditedRoute] = useState(userData?.route || "");
  const [avatar, setAvatar] = useState(
    user?.photoURL ||
      `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541`
  );

  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSave = () => {
    // TODO: Save to Firebase or update context
    console.log("Updated Info:", {
      name: editedName,
      busNumber: editedBus,
      route: editedRoute,
      avatar,
    });
    setEditMode(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // set image preview
        // TODO: Upload to Firebase Storage and update Firestore
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-4 relative">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          />
          <div
            className="absolute bottom-0 right-[38%] bg-yellow-400 p-1 rounded-full cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <Camera size={16} className="text-black" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Basic Info */}
        <div className="text-center mb-6">
          {editMode ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-xl font-bold text-yellow-400 bg-transparent border-b border-yellow-400 text-center outline-none w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold text-yellow-400">
              {user?.displayName || userData?.name || "Driver"}
            </h1>
          )}
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/driver-dashboard")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            <LayoutDashboard size={20} /> Go to Dashboard
          </button>

          <button
            onClick={editMode ? handleSave : () => setEditMode(true)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${
              editMode
                ? "bg-green-600 hover:bg-green-500"
                : "bg-blue-400 hover:bg-blue-500"
            } text-white font-semibold rounded-lg transition`}
          >
            {editMode ? <Save size={20} /> : <Pencil size={20} />}
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-500 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverProfilePage;