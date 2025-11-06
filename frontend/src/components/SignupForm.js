// // SignupForm.js

// import { useState, useEffect } from "react";
// import { Form, useNavigate } from "react-router-dom";

// export default function SignupForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("user");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // NEW: State for phone number
//   const [phone, setPhone] = useState("");

//   const [location, setLocation] = useState(null);
//   const [locationError, setLocationError] = useState("");
//   const [isWorker, setIsWorker] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (role === 'worker' || role === 'admin') {
//       setIsWorker(true);
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setLocation({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             });
//             setLocationError("");
//           },
//           (err) => {
//             console.error(err);
//             setLocationError("Location access denied or timed out.");
//             setLocation(null);
//           },
//           { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//         );
//       } else {
//         setLocationError("Geolocation is not supported by your browser.");
//       }
//     } else {
//       setIsWorker(false);
//       setLocation(null);
//       setLocationError("");
//     }
//   }, [role]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password || !name || !confirmPassword) {
//       return setError("Please fill in all fields");
//     }
//     if (password !== confirmPassword) {
//       return setError("Passwords do not match");
//     }
//     if (password.length < 6) {
//       return setError("Password must be at least 6 characters");
//     }
//     // NEW: Validation for phone number if the role is worker
//     if (role === 'worker' && !phone) {
//       return setError("Please enter a phone number for worker accounts");
//     }

//     setLoading(true);

//     const requestBody = { name, email, password, role };

//     // NEW: Add phone number to request body if role is worker
//     if (role === 'worker' && phone) {
//       requestBody.phone = phone;
//     }

//     if (location && (role === 'worker' || role === 'admin')) {
//       requestBody.latitude = location.latitude;
//       requestBody.longitude = location.longitude;
//     }

//     try {
//       const response = await fetch('http://localhost:8001/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.msg || 'Registration failed.');
//       }

//       alert('Registration successful! Please log in.');
//       navigate("/login");

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
//         <h2 className="text-2xl font-bold text-center text-green-700">Create Account</h2>
//         <p className="text-center mb-4">
//           Join CityZen to help make our city cleaner
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label>Full Name</label>
//             <input
//               className="w-full border rounded p-2"
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label>Email</label>
//             <input
//               className="w-full border rounded p-2"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label>Password</label>
//             <input
//               className="w-full border rounded p-2"
//               type="password"
//               placeholder="Create a password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label>Confirm Password</label>
//             <input
//               className="w-full border rounded p-2"
//               type="password"
//               placeholder="Confirm your password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="w-full max-w-full overflow-visible">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Account Type
//             </label>
//             <select
//               className="
//       w-full 
//       border border-gray-300 
//       rounded-lg 
//       px-3 py-2.5 
//       text-sm 
//       bg-white 
//       focus:outline-none 
//       focus:ring-2 focus:ring-green-500 
//       focus:border-green-500 
//       transition-all 
//       appearance-none
//     "
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="user">Citizen - Report waste issues</option>
//               <option value="worker">Worker - Handle cleanup tasks</option>
//               <option value="admin">Administrator - Manage operations</option>
//             </select>
//           </div>

//           {/* NEW: Conditionally render phone input for workers */}
//           {isWorker && (
//             <div>
//               <label>Phone Number</label>
//               <input
//                 className="w-full border rounded p-2"
//                 type="tel"
//                 placeholder="Enter your 10-digit phone number"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required={role === 'worker'} // Make it required only for workers
//               />
//             </div>
//           )}

//           {isWorker && (
//             <div className="text-sm">
//               {location ? (
//                 <p className="text-green-500">✅ Location detected! We'll use this for task assignments.</p>
//               ) : (
//                 <p className="text-red-500">
//                   ❌ {locationError || "Waiting for location permission..."}
//                 </p>
//               )}
//             </div>
//           )}

//           {error && <div className="text-red-500 text-sm">{error}</div>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react"; // 1. REMOVED useContext
import { useNavigate } from "react-router-dom";
// 2. IMPORT useAuth instead of AuthContext
import { useAuth } from "./context/AuthContext"; 

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isWorker, setIsWorker] = useState(false);

  // --- NEW: State for OTP flow ---
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  // ------------------------------

  const navigate = useNavigate();
  // 3. CALL your useAuth hook
  const auth = useAuth(); 

  useEffect(() => {
    if (role === 'worker' || role === 'admin') {
      setIsWorker(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocationError("");
          },
          (err) => {
            console.error(err);
            setLocationError("Location access denied or timed out.");
            setLocation(null);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
      }
    } else {
      setIsWorker(false);
      setLocation(null);
      setLocationError("");
    }
  }, [role]);

  // This is your original handleSubmit, modified to show OTP form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name || !confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (role === 'worker' && !phone) {
      return setError("Please enter a phone number for worker accounts");
    }

    setLoading(true);

    const requestBody = { name, email, password, role };

    if (role === 'worker' && phone) {
      requestBody.phone = phone;
    }

    if (location && (role === 'worker' || role === 'admin')) {
      requestBody.latitude = location.latitude;
      requestBody.longitude = location.longitude;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed.');
      }

      // --- SUCCESS: Show OTP form instead of navigating ---
      setShowOtpForm(true);
      setError(""); // Clear any previous errors

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handler for submitting the OTP ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      return setError("Please enter the 6-digit OTP.");
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, otp: otp }), // Send email and OTP
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'OTP verification failed.');
      }

      // --- OTP VERIFIED: Log the user in and redirect ---
      
      // 1. Find the token key (authToken, workerToken, etc.)
      const tokenKey = Object.keys(data).find(key => key.endsWith('Token'));
      if (!tokenKey) {
        throw new Error('Login failed: Token not received.');
      }
      
      const token = data[tokenKey];
      const user = data.user;

      // 2. Use your AuthContext to log the user in
      // This line matches your AuthContext (userData, token)
      auth.login(user, token); 

      // 3. Redirect based on role (as seen in your App.js)
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'worker') {
        navigate('/worker');
      } else {
        // As requested, default to citizen dashboard
        navigate('/citizen');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
        
        {/* --- Conditional Rendering: Show OTP form or Signup form --- */}
        
        {!showOtpForm ? (
          // --- 1. ORIGINAL SIGNUP FORM ---
          <>
            <h2 className="text-2xl font-bold text-center text-green-700">Create Account</h2>
            <p className="text-center mb-4">
              Join CityZen to help make our city cleaner
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* All your original input fields are preserved here */}
              <div>
                <label>Full Name</label>
                <input
                  className="w-full border rounded p-2"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  className="w-full border rounded p-2"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  className="w-full border rounded p-2"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  className="w-full border rounded p-2"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="w-full max-w-full overflow-visible">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  className="
            w-full 
            border border-gray-300 
            rounded-lg 
            px-3 py-2.5 
            text-sm 
            bg-white 
            focus:outline-none 
            focus:ring-2 focus:ring-green-500 
            focus:border-green-500 
            transition-all 
            appearance-none
          "
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Citizen - Report waste issues</option>
                  <option value="worker">Worker - Handle cleanup tasks</option>
                  <option value="admin">Administrator - Manage operations</option>
                </select>
              </div>

              {isWorker && (
                <div>
                  <label>Phone Number</label>
                  <input
                    className="w-full border rounded p-2"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={role === 'worker'} 
                  />
                </div>
              )}

              {isWorker && (
                <div className="text-sm">
                  {location ? (
                    <p className="text-green-500">✅ Location detected! We'll use this for task assignments.</p>
                  ) : (
                    <p className="text-red-500">
                      ❌ {locationError || "Waiting for location permission..."}
                    </p>
                  )}
                </div>
              )}

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </>
        ) : (
          // --- 2. NEW OTP VERIFICATION FORM ---
          <>
            <h2 className="text-2xl font-bold text-center text-green-700">Verify Your Email</h2>
            <p className="text-center mb-4">
              A 6-digit code has been sent to <strong>{email}</strong>.
            </p>
            <p className="text-center text-sm text-gray-600 mb-4">
              Please check your inbox (and spam folder) and enter the code below.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label>Verification Code (OTP)</label>
                <input
                  className="w-full border rounded p-2 text-center text-lg tracking-[0.3em]"
                  type="text"
                  placeholder="______"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify & Complete Signup'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
