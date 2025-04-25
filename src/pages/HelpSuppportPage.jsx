import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HelpSupportPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I track my bus?",
      answer:
        "Login to the app and select your route. The live bus location will be shown on the map.",
    },
    {
      question: "Why is my bus not showing on the map?",
      answer:
        "This can happen due to GPS issues. Ensure your internet is working, and try refreshing the page.",
    },
    {
      question: "Can I report a delayed bus?",
      answer:
        "Yes! Use the issue reporting form below to notify the admin about delays.",
    },
  ];

  return (
    <div className="flex  overflow-x-hidden flex-col min-h-screen bg-gray-900 text-white">
    

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          Help & Support
        </h1>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-md shadow-md cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <span className="text-yellow-400">
                      {openFAQ === index ? "−" : "+"}
                    </span>
                  </div>
                  {openFAQ === index && (
                    <p className="mt-2 text-gray-300">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Issue Reporting Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Report an Issue
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-white"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-white"
                required
              />
              <textarea
                placeholder="Describe the issue..."
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-white h-24"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>

        
      </div>

      
    </div>
  );
};

export default HelpSupportPage;
