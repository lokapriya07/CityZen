import { useState } from "react";
import { Leaf } from "lucide-react";
// 1. Import useNavigate from react-router-dom
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 2. Initialize the navigate function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears user session
    setIsDropdownOpen(false); // Closes the dropdown
    // 3. Navigate to the homepage
    navigate("/"); 
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-500" />
            <Link to="/" className="text-xl font-bold text-gray-900">CityZen</Link>
          </div>

          {/* Right side: Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              // --- Logged In View: Dropdown ---
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="font-medium text-gray-700 flex items-center"
                >
                  Welcome, {user.name}
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* --- Dropdown Menu --- */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {/* The onClick handler now calls our new handleLogout function */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // --- Logged Out View ---
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-500 transition-colors font-medium">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;