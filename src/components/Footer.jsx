import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-100 py-6  px-6 ">
      <div className=" mx-auto flex flex-col md:flex-row  justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-bold text-yellow-400">Bus Tracker</h2>
          <p className="text-sm">Real-time college bus tracking system.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-md font-semibold text-white">Quick Links</h2>
          <ul className="text-sm space-y-1">
            <li>
              <a href="/about" className="hover:text-yellow-400">
                About
              </a>
            </li>
            <li>
              <a href="/help-support" className="hover:text-yellow-400">
                Help & Support
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-yellow-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-md font-semibold text-white">Contact Us</h2>
          <p className="text-sm flex items-center justify-center md:justify-start">
            <FaEnvelope className="mr-2 text-yellow-400" />
            <a
              href="mailto:support@bus-tracker.com"
              className="hover:text-yellow-400"
            >
              support@bus-tracker.com
            </a>
          </p>
          <p className="text-sm flex items-center justify-center md:justify-start">
            <FaPhone className="mr-2 text-yellow-400" /> +91 9876543210
          </p>
          <p className="text-sm flex items-center justify-center md:justify-start">
            <FaWhatsapp className="mr-2 text-yellow-400" />
            <a
              href="https://wa.me/919876543210"
              className="hover:text-yellow-400"
            >
              WhatsApp Us
            </a>
          </p>
          <p className="text-sm flex items-center justify-center md:justify-start">
            <FaMapMarkerAlt className="mr-2 text-yellow-400" /> IIIT Bhopal,
            Madhya Pradesh
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-4 pt-2 text-center text-sm">
        © {new Date().getFullYear()} Bus Tracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
