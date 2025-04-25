import { useAuth } from "../context/AuthContext";
import { BusFront, MapPin, CalendarDays, User } from "lucide-react";
import { Link } from "react-router-dom";

const DriverDashboard = () => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Greeting Section */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-yellow-400">
          <h1 className="text-2xl font-bold text-yellow-400">
            Welcome, {userData?.name || "Driver"} 👋
          </h1>
          <p className="text-gray-300 mt-1">
            Here is your dashboard. Check your route, schedule, and profile.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Route Details */}
          <Link
            to="/bus-route-details"
            className="bg-yellow-400 hover:bg-yellow-500 transition shadow rounded-lg p-5 flex items-center gap-4 text-black"
          >
            <MapPin size={36} className="text-black" />
            <div>
              <h2 className="font-semibold text-lg">View Route</h2>
              <p className="text-sm">See your assigned bus route</p>
            </div>
          </Link>

          {/* Schedule */}
          <div className="bg-gray-700 hover:bg-gray-600 transition shadow rounded-lg p-5 flex items-center gap-4">
            <CalendarDays size={36} className="text-yellow-400" />
            <div>
              <h2 className="font-semibold text-lg text-white">Schedule</h2>
              <p className="text-gray-300 text-sm">
                Upcoming route timing info
              </p>
            </div>
          </div>

          {/* Profile */}
          <Link
            to="/driver-profile"
            className="bg-yellow-400 hover:bg-yellow-500 transition shadow rounded-lg p-5 flex items-center gap-4 text-black"
          >
            <User size={36} className="text-black" />
            <div>
              <h2 className="font-semibold text-lg">Your Profile</h2>
              <p className="text-sm">Check or update your info</p>
            </div>
          </Link>
        </div>

        {/* Assigned Bus Info */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6 mt-8 border border-yellow-400">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">
            Assigned Bus
          </h2>
          <div className="flex items-center gap-4">
            <BusFront size={40} className="text-yellow-400" />
            <div>
              <p className="font-medium text-white">
                Bus Number:{" "}
                <span className="text-yellow-400">
                  {userData?.busNumber || "N/A"}
                </span>
              </p>
              <p className="text-sm text-gray-300">
                Route: {userData?.route || "Not Assigned Yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;