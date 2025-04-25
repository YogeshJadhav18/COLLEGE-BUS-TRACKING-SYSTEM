import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const busRoutes = [
  {
    id: 1,
    routeName: "Route Bus 101 ",
    start: "MANIT GATE",
    end: "SINGHARCHOLI ",
    stops: ["Roshanpura square", "Kamla park road", "Kamla park road","Kohefiza square","Lalghati square","Halalpura","Sant Hindaram","Bairagarh",
            "Anchavati Colony"],
    timing: "7:30 AM - 6:00 PM",
  },
  {
    id: 2,
    routeName: "Route Bus 102",
    start: "MANIT GATE",
    end: "BHOPAL JUNCTION",
    stops: ["Tulsi Nagar","Shivaji Nagar","Mp Nagar","Arera Hills","Jahangirabad","Old Shubash Nagar","New Shubash Nagar","Ashoka Garden",
      "Krishna Campus","Navbhar colony"
    ],
    timing: "6:30 AM - 05:30 PM",
  },
  {
    id: 3,
    routeName: "Route C",
    start: "IT Department",
    end: "Bus Stand",
    stops: ["Hostel 2", "Gate No. 3", "Central Park"],
    timing: "8:00 AM - 05:00PM",
  },
];

const BusRouteDetailsPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 relative">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6 relative">
          <motion.span
            initial={{ x: 400 }} // Start from the right
            animate={{ x: -60 }} // Move towards the left
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block text-4xl mx-2"
          >
            🚌
          </motion.span>
          Bus Tracking & Routes
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
          {busRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-gray-800 border border-yellow-400 shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-xl font-bold text-yellow-400">
                {route.routeName}
              </h3>
              <p className="text-gray-300 mt-2">
                <span className="font-semibold">From:</span> {route.start}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">To:</span> {route.end}
              </p>
              <p className="text-gray-300 mt-2">
                <span className="font-semibold">Stops:</span>{" "}
                {route.stops.join(", ")}
              </p>
              <p className="text-green-400 font-semibold mt-2">
                ⏰ {route.timing}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      
    </div>
  );
};

export default BusRouteDetailsPage;
