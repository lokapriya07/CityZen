import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  // --- State variables for form inputs and UI feedback ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For showing a loading state on the button
  
  const navigate = useNavigate();

  // --- Handles form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser from reloading the page
    setError(""); // Clear any previous errors

    // --- 1. Frontend Validation ---
    if (!email || !password || !name || !confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true); // Disable the button and show a loading message

    // --- 2. API Call to the Backend ---
    try {
      const response = await fetch('http://localhost:8001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., "User already exists"), display it
        throw new Error(data.msg || 'Registration failed.');
      }

      // --- 3. Handle Success ---
      // If registration is successful, alert the user and redirect to the login page
      alert('Registration successful! Please log in.');
      navigate("/login");

    } catch (err) {
      // If there was an error during the API call, display it
      setError(err.message);
    } finally {
      // --- 4. Reset Loading State ---
      // This runs whether the request succeeded or failed
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

          <div>
            <label>Account Type</label>
            <select
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Citizen - Report waste issues</option>
              <option value="worker">Waste Worker - Handle cleanup tasks</option>
              <option value="admin">Administrator - Manage operations</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading} // Button is disabled while loading
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}