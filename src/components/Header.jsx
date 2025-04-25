import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Bell,
  MapPin,
  HelpCircle,
  LogOut,
  LogIn,
  UserPlus,
  BusFront,
  Home,
  Route,
} from "lucide-react"; // Added Home & Route icons

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <>
      {/* 🛠 Fixed Header */}
      <nav className="bg-[#222] text-white p-4 fixed w-full top-0 left-0 z-50 shadow-md">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BusFront className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-semibold">Bus Tracker</span>
          </Link>

          {/* Desktop Navigation (Restricted) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Restricted Links: Only accessible if user is logged in */}
            {user && (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <Home size={20} /> Home
                </Link>
                <Link
                  to="/bus-tracking"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <MapPin size={20} /> Track Bus
                </Link>
                <Link
                  to="/bus-route-details"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <Route size={20} /> Bus Routes
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <Bell size={20} /> Notifications
                </Link>
                <Link
                  to="/help-support"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <HelpCircle size={20} /> Help
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <User size={20} /> Profile
                </Link>
              </>
            )}

            {/* Login/Signup for Unauthenticated Users */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <LogIn size={20} /> Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <UserPlus size={20} /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* 🛠 Push Content Down */}
      <div className="pt-16"></div>

      {/* 🛠 Mobile Menu (Restricted) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#222] text-white p-6 flex flex-col z-50 overflow-hidden">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col gap-6 mt-10">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-lg hover:text-gray-300"
            >
              <Home size={24} /> Home
            </Link>

            {/* Restricted Links: Only accessible if user is logged in */}
            {user && (
              <>
                <Link
                  to="/bus-tracking"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <MapPin size={24} /> Track Bus
                </Link>
                <Link
                  to="/bus-route-details"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <Route size={24} /> Bus Routes
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <Bell size={24} /> Notifications
                </Link>
                <Link
                  to="/help-support"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <HelpCircle size={24} /> Help
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <User size={24} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center gap-2 justify-center"
                >
                  <LogOut size={24} /> Logout
                </button>
              </>
            )}

            {/* Login/Signup for Unauthenticated Users */}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <LogIn size={24} /> Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-gray-300"
                >
                  <UserPlus size={24} /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
