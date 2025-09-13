import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // 👉 Dummy signup logic (replace with API call later)
    const success = true;

    if (success) {
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "worker":
          navigate("/worker");
          break;
        default:
          navigate("/");
          break;
      }
    } else {
      setError("Registration failed. Please try again.");
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
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
