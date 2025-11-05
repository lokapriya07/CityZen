// SignupForm.js
import React, { useState, useEffect } from "react";
// Removed 'useNavigate' as it's not compatible with this environment
// import { useNavigate } from "react-router-dom"; 

// --- Main App Component ---
// This component will manage the "pages" of your application.
export default function App() {
  // 'page' state determines whether to show 'signup' or 'login'
  const [page, setPage] = useState('signup');

  // Render the correct component based on the 'page' state
  switch (page) {
    case 'signup':
      // Pass a function to SignupForm so it can tell App to switch to the login page
      return <SignupForm onSignupSuccess={() => setPage('login')} />;
    case 'login':
      return <LoginForm />;
    default:
      return <SignupForm onSignupSuccess={() => setPage('login')} />;
  }
}

// --- Your SignupForm Component ---
// It now accepts a prop 'onSignupSuccess' to call when registration is done.
function SignupForm({ onSignupSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isWorker, setIsWorker] = useState(false);

  // Removed 'useNavigate' as it was causing the error
  // const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Clear previous success messages

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
      const response = await fetch('https://cityzen-50ug.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.msg || 'Registration failed.');
      }

      setSuccess('Registration successful! Redirecting to login...');

      // --- THIS IS THE FIX ---
      // Instead of 'navigate()', we call the function passed in via props
      // This tells the parent App component to change the page.
      setTimeout(() => {
        onSignupSuccess(); // Call the function to switch pages
      }, 2000); // 2-second delay
      // -----------------------

    } catch (err) {
      setError(err.message);
      setSuccess(""); // Clear success message on error
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center text-green-700">Create Account</h2>
        <p className="text-center mb-4">
          Join CityZen to help make our city cleaner
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {success && <div className="text-green-600 text-sm font-medium p-2 bg-green-50 rounded border border-green-200">{success}</div>}
          {error && <div className="text-red-600 text-sm font-medium p-2 bg-red-50 rounded border border-red-200">{error}</div>}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Placeholder Login Component ---
// This is the component that will show after successful signup.
function LoginForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto border p-6 rounded shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center text-green-700">Login</h2>
        <p className="text-center mb-4">
          Please login to continue.
        </p>
        <form className="space-y-4">
          <div>
            <label>Email</label>
            <input
              className="w-full border rounded p-2"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              className="w-full border rounded p-2"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}