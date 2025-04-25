import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiMap,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Adjust according to auth method
    window.location.href = "/login"; // Redirect to login
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center fixed w-full top-0 left-0 z-50 shadow-md">
      {/* Logo */}
      <Link
        to="/admin-dashboard"
        className="text-xl font-semibold text-yellow-400"
      >
        Admin Panel
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Navigation Links */}
      <div
        className={`flex flex-col lg:flex-row gap-6 absolute lg:relative top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent p-4 lg:p-0 ${
          menuOpen ? "block" : "hidden lg:flex"
        }`}
      >
        <Link
          to="/manage-users"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiUsers size={20} /> Users
        </Link>
        <Link
          to="/bus-tracking"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiMap size={20} /> Tracking
        </Link>
        <Link
          to="/notifications"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiBell size={20} /> Notifications
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiSettings size={20} /> Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-400"
        >
          <FiLogOut size={20} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminHeader;
