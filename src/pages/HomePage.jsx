import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer.jsx";
import { FiMap, FiBell, FiHelpCircle, FiList } from "react-icons/fi";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-100 dark:bg-gray-900">
       

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl  bg-black text-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 text-center backdrop-blur-lg border border-yellow-400">
          {/* Title */}
          <h1 className="text-4xl font-bold text-yellow-400 leading-relaxed">
            COLLEGE BUS TRACKING SYSTEM 🚍
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Get real-time updates on bus locations and schedules.
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <div
              onClick={() => navigate("/bus-tracking")}
              className="flex flex-col items-center p-6 bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              <FiMap className="text-5xl mb-3" />
              <span className="text-lg font-semibold">Track Bus</span>
            </div>

            <div
              onClick={() => navigate("/bus-route-details")}
              className="flex flex-col items-center p-6 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              <FiList className="text-5xl mb-3" />
              <span className="text-lg font-semibold">
                Bus Routes & Schedule
              </span>
            </div>

            <div
              onClick={() => navigate("/notifications")}
              className="flex flex-col items-center p-6 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              <FiBell className="text-5xl mb-3" />
              <span className="text-lg font-semibold">Check Notifications</span>
            </div>

            <div
              onClick={() => navigate("/help-support")}
              className="flex flex-col items-center p-6 bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              <FiHelpCircle className="text-5xl mb-3" />
              <span className="text-lg font-semibold">Help & Support</span>
            </div>
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default HomePage;

