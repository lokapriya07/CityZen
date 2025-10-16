import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useAuth } from "../components/context/AuthContext"; // Import the useAuth hook to check login status

const HeroSection = () => {
  const { user } = useAuth(); // Get the current user from the context
  const navigate = useNavigate(); // Initialize the navigate function

  // This function will be called when the "Report Waste" button is clicked
  const handleReportWasteClick = () => {
    if (user) {
      // If the user is logged in, navigate to the report issue page
      navigate("/report-issue");
    } else {
      // If the user is not logged in, prompt them to log in first
      alert("Please log in to report waste.");
      // Optionally, you can redirect them directly to the login page:
      // navigate("/login");
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-br from-green-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Clean Communities,
                <span className="text-green-500"> Brighter Future</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of citizens making a difference. Report waste issues, track cleanup progress, and build
                cleaner communities together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Add the onClick handler to this button */}
              <button 
                onClick={handleReportWasteClick} 
                className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Report Waste Now
                <ArrowRight className="h-5 w-5" />
              </button>
              {/* <button className="btn btn-secondary text-lg px-8 py-3">View Dashboard</button> */}
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">5,000+</div>
                <div className="text-sm text-gray-600">Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">50+</div>
                <div className="text-sm text-gray-600">Communities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="/modern-city-with-clean-streets-and-recycling-bins.png"
                alt="Clean modern city with waste management"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;