import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const NAVBAR_HEIGHT = 64; // px — adjust if your navbar height differs

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate("/");
  };
  
  // Helper function to close menus when a link is clicked
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  }

  const goAndScroll = (id) => {
    // close mobile menu & dropdown if open
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);

    if (location.pathname === "/") {
      // already home → scroll immediately
      const section = document.getElementById(id);
      if (section) {
        const offset = section.offsetTop - NAVBAR_HEIGHT;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    } else {
      // navigate to home and pass desired id in state
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const isHomePage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
      <div className="flex justify-between items-center w-full h-16 px-4 sm:px-6">
        
        {/* LEFT: MENU TOGGLE + LOGO */}
        <div className="flex items-center space-x-4">
          {/* MOBILE MENU TOGGLE -- MOVED TO LEFT & ALWAYS VISIBLE ON MOBILE */}
          <button
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            className="md:hidden text-gray-700 hover:text-green-600 transition"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* LOGO */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-500" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              CityZen
            </Link>
          </div>
        </div>

        {/* CENTER: LINKS (desktop only) */}
        {isHomePage && (
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => goAndScroll("about")} className="text-gray-700 hover:text-green-500 font-medium transition">About us</button>
            <button onClick={() => goAndScroll("services")} className="text-gray-700 hover:text-green-500 font-medium transition">Services</button>
            <button onClick={() => goAndScroll("community")} className="text-gray-700 hover:text-green-500 font-medium transition">Community</button>
            <button onClick={() => goAndScroll("contact")} className="text-gray-700 hover:text-green-500 font-medium transition">Contact us</button>
          </div>
        )}

        {/* RIGHT: AUTH */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 font-medium text-gray-700 hover:text-green-600 transition"
              >
                <img
                  src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border border-gray-300 object-cover"
                />
                <span className="hidden sm:inline">{user.name}</span>
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            // AUTH LINKS - Desktop only
            // These are now hidden on mobile and will be shown in the dropdown
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-green-500 transition font-medium">Sign In</Link>
              <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE LINKS DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-inner border-t px-4 py-3" id="mobile-menu">
          <div className="space-y-3 pb-4"> {/* Added pb-4 for spacing before the border */}
            {/* Show page links */}
            {isHomePage ? (
              <>
                <button onClick={() => goAndScroll("about")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">About us</button>
                <button onClick={() => goAndScroll("services")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Services</button>
                <button onClick={() => goAndScroll("community")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Community</button>
                <button onClick={() => goAndScroll("contact")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Contact us</button>
              </>
            ) : (
              <Link to="/" onClick={handleMobileLinkClick} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Home</Link>
            )}
          </div>
          
          {/* Show Auth links in mobile menu if not logged in */}
          {!user && (
            <div className="border-t border-gray-200 pt-4 flex items-center justify-around"> {/* Changed to flex and justify-around */}
              <Link 
                to="/login" 
                onClick={handleMobileLinkClick} 
                className="text-gray-700 hover:text-green-500 font-medium px-3 py-2" // Added some padding for better click area
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                onClick={handleMobileLinkClick}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;