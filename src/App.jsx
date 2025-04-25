import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HelpSupportPage from "./pages/HelpSuppportPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import BusTrackingPage from "./pages/BusTrackingPage";
import BusRouteDetails from "./pages/BusRouteDetailsPage";
import MapComponent from "./components/MapComponent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DriverProfilePage from "./pages/DriverProfilePage";
import AdminDashboard from "./dashboard/AdminDashboard";
import DriverDashboard from "./dashboard/DriverDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOtp";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";



function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/signup"; // ✅ Hide Header & Footer on Login/Signup pages

  return (
    <>
      {!hideHeaderFooter && <Header />} {/* ✅ Hide Header on login/signup */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<PrivateRoute />}>
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/driver-dashboard" element = {<DriverDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/help-support" element={<HelpSupportPage />} />
          <Route path="/bus-route-details" element={<BusRouteDetails />} />
          <Route path="/bus-tracking" element={<BusTrackingPage />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/driver-profile" element={<DriverProfilePage />} />{" "}
          {/* ✅ Added new driver profile route */}
        </Route>
      </Routes>
      {!hideHeaderFooter && <Footer />} {/* ✅ Hide Footer on login/signup */}
    </>
  );
}

export default App;
