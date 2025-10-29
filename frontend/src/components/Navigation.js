//  import { useState } from "react";
// import { Leaf } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// const Navigation = () => {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation(); // ✅ to check current page

//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//     navigate("/");
//   };

//   // Scroll smoothly to section
//   const scrollToSection = (id) => {
//     const section = document.getElementById(id);
//     if (section) {
//       window.scrollTo({
//         top: section.offsetTop - 60, // offset for navbar height
//         behavior: "smooth",
//       });
//     }
//   };

//   // ✅ Check if current page is homepage
//   const isHomePage = location.pathname === "/";

//   return (
//     <nav className="border-b bg-white fixed top-0 left-0 w-full z-50 shadow-sm m-0 p-0">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left side: Logo */}
//           <div className="flex items-center space-x-2">
//             <Leaf className="h-8 w-8 text-green-500" />
//             <Link to="/" className="text-xl font-bold text-gray-900">
//               CityZen
//             </Link>
//           </div>

//           {/* ✅ Middle: Show navigation links only on homepage */}
//           {isHomePage && (
//             <div className="hidden md:flex items-center space-x-8">
//               <button
//                 onClick={() => scrollToSection("about")}
//                 className="text-gray-700 hover:text-green-500 font-medium"
//               >
//                 About us
//               </button>
//               <button
//                 onClick={() => scrollToSection("services")}
//                 className="text-gray-700 hover:text-green-500 font-medium"
//               >
//                 Services
//               </button>
//               <button
//                 onClick={() => scrollToSection("community")}
//                 className="text-gray-700 hover:text-green-500 font-medium"
//               >
//                 Community
//               </button>
//               <button
//                 onClick={() => scrollToSection("contact")}
//                 className="text-gray-700 hover:text-green-500 font-medium"
//               >
//                 Contact us
//               </button>
//             </div>
//           )}

//           {/* Right side: Auth */}
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="font-medium text-gray-700 flex items-center"
//                 >
//                   Welcome, {user.name}
//                   <svg
//                     className="h-4 w-4 ml-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-gray-600 hover:text-green-500 transition-colors font-medium"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;


// import { useState } from "react";
// import { Leaf, Menu, X } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// const Navigation = () => {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//     navigate("/");
//   };

//   // ✅ Scroll smoothly to section (used for homepage links)
//   const scrollToSection = (id) => {
//     const section = document.getElementById(id);
//     if (section) {
//       window.scrollTo({
//         top: section.offsetTop - 60,
//         behavior: "smooth",
//       });
//     }
//   };

//   const isHomePage = location.pathname === "/";

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
//       <div className="flex justify-between items-center w-full h-16 px-4 sm:px-6">
//         {/* ---------- LEFT: LOGO ---------- */}
//         <div className="flex items-center space-x-2">
//           <Leaf className="h-8 w-8 text-green-500" />
//           <Link to="/" className="text-xl font-bold text-gray-900">
//             CityZen
//           </Link>
//         </div>

//         {/* ---------- CENTER: NAV LINKS (Only on homepage) ---------- */}
//         {isHomePage && (
//           <div className="hidden md:flex items-center space-x-8">
//             <button
//               onClick={() => scrollToSection("about")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               About us
//             </button>
//             <button
//               onClick={() => scrollToSection("services")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               Services
//             </button>
//             <button
//               onClick={() => scrollToSection("community")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               Community
//             </button>
//             <button
//               onClick={() => scrollToSection("contact")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               Contact us
//             </button>
//           </div>
//         )}

//         {/* ---------- RIGHT: AUTH & DROPDOWN ---------- */}
//         <div className="flex items-center space-x-4">
//           {user ? (
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="font-medium text-gray-700 flex items-center hover:text-green-600 transition"
//               >
//                 Welcome, {user.name}
//                 <svg
//                   className="h-4 w-4 ml-1"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {/* Dropdown */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="text-gray-600 hover:text-green-500 transition font-medium"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}

//           {/* ---------- MOBILE MENU BUTTON ---------- */}
//           {isHomePage && (
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden text-gray-700 hover:text-green-600 transition"
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ---------- MOBILE MENU LINKS ---------- */}
//       {isMobileMenuOpen && isHomePage && (
//         <div className="md:hidden bg-white shadow-inner border-t px-4 py-3 space-y-3">
//           <button
//             onClick={() => scrollToSection("about")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             About us
//           </button>
//           <button
//             onClick={() => scrollToSection("services")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             Services
//           </button>
//           <button
//             onClick={() => scrollToSection("community")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             Community
//           </button>
//           <button
//             onClick={() => scrollToSection("contact")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             Contact us
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navigation;



// import { useState } from "react";
// import { Leaf, Menu, X, User } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// const Navigation = () => {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//     navigate("/");
//   };

//   // ✅ Scroll smoothly to section (for homepage)
//   const scrollToSection = (id) => {
//     const section = document.getElementById(id);
//     if (section) {
//       window.scrollTo({
//         top: section.offsetTop - 60,
//         behavior: "smooth",
//       });
//     }
//   };

//   const isHomePage = location.pathname === "/";

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
//       <div className="flex justify-between items-center w-full h-16 px-4 sm:px-6">
//         {/* ---------- LEFT: LOGO ---------- */}
//         <div className="flex items-center space-x-2 pl-11">
//           <Leaf className="h-8 w-8 text-green-500" />
//           <Link to="/" className="text-xl font-bold text-gray-900">
//             CityZen
//           </Link>
//         </div>

      


//         {/* ---------- CENTER: NAV LINKS (Homepage only) ---------- */}
//         {isHomePage && (
//           <div className="hidden md:flex items-center space-x-8">
//             <button
//               onClick={() => scrollToSection("about")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               About us
//             </button>
//             <button
//               onClick={() => scrollToSection("services")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               Services
//             </button>
//             <button
//               onClick={() => scrollToSection("community")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               Community
//             </button>
//             <button
//               onClick={() => scrollToSection("contact")}
//               className="text-gray-700 hover:text-green-500 font-medium transition"
//             >
//               Contact us
//             </button>
//           </div>
//         )}

//         {/* ---------- RIGHT: USER & AUTH ---------- */}
//         <div className="flex items-center space-x-4">
//           {user ? (
//             <div className="relative">
//               {/* User Button with Profile Picture */}
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 font-medium text-gray-700 hover:text-green-600 transition"
//               >
//                 {/* Profile Picture */}
//                 <img
//                   src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
//                   alt="Profile"
//                   className="h-8 w-8 rounded-full border border-gray-300 object-cover"
//                 />
//                 <span>Welcome, {user.name}</span>
//                 <svg
//                   className="h-4 w-4 ml-1"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {/* Dropdown */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="text-gray-600 hover:text-green-500 transition font-medium"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}

//           {/* ---------- MOBILE MENU TOGGLE ---------- */}
//           {isHomePage && (
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden text-gray-700 hover:text-green-600 transition"
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ---------- MOBILE MENU LINKS ---------- */}
//       {isMobileMenuOpen && isHomePage && (
//         <div className="md:hidden bg-white shadow-inner border-t px-4 py-3 space-y-3">
//           <button
//             onClick={() => scrollToSection("about")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             About us
//           </button>
//           <button
//             onClick={() => scrollToSection("services")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             Services
//           </button>
//           <button
//             onClick={() => scrollToSection("community")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             Community
//           </button>
//           <button
//             onClick={() => scrollToSection("contact")}
//             className="block w-full text-left text-gray-700 hover:text-green-500 font-medium"
//           >
//             Contact us
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navigation;


// // src/components/Navigation.jsx
// import { useState } from "react";
// import { Leaf, Menu, X } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// const NAVBAR_HEIGHT = 64; // px — adjust if your navbar height differs

// const Navigation = () => {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//     navigate("/");
//   };

//   const goAndScroll = (id) => {
//     // close mobile menu & dropdown if open
//     setIsMobileMenuOpen(false);
//     setIsDropdownOpen(false);

//     if (location.pathname === "/") {
//       // already home → scroll immediately
//       const section = document.getElementById(id);
//       if (section) {
//         const offset = section.offsetTop - NAVBAR_HEIGHT;
//         window.scrollTo({ top: offset, behavior: "smooth" });
//       }
//     } else {
//       // navigate to home and pass desired id in state
//       navigate("/", { state: { scrollTo: id } });
//     }
//   };

//   const isHomePage = location.pathname === "/";

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
//       <div className="flex justify-between items-center w-full h-16 px-4 sm:px-6">
//         {/* LEFT: LOGO */}
//         <div className="flex items-center space-x-2 pl-6 md:pl-11">
//           <Leaf className="h-8 w-8 text-green-500" />
//           <Link to="/" className="text-xl font-bold text-gray-900">
//             CityZen
//           </Link>
//         </div>

//         {/* CENTER: LINKS (desktop only) */}
//         {isHomePage && (
//           <div className="hidden md:flex items-center space-x-8">
//             <button onClick={() => goAndScroll("about")} className="text-gray-700 hover:text-green-500 font-medium transition">About us</button>
//             <button onClick={() => goAndScroll("services")} className="text-gray-700 hover:text-green-500 font-medium transition">Services</button>
//             <button onClick={() => goAndScroll("community")} className="text-gray-700 hover:text-green-500 font-medium transition">Community</button>
//             <button onClick={() => goAndScroll("contact")} className="text-gray-700 hover:text-green-500 font-medium transition">Contact us</button>
//           </div>
//         )}

//         {/* RIGHT: AUTH */}
//         <div className="flex items-center space-x-4 pr-6">
//           {user ? (
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 font-medium text-gray-700 hover:text-green-600 transition"
//               >
//                 <img
//                   src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
//                   alt="Profile"
//                   className="h-8 w-8 rounded-full border border-gray-300 object-cover"
//                 />
//                 <span className="hidden sm:inline">Welcome, {user.name}</span>
//                 <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
//                   <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link to="/login" className="text-gray-600 hover:text-green-500 transition font-medium">Sign In</Link>
//               <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium">Sign Up</Link>
//             </>
//           )}

//           {/* MOBILE MENU TOGGLE */}
//           {isHomePage && (
//             <button onClick={() => setIsMobileMenuOpen((s) => !s)} className="md:hidden text-gray-700 hover:text-green-600 transition">
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* MOBILE LINKS */}
//       {isMobileMenuOpen && isHomePage && (
//         <div className="md:hidden bg-white shadow-inner border-t px-4 py-3 space-y-3">
//           <button onClick={() => goAndScroll("about")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">About us</button>
//           <button onClick={() => goAndScroll("services")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Services</button>
//           <button onClick={() => goAndScroll("community")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Community</button>
//           <button onClick={() => goAndScroll("contact")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium">Contact us</button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navigation;



// src/components/Navigation.jsx
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
    navigate("/");
  };

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
      <div className="flex justify-between items-center w-full h-16 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {/* LEFT: LOGO - Optimized for mobile S */}
        <div className="flex items-center space-x-1 xs:space-x-2 flex-shrink-0">
          <Leaf className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-green-500" />
          <Link to="/" className="text-lg xs:text-xl font-bold text-gray-900 whitespace-nowrap">
            CityZen
          </Link>
        </div>

        {/* CENTER: LINKS (tablet and desktop) */}
        {isHomePage && (
          <div className="hidden sm:flex items-center space-x-4 lg:space-x-8 mx-4 flex-1 justify-center">
            <button 
              onClick={() => goAndScroll("about")} 
              className="text-gray-700 hover:text-green-500 font-medium transition whitespace-nowrap text-sm lg:text-base"
            >
              About us
            </button>
            <button 
              onClick={() => goAndScroll("services")} 
              className="text-gray-700 hover:text-green-500 font-medium transition whitespace-nowrap text-sm lg:text-base"
            >
              Services
            </button>
            <button 
              onClick={() => goAndScroll("community")} 
              className="text-gray-700 hover:text-green-500 font-medium transition whitespace-nowrap text-sm lg:text-base"
            >
              Community
            </button>
            <button 
              onClick={() => goAndScroll("contact")} 
              className="text-gray-700 hover:text-green-500 font-medium transition whitespace-nowrap text-sm lg:text-base"
            >
              Contact us
            </button>
          </div>
        )}

        {/* RIGHT: AUTH - Optimized for mobile S */}
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 flex-shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 xs:space-x-2 font-medium text-gray-700 hover:text-green-600 transition text-sm xs:text-base"
              >
                <img
                  src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  alt="Profile"
                  className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 rounded-full border border-gray-300 object-cover"
                />
                <span className="hidden xs:inline whitespace-nowrap">Welcome, {user.name.split(' ')[0]}</span>
                <svg className="h-3 w-3 xs:h-4 xs:w-4 ml-1 hidden xs:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 xs:w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                  <button onClick={handleLogout} className="block w-full text-left px-3 xs:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-green-500 transition font-medium whitespace-nowrap text-xs xs:text-sm lg:text-base"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-green-500 text-white px-2 py-1.5 xs:px-3 xs:py-2 lg:px-4 rounded-md hover:bg-green-600 transition font-medium whitespace-nowrap text-xs xs:text-sm lg:text-base"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* MOBILE MENU TOGGLE */}
          {isHomePage && (
            <button 
              onClick={() => setIsMobileMenuOpen((s) => !s)} 
              className="sm:hidden text-gray-700 hover:text-green-600 transition ml-1 xs:ml-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 xs:h-6 xs:w-6" /> : <Menu className="h-5 w-5 xs:h-6 xs:w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE LINKS - Optimized for mobile S */}
      {isMobileMenuOpen && isHomePage && (
        <div className="sm:hidden bg-white shadow-inner border-t px-3 xs:px-4 py-3 space-y-2 xs:space-y-3 absolute top-16 left-0 w-full z-50">
          <button onClick={() => goAndScroll("about")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium py-2 text-sm xs:text-base">
            About us
          </button>
          <button onClick={() => goAndScroll("services")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium py-2 text-sm xs:text-base">
            Services
          </button>
          <button onClick={() => goAndScroll("community")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium py-2 text-sm xs:text-base">
            Community
          </button>
          <button onClick={() => goAndScroll("contact")} className="block w-full text-left text-gray-700 hover:text-green-500 font-medium py-2 text-sm xs:text-base">
            Contact us
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;